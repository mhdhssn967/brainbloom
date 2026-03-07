import { useRef, useEffect, useState, useMemo } from "react";
import { useGLTF, useAnimations }               from "@react-three/drei";
import { useFrame }                             from "@react-three/fiber";
import { SkeletonUtils }                        from "three-stdlib";
import * as THREE                               from "three";
import { ZOMBIE_ANIMS, ATTACK_RADIUS, CHARACTER_Z } from "../constants";

const ATTACK_SWITCH_INTERVAL = 1.5;

export function Zombie({
  zombie,
  isPrimaryTarget,
  onReachCharacter,
  onUpdateState,
}) {
  const groupRef  = useRef();
  const modelRef  = useRef();

  const file = `/assets/models/${zombie.modelFile}`;
  const { scene, animations } = useGLTF(file);

  const clonedScene = useMemo(() => SkeletonUtils.clone(scene),  [scene]);
  const clonedAnims = useMemo(() => animations.map(c => c.clone()), [animations]);

  const { actions } = useAnimations(clonedAnims, modelRef);

  const pos          = useRef({ x: zombie.x, z: zombie.z });
  const currentAnim  = useRef(null);
  const attackTimer  = useRef(0);
  const attackToggle = useRef(false);
  const hasDied      = useRef(false);
  const hasAttacked  = useRef(false);

  const playAnim = (name, loop = true) => {
    if (!name || !actions[name]) return;
    if (currentAnim.current === name) return;

    const prev = actions[currentAnim.current];
    const next = actions[name];

    if (prev && prev.isRunning()) prev.fadeOut(0.2);
    next
      .reset()
      .fadeIn(0.2)
      .setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1)
      .play();
    if (!loop) next.clampWhenFinished = true;
    currentAnim.current = name;
  };

  // Start move animation
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    playAnim(zombie.moveAnimation ?? ZOMBIE_ANIMS.WALK, true);
  }, [actions]);

  // Wave animation change
  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    if (zombie.state !== "walking") return;
    currentAnim.current = null;
    playAnim(zombie.moveAnimation ?? ZOMBIE_ANIMS.WALK, true);
  }, [zombie.moveAnimation]);

  // Dying
  useEffect(() => {
    if (zombie.state !== "dying" || hasDied.current) return;
    if (!actions || Object.keys(actions).length === 0) return;
    hasDied.current     = true;
    currentAnim.current = null;
    playAnim(ZOMBIE_ANIMS.DEATH, false);
  }, [zombie.state, actions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (zombie.state === "dead") {
      groupRef.current.visible = false;
      return;
    }

    if (zombie.state === "dying") {
      groupRef.current.position.set(pos.current.x, 0, pos.current.z);
      return;
    }

    const dx   = 0 - pos.current.x;
    const dz   = CHARACTER_Z - pos.current.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    groupRef.current.rotation.y = Math.atan2(dx, dz);

    if (dist < ATTACK_RADIUS) {
      if (!hasAttacked.current) {
        hasAttacked.current = true;
        currentAnim.current = null;
        playAnim(ZOMBIE_ANIMS.ATTACK, true);
        onReachCharacter?.();
      }
      attackTimer.current += delta;
      if (attackTimer.current >= ATTACK_SWITCH_INTERVAL) {
        attackTimer.current  = 0;
        attackToggle.current = !attackToggle.current;
        currentAnim.current  = null;
        playAnim(
          attackToggle.current ? ZOMBIE_ANIMS.PUNCH : ZOMBIE_ANIMS.ATTACK,
          true
        );
        onReachCharacter?.();
      }
      groupRef.current.position.set(pos.current.x, 0, pos.current.z);
      return;
    }

    hasAttacked.current = false;
    const speed = zombie.speed ?? 0.013;
    pos.current.x += (dx / dist) * speed;
    pos.current.z += (dz / dist) * speed;
    playAnim(zombie.moveAnimation ?? ZOMBIE_ANIMS.WALK, true);
    groupRef.current.position.set(pos.current.x, 0, pos.current.z);
  });

  return (
    <group ref={groupRef} position={[zombie.x, 0, zombie.z]}>
      {isPrimaryTarget && zombie.state === "walking" && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {/* <ringGeometry args={[0.55, 0.75, 32]} /> */}
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff4400"
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
      <primitive ref={modelRef} object={clonedScene} scale={[0.85, 0.85, 0.85]} />
    </group>
  );
}

useGLTF.preload("/assets/models/zombie1.glb");
useGLTF.preload("/assets/models/zombie2.glb");