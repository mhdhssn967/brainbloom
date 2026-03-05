import { useRef, useEffect, useState } from "react";
import { useGLTF, useAnimations }      from "@react-three/drei";
import { useFrame }                    from "@react-three/fiber";
import { SkeletonUtils }               from "three-stdlib";
import * as THREE                      from "three";
import SoundManager                    from "@/engine/SoundManager";
import { SOUND_KEYS }                  from "@/utils/constants";

// Seconds into the jump before horizontal movement starts
const MOVE_DELAY = 0.4;
// Seconds before jump animation ends that movement stops
const MOVE_EARLY = 0.2;

function randBetween(a, b) {
  return a + Math.random() * (b - a);
}

/**
 * Props:
 *   frog    — frog data object { id, x, z, captured, capturedBy }
 *   posRef  — mutable ref written every frame with live {x, z}
 *   bounds  — { halfW, halfH } in world units from viewport (replaces GROUND_HALF)
 */
export function Frog({ frog, posRef, bounds }) {
  const groupRef = useRef();
  const modelRef = useRef();

  const { scene, animations } = useGLTF("/assets/models/frog.glb");
  const [clonedScene] = useState(() => SkeletonUtils.clone(scene));
  const [clonedAnims] = useState(() => animations.map(c => c.clone()));
  const { actions }   = useAnimations(clonedAnims, modelRef);

  // Keep latest bounds in a ref so useFrame always reads current value
  const boundsRef = useRef(bounds ?? { halfW: 8, halfH: 8 });
  useEffect(() => {
    if (bounds) boundsRef.current = bounds;
  }, [bounds]);

  // ── Movement refs ─────────────────────────────────────────────────────
  const pos        = useRef({ x: frog.x, z: frog.z });
  const jumpOrigin = useRef({ x: frog.x, z: frog.z });
  const target     = useRef({ x: frog.x, z: frog.z });
  const state      = useRef("idle");
  const timer      = useRef(randBetween(0.3, 2.5));   // stagger initial jump
  const progress   = useRef(0);
  const jumpDur    = useRef(0.65);
  const moveStartF = useRef(0.35);
  const moveEndF   = useRef(0.75);

  // ── Get actual jump clip duration ─────────────────────────────────────
  useEffect(() => {
    const clip = animations.find(a => a.name === "FrogArmature|Frog_Jump");
    if (clip && clip.duration > 0) {
      const dur          = clip.duration;
      jumpDur.current    = dur;
      moveStartF.current = Math.min(MOVE_DELAY / dur, 0.5);
      moveEndF.current   = Math.max(1 - MOVE_EARLY / dur, moveStartF.current + 0.2);
    }
  }, [animations]);

  // ── Play idle on mount ────────────────────────────────────────────────
  useEffect(() => {
    const idle = actions["FrogArmature|Frog_Idle"];
    if (!idle) return;
    idle.reset().setLoop(THREE.LoopRepeat, Infinity).play();
  }, [actions]);

  // ── Write spawn position to posRef ───────────────────────────────────
  useEffect(() => {
    if (posRef) posRef.current = { x: frog.x, z: frog.z };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Animation helpers ─────────────────────────────────────────────────
  const playIdle = () => {
    const idle = actions["FrogArmature|Frog_Idle"];
    const jump = actions["FrogArmature|Frog_Jump"];
    if (jump) jump.fadeOut(0.1);
    if (idle) idle.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.1).play();
  };

  const playJump = () => {
    SoundManager.play(SOUND_KEYS.FROG);
    const idle = actions["FrogArmature|Frog_Idle"];
    const jump = actions["FrogArmature|Frog_Jump"];
    if (idle) idle.fadeOut(0.05);
    if (jump) {
      jump.reset().setLoop(THREE.LoopOnce, 1).fadeIn(0.05).play();
      jump.clampWhenFinished = true;
    }
  };

  // ── Frame loop ────────────────────────────────────────────────────────
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const { halfW, halfH } = boundsRef.current;

    // ── CAPTURED — freeze position, keep idle animation ────────────────
    if (frog.captured) {
      groupRef.current.position.set(pos.current.x, 0, pos.current.z);
      if (posRef) posRef.current = { x: pos.current.x, z: pos.current.z };
      return;
    }

    timer.current -= delta;

    // ── IDLE ────────────────────────────────────────────────────────────
    if (state.current === "idle") {
      groupRef.current.position.set(pos.current.x, 0, pos.current.z);
      if (posRef) posRef.current = { x: pos.current.x, z: pos.current.z };

      if (timer.current <= 0) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = randBetween(1.5, 3.5);

        // Clamp to dynamic viewport bounds
        const nx = Math.max(-halfW, Math.min(halfW, pos.current.x + Math.cos(angle) * dist));
        const nz = Math.max(-halfH, Math.min(halfH, pos.current.z + Math.sin(angle) * dist));

        jumpOrigin.current = { x: pos.current.x, z: pos.current.z };
        target.current     = { x: nx, z: nz };
        progress.current   = 0;
        timer.current      = jumpDur.current;
        state.current      = "jumping";

        const dx = nx - pos.current.x;
        const dz = nz - pos.current.z;
        groupRef.current.rotation.y = Math.atan2(dx, dz);

        playJump();
      }

    // ── JUMPING ─────────────────────────────────────────────────────────
    } else if (state.current === "jumping") {
      const dur = Math.max(jumpDur.current, 0.01);
      progress.current = Math.min(progress.current + delta / dur, 1);
      const p  = progress.current;
      const ms = moveStartF.current;
      const me = moveEndF.current;

      // Remap p to movement window 0→1
      let rawT;
      if      (p <= ms) rawT = 0;
      else if (p >= me) rawT = 1;
      else              rawT = (p - ms) / (me - ms);

      // Ease-in-out
      const moveT = rawT < 0.5
        ? 2 * rawT * rawT
        : 1 - Math.pow(-2 * rawT + 2, 2) / 2;

      const ox = jumpOrigin.current.x;
      const oz = jumpOrigin.current.z;
      const tx = target.current.x;
      const tz = target.current.z;

      pos.current.x = ox + (tx - ox) * moveT;
      pos.current.z = oz + (tz - oz) * moveT;

      const arc = Math.sin(p * Math.PI) * 0;

      groupRef.current.position.set(pos.current.x, arc, pos.current.z);
      if (posRef) posRef.current = { x: pos.current.x, z: pos.current.z };

      if (p >= 1) {
        pos.current.x = tx;
        pos.current.z = tz;
        state.current = "idle";
        timer.current = randBetween(1, 4);
        groupRef.current.position.set(tx, 0, tz);
        if (posRef) posRef.current = { x: tx, z: tz };
        playIdle();
      }
    }
  });

  return (
    <group ref={groupRef} position={[frog.x, 0, frog.z]}>
      <primitive
        ref={modelRef}
        object={clonedScene}
        scale={[0.4, 0.4, 0.4]}
      />
    </group>
  );
}

useGLTF.preload("/assets/models/frog.glb");