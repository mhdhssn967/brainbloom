import { useState, useCallback, useRef } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import SoundManager         from "@/engine/SoundManager";
import { SOUND_KEYS }       from "@/utils/constants";
import {
  initGameStates,
  isNearEnough,
  screenToSvg,
  getNextState,
  getWinner,
} from "./engine";
import {
  POINTS_PER_CORRECT,
  RESULT_SHOW_MS,
  STATES_TO_PLACE,
} from "./constants";

/**
 * Game phases:
 * "playing"  — active team is dragging a state
 * "correct"  — snap succeeded, brief flash before next turn
 * "wrong"    — snap failed, other team gets a chance
 * "retry"    — second team's attempt at the same state
 * "done"     — all states placed or attempted
 */

export function useMapGame() {
  const { endSession }      = useSessionStore();
  const { teams, addScore } = useTeamStore();

  // ── SVG ref — needed to get bounding rect for coordinate conversion ──
  const mapRef = useRef(null);

  // ── Game state ───────────────────────────────────────────────────────
  const [gameStates]    = useState(() => initGameStates());
  const [roundIndex,    setRoundIndex]    = useState(0);
  const [activeTeam,    setActiveTeam]    = useState(0);       // 0 = red, 1 = blue
  const [phase,         setPhase]         = useState("playing");
  const [placedStates,  setPlacedStates]  = useState([]);      // successfully placed
  const [failedFirst,   setFailedFirst]   = useState(false);   // first attempt failed
  const [lastResult,    setLastResult]    = useState(null);    // "correct" | "wrong"
  const [gameOver,      setGameOver]      = useState(false);
  const [scores,        setScores]        = useState({ 0: 0, 1: 0 });

  // Current state the player needs to place
  const currentState = getNextState(gameStates.toPlace, roundIndex);

  // ── Get SVG bounding rect for coordinate conversion ──────────────────
  const getSvgRect = useCallback(() => {
    if (!mapRef.current) return null;
    return mapRef.current.getBoundingClientRect();
  }, []);

  // ── Advance to next round ────────────────────────────────────────────
  const nextRound = useCallback(() => {
    const next = roundIndex + 1;
    if (next >= STATES_TO_PLACE) {
      setGameOver(true);
      setPhase("done");
      endSession();
      return;
    }
    setRoundIndex(next);
    setActiveTeam(t => t === 0 ? 1 : 0);  // alternate starting team
    setFailedFirst(false);
    setLastResult(null);
    setPhase("playing");
  }, [roundIndex, endSession]);

  // ── Handle drop — called when student releases the dragged state ─────
  const handleDrop = useCallback((screenX, screenY) => {
    if (phase !== "playing") return;
    if (!currentState) return;

   const svg = document.getElementById("india-svg-main");
  if (!svg) return;

    // Convert screen drop position to SVG coordinate space
    const rect = svg.getBoundingClientRect();

  const svgPos = screenToSvg(
    screenX, screenY,
    rect.width,
    { x: rect.left, y: rect.top }
  );

  const correct = isNearEnough(svgPos, currentState.centroid);

    if (correct) {
      // ── Correct placement ──────────────────────────────────────────
      SoundManager.play(SOUND_KEYS.CORRECT);

      // Add to placed states with the team colour
      setPlacedStates(prev => [
        ...prev,
        { ...currentState, teamId: activeTeam }
      ]);

      // Update score
      const newScore = scores[activeTeam] + POINTS_PER_CORRECT;
      setScores(prev => ({ ...prev, [activeTeam]: newScore }));
      addScore(activeTeam, POINTS_PER_CORRECT);

      setLastResult("correct");
      setPhase("correct");

      setTimeout(() => nextRound(), RESULT_SHOW_MS);

    } else {
      // ── Wrong placement ────────────────────────────────────────────
      SoundManager.play(SOUND_KEYS.WRONG);
      setLastResult("wrong");

      if (!failedFirst) {
        // First attempt failed — give other team a chance
        setFailedFirst(true);
        setActiveTeam(t => t === 0 ? 1 : 0);
        setPhase("playing");
      } else {
        // Both teams failed — discard state, move on
        setPhase("wrong");
        setTimeout(() => nextRound(), RESULT_SHOW_MS);
      }
    }
  }, [
    phase, currentState, activeTeam,
    failedFirst, scores, getSvgRect,
    addScore, nextRound,
  ]);

  return {
    // Refs
    mapRef,
    // State
    preShownStates: gameStates.preShown,
    currentState,
    placedStates,
    activeTeam,
    phase,
    lastResult,
    roundIndex,
    scores,
    gameOver,
    teams,
    // Actions
    handleDrop,
  };
}