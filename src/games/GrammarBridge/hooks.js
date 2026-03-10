import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTeamStore }          from "@/store/teamStore";
import { useSessionStore }       from "@/store/sessionStore";
import SoundManager              from "@/engine/SoundManager";
import { SOUND_KEYS }            from "@/utils/constants";
import { getQuestionsForRound, getOptionsForBlank } from "@/data/grammarBridgeData";
import {
  buildPlayerState,
  fillNextBlank,
  isBridgeComplete,
  getNextBlankIndex,
  checkAnswer,
  getEndX, 
} from "./engine";
import { WRONG_LOCK_MS } from "./constants";

export function useGrammarBridge({ totalRounds, difficulty }) {
  const { teams }      = useTeamStore();
  const { endSession } = useSessionStore();

  // Build initial state ONCE — not twice
  const initialStates = useMemo(() => {
    const [q0, q1] = getQuestionsForRound(1, totalRounds);
    return {
      0: buildPlayerState(0, q0),
      1: buildPlayerState(1, q1),
    };
  }, []); // empty deps — only runs once

  const [playerStates, setPlayerStates] = useState(initialStates);
  const playerStatesRef                 = useRef(initialStates);
  const [lockedOpts,   setLockedOpts]   = useState({ 0: new Set(), 1: new Set() });
  const [confetti,     setConfetti]     = useState({ 0: false, 1: false });
  const [gameOver,     setGameOver]     = useState(false);
  const [winner,       setWinner]       = useState(null);

  const playerRounds = useRef({ 0: 1, 1: 1 });

  // ── Update one player's state ─────────────────────────────────────────
  const updatePlayer = useCallback((playerId, patch) => {
    setPlayerStates(prev => {
      const updated = { ...prev, [playerId]: { ...prev[playerId], ...patch } };
      playerStatesRef.current = updated;
      return updated;
    });
  }, []);

  // ── Load next round for a player ──────────────────────────────────────
  const loadNextRound = useCallback((playerId) => {
    playerRounds.current[playerId] += 1;
    const nextRound = playerRounds.current[playerId];

    if (nextRound > totalRounds) {
      setGameOver(true);
      setWinner(playerId);
      endSession();
      return;
    }

    const [q0, q1] = getQuestionsForRound(nextRound, totalRounds);
    const q        = playerId === 0 ? q0 : q1;
    const newState = buildPlayerState(playerId, q);

    setPlayerStates(prev => {
      const updated = { ...prev, [playerId]: newState };
      playerStatesRef.current = updated;
      return updated;
    });

    setConfetti(prev => ({ ...prev, [playerId]: false }));
  }, [totalRounds, endSession]);

  // ── Start walking — hook drives characterX toward endX ───────────────
  // Walking is driven by BridgeCharacter useFrame via characterX in state
  // Here we just set phase=walking and target endX
  // We poll until character has "arrived" using a ref
  const walkingRefs = useRef({ 0: false, 1: false });

const startWalking = useCallback((playerId) => {
  const state  = playerStatesRef.current[playerId];
  const blocks = state.blocks;
  const endX   = blocks[blocks.length - 1]?.x ?? 4;
  const endIslandX = endX + 1.6;

  setConfetti(prev => ({ ...prev, [playerId]: true }));
  SoundManager.play(SOUND_KEYS.WIN);

  // Only set phase — BridgeCharacter drives its own position
  updatePlayer(playerId, {
    phase: "walking",
    // DO NOT set characterX here — character owns its position now
  });

  // Wait for walk animation to fully complete (~4 seconds)
  setTimeout(() => {
    loadNextRound(playerId);
  }, 4200);
}, [updatePlayer, loadNextRound]);;
  // ── Handle answer ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((playerId, picked) => {
    const state = playerStatesRef.current[playerId];
    if (!state || state.phase !== "playing") return;

    // Find next unfilled blank
    const nextBlank = state.blocks.find(b => b.isMissing && !b.isFilled);
    if (!nextBlank) return;

    const isCorrect = picked.trim() === nextBlank.word.trim();

    console.log("picked:", JSON.stringify(picked), "expected:", JSON.stringify(nextBlank.word), "match:", isCorrect);

    if (isCorrect) {
  SoundManager.play(SOUND_KEYS.CORRECT);

  const newBlocks      = fillNextBlank(state.blocks, picked);
  const complete       = isBridgeComplete(newBlocks);
  const nextBlankIdx   = state.blankIndex + 1; // ← simple increment
  const newOptions     = complete
    ? state.options
    : getOptionsForBlank(state.question, nextBlankIdx);

  updatePlayer(playerId, {
    blocks:     newBlocks,
    options:    newOptions,
    blankIndex: nextBlankIdx,
    phase:      complete ? "bridge_complete" : "playing",
  });

  setLockedOpts(prev => ({ ...prev, [playerId]: new Set() }));

  if (complete) {
    setTimeout(() => startWalking(playerId), 500);
  }
}else {
      SoundManager.play(SOUND_KEYS.WRONG);

      setLockedOpts(prev => ({
        ...prev,
        [playerId]: new Set([...(prev[playerId] ?? []), picked]),
      }));

      setTimeout(() => {
        setLockedOpts(prev => {
          const s = new Set(prev[playerId]);
          s.delete(picked);
          return { ...prev, [playerId]: s };
        });
      }, WRONG_LOCK_MS);
    }
  }, [updatePlayer, startWalking]);

  useEffect(() => {
    return () => {};
  }, []);

  return {
    playerStates,
    lockedOpts,
    confetti,
    gameOver,
    winner,
    teams,
    playerRounds,
    totalRounds,
    handleAnswer,
  };
}