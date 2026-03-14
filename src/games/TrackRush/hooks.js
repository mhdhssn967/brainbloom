import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import SoundManager        from "@/engine/SoundManager";
import { SOUND_KEYS }      from "@/utils/constants";
import { buildQuestionList } from "@/data/trackRushData";
import { POINTS_CORRECT, POINTS_WRONG, STUMBLE_MS, NEXT_Q_DELAY_MS } from "./constants";

function initPlayer() {
  return { score: 0, lane: 1, phase: "waiting" };
}

export function useTrackRush({ levelKey, totalSeconds }) {
  const { endSession } = useSessionStore();
  const { teams }      = useTeamStore();

  const questions  = useMemo(() => buildQuestionList(levelKey), [levelKey]);
  const [qIndex,   setQIndex]  = useState(0);
  const qIndexRef              = useRef(0);

  const initState = useMemo(() => ({ 0: initPlayer(), 1: initPlayer() }), []);
  const [players,  setPlayers] = useState(initState);
  const playersRef             = useRef(initState);

  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [gameOver, setGameOver] = useState(false);
  const [winner,   setWinner]   = useState(null);
  const [started,  setStarted]  = useState(false);

  // ── Block spawn descriptor — just lane + id, NO z (z lives in R3F)
  // Changing this triggers R3F to remount portals at z=-30
  const [spawnKey, setSpawnKey] = useState(null); // { qIdx, ts } — ts forces remount

  const answeredRef  = useRef({ 0: false, 1: false });
  const hitCoolRef   = useRef({ 0: false, 1: false });
  const gameOverRef  = useRef(false);
  const timerRef     = useRef(null);
  const timeLeftRef  = useRef(totalSeconds);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const updatePlayer = useCallback((id, patch) => {
    setPlayers(prev => {
      const u = { ...prev, [id]: { ...prev[id], ...patch } };
      playersRef.current = u;
      return u;
    });
  }, []);

  const endGame = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    clearInterval(timerRef.current);
    const p = playersRef.current;
    const w = p[0].score > p[1].score ? 0 : p[1].score > p[0].score ? 1 : null;
    setWinner(w);
    setGameOver(true);
    endSession();
    try { SoundManager.play(SOUND_KEYS.WIN); } catch (e) {}
  }, [endSession]);

  // ── spawnBlocks — just sets a key; R3F canvas spawns portals on key change
  const spawnBlocks = useCallback((qIdx) => {
    answeredRef.current = { 0: false, 1: false };
    hitCoolRef.current  = { 0: false, 1: false };
    qIndexRef.current   = qIdx;
    setQIndex(qIdx);
    setSpawnKey({ qIdx, ts: Date.now() });
  }, []);

  const loadQuestion = useCallback((idx) => {
    setPlayers(prev => {
      const u = { 0: { ...prev[0], phase: "running" }, 1: { ...prev[1], phase: "running" } };
      playersRef.current = u;
      return u;
    });
    spawnBlocks(idx);
  }, [spawnBlocks]);

  const startGame = useCallback(() => {
    setStarted(true);
    setPlayers(prev => {
      const u = { 0: { ...prev[0], phase: "running" }, 1: { ...prev[1], phase: "running" } };
      playersRef.current = u;
      return u;
    });
    spawnBlocks(0);
    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      if (timeLeftRef.current <= 0) endGame();
    }, 1000);
  }, [spawnBlocks, endGame]);

  // ── Hit callback — called from R3F canvas
  // originalCorrectIdx: question.correct if player ran through correct portal, else -1
  const onPortalHit = useCallback((playerId, originalCorrectIdx) => {
    if (gameOverRef.current) return;
    if (answeredRef.current[playerId]) return;
    if (hitCoolRef.current[playerId]) return;

    hitCoolRef.current[playerId] = true;
    setTimeout(() => { hitCoolRef.current[playerId] = false; }, 120);

    const q = questions[qIndexRef.current];
    if (!q) return;

    const isCorrect = originalCorrectIdx === q.correct;

    if (isCorrect) {
      try { SoundManager.play(SOUND_KEYS.CORRECT); } catch (e) {}
      answeredRef.current[playerId] = true;
      setPlayers(prev => {
        const u = { ...prev, [playerId]: { ...prev[playerId], score: prev[playerId].score + POINTS_CORRECT, phase: "celebrating" } };
        playersRef.current = u;
        return u;
      });
      setTimeout(() => {
        if (gameOverRef.current) return;
        loadQuestion((qIndexRef.current + 1) % questions.length);
      }, NEXT_Q_DELAY_MS);
    } else {
      try { SoundManager.play(SOUND_KEYS.WRONG); } catch (e) {}
      setPlayers(prev => {
        const u = { ...prev, [playerId]: { ...prev[playerId], score: Math.max(0, prev[playerId].score + POINTS_WRONG), phase: "stumble" } };
        playersRef.current = u;
        return u;
      });
      setTimeout(() => {
        if (gameOverRef.current) return;
        setPlayers(prev => {
          const u = { ...prev, [playerId]: { ...prev[playerId], phase: "running" } };
          playersRef.current = u;
          return u;
        });
      }, STUMBLE_MS);
    }
  }, [questions, loadQuestion]);

  const changeLane = useCallback((playerId, direction) => {
    if (gameOverRef.current) return;
    const p = playersRef.current[playerId];
    const newLane = Math.max(0, Math.min(2, p.lane + direction));
    if (newLane === p.lane) return;
    updatePlayer(playerId, { lane: newLane });
  }, [updatePlayer]);

  useEffect(() => () => clearInterval(timerRef.current), []);

  return {
    players, timeLeft, gameOver, winner,
    started, teams, qIndex, questions,
    spawnKey, onPortalHit, changeLane, startGame,
  };
}