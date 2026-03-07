import { useState, useCallback, useRef, useEffect } from "react";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import SoundManager         from "@/engine/SoundManager";
import { SOUND_KEYS }       from "@/utils/constants";
import {
  getQuestion,
  spawnZombie,
  getCurrentWave,
  checkAnswer,
  getPrimaryTarget,
  getWinner,
} from "./engine";
import {
  MAX_HEALTH,
  ATTACK_DAMAGE,
  WRONG_LOCK_MS,
  HEADSHOT_WINDOW,
  POINTS_KILL,
  POINTS_HEADSHOT,
  DEATH_ANIM_MS,
  ARENA_WIDTH,
  SPAWN_Z,
  CHARACTER_Z,
  MAX_ZOMBIES_SCREEN,
  WAVES,
} from "./constants";

export function useZombieBlast({
  playerCount,
  gameType,
  timeLimit,
  difficulty,
  source = { type: "math" },
}) {
  const { endSession } = useSessionStore();
  const { teams }      = useTeamStore();

  const perPlayerWidth = playerCount === 2
    ? ARENA_WIDTH / 2
    : ARENA_WIDTH;

  // ── Players ───────────────────────────────────────────────────────────
  const initPlayers = () =>
    Array.from({ length: playerCount }, (_, i) => ({
      id: i, health: MAX_HEALTH, score: 0, alive: true,
    }));

  const [players,    setPlayers]    = useState(initPlayers);
  const playersRef                  = useRef(initPlayers());

  // ── Zombies ───────────────────────────────────────────────────────────
  const initZombies = () => {
    const obj = {};
    for (let i = 0; i < playerCount; i++) obj[i] = [];
    return obj;
  };

  const [zombiesByPlayer, setZombiesByPlayer] = useState(initZombies);
  const zombiesRef                            = useRef(initZombies());

  // ── Primary targets — { [playerId]: zombieId | null } ─────────────────
  // This is the ONE zombie each player is currently aiming at.
  // Only changes when that zombie dies.
  const [primaryTargets, setPrimaryTargets] = useState({ 0: null, 1: null });
  const primaryTargetsRef                   = useRef({ 0: null, 1: null });

  // ── Bullets ───────────────────────────────────────────────────────────
  const [bulletsByPlayer, setBulletsByPlayer] = useState(initZombies);

  // ── Questions ─────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState(() => {
    const obj = {};
    for (let i = 0; i < playerCount; i++) {
      obj[i] = getQuestion(source, difficulty);
    }
    return obj;
  });

  const questionTime = useRef({});
  useEffect(() => {
    for (let i = 0; i < playerCount; i++) {
      questionTime.current[i] = Date.now();
    }
  }, []);

  // ── Locked options ────────────────────────────────────────────────────
  const [lockedOpts, setLockedOpts] = useState(() => {
    const obj = {};
    for (let i = 0; i < playerCount; i++) obj[i] = new Set();
    return obj;
  });

  // ── Hit labels ────────────────────────────────────────────────────────
  const [hitLabels, setHitLabels] = useState([]);

  // ── Game state ────────────────────────────────────────────────────────
  const [phase,    setPhase]    = useState("playing");
  const [gameOver, setGameOver] = useState(false);
  const [winner,   setWinner]   = useState(null);
  const [elapsed,  setElapsed]  = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit ?? 60);

  const elapsedRef    = useRef(0);
  const phaseRef      = useRef("playing");
  const gameStartTime = useRef(Date.now());
  const spawnTimers   = useRef([]);
  const gameTimer     = useRef(null);

  // ── Recalculate primary target for a player ───────────────────────────
  // Called after any zombie state change or new spawn
  const recalcPrimaryTarget = useCallback((playerId, zombies) => {
    const current = primaryTargetsRef.current[playerId];
    const pool    = zombies ?? zombiesRef.current[playerId] ?? [];

    // If current target is still alive — keep it, don't switch
    const currentStillAlive = pool.some(
      z => z.id === current &&
           z.state !== "dying" &&
           z.state !== "dead"
    );
    if (currentStillAlive) return;

    // Current target is gone — pick the oldest spawned alive zombie
    const primary = getPrimaryTarget(pool);
    const newId   = primary?.id ?? null;

    primaryTargetsRef.current = {
      ...primaryTargetsRef.current,
      [playerId]: newId,
    };
    setPrimaryTargets({ ...primaryTargetsRef.current });
  }, []);

  // ── End game ──────────────────────────────────────────────────────────
  const endGame = useCallback((winnerId) => {
    if (phaseRef.current === "done") return;
    phaseRef.current = "done";
    setPhase("done");
    setGameOver(true);
    setWinner(winnerId);
    SoundManager.play(SOUND_KEYS.GAME_OVER);
    endSession();
    spawnTimers.current.forEach(id => {
      clearInterval(id);
      clearTimeout(id);
    });
    if (gameTimer.current) clearInterval(gameTimer.current);
  }, [endSession]);

  // ── Game clock ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "playing") return;
    gameTimer.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
      if (gameType === "timed") {
        const left = (timeLimit ?? 60) - elapsedRef.current;
        setTimeLeft(left);
        if (left <= 0) {
          endGame(getWinner(playersRef.current));
        }
      }
    }, 1000);
    return () => clearInterval(gameTimer.current);
  }, [phase, gameType, timeLimit, endGame]);

  // ── Update zombie state ───────────────────────────────────────────────
  const updateZombieState = useCallback((playerId, zombieId, newState) => {
    setZombiesByPlayer(prev => {
      const updated = (prev[playerId] ?? []).map(z =>
        z.id === zombieId ? { ...z, ...newState } : z
      );
      const next = { ...prev, [playerId]: updated };
      zombiesRef.current = next;

      // Recalc target after state change
      recalcPrimaryTarget(playerId, updated);
      return next;
    });
  }, [recalcPrimaryTarget]);

  // ── Zombie attack ─────────────────────────────────────────────────────
  const zombieAttack = useCallback((playerId) => {
    if (phaseRef.current !== "playing") return;
    SoundManager.play(SOUND_KEYS.ZOMBIE_ATTACK);

    setPlayers(prev => {
      const updated = prev.map(p => {
        if (p.id !== playerId) return p;
        const newHealth = Math.max(0, p.health - ATTACK_DAMAGE);
        const newAlive  = newHealth > 0;
        if (!newAlive && p.alive) {
          setTimeout(() => {
            if (playerCount === 1) {
              endGame(null);
            } else {
              const others = playersRef.current.filter(
                op => op.id !== playerId && op.alive
              );
              endGame(others[0]?.id ?? null);
            }
          }, 100);
        }
        return { ...p, health: newHealth, alive: newAlive };
      });
      playersRef.current = updated;
      return updated;
    });
  }, [playerCount, endGame]);

  // ── Spawn ─────────────────────────────────────────────────────────────
  const startSpawning = useCallback((playerId) => {
    const spawnTick = () => {
      if (phaseRef.current !== "playing") return;
      const wave    = getCurrentWave(elapsedRef.current);
      const current = zombiesRef.current[playerId] ?? [];
      const alive   = current.filter(z => z.state !== "dead");
      if (alive.length >= MAX_ZOMBIES_SCREEN) return;

      const zombie = spawnZombie(perPlayerWidth, SPAWN_Z);
      zombie.moveAnimation = wave.animation;
      zombie.speed         = wave.speed;

      SoundManager.play(SOUND_KEYS.ZOMBIE_GROWL);

      const updated = [...current, zombie];
      zombiesRef.current = { ...zombiesRef.current, [playerId]: updated };
      setZombiesByPlayer({ ...zombiesRef.current });

      // Recalc — if no primary target yet, this zombie becomes it
      recalcPrimaryTarget(playerId, updated);
    };

    setTimeout(spawnTick, 1000);
    const id = setInterval(spawnTick, WAVES[0].spawnInterval);
    spawnTimers.current.push(id);
  }, [perPlayerWidth, recalcPrimaryTarget]);

  // ── Handle answer ─────────────────────────────────────────────────────
  const handleAnswer = useCallback((playerId, picked) => {
    if (phaseRef.current !== "playing") return;

    const question  = questions[playerId];
    const isCorrect = checkAnswer(question, picked);

    if (isCorrect) {
      const elapsed    = Date.now() - (questionTime.current[playerId] ?? 0);
      const isHeadshot = elapsed < HEADSHOT_WINDOW;
      const points     = isHeadshot ? POINTS_HEADSHOT : POINTS_KILL;

      SoundManager.play(isHeadshot ? SOUND_KEYS.HEADSHOT : SOUND_KEYS.SHOOT);

      // ── Always shoot the PRIMARY target ──────────────────────────
      const targetId = primaryTargetsRef.current[playerId];
      const zombies  = zombiesRef.current[playerId] ?? [];
      const target   = targetId !== null
        ? zombies.find(z => z.id === targetId && z.state === "walking")
        : null;

      if (target) {
        // Spawn bullet
        const bullet = {
          id:       `b-${Date.now()}-${Math.random()}`,
          fromX:    0,
          fromZ:    CHARACTER_Z,
          toX:      target.x,
          toZ:      target.z,
          targetId: target.id,
          playerId,
        };

        setBulletsByPlayer(prev => ({
          ...prev,
          [playerId]: [...(prev[playerId] ?? []), bullet],
        }));

        const travelMs = 280;

        setTimeout(() => {
          SoundManager.play(SOUND_KEYS.ZOMBIE_DEATH);

          // Hit label
          const labelId = `label-${Date.now()}-${Math.random()}`;
          setHitLabels(prev => [...prev, {
            id: labelId, x: target.x, z: target.z,
            points, isHeadshot, playerId,
          }]);
          setTimeout(() => {
            setHitLabels(prev => prev.filter(l => l.id !== labelId));
          }, 1200);

          // Kill zombie — this triggers recalcPrimaryTarget
          // which will then point to the NEXT oldest zombie
          updateZombieState(playerId, target.id, { state: "dying" });

          // Remove bullet
          setBulletsByPlayer(prev => ({
            ...prev,
            [playerId]: (prev[playerId] ?? []).filter(b => b.id !== bullet.id),
          }));

          // Remove zombie body after death animation
          setTimeout(() => {
            updateZombieState(playerId, target.id, { state: "dead" });
          }, DEATH_ANIM_MS);

        }, travelMs);
      }

      // Update score
      setPlayers(prev => {
        const updated = prev.map(p =>
          p.id === playerId ? { ...p, score: p.score + points } : p
        );
        playersRef.current = updated;
        return updated;
      });

      // Next question
      setQuestions(prev => ({
        ...prev,
        [playerId]: getQuestion(source, difficulty),
      }));
      questionTime.current[playerId] = Date.now();
      setLockedOpts(prev => ({ ...prev, [playerId]: new Set() }));

    } else {
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
  }, [questions, source, difficulty, updateZombieState]);

  // ── Start on mount ────────────────────────────────────────────────────
  useEffect(() => {
    for (let i = 0; i < playerCount; i++) startSpawning(i);
    return () => {
      spawnTimers.current.forEach(id => {
        clearInterval(id);
        clearTimeout(id);
      });
    };
  }, []);

  const currentWave = getCurrentWave(elapsed);

  return {
    players,
    zombiesByPlayer,
    bulletsByPlayer,
    questions,
    lockedOpts,
    hitLabels,
    primaryTargets,      // ← exposed so Character can aim at correct zombie
    phase,
    gameOver,
    winner,
    elapsed,
    timeLeft,
    currentWave,
    teams,
    handleAnswer,
    zombieAttack,
    updateZombieState,
  };
}