import { useState, useCallback, useRef, useEffect } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import SoundManager         from "@/engine/SoundManager";
import { SOUND_KEYS }       from "@/utils/constants";
import {
  generateQuestion,
  initFrogs,
  checkAnswer,
} from "./engine";
import {
  GROUND_SIZE,
  WRONG_LOCK_MS,
  SQUARE_FALL_MS,
} from "./constants";

export function useFrogCatch(ageGroup, frogCount) {
  const { endSession } = useSessionStore();
  const { teams }      = useTeamStore();

  // Spawn frogs across a wide area — zoom=40 on ~1920px canvas ≈ 24 half-width world units.
  // Runtime movement is clamped to actual viewport via the bounds prop in Frog.jsx.
  const [frogs,      setFrogs]      = useState(() => initFrogs(frogCount, 30));
  const frogsRef                    = useRef(frogs);

  const [questions,  setQuestions]  = useState({
    0: generateQuestion(ageGroup),
    1: generateQuestion(ageGroup),
  });

  const [scores,     setScores]     = useState({ 0: 0, 1: 0 });
  const [lockedOpts, setLockedOpts] = useState({ 0: new Set(), 1: new Set() });

  // { teamId, frogId } | null
  const [catching,   setCatching]   = useState(null);

  const [phase,      setPhase]      = useState("playing");
  const [gameOver,   setGameOver]   = useState(false);

  // Keep frogsRef in sync
  useEffect(() => { frogsRef.current = frogs; }, [frogs]);

  // ── Handle answer ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((teamId, picked) => {
    if (phase !== "playing") return;

    const question  = questions[teamId];
    const isCorrect = checkAnswer(question, picked);

    if (isCorrect) {
      SoundManager.play(SOUND_KEYS.CORRECT);

      const available = frogsRef.current.filter(f => !f.captured);
      if (available.length === 0) return;

      const target = available[Math.floor(Math.random() * available.length)];

      // Start catch — block both teams from answering while ring falls
      setPhase("catching");
      setCatching({ teamId, frogId: target.id });

      setTimeout(() => {
        setFrogs(prev => prev.map(f =>
          f.id === target.id
            ? {
                ...f,
                captured:    true,
                capturedBy:  teamId,
                animation:   "FrogArmature|Frog_Idle",
              }
            : f
        ));

        const newScore = (scores[teamId] ?? 0) + 1;
        setScores(prev => ({ ...prev, [teamId]: newScore }));

        setCatching(null);

        const totalCaught = Object.values({ ...scores, [teamId]: newScore })
          .reduce((a, b) => a + b, 0);

        if (totalCaught >= frogCount) {
          setGameOver(true);
          setPhase("done");
          endSession();
          return;
        }

        setPhase("playing");
        setQuestions(prev => ({ ...prev, [teamId]: generateQuestion(ageGroup) }));
        setLockedOpts(prev => ({ ...prev, [teamId]: new Set() }));

      }, SQUARE_FALL_MS);

    } else {
      SoundManager.play(SOUND_KEYS.WRONG);

      setLockedOpts(prev => ({
        ...prev,
        [teamId]: new Set([...prev[teamId], picked]),
      }));

      setTimeout(() => {
        setLockedOpts(prev => {
          const updated = new Set(prev[teamId]);
          updated.delete(picked);
          return { ...prev, [teamId]: updated };
        });
      }, WRONG_LOCK_MS);
    }
  }, [phase, questions, scores, frogCount, ageGroup, endSession]);

  return {
    frogs,
    questions,
    scores,
    lockedOpts,
    catching,
    phase,
    gameOver,
    teams,
    handleAnswer,
    frogCount,
  };
}