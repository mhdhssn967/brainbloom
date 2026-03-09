import {
  useRef, useEffect, useState,
  forwardRef, useImperativeHandle,
  useMemo, useCallback
} from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame }               from "@react-three/fiber";
import { SkeletonUtils }          from "three-stdlib";
import * as THREE                 from "three";
import { CHAR_ANIMS }             from "../constants";

export const Character = forwardRef(function Character(
  { playerId, health, primaryTarget },
  ref
) {
  const groupRef    = useRef();
  const modelRef    = useRef();
  const isDead      = useRef(false);
  const isShooting  = useRef(false);
  const currentAnim = useRef(null);

  const file = playerId === 1
    ? "/assets/models/character2.glb"
    : "/assets/models/character1.glb";

  const { scene, animations } = useGLTF(file);

  // Clone once, never again — useMemo with empty deps
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const clonedAnims = useMemo(() => animations.map(c => c.clone()), [animations]);

  const { actions } = useAnimations(clonedAnims, modelRef);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    console.log(`Character${playerId} anims:`, Object.keys(actions));
    playAnim(CHAR_ANIMS.IDLE, true);
  }, [actions]);

  const playAnim = (name, loop = true, onFinish = null) => {
    if (!name || !actions[name]) return;
    if (currentAnim.current === name) return;

    const prev = actions[currentAnim.current];
    const next = actions[name];

    if (prev && prev.isRunning()) prev.fadeOut(0.15);
    next
      .reset()
      .fadeIn(0.15)
      .setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
      .play();

    if (!loop) {
      next.clampWhenFinished = true;
      if (onFinish) {
        const handler = (e) => {
          if (e.action === next) {
            next._mixer.removeEventListener("finished", handler);
            onFinish();
          }
        };
        next._mixer.addEventListener("finished", handler);
      }
    }
    currentAnim.current = name;
  };

  const triggerShoot = useCallback(() => {
  console.log("triggerShoot called");
  console.log("isDead:", isDead.current);
  console.log("isShooting:", isShooting.current);
  console.log("actions keys:", Object.keys(actions));
  console.log("CHAR_ANIMS.SHOOT value:", CHAR_ANIMS.SHOOT);
  console.log("shoot action exists:", !!actions[CHAR_ANIMS.SHOOT]);

  if (isDead.current || isShooting.current) return;
  if (!actions[CHAR_ANIMS.SHOOT]) {
    console.warn("Shoot anim missing:", CHAR_ANIMS.SHOOT);
    return;
  }

  isShooting.current  = true;
  currentAnim.current = null;

  const prev = actions[CHAR_ANIMS.IDLE];
  const next = actions[CHAR_ANIMS.SHOOT];

  console.log("prev action:", prev);
  console.log("next action:", next);

  if (prev && prev.isRunning()) prev.fadeOut(0.08);
  next.reset()
      .fadeIn(0.08)
      .setLoop(THREE.LoopOnce, 1)
      .play();
  next.clampWhenFinished = true;
  currentAnim.current   = CHAR_ANIMS.SHOOT;

  const handler = (e) => {
    if (e.action !== next) return;
    next._mixer.removeEventListener("finished", handler);
    isShooting.current  = false;
    currentAnim.current = null;
    playAnim(CHAR_ANIMS.IDLE, true);
  };
  next._mixer.addEventListener("finished", handler);
}, [actions, playAnim]);
useImperativeHandle(ref, () => ({ shoot: triggerShoot }), [triggerShoot]);


  const prevHealth = useRef(health);
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;

    if (health <= 0 && !isDead.current) {
      isDead.current      = true;
      currentAnim.current = null;
      playAnim(CHAR_ANIMS.DEATH, false);
      return;
    }

    if (health < prevHealth.current && health > 0 && !isShooting.current) {
      currentAnim.current = null;
      playAnim(CHAR_ANIMS.HIT, false, () => {
        currentAnim.current = null;
        playAnim(CHAR_ANIMS.IDLE, true);
      });
    }

    prevHealth.current = health;
  }, [health, actions]);

  useFrame(() => {
    if (!groupRef.current || isDead.current) return;
    if (primaryTarget) {
      groupRef.current.rotation.y = Math.atan2(primaryTarget.x, primaryTarget.z);
    } else {
      groupRef.current.rotation.y = Math.PI;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive ref={modelRef} object={clonedScene} scale={[0.9, 0.9, 0.9]} />
    </group>
  );
});

useGLTF.preload("/assets/models/character1.glb");
useGLTF.preload("/assets/models/character2.glb");