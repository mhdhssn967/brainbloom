import { useRef, useEffect, useMemo, Suspense, useState } from "react";
import { Canvas, useFrame, useThree }                     from "@react-three/fiber";
import { useGLTF, useAnimations, Html }                   from "@react-three/drei";
import * as THREE                                         from "three";
import { clone }                                          from "three/examples/jsm/utils/SkeletonUtils";
import { LANE_X, CHAR_Z, STUMBLE_MS }                     from "../constants";

const BLOCK_SPEED = 7;       // world units per second
const SPAWN_Z     = -32;     // where portals appear
const HIT_Z       = 1.8;     // z at which collision fires
const COLORS = ["#FFD700","#EF4444","#3B82F6","#22C55E","#EC4899","#fff","#F59E0B"];

// ─── Moving tree ──────────────────────────────────────────────────────────────
function MovingTree({ startZ, xSide, speed = 5.5, colorIdx = 0, started }) {
  const ref  = useRef();
  const zRef = useRef(startZ);
  const treeColors = ["#2D8A1E","#3DAB26","#1F7A14","#4CBB35"];
  const leafC  = treeColors[colorIdx % treeColors.length];
  const trunkC = "#7B4E2D";

  useFrame((_, delta) => {
    if (!started) return;
    zRef.current += speed * delta;
    if (zRef.current > 22) zRef.current = -50;
    if (ref.current) ref.current.position.z = zRef.current;
  });

  return (
    <group ref={ref} position={[xSide, 0, startZ]}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 1.8, 6]} />
        <meshStandardMaterial color={trunkC} />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0, 1.8, 2.8, 7]} />
        <meshStandardMaterial color={leafC} />
      </mesh>
      <mesh position={[0, 3.6, 0]}>
        <cylinderGeometry args={[0, 1.2, 2.0, 7]} />
        <meshStandardMaterial color={leafC} emissive={leafC} emissiveIntensity={0.05} />
      </mesh>
    </group>
  );
}

// ─── Moving coin ──────────────────────────────────────────────────────────────
function MovingCoin({ startZ, x, speed = 5.5, started }) {
  const ref  = useRef();
  const zRef = useRef(startZ);
  useFrame((state, delta) => {
    if (!started) return;
    zRef.current += speed * delta;
    if (zRef.current > 22) zRef.current = -50;
    if (ref.current) {
      ref.current.position.z = zRef.current;
      ref.current.rotation.y = state.clock.elapsedTime * 3;
    }
  });
  return (
    <mesh ref={ref} position={[x, 1.4, startZ]}>
      <cylinderGeometry args={[0.28, 0.28, 0.09, 12]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFB300" emissiveIntensity={0.7} metalness={0.9} roughness={0.1} />
    </mesh>
  );
}

// ─── Environment ─────────────────────────────────────────────────────────────
function Environment({ started }) {
  return (
    <group>
      <mesh position={[0, 10, -55]}>
        <planeGeometry args={[120, 40]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
      <mesh position={[7, 18, -50]}>
        <sphereGeometry args={[2.5, 16, 16]} />
        <meshStandardMaterial color="#FFE14D" emissive="#FFD700" emissiveIntensity={1.0} />
      </mesh>
      {[[-10,15,-45],[0,16,-50],[12,14,-42],[-5,17,-55]].map(([x,y,z],i) => (
        <group key={i} position={[x,y,z]}>
          <mesh><sphereGeometry args={[1.6,8,8]}/><meshStandardMaterial color="#fff"/></mesh>
          <mesh position={[1.4,-0.2,0]}><sphereGeometry args={[1.2,8,8]}/><meshStandardMaterial color="#fff"/></mesh>
          <mesh position={[-1.4,-0.2,0]}><sphereGeometry args={[1.1,8,8]}/><meshStandardMaterial color="#fff"/></mesh>
        </group>
      ))}
      {/* Grass */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-0.02,-15]}>
        <planeGeometry args={[40, 90]} />
        <meshStandardMaterial color="#5DC44A" />
      </mesh>
      {/* Road */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,0,-15]}>
        <planeGeometry args={[12, 90]} />
        <meshStandardMaterial color="#D4A853" />
      </mesh>
      {/* Lane dividers */}
      {[-1.6, 1.6].map((x,i) => (
        <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[x,0.002,-15]}>
          <planeGeometry args={[0.12, 90]} />
          <meshStandardMaterial color="#fff" opacity={0.65} transparent />
        </mesh>
      ))}
      {/* Kerbs */}
      {[-6.2, 6.2].map((x,i) => (
        <mesh key={i} rotation={[-Math.PI/2,0,0]} position={[x,0.003,-15]}>
          <planeGeometry args={[0.45, 90]} />
          <meshStandardMaterial color={i===0?"#EF4444":"#3B82F6"} opacity={0.8} transparent />
        </mesh>
      ))}
      {/* Moving trees */}
      {[-14,-26,-38,-2,-50].map((z,i) => <MovingTree key={`L${i}`} startZ={z} xSide={-8} colorIdx={i} started={started} />)}
      {[-8,-20,-32,-44,-6].map((z,i)  => <MovingTree key={`R${i}`} startZ={z} xSide={8}  colorIdx={i+2} started={started} />)}
      {/* Moving coins */}
      {[-10,-25,-40].map((z,i) => <MovingCoin key={`CL${i}`} startZ={z} x={-6.5} speed={5+i*0.5} started={started} />)}
      {[-16,-31].map((z,i)     => <MovingCoin key={`CR${i}`} startZ={z} x={6.5}  speed={5.5+i*0.5} started={started} />)}
    </group>
  );
}

// ─── HologramPortal — owns its own z in useFrame ─────────────────────────────
// Key prop from parent forces remount (reset z) on new question
function HologramPortal({ lane, option, playerId, playerLane, teamColor, onHit, started }) {
  const groupRef  = useRef();
  const ringRef   = useRef();
  const innerRef  = useRef();
  const confRefs  = useRef([]);
  const zRef      = useRef(SPAWN_Z);
  const hitFired  = useRef(false);
  const hitTime   = useRef(null);
  const [state, setState] = useState("active"); // active | correct | wrong

  const stateRef = useRef("active");

  const confData = useRef(
    Array.from({ length: 20 }, () => ({
      ox: (Math.random()-0.5)*0.5, oy: 0.3, oz: (Math.random()-0.5)*0.5,
      vx: (Math.random()-0.5)*5,  vy: 3+Math.random()*4, vz: (Math.random()-0.5)*3,
      color: COLORS[Math.floor(Math.random()*COLORS.length)],
    }))
  );

  // Called by parent to mark this portal as hit
  const markCorrect = useCallback_r3f(() => {
    stateRef.current = "correct";
    setState("correct");
  });
  const markWrong = useCallback_r3f(() => {
    stateRef.current = "wrong";
    setState("wrong");
    setTimeout(() => { stateRef.current = "active"; setState("active"); }, 500);
  });

  useFrame((clock, delta) => {
    if (!started || !groupRef.current) return;

    // Move portal toward character
    if (stateRef.current !== "correct") {
      zRef.current += BLOCK_SPEED * delta;
      groupRef.current.position.z = zRef.current;
    }

    // Hit detection — fire once when portal reaches player z AND player is in this lane
    if (!hitFired.current && zRef.current >= HIT_Z && playerLane === lane) {
      hitFired.current = true;
      onHit(lane);
    }

    // Ring pulse + rotate
    if (ringRef.current && stateRef.current === "active") {
      const t = clock.elapsedTime;
      const pulse = 1 + Math.sin(t * 3 + lane) * 0.05;
      ringRef.current.scale.set(pulse, pulse, pulse);
      ringRef.current.rotation.y += delta * 1.2;
    }

    // Inner shimmer
    if (innerRef.current && stateRef.current === "active") {
      innerRef.current.material.opacity = 0.14 + Math.sin(clock.elapsedTime * 4 + lane) * 0.08;
    }

    // Confetti animation
    if (stateRef.current === "correct") {
      if (!hitTime.current) hitTime.current = clock.elapsedTime;
      const elapsed = clock.elapsedTime - hitTime.current;
      confData.current.forEach((p, i) => {
        const m = confRefs.current[i];
        if (!m) return;
        m.position.set(
          p.ox + p.vx * elapsed,
          p.oy + p.vy * elapsed - 5 * elapsed * elapsed,
          p.oz + p.vz * elapsed,
        );
        m.rotation.y += 0.12;
        m.material.opacity = Math.max(0, 1 - elapsed / 0.9);
      });
    }
  });

  const pc = teamColor;
  const isWrong   = state === "wrong";
  const isCorrect = state === "correct";

  return (
    <group ref={groupRef} position={[LANE_X[lane], 0, SPAWN_Z]}>
      {isWrong && <pointLight position={[0,1,0]} color="#EF4444" intensity={12} distance={5} />}

      {!isCorrect && (
        <>
          {/* Ground glow */}
          <mesh rotation={[-Math.PI/2,0,0]} position={[0,0.01,0]}>
            <circleGeometry args={[1.8, 32]} />
            <meshStandardMaterial color={pc} emissive={pc} emissiveIntensity={0.9} transparent opacity={0.32} />
          </mesh>
          {/* Cylinder column */}
          <mesh ref={innerRef} position={[0,1.6,0]}>
            <cylinderGeometry args={[1.65, 1.65, 3.2, 28, 1, true]} />
            <meshStandardMaterial color={pc} emissive={pc} emissiveIntensity={0.7}
              transparent opacity={0.14} side={THREE.DoubleSide} />
          </mesh>
          {/* Bottom rotating ring */}
          <mesh ref={ringRef} rotation={[Math.PI/2,0,0]} position={[0,0.08,0]}>
            <torusGeometry args={[1.75, 0.09, 10, 36]} />
            <meshStandardMaterial color={pc} emissive={pc} emissiveIntensity={2.2} transparent opacity={0.95} />
          </mesh>
          {/* Tilted mid ring */}
          <mesh rotation={[Math.PI/2+0.5, 0.3, 0]} position={[0,1.6,0]}>
            <torusGeometry args={[1.5, 0.055, 10, 32]} />
            <meshStandardMaterial color={pc} emissive={pc} emissiveIntensity={1.6} transparent opacity={0.7} />
          </mesh>
          {/* Top cap */}
          <mesh position={[0,3.28,0]}>
            <cylinderGeometry args={[0.1, 1.65, 0.07, 24]} />
            <meshStandardMaterial color={pc} emissive={pc} emissiveIntensity={2.5} transparent opacity={0.85} />
          </mesh>
          <pointLight position={[0,1.2,0]} color={pc} intensity={1.8} distance={4} />

          {/* Text label via Html — auto-projected from 3D position */}
          <Html position={[0, 1.6, 0]} center distanceFactor={10} zIndexRange={[10,0]}
            style={{ pointerEvents:"none" }}>
            <div style={{
              background:    isWrong ? "rgba(239,68,68,0.9)" : "rgba(0,0,0,0.80)",
              border:        `2.5px solid ${isWrong ? "#EF4444" : pc}`,
              borderRadius:  14,
              padding:       "6px 18px",
              fontFamily:    "'Lilita One', cursive",
              fontSize:      52,
              color:         "#fff",
              whiteSpace:    "nowrap",
              textShadow:    `0 0 12px ${pc}, 0 2px 4px rgba(0,0,0,0.9)`,
              boxShadow:     `0 0 18px ${pc}66`,
              minWidth:      80,
              textAlign:     "center",
            }}>
              {option}
            </div>
          </Html>
        </>
      )}

      {/* Confetti */}
      {isCorrect && confData.current.map((p, i) => (
        <mesh key={i} ref={el => confRefs.current[i] = el} position={[p.ox, p.oy, p.oz]}>
          <boxGeometry args={[0.18, 0.10, 0.10]} />
          <meshStandardMaterial color={p.color} transparent opacity={1} />
        </mesh>
      ))}
    </group>
  );
}

// tiny helper — useCallback isn't available outside React components but we
// just need a stable ref-based "setter" here
function useCallback_r3f(fn) { return fn; }

// ─── Deterministic shuffle for per-player lane ordering ──────────────────────
// Same qIdx+playerId always produces the same order (stable across re-renders)
function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns { options, correctLane } with options shuffled per player
function getPlayerOptions(question, playerId) {
  if (!question) return null;
  const seed = question.correct * 31 + playerId * 9999 + question.options.length;
  const indices = seededShuffle([0, 1, 2], seed);
  return {
    options:     indices.map(i => question.options[i]),
    correctLane: indices.indexOf(question.correct),
  };
}

// ─── PortalsLayer — remounts portals when spawnKey changes ───────────────────
function PortalsLayer({ spawnKey, question, playerId, playerLane, teamColor, onPortalHit, started }) {
  if (!spawnKey || !question) return null;
  const { options, correctLane } = getPlayerOptions(question, playerId);
  return (
    <group key={`${spawnKey.qIdx}-${spawnKey.ts}`}>
      {[0, 1, 2].map(lane => (
        <HologramPortal
          key={lane}
          lane={lane}
          option={options[lane]}
          correctLane={correctLane}
          playerId={playerId}
          playerLane={playerLane}
          teamColor={teamColor}
          onHit={(l) => onPortalHit(playerId, l === correctLane ? question.correct : -1)}
          started={started}
        />
      ))}
    </group>
  );
}

// ─── Character ───────────────────────────────────────────────────────────────
function Character({ modelPath, lane, phase, teamColor }) {
  const groupRef    = useRef();
  const { scene }   = useGLTF(modelPath);
  const clonedScene = useMemo(() => clone(scene), [scene]);
  const { actions } = useAnimations(useGLTF(modelPath).animations, groupRef);
  const curX        = useRef(LANE_X[lane]);

  useEffect(() => {
    if (!actions) return;
    const names = Object.keys(actions);
    if (!names.length) return;
    const runAnim     = names.find(n => /run/i.test(n))               ?? names[0];
    const idleAnim    = names.find(n => /wave/i.test(n))              ?? names[0];
    const stumbleAnim = names.find(n => /stumble|hit|fall/i.test(n));
    const celebAnim   = names.find(n => /cheer|victory|wave|celebrat/i.test(n));
    Object.values(actions).forEach(a => a?.stop());
    if (phase === "waiting")     { actions[idleAnim]?.reset().play(); }
    else if (phase === "running") { actions[runAnim]?.reset().play(); }
    else if (phase === "stumble") {
      if (stumbleAnim) { actions[stumbleAnim]?.reset().play(); setTimeout(() => actions[runAnim]?.reset().play(), STUMBLE_MS); }
      else actions[runAnim]?.reset().play();
    }
    else if (phase === "celebrating") {
    //   if (celebAnim) actions[celebAnim]?.reset().play();
      actions[runAnim]?.reset().play();
    }
  }, [phase, actions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const tx = LANE_X[lane];
    curX.current = THREE.MathUtils.lerp(curX.current, tx, Math.min(1, delta * 13));
    groupRef.current.position.x = curX.current;
    const diff = tx - curX.current;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -diff * 0.14, delta * 10);
    if (phase === "stumble") {
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.025) * 0.12;
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, delta * 8);
    }
  });

  return (
    <group ref={groupRef} position={[LANE_X[lane], 0, CHAR_Z]}>
      <primitive object={clonedScene} scale={0.65} rotation={[0, Math.PI, 0]} />
      <pointLight position={[0,0.8,0]} color={teamColor}
        intensity={phase === "celebrating" ? 5 : 1.5} distance={3.5} />
      {phase === "stumble" && <pointLight position={[0,1,0]} color="#EF4444" intensity={6} distance={3} />}
    </group>
  );
}

// ─── Camera ──────────────────────────────────────────────────────────────────
function GameCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 5, 16);
    camera.lookAt(0, 0, -10);
    camera.fov = 38; camera.near = 0.1; camera.far = 220;
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
}

// ─── Scene ───────────────────────────────────────────────────────────────────
function Scene({ playerId, player, spawnKey, question, teamColor, onPortalHit, started }) {
  const modelPath = playerId === 0 ? "/assets/models/ch1.glb" : "/assets/models/ch2.glb";
  return (
    <>
      <GameCamera />
      <ambientLight intensity={1.2} color="#fff8e7" />
      <directionalLight position={[8,20,8]} intensity={2.0} color="#fff5cc" castShadow />
      <directionalLight position={[-6,12,6]} intensity={0.5} color="#c8e8ff" />
      <fog attach="fog" args={["#87CEEB", 38, 70]} />
      <Environment started={started} />
      <Suspense fallback={null}>
        <Character modelPath={modelPath} lane={player.lane} phase={player.phase} teamColor={teamColor} />
      </Suspense>
      <PortalsLayer
        spawnKey={spawnKey}
        question={question}
        playerId={playerId}
        playerLane={player.lane}
        teamColor={teamColor}
        onPortalHit={onPortalHit}
        started={started}
      />
    </>
  );
}

// ─── Export ──────────────────────────────────────────────────────────────────
export default function TrackCanvas({ playerId, player, spawnKey, question, teamColor, onPortalHit, started }) {
  return (
    <Canvas shadows gl={{ antialias: true, alpha: false }}
      style={{ width:"100%", height:"100%", background:"#87CEEB" }}>
      <Scene playerId={playerId} player={player} spawnKey={spawnKey}
        question={question} teamColor={teamColor}
        onPortalHit={onPortalHit} started={started} />
    </Canvas>
  );
}