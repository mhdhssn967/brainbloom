import {
  useRef, useEffect, useMemo, useCallback
} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame }               from "@react-three/fiber";
import { SkeletonUtils }          from "three-stdlib";
import * as THREE                 from "three";
import { CHAR_ANIMS, CHARACTER_Y } from "../constants";

const WALK_SPEED = 0.025;
const RUN_SPEED  = 0.07;

export function BridgeCharacter({ phase, characterX, startX, endX, teamColor }) {
  console.log(teamColor);
  
  const groupRef    = useRef();
  const modelRef    = useRef();
  const currentAnim = useRef(null);
  const subPhase    = useRef("idle");

  // Internal position — drives actual 3D position
  const posX        = useRef(characterX);
  // Target position — set once when walking starts
  const targetX     = useRef(characterX);
  const isWalking   = useRef(false);

  const { scene, animations } = useGLTF("/assets/models/anim.glb");
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene),     [scene]);
  const clonedAnims = useMemo(() => animations.map(c => c.clone()), [animations]);
  const { actions } = useAnimations(clonedAnims, modelRef);

  const playAnim = useCallback((name, loop = true) => {
    if (!name || !actions[name]) return;
    if (currentAnim.current === name) return;

    const prev = actions[currentAnim.current];
    const next = actions[name];

    if (prev && prev.isRunning()) prev.fadeOut(0.25);
    next
      .reset()
      .fadeIn(0.25)
      .setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
      .play();
    if (!loop) next.clampWhenFinished = true;
    currentAnim.current = name;
  }, [actions]);

  // Mount — start idle
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    playAnim(CHAR_ANIMS.IDLE, true);
  }, [actions, playAnim]);

  

  // Phase change from parent
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    if (phase === "playing") {
      isWalking.current = false;
      subPhase.current  = "idle";
      // Snap internal position to start
      posX.current    = characterX;
      targetX.current = characterX;
      if (groupRef.current) groupRef.current.position.x = characterX;
      playAnim(CHAR_ANIMS.IDLE, true);
    }

    if (phase === "walking") {
      // Start walking — target is endX
      isWalking.current = true;
      subPhase.current  = "walk_in";
      targetX.current   = endX;
      // posX stays at current position — useFrame moves it
      playAnim(CHAR_ANIMS.WALK, true);
    }
  }, [phase]);   // ← intentionally only phase, not characterX/endX

  useFrame(() => {
    if (!groupRef.current) return;

    if (!isWalking.current) return;

    const current  = posX.current;
    const target   = targetX.current;
    const total    = target - startX;
    if (total <= 0) return;

    const progress = (current - startX) / total; // 0 → 1

    // Determine sub-phase and speed
    let speed = WALK_SPEED;
     if (progress < 0.85) {
      speed = RUN_SPEED;
      if (subPhase.current !== "run") {
        subPhase.current = "run";
        playAnim(CHAR_ANIMS.RUN, true);
      }
    } else if (progress < 0.98) {
      speed = WALK_SPEED;
      if (subPhase.current !== "walk_out") {
        subPhase.current = "walk_out";
        playAnim(CHAR_ANIMS.WALK, true);
      }
    } else {
      // Arrived
      if (subPhase.current !== "arrived") {
        subPhase.current  = "arrived";
        isWalking.current = false;
        posX.current      = target;
        groupRef.current.position.x = target;
        playAnim(CHAR_ANIMS.IDLE, true);
      }
      return;
    }

    // Move
    posX.current = Math.min(current + speed, target);
    groupRef.current.position.x = posX.current;
  });

  // Facing direction
  // idle → face camera (rotation y = 0)
  // walking → face right (rotation y = PI/2ave)
  const facingY = phase === "playing" ? 0 : Math.PI / 2;

useEffect(() => {
  if (!clonedScene) return;
  if (teamColor !== "#EF4444") return;

  clonedScene.traverse((child) => {
    if (!child.isMesh) return;

    // make material unique
    child.material = child.material.clone();

    const mat = child.material;
    if (!mat.color) return;

    const hex = mat.color.getHexString().toLowerCase();

    if (hex === "0387e7") {
      mat.color.set("#ef4444"); // replace with team red
      mat.needsUpdate = true;
    }
    if (hex === "759fa3"){
      mat.color.set("rgb(255, 172, 172)"); // replace with team red
      mat.needsUpdate = true;
    }
  });

}, [clonedScene, teamColor]);

  return (
    <group
      ref={groupRef}
      position={[characterX, CHARACTER_Y, 0]}
    >
      <group rotation={[0, facingY, 0]}>
        <primitive
          ref={modelRef}
          object={clonedScene}
          scale={[0.55, 0.55, 0.55]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/assets/models/anim.glb");