import { useState, useCallback, useRef } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import SoundManager         from "@/engine/SoundManager";
import { SOUND_KEYS }       from "@/utils/constants";
import {
  buildWordList,
  generateBlanks,
  buildSlots,
  checkLetter,
  getNextActiveBlank,
  isWordComplete,
  getImagePath,
} from "./engine";
import { WIN_ANIM_MS, SHAKE_MS } from "./constants";

/**
 * Phases:
 * "playing"  — both sides actively spelling
 * "won"      — one team completed the word, win animation playing
 * "next"     — loading next word
 * "done"     — all rounds finished
 */

export function useSpellIt(categoryKey, totalRounds) {
  const { endSession }      = useSessionStore();
  const { teams }           = useTeamStore();

  // ── Word list ────────────────────────────────────────────────────────
  const [wordList]            = useState(() => buildWordList(categoryKey, totalRounds));
  const [roundIndex,  setRoundIndex]  = useState(0);
  const [phase,       setPhase]       = useState("playing");
  const [gameOver,    setGameOver]    = useState(false);

  // ── Per-round state — regenerated each round ─────────────────────────
  const currentWord   = wordList[roundIndex] ?? null;
  const [blanks,      setBlanks]      = useState(() =>
    currentWord ? generateBlanks(currentWord.name) : []
  );
  const [slots,       setSlots]       = useState(() =>
    currentWord ? buildSlots(currentWord.name, blanks) : []
  );

  // ── Per-team state ────────────────────────────────────────────────────
  // filled: { [teamId]: { [slotIndex]: letter } }
  const [filled,      setFilled]      = useState({ 0: {}, 1: {} });
  // activeBlank: { [teamId]: slotIndex | null }
  const [activeBlank, setActiveBlank] = useState(() => ({
    0: getNextActiveBlank(blanks, {}),
    1: getNextActiveBlank(blanks, {}),
  }));
  // shaking: { [teamId]: boolean }
  const [shaking,     setShaking]     = useState({ 0: false, 1: false });
  // winner of current round
  const [roundWinner, setRoundWinner] = useState(null);
  // collection: { [teamId]: [wordEntry, ...] }
  const [collection,  setCollection]  = useState({ 0: [], 1: [] });

  // Refs — safe inside callbacks
  const phaseRef  = useRef("playing");
  const filledRef = useRef({ 0: {}, 1: {} });

  const setPhaseSync = (p) => { phaseRef.current = p; setPhase(p); };

  // ── Load a new round ─────────────────────────────────────────────────
  const loadRound = useCallback((index) => {
    const word = wordList[index];
    if (!word) {
      setGameOver(true);
      setPhaseSync("done");
      endSession();
      return;
    }

    const newBlanks = generateBlanks(word.name);
    const newSlots  = buildSlots(word.name, newBlanks);
    const firstBlank = getNextActiveBlank(newBlanks, {});

    setBlanks(newBlanks);
    setSlots(newSlots);
    setFilled({ 0: {}, 1: {} });
    filledRef.current = { 0: {}, 1: {} };
    setActiveBlank({ 0: firstBlank, 1: firstBlank });
    setShaking({ 0: false, 1: false });
    setRoundWinner(null);
    setPhaseSync("playing");
  }, [wordList, endSession]);

  // ── Handle a key press for a team ────────────────────────────────────
  const handleKey = useCallback((teamId, letter) => {
    if (phaseRef.current !== "playing") return;

    const teamFilled  = filledRef.current[teamId] ?? {};
    const active      = getNextActiveBlank(blanks, teamFilled);

    // No active blank — word already complete for this team
    if (active === null) return;

    const word        = wordList[roundIndex]?.name ?? "";
    const isCorrect   = checkLetter(word, active, letter);

    if (isCorrect) {
      SoundManager.play(SOUND_KEYS.CORRECT);

      // Fill this blank
      const newTeamFilled = { ...teamFilled, [active]: letter };
      filledRef.current   = { ...filledRef.current, [teamId]: newTeamFilled };
      setFilled({ ...filledRef.current });

      // Advance active blank
      const next = getNextActiveBlank(blanks, newTeamFilled);
      setActiveBlank(prev => ({ ...prev, [teamId]: next }));

      // Check if word complete for this team
      if (isWordComplete(blanks, newTeamFilled)) {
        // This team wins the round
        SoundManager.play(SOUND_KEYS.WIN ?? SOUND_KEYS.STREAK);
        setRoundWinner(teamId);
        setPhaseSync("won");

        // Add word to their collection
        const wonWord = wordList[roundIndex];
        setCollection(prev => ({
          ...prev,
          [teamId]: [...prev[teamId], wonWord],
        }));

        // After win animation, load next round
        setTimeout(() => {
          const next = roundIndex + 1;
          if (next >= wordList.length) {
            setGameOver(true);
            setPhaseSync("done");
            endSession();
          } else {
            setRoundIndex(next);
            loadRound(next);
          }
        }, WIN_ANIM_MS);
      }

    } else {
      // Wrong letter — shake this team's active box
      SoundManager.play(SOUND_KEYS.WRONG);
      setShaking(prev => ({ ...prev, [teamId]: true }));
      setTimeout(() => {
        setShaking(prev => ({ ...prev, [teamId]: false }));
      }, SHAKE_MS);
    }
  }, [blanks, roundIndex, wordList, loadRound, endSession]);

  return {
    // Current round
    currentWord,
    roundIndex,
    totalRounds: wordList.length,
    slots,
    blanks,
    phase,
    // Per-team
    filled,
    activeBlank,
    shaking,
    roundWinner,
    collection,
    gameOver,
    teams,
    // Image path helper
    imagePath: currentWord
      ? getImagePath(categoryKey, currentWord.file)
      : null,
    // Actions
    handleKey,
  };
}