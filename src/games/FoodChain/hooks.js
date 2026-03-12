import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import SoundManager        from "@/engine/SoundManager";
import { SOUND_KEYS }      from "@/utils/constants";
import { buildRound, checkAnswer, fillBlank, isRoundComplete, getWinner } from "./engine";
import { POINTS_PER_BLANK } from "./constants";

function buildPlayerState(biomeId, round = 1) {
  return {
    round,
    score:      0,
    roundState: buildRound(biomeId, round),
    phase:      "playing",   // playing | wrong_flash | round_complete
    wrongCard:  null,
  };
}

export function useFoodChain({ biomeId, totalSeconds }) {
  const { endSession } = useSessionStore();
  const { teams }      = useTeamStore();

  const init = useMemo(() => ({
    0: buildPlayerState(biomeId, 1),
    1: buildPlayerState(biomeId, 1),
  }), [biomeId]);

  const [players,  setPlayers]  = useState(init);
  const playersRef              = useRef(init);

  const [timeLeft,  setTimeLeft]  = useState(totalSeconds);
  const [gameOver,  setGameOver]  = useState(false);
  const [winner,    setWinner]    = useState(null);
  const [started,   setStarted]   = useState(false);
  const timeLeftRef               = useRef(totalSeconds);
  const gameOverRef               = useRef(false);
  const timerRef                  = useRef(null);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    clearInterval(timerRef.current);
    const p = playersRef.current;
    setWinner(getWinner(p[0], p[1]));
    setGameOver(true);
    endSession();
    SoundManager.play(SOUND_KEYS.WIN);
  }, [endSession]);

  const startCountdown = useCallback(() => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) endGame();
    }, 1000);
  }, [endGame]);

  const updatePlayer = useCallback((id, patch) => {
    setPlayers(prev => {
      const updated = { ...prev, [id]: { ...prev[id], ...patch } };
      playersRef.current = updated;
      return updated;
    });
  }, []);

  const handleAnswer = useCallback((playerId, tapped) => {
    if (gameOverRef.current) return;
    const p = playersRef.current[playerId];
    if (p.phase !== "playing") return;

    const correct = checkAnswer(p.roundState, tapped);

    if (correct) {
      SoundManager.play(SOUND_KEYS.CORRECT);
      const newRoundState = fillBlank(p.roundState, tapped);

      if (isRoundComplete(newRoundState)) {
        // Round complete
        SoundManager.play(SOUND_KEYS.STREAK);
        updatePlayer(playerId, {
          roundState: newRoundState,
          score:      p.score + POINTS_PER_BLANK * newRoundState.answers.length,
          phase:      "round_complete",
        });
        // Next round after short celebration
        setTimeout(() => {
          if (gameOverRef.current) return;
          const nextRound = p.round + 1;
          updatePlayer(playerId, {
            round:      nextRound,
            roundState: buildRound(biomeId, nextRound),
            phase:      "playing",
            wrongCard:  null,
          });
        }, 900);
      } else {
        updatePlayer(playerId, { roundState: newRoundState });
      }

    } else {
      SoundManager.play(SOUND_KEYS.WRONG);
      updatePlayer(playerId, { phase: "wrong_flash", wrongCard: tapped });
      setTimeout(() => {
        if (gameOverRef.current) return;
        updatePlayer(playerId, { phase: "playing", wrongCard: null });
      }, 600);
    }
  }, [updatePlayer, biomeId]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return {
    players, timeLeft, gameOver, winner,
    started, teams, handleAnswer, startCountdown,
  };
}