import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FlagPole({ position }) {
  const flagRef = useRef();

  // Animate flag waving
  useFrame(({ clock }) => {
    if (!flagRef.current) return;
    const t = clock.getElapsedTime();
    // Bend the flag geometry vertices to simulate wave
    const geo = flagRef.current.geometry;
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const wave = Math.sin(t * 3 + x * 4) * 0.04 * x;
      pos.setZ(i, wave);
    }
    pos.needsUpdate = true;
  });

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pole base */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.15, 8]} />
        <meshStandardMaterial color="#64748B" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Flag cloth */}
      <mesh
        ref={flagRef}
        position={[0.35, 1.55, 0]}
      >
        <planeGeometry args={[0.7, 0.45, 8, 4]} />
        <meshStandardMaterial
          color="green"
          side={THREE.DoubleSide}
          roughness={0.8}
        />
      </mesh>

      {/* Flag checkered pattern overlay */}
      <mesh position={[0.35, 1.55, 0.01]}>
        <planeGeometry args={[0.7, 0.45, 1, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Pole tip ball */}
      <mesh position={[0, 1.82, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}