import { useState, useCallback, useRef } from "react";
import { generateQuestion }   from "@/data/mathQuestions";
import { useSessionStore }    from "@/store/sessionStore";
import { useTeamStore }       from "@/store/teamStore";
import { useTimer }           from "@/hooks/useTimer";
import SoundManager           from "@/engine/SoundManager";
import {
  initBalloons,
  applyCorrectAnswer,
  applyWrongAnswer,
  isGameOver,
  getWinner,
} from "./engine";
import {
  POINTS_CORRECT,
  QUESTION_LIMIT,
  ANSWER_TIMEOUT,
  POP_ANIM_DURATION,
} from "./constants";
import { SOUND_KEYS } from "@/utils/constants";
/**
 * useBalloonGame — the single hook that drives the entire game.
 * Components only call this. No store or engine imports in components.
 *
 * @param {string} difficulty  "easy" | "medium" | "hard"
 * @returns game state + handleAnswer
 */
export function useBalloonGame(difficulty = "easy") {
  const { endSession }          = useSessionStore();
  const { teams, addScore } = useTeamStore();

  // ── Core game state ──────────────────────────────────────────────────
  const [balloons, setBalloons]           = useState(() => initBalloons(2));
  const [currentQuestion, setQuestion]   = useState(() => generateQuestion(difficulty));
  const [questionCount, setQuestionCount] = useState(1);
  const [poppingTeam, setPoppingTeam]     = useState(null);  // which side is animating
  const [flashTeam, setFlashTeam]         = useState(null);  // correct/wrong flash
  const [flashType, setFlashType]         = useState(null);  // "correct" | "wrong"
  const [gameOver, setGameOver]           = useState(false);
  const [winner, setWinner]               = useState(null);

  // Lock to prevent double answers during animation
  const isAnswering = useRef(false);

  // ── Load next question ───────────────────────────────────────────────
  const loadNextQuestion = useCallback(() => {
    setQuestionCount(prev => {
      const next = prev + 1;
      if (next > QUESTION_LIMIT) {
        // Question limit hit — end by balloon count
        endSession();
        setGameOver(true);
        return prev;
      }
      return next;
    });
    setQuestion(generateQuestion(difficulty));
    setPoppingTeam(null);
    setFlashTeam(null);
    setFlashType(null);
    isAnswering.current = false;
  }, [difficulty, endSession]);

  // ── Timer — auto-skip on timeout ─────────────────────────────────────
  const { remaining, start, reset } = useTimer(ANSWER_TIMEOUT, () => {
    // Time ran out — no one answered, just load next question
    if (!isAnswering.current) {
      isAnswering.current = true;
      loadNextQuestion();
    }
  });

  // Start timer when component mounts (called from game component)
  const startTimer = useCallback(() => {
    start();
  }, [start]);

  // ── Handle an answer ─────────────────────────────────────────────────
  const handleAnswer = useCallback((teamId, selectedOption) => {
    // Block if already processing an answer
    if (isAnswering.current || gameOver) return;
    isAnswering.current = true;

    // Stop the timer
    reset();

    const isCorrect = selectedOption === currentQuestion.answer;

    if (isCorrect) {
  SoundManager.play("correct");
  addScore(teamId, POINTS_CORRECT);

  setFlashTeam(teamId);
  setFlashType("correct");

  const opponentId = teamId === 0 ? 1 : 0;
  setPoppingTeam(opponentId);
  SoundManager.play(SOUND_KEYS.BALLOON_POP);

  const updated = applyCorrectAnswer(balloons, teamId);
  setBalloons(updated);

  console.log("updated balloons:", updated, "isGameOver:", isGameOver(updated));

  if (isGameOver(updated)) {
    const w = getWinner(updated);
    console.log("game over — winner:", w);
    setTimeout(() => {
      setWinner(w);
      setGameOver(true);
      endSession();
    }, POP_ANIM_DURATION);   // wait for pop animation THEN show overlay
    return;
  }

} else {
  SoundManager.play("wrong");

  setFlashTeam(teamId);
  setFlashType("wrong");

  setPoppingTeam(teamId);
  SoundManager.play(SOUND_KEYS.BALLOON_POP); 

  const updated = applyWrongAnswer(balloons, teamId);
  setBalloons(updated);

  console.log("updated balloons:", updated, "isGameOver:", isGameOver(updated));

  if (isGameOver(updated)) {
    const w = getWinner(updated);
    console.log("game over — winner:", w);
    setTimeout(() => {
      setWinner(w);
      setGameOver(true);
      endSession();
    }, POP_ANIM_DURATION);
    return;
  }
}

    // Wait for pop animation, then next question
    setTimeout(() => {
      loadNextQuestion();
      reset(ANSWER_TIMEOUT);
      start();
    }, POP_ANIM_DURATION);

  }, [
    currentQuestion, balloons, gameOver,
    addScore, endSession,
    loadNextQuestion, reset, start,
  ]);

  return {
    // State
    balloons,
    currentQuestion,
    questionCount,
    remaining,
    poppingTeam,
    flashTeam,
    flashType,
    gameOver,
    winner,
    teams,
    // Actions
    handleAnswer,
    startTimer,
  };
}