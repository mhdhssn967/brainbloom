import { useRef, useEffect, useState } from "react";
import { useFrame }                    from "@react-three/fiber";
import * as THREE                      from "three";
import { SQUARE_FALL_MS }              from "../constants";

/**
 * CatchSquare
 *
 * Props:
 *   catching      — { teamId, frogId } | null
 *   frogs         — frog array (for captured state + initial pos)
 *   frogPosRefs   — Map<frogId, React.MutableRefObject<{x,z}>>
 *                   live positions written every frame by each Frog
 *   teamColors    — TEAM_COLORS array
 */
export default function CatchSquare({ catching, frogs, frogPosRefs, teamColors }) {
  return (
    <>
      {/* ── Permanent rings around already-captured frogs ─────────── */}
      {frogs
        .filter(f => f.captured)
        .map(f => (
          <GroundRing
            key={f.id}
            frog={f}
            posRef={frogPosRefs?.get(f.id)}
            color={teamColors[f.capturedBy]?.hex ?? "#fff"}
          />
        ))
      }

      {/* ── Falling ring animation for the currently-being-caught frog */}
      {catching && (
        <FallingRing
          key={catching.frogId + "-" + catching.teamId}
          catching={catching}
          frogs={frogs}
          frogPosRefs={frogPosRefs}
          teamColors={teamColors}
        />
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FallingRing
// Aims at the frog's live position while falling, lands around it.
// ─────────────────────────────────────────────────────────────────────────────
function FallingRing({ catching, frogs, frogPosRefs, teamColors }) {
  const ringRef      = useRef();
  const glowRef      = useRef();
  const pulseRef     = useRef();
  const startTime    = useRef(Date.now());
  const landedPos    = useRef(null);   // locked once ring reaches ground

  const color = teamColors[catching.teamId]?.hex ?? "#ffffff";

  useEffect(() => {
    startTime.current = Date.now();
    landedPos.current = null;
  }, [catching]);

  useFrame(() => {
    const elapsed  = Date.now() - startTime.current;
    const progress = Math.min(elapsed / SQUARE_FALL_MS, 1);

    // Get live frog position from shared ref (tracks even while frog moves)
    const posRef = frogPosRefs?.get(catching.frogId);
    const liveX  = posRef?.current?.x ?? 0;
    const liveZ  = posRef?.current?.z ?? 0;

    // Once the ring has fully landed, lock it to that position
    if (progress >= 1 && !landedPos.current) {
      landedPos.current = { x: liveX, z: liveZ };
    }

    const targetX = landedPos.current ? landedPos.current.x : liveX;
    const targetZ = landedPos.current ? landedPos.current.z : liveZ;

    // Cubic ease-in-out for the fall
    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    const startY = 14;
    const endY   = 0.08;
    const y      = startY + (endY - startY) * eased;

    // Ring spins as it falls, stops when landed
    const rot = (1 - eased) * Math.PI * 3;

    // ── Main ring ────────────────────────────────────────────────────
    if (ringRef.current) {
      ringRef.current.position.set(targetX, y, targetZ);
      ringRef.current.scale.setScalar(0.1 + eased * 0.9);
      ringRef.current.rotation.z = rot;
    }

    // ── Glow trail (slightly behind) ─────────────────────────────────
    const glowProgress = Math.max(0, progress - 0.08);
    const glowEased    = glowProgress < 0.5
      ? 4 * glowProgress * glowProgress * glowProgress
      : 1 - Math.pow(-2 * glowProgress + 2, 3) / 2;
    const glowY = startY + (endY - startY) * glowEased;

    if (glowRef.current) {
      glowRef.current.position.set(targetX, glowY + 0.01, targetZ);
      glowRef.current.scale.setScalar(0.1 + glowEased * 1.05);
      glowRef.current.rotation.z = rot * 0.7;
    }

    // ── Landing pulse ─────────────────────────────────────────────────
    if (pulseRef.current) {
      const pulseStart = 0.78;
      if (progress > pulseStart) {
        const pp = (progress - pulseStart) / (1 - pulseStart);
        pulseRef.current.visible = true;
        pulseRef.current.position.set(targetX, 0.09, targetZ);
        pulseRef.current.scale.setScalar(0.9 + pp * 1.6);
        pulseRef.current.material.opacity = (1 - pp) * 0.9;
      } else {
        pulseRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      {/* Glow trail */}
      <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.70, 1.06, 56]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.5}
          transparent opacity={0.3} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main falling ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.60, 0.86, 56]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={1.4}
          transparent opacity={0.95} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Landing pulse */}
      <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.58, 0.88, 56]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={1.8}
          transparent opacity={0.9} side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GroundRing
// Permanent ring that stays on the ground around a captured frog.
// Stroke-only — no fill, just the ring border.
// ─────────────────────────────────────────────────────────────────────────────
function GroundRing({ frog, posRef, color }) {
  const outerRef  = useRef();
  const innerRef  = useRef();
  const groupRef  = useRef();
  const timeRef   = useRef(0);
  // Snap the ring's position to where the frog actually was when caught
  // posRef.current is frozen by Frog.jsx once frog.captured = true
  const capturedPos = posRef?.current ?? { x: frog.x, z: frog.z };

  useFrame((_, delta) => {
    timeRef.current += delta;
    const pulse = 1 + Math.sin(timeRef.current * 2.5) * 0.04;

    if (outerRef.current) {
      outerRef.current.scale.setScalar(pulse);
      outerRef.current.material.emissiveIntensity = 0.5 + Math.sin(timeRef.current * 2.5) * 0.25;
    }
    if (innerRef.current) {
      innerRef.current.scale.setScalar(1 + Math.sin(timeRef.current * 2.5 + 0.5) * 0.03);
    }
  });

  return (
    <group ref={groupRef} position={[capturedPos.x, 0.06, capturedPos.z]} rotation={[-Math.PI / 2, 0, 0]}>

      {/* Outer soft glow ring */}
      <mesh ref={outerRef}>
        <ringGeometry args={[1.3, 1.0, 64]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.5}
          transparent opacity={0.25} side={THREE.DoubleSide}
        />
      </mesh>

      {/* Main crisp ring — stroke only, no fill */}
      <mesh ref={innerRef}>
        <ringGeometry args={[1, 0.80, 64]} />
        <meshStandardMaterial
          color={color} emissive={color} emissiveIntensity={0.9}
          transparent opacity={0.9} side={THREE.DoubleSide}
        />
      </mesh>

      {/* No inner circle fill — pure stroke ring */}

    </group>
  );
}