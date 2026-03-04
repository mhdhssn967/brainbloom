import { useState, useCallback, useRef, useEffect } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import { useTimer }         from "@/hooks/useTimer";
import SoundManager         from "@/engine/SoundManager";
import { SOUND_KEYS }       from "@/utils/constants";
import {
  buildRounds,
  fetchRoundImages,
  scoreAnswer,
  getWinner,
} from "./engine";
import {
  TOTAL_ROUNDS,
  ANSWER_TIMEOUT,
  FLOAT_ANIM_MS,
} from "./constants";

/**
 * Phases:
 * "loading"  — fetching images for current round
 * "playing"  — images shown, waiting for tap
 * "result"   — brief flash showing correct answer
 * "done"     — game over
 */

export function useSpotIt(categoryKey = "random") {
  const { endSession }      = useSessionStore();
  const { teams, addScore } = useTeamStore();

  // ── Core state ───────────────────────────────────────────────────────
  const [rounds]              = useState(() => buildRounds(categoryKey, TOTAL_ROUNDS));
  const [roundIndex,  setRoundIndex]  = useState(0);
  const [phase,       setPhase]       = useState("loading");
  const [imageCache,  setImageCache]  = useState({});  // wiki → imageUrl
  const [scores,      setScores]      = useState({ 0: 0, 1: 0 });
  const [floats,      setFloats]      = useState([]);  // floating +10/-5 animations
  const [correctWiki, setCorrectWiki] = useState(null);
  const [gameOver,    setGameOver]    = useState(false);
  const [answered,    setAnswered]    = useState({ 0: null, 1: null }); // wiki tapped per team

  // Refs — safe inside callbacks
  const phaseRef      = useRef("loading");
  const answeredRef   = useRef({ 0: null, 1: null });
  const roundIndexRef = useRef(0);

  const setPhaseSync = (p) => { phaseRef.current = p;      setPhase(p); };

  const currentRound = rounds[roundIndex] ?? null;

  // ── Fetch images for a round ─────────────────────────────────────────
  const loadRoundImages = useCallback(async (round) => {
    if (!round) return;
    setPhaseSync("loading");

    // Check cache first — only fetch missing ones
    const missing = round.options.filter(o => !(o.wiki in imageCache));

    if (missing.length > 0) {
      const freshImages = await fetchRoundImages({
        options: missing,
      });
      setImageCache(prev => ({ ...prev, ...freshImages }));
    }

    setCorrectWiki(round.correctWiki);
    setAnswered({ 0: null, 1: null });
    answeredRef.current = { 0: null, 1: null };
    setPhaseSync("playing");
  }, [imageCache]);

  // ── Prefetch next round images in background ─────────────────────────
  const prefetchNext = useCallback(async (index) => {
    const next = rounds[index + 1];
    if (!next) return;
    const missing = next.options.filter(o => !(o.wiki in imageCache));
    if (missing.length === 0) return;
    const fresh = await fetchRoundImages({ options: missing });
    setImageCache(prev => ({ ...prev, ...fresh }));
  }, [rounds, imageCache]);

  // ── Add floating score animation ─────────────────────────────────────
  const addFloat = useCallback((teamId, points) => {
    const id = `float-${Date.now()}-${teamId}`;
    setFloats(prev => [...prev, { id, teamId, points }]);
    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== id));
    }, FLOAT_ANIM_MS);
  }, []);

  // ── Advance to next round ────────────────────────────────────────────
  const nextRound = useCallback(() => {
    const next = roundIndexRef.current + 1;
    if (next >= TOTAL_ROUNDS) {
      setGameOver(true);
      setPhaseSync("done");
      endSession();
      return;
    }
    roundIndexRef.current = next;
    setRoundIndex(next);
  }, [endSession]);

  // ── Timer ────────────────────────────────────────────────────────────
  const { remaining, start: startTimer, reset: resetTimer } = useTimer(
    ANSWER_TIMEOUT,
    () => {
      if (phaseRef.current !== "playing") return;
      // Time up — no one answered, move on
      setPhaseSync("result");
      setTimeout(() => nextRound(), 1500);
    }
  );

  // ── Handle image tap ─────────────────────────────────────────────────
  const handleTap = useCallback((teamId, wikiTapped) => {
  if (phaseRef.current !== "playing") return;
  if (answeredRef.current[teamId] !== null) return;

  const isCorrect = wikiTapped === correctWiki;
  const points    = scoreAnswer(isCorrect);

  // Record answer
  answeredRef.current = { ...answeredRef.current, [teamId]: wikiTapped };
  setAnswered({ ...answeredRef.current });

  SoundManager.play(isCorrect ? SOUND_KEYS.CORRECT : SOUND_KEYS.WRONG);

  if (points !== 0) {
    const clamped = Math.max(0, (scores[teamId] ?? 0) + points);
    setScores(prev => ({ ...prev, [teamId]: clamped }));
    addScore(teamId, points > 0 ? points : 0);
    addFloat(teamId, points);
  }

  if (isCorrect) {
    // Correct — show briefly then immediately next round
    resetTimer();
    setPhaseSync("result");
    setTimeout(() => nextRound(), 800);   // ← was 1500, now 800ms
    return;
  }

  // Wrong — check if both teams answered
  const bothAnswered = Object.values(answeredRef.current).every(v => v !== null);
  if (bothAnswered) {
    resetTimer();
    setPhaseSync("result");
    setTimeout(() => nextRound(), 1200);
  }
}, [correctWiki, scores, addScore, addFloat, nextRound, resetTimer]);

  // ── Load round when roundIndex changes ───────────────────────────────
  useEffect(() => {
    if (!currentRound) return;
    loadRoundImages(currentRound).then(() => {
      resetTimer(ANSWER_TIMEOUT);
      startTimer();
      prefetchNext(roundIndex);
    });
  }, [roundIndex]);

  return {
    // State
    currentRound,
    roundIndex,
    phase,
    imageCache,
    scores,
    floats,
    correctWiki,
    answered,
    remaining,
    gameOver,
    teams,
    // Actions
    handleTap,
  };
}