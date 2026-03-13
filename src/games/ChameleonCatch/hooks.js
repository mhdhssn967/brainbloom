import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import SoundManager        from "@/engine/SoundManager";
import { SOUND_KEYS }      from "@/utils/constants";
import { buildBugs, moveBugs, isRoundComplete, getWinner } from "./engine";
import { buildRoundList, getBugType } from "@/data/chameleonData";
import {
  POINTS_CORRECT, POINTS_WRONG,
  TONGUE_DURATION, DIZZY_DURATION, ROUND_PAUSE_MS,
} from "./constants";

function buildPlayerState() {
  return {
    score:          0,
    round:          0,      // keep as "round" to match your existing PlayerSide usage
    bugs:           [],
    phase:          "waiting",
    tongue:         null,
    dizzy:          false,
    chameleonAngle: 0,
  };
}

export function useChameleonCatch({
  subjectId, levelKey, totalSeconds,
  containerW = 480, containerH = 520,
}) {
  const { endSession } = useSessionStore();
  const { teams }      = useTeamStore();

  const bugType = useMemo(() => getBugType(subjectId), [subjectId]);

  // Each player gets their own independently shuffled round list
  const roundLists = useMemo(() => ({
    0: buildRoundList(subjectId, levelKey),
    1: buildRoundList(subjectId, levelKey),
  }), [subjectId, levelKey]);

  const init = useMemo(() => ({ 0: buildPlayerState(), 1: buildPlayerState() }), []);

  const [players,  setPlayers]  = useState(init);
  const playersRef               = useRef(init);
  const [timeLeft, setTimeLeft]  = useState(totalSeconds);
  const [gameOver, setGameOver]  = useState(false);
  const [winner,   setWinner]    = useState(null);
  const [started,  setStarted]   = useState(false);
  const timeLeftRef              = useRef(totalSeconds);
  const gameOverRef              = useRef(false);
  const timerRef                 = useRef(null);
  const rafRef                   = useRef(null);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
    const p = playersRef.current;
    setWinner(getWinner(p[0], p[1]));
    setGameOver(true);
    endSession();
    try { SoundManager.play(SOUND_KEYS.WIN); } catch (e) {}
  }, [endSession]);

  const updatePlayer = useCallback((id, patch) => {
    setPlayers(prev => {
      const u = { ...prev, [id]: { ...prev[id], ...patch } };
      playersRef.current = u;
      return u;
    });
  }, []);

  const loadRound = useCallback((playerId, roundIndex) => {
    const list  = roundLists[playerId];
    const round = list[roundIndex % list.length];
    const bugs  = buildBugs(
      round, bugType, roundIndex,
      containerW, containerH, playerId
    );
    updatePlayer(playerId, {
      round:          roundIndex,
      bugs,
      phase:          "playing",
      tongue:         null,
      dizzy:          false,
      chameleonAngle: 0,
    });
  }, [roundLists, bugType, containerW, containerH, updatePlayer]);

  const startCountdown = useCallback(() => {
    setStarted(true);
    loadRound(0, 0);
    loadRound(1, 0);
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) endGame();
    }, 1000);
  }, [loadRound, endGame]);

  // RAF animation loop
  useEffect(() => {
    let last = performance.now();
    function frame(now) {
      if (gameOverRef.current) return;
      const dt = now - last; last = now;
      setPlayers(prev => {
        let changed = false;
        const next = { ...prev };
        [0, 1].forEach(id => {
          const p = prev[id];
          if (p.phase !== "playing" && p.phase !== "tongue_out") return;
          next[id] = { ...p, bugs: moveBugs(p.bugs, containerW, containerH, dt) };
          changed = true;
        });
        if (changed) playersRef.current = next;
        return changed ? next : prev;
      });
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [containerW, containerH]);

  const handleBugTap = useCallback((playerId, bugId) => {
    if (gameOverRef.current) return;
    const p = playersRef.current[playerId];
    if (p.phase !== "playing") return;
    const bug = p.bugs.find(b => b.id === bugId);
    if (!bug || bug.caught || bug.flashing) return;

    if (bug.isCorrect) {
      try { SoundManager.play(SOUND_KEYS.CORRECT); } catch (e) {}
      updatePlayer(playerId, {
        phase:  "tongue_out",
        tongue: { targetX: bug.x, targetY: bug.y },
        bugs:   p.bugs.map(b => b.id === bugId ? { ...b, caught: true } : b),
        score:  p.score + POINTS_CORRECT,
      });
      setTimeout(() => {
        if (gameOverRef.current) return;
        const cur = playersRef.current[playerId];
        if (isRoundComplete(cur.bugs)) {
          updatePlayer(playerId, { phase: "round_complete", tongue: null });
          try { SoundManager.play(SOUND_KEYS.STREAK); } catch (e) {}
          setTimeout(() => {
            if (!gameOverRef.current) loadRound(playerId, cur.round + 1);
          }, ROUND_PAUSE_MS);
        } else {
          updatePlayer(playerId, { phase: "playing", tongue: null });
        }
      }, TONGUE_DURATION);

    } else {
      try { SoundManager.play(SOUND_KEYS.WRONG); } catch (e) {}
      updatePlayer(playerId, {
        phase:   "tngue_out",
        dizzy:   true,
        score:   Math.max(0, p.score + POINTS_WRONG),
        bugs:    p.bugs.map(b => b.id === bugId ? { ...b, flashing: true } : b),
      });
      setTimeout(() => {
        if (gameOverRef.current) return;
        updatePlayer(playerId, {
          phase: "playing", dizzy: false,
          bugs:  playersRef.current[playerId].bugs.map(b =>
            b.id === bugId ? { ...b, flashing: false } : b
          ),
        });
      }, DIZZY_DURATION);
    }
  }, [updatePlayer, loadRound]);

  // Get the current round data for a player (for instruction display)
  const getCurrentRound = useCallback((playerId) => {
    const p    = playersRef.current[playerId];
    const list = roundLists[playerId];
    return list?.[p.round % list.length] ?? null;
  }, [roundLists]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  return {
    players, timeLeft, gameOver, winner,
    started, teams, handleBugTap, startCountdown,
    bugType, getCurrentRound,
  };
}