import { useState, useCallback, useRef, useEffect } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import { useTimer }         from "@/hooks/useTimer";
import SoundManager         from "@/engine/SoundManager";
import {
  generatePattern,
  evaluateTaps,
  calculateScore,
  getTileCount,
  isGameOver,
} from "./engine";
import {
  TOTAL_ROUNDS,
  SHOW_DURATION,
  RECALL_DURATION,
} from "./constants";
import { SOUND_KEYS } from "@/utils/constants";

export function useMemoryGame() {
  const { endSession }      = useSessionStore();
  const { teams, addScore } = useTeamStore();

  // ── Game state ───────────────────────────────────────────────────────
  const [round, setRound]           = useState(1);
  const [phase, setPhase]           = useState("idle");
  const [pattern, setPattern]       = useState([]);
  const [leftTaps, setLeftTaps]     = useState([]);
  const [rightTaps, setRightTaps]   = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [gameOver, setGameOver]     = useState(false);

  // Refs — always current values, safe inside timeouts
  const roundRef       = useRef(1);
  const leftTapsRef    = useRef([]);
  const rightTapsRef   = useRef([]);
  const phaseRef       = useRef("idle");
  const patternRef     = useRef([]);

  // Keep refs in sync with state
  const setPhaseSync = (p) => { phaseRef.current = p; setPhase(p); };
  const setRoundSync = (r) => { roundRef.current = r; setRound(r); };

  // ── Start a round by number ──────────────────────────────────────────
  // Takes round number as argument — never reads from state/ref
  const startRound = useCallback((roundNum) => {
    if (isGameOver(roundNum)) {
      setGameOver(true);
      setPhaseSync("done");
      endSession();
      return;
    }

    const tileCount  = getTileCount(roundNum);
    const newPattern = generatePattern(tileCount);

    // Reset taps
    leftTapsRef.current  = [];
    rightTapsRef.current = [];
    setLeftTaps([]);
    setRightTaps([]);
    setEvaluation(null);

    // Update round and pattern
    setRoundSync(roundNum);
    patternRef.current = newPattern;
    setPattern(newPattern);
    setPhaseSync("show");

  }, [endSession]);

  // ── Timer — recall countdown ─────────────────────────────────────────
  const { remaining, start: startTimer, reset: resetTimer } = useTimer(
    RECALL_DURATION,
    () => {
      // Timer expired — evaluate and move on
      endRecallPhase();
    }
  );

  // ── End recall, score both teams, show result ────────────────────────
  const endRecallPhase = useCallback(() => {
    // Guard — only run during recall phase
    if (phaseRef.current !== "recall") return;

    const currentPattern = patternRef.current;
    const leftEval  = evaluateTaps(currentPattern, leftTapsRef.current);
    const rightEval = evaluateTaps(currentPattern, rightTapsRef.current);

    const leftScore  = calculateScore(leftEval);
    const rightScore = calculateScore(rightEval);

    if (leftScore  > 0) addScore(0, leftScore);
    if (rightScore > 0) addScore(1, rightScore);

    setEvaluation({ left: leftEval, right: rightEval });
    setPhaseSync("result");

    // After showing result, start the next round
    setTimeout(() => {
      const nextRoundNum = roundRef.current + 1;
      startRound(nextRoundNum);
    }, 1500);

  }, [addScore, startRound]);

  // ── Show phase — display tiles, then switch to recall ────────────────
  useEffect(() => {
    if (phase !== "show") return;

    const t = setTimeout(() => {
      setPhaseSync("recall");
      resetTimer(RECALL_DURATION);
      startTimer();
    }, SHOW_DURATION);

    return () => clearTimeout(t);
  }, [phase, resetTimer, startTimer]);

  // ── Start game — called from component on mount ──────────────────────
  const startGame = useCallback(() => {
    startRound(1);
  }, [startRound]);

  // ── Handle tile tap ──────────────────────────────────────────────────
  const handleTap = useCallback((teamId, tileIndex) => {
  if (phaseRef.current !== "recall") return;

  const ref = teamId === 0 ? leftTapsRef : rightTapsRef;
  const set = teamId === 0 ? setLeftTaps : setRightTaps;

  const already = ref.current.includes(tileIndex);

  let updated;
  if (already) {
    // Retap — deselect the tile, no sound
    updated = ref.current.filter(i => i !== tileIndex);
  } else {
    // New tap — select and play sound
    updated = [...ref.current, tileIndex];
    const isCorrect = patternRef.current.includes(tileIndex);
    SoundManager.play(isCorrect ? SOUND_KEYS.CORRECT : SOUND_KEYS.WRONG);
  }

  ref.current = updated;
  set(updated);

}, []);

  return {
    round,
    phase,
    pattern,
    leftTaps,
    rightTaps,
    evaluation,
    remaining,
    gameOver,
    teams,
    tappingLocked: phase !== "recall",
    startGame,
    handleTap,
  };
}