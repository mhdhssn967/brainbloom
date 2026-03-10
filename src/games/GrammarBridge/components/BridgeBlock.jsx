import { useMemo, useRef } from "react";
import { useGLTF }         from "@react-three/drei";
import { useFrame }        from "@react-three/fiber";
import { SkeletonUtils }   from "three-stdlib";
import * as THREE          from "three";

const SETTLE_OFFSET = -2.7;  // your existing block Y
const DROP_HEIGHT   = 8;     // how far above it spawns
const GRAVITY       = 0.018;
const BOUNCE_DAMP   = 0.38;
const BOUNCE_STOP   = 0.02;

export function BridgeBlock({ block, teamColor, isGap }) {
  const groupRef    = useRef();
  const { scene }   = useGLTF("/assets/models/block.glb");
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Sway state
  const swayOffset = useRef(block.index * 1.3 + Math.random() * Math.PI);

  // Drop animation state — only active when isFresh
  const dropY      = useRef(SETTLE_OFFSET);
  const dropVel    = useRef(0);
  const dropDone   = useRef(!block.isFresh);
  const wasFresh   = useRef(false);

  // Tint filled blocks
  useMemo(() => {
    if (!block.isMissing || !block.isFilled) return;
    clonedScene.traverse(child => {
      if (child.isMesh) {
        child.material                   = child.material.clone();
        // child.material.emissive          = new THREE.Color(teamColor);
        child.material.emissiveIntensity  = 0.4;
        child.material.needsUpdate        = true;
      }
    });
  }, [clonedScene, block.isFilled, teamColor]);

  // Trigger drop when block becomes freshly filled
  if (block.isFresh && !wasFresh.current) {
    wasFresh.current = true;
    dropY.current    = SETTLE_OFFSET + DROP_HEIGHT;
    dropVel.current  = 0;
    dropDone.current = false;
  }
  if (!block.isFresh) {
    wasFresh.current = false;
  }

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() + swayOffset.current;

    // ── Drop animation ────────────────────────────────────────
    if (!dropDone.current) {
      dropVel.current  -= GRAVITY;
      dropY.current    += dropVel.current;

      if (dropY.current <= SETTLE_OFFSET) {
        if (Math.abs(dropVel.current) < BOUNCE_STOP) {
          dropY.current    = SETTLE_OFFSET;
          dropVel.current  = 0;
          dropDone.current = true;
        } else {
          dropY.current   = SETTLE_OFFSET;
          dropVel.current = -dropVel.current * BOUNCE_DAMP;
        }
      }

      groupRef.current.position.y = dropY.current;

      // Spin while falling — quarter spin maps to full drop
      const fallProgress = 1 - Math.max(0,
        (dropY.current - SETTLE_OFFSET) / DROP_HEIGHT
      );
      groupRef.current.rotation.y = (1 - fallProgress) * Math.PI * 0.5;
      groupRef.current.rotation.z = (1 - fallProgress) * 0.3;
      return;
    }

    // ── Settled sway ──────────────────────────────────────────
    groupRef.current.position.y = SETTLE_OFFSET + Math.sin(t * 0.8) * 0.1;
    groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.2;
    groupRef.current.rotation.z = Math.sin(t * 0.5 + 1.2) * 0.025;
  });

  if (isGap) {
    return (
      <group ref={groupRef} position={[block.x + 0.4, -3.2, 0]}>
        <mesh>
          <boxGeometry args={[1.05, 0.35, 1.05]} />
          <meshStandardMaterial color={teamColor} transparent opacity={0.06} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.05, 0.35, 1.05)]} />
          <lineBasicMaterial color={teamColor} transparent opacity={0.5} />
        </lineSegments>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={[block.x, SETTLE_OFFSET, 0]}>
      <primitive object={clonedScene} scale={[0.55, 0.55, 0.15]} />
    </group>
  );
}

useGLTF.preload("/assets/models/block.glb");