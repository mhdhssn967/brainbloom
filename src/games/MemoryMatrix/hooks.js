import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import SoundManager         from "@/engine/SoundManager";
import { SOUND_KEYS }       from "@/utils/constants";
import {
  getStageForLevel,
  generatePattern,
  isTileCorrect,
  isLevelComplete,
  getWinner,
} from "./engine";
import {
  SHOW_DURATION,
  RESULT_FLASH_MS,
  WRONG_FLASH_MS,
} from "./constants";

function buildPlayerState(level = 1) {
  const stage   = getStageForLevel(level);
  const pattern = generatePattern(stage.gridSize, stage.lit);
  return {
    level,
    stage,
    pattern,
    correctTaps:  [],   // indices tapped correctly so far
    wrongTile:    null, // index of last wrong tap (for red flash)
    phase:        "show",  // show | recall | advancing | wrong_flash
  };
}

export function useMemoryGame({ totalSeconds }) {
  const { endSession }  = useSessionStore();
  const { teams }       = useTeamStore();

  // ── Per-player state ──────────────────────────────────────────────────
  const init = useMemo(() => ({
    0: buildPlayerState(1),
    1: buildPlayerState(1),
  }), []);

  const [players,  setPlayers]  = useState(init);
  const playersRef              = useRef(init);

  // ── Game timer ────────────────────────────────────────────────────────
  const [timeLeft,  setTimeLeft]  = useState(totalSeconds);
  const [gameOver,  setGameOver]  = useState(false);
  const [winner,    setWinner]    = useState(null);
  const [started,   setStarted]   = useState(false);
  const timeLeftRef               = useRef(totalSeconds);
  const gameOverRef               = useRef(false);
  const timerRef                  = useRef(null);

  // ── End game ──────────────────────────────────────────────────────────
  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    clearInterval(timerRef.current);
    const w = getWinner(
      playersRef.current[0],
      playersRef.current[1]
    );
    setWinner(w);
    setGameOver(true);
    endSession();
    SoundManager.play(SOUND_KEYS.WIN);
  }, [endSession]);

  // ── Start countdown ───────────────────────────────────────────────────
  const startCountdown = useCallback(() => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) endGame();
    }, 1000);
  }, [endGame]);

  // ── Update one player ─────────────────────────────────────────────────
  const updatePlayer = useCallback((playerId, patch) => {
    setPlayers(prev => {
      const updated = {
        ...prev,
        [playerId]: { ...prev[playerId], ...patch },
      };
      playersRef.current = updated;
      return updated;
    });
  }, []);

  // ── Begin show phase for a player ────────────────────────────────────
  const beginShow = useCallback((playerId, level) => {
    const stage   = getStageForLevel(level);
    const pattern = generatePattern(stage.gridSize, stage.lit);
    updatePlayer(playerId, {
      level,
      stage,
      pattern,
      correctTaps: [],
      wrongTile:   null,
      phase:       "show",
    });

    // After show duration switch to recall
    setTimeout(() => {
      if (gameOverRef.current) return;
      updatePlayer(playerId, { phase: "recall" });
    }, SHOW_DURATION);
  }, [updatePlayer]);

  // ── Start both players on mount ───────────────────────────────────────
  useEffect(() => {
    beginShow(0, 1);
    beginShow(1, 1);
  }, []);

  // ── Handle tile tap ───────────────────────────────────────────────────
  const handleTap = useCallback((playerId, tileIndex) => {
    if (gameOverRef.current) return;
    const p = playersRef.current[playerId];
    if (p.phase !== "recall") return;
    if (p.correctTaps.includes(tileIndex)) return; // already tapped

    const correct = isTileCorrect(p.pattern, tileIndex);

    if (correct) {
      SoundManager.play(SOUND_KEYS.CORRECT);
      const newCorrect = [...p.correctTaps, tileIndex];
      const complete   = isLevelComplete(p.pattern, newCorrect);

      if (complete) {
        // Level complete — flash advancing then go to next level
        updatePlayer(playerId, {
          correctTaps: newCorrect,
          phase:       "advancing",
        });
        SoundManager.play(SOUND_KEYS.WIN);
        setTimeout(() => {
          if (gameOverRef.current) return;
          beginShow(playerId, p.level + 1);
        }, RESULT_FLASH_MS);
      } else {
        updatePlayer(playerId, { correctTaps: newCorrect });
      }

    } else {
      // Wrong tap — flash red then reset pattern at same level
      SoundManager.play(SOUND_KEYS.WRONG);
      updatePlayer(playerId, {
        wrongTile: tileIndex,
        phase:     "wrong_flash",
      });
      setTimeout(() => {
        if (gameOverRef.current) return;
        beginShow(playerId, p.level); // same level, new pattern
      }, WRONG_FLASH_MS);
    }
  }, [updatePlayer, beginShow]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return {
    players,
    timeLeft,
    gameOver,
    winner,
    started,
    teams,
    handleTap,
    startCountdown,
  };
}