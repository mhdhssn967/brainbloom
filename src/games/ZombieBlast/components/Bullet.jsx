import { useRef, useEffect } from "react";
import { useFrame }          from "@react-three/fiber";
import * as THREE            from "three";
import { BULLET_SPEED }      from "../constants";

export function Bullet({ bullet, onHit }) {
  const meshRef   = useRef();
  const trailRefs = useRef([]);
  const done      = useRef(false);

  const from = useRef(
    new THREE.Vector3(bullet.fromX, 0.8, bullet.fromZ)
  );
  const to   = useRef(
    new THREE.Vector3(bullet.toX,   0.8, bullet.toZ)
  );
  const pos  = useRef(from.current.clone());

  useFrame(() => {
    if (done.current || !meshRef.current) return;

    const dir  = new THREE.Vector3()
      .subVectors(to.current, pos.current)
      .normalize();
    const dist = pos.current.distanceTo(to.current);

    if (dist < BULLET_SPEED + 0.1) {
      done.current = true;
      meshRef.current.visible = false;
      onHit?.();
      return;
    }

    pos.current.addScaledVector(dir, BULLET_SPEED);
    meshRef.current.position.copy(pos.current);

    // Face direction of travel
    meshRef.current.rotation.y = Math.atan2(dir.x, dir.z);

    // Update trail positions
    trailRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const trailPos = pos.current.clone().addScaledVector(
        dir, -(i + 1) * 0.18
      );
      ref.position.copy(trailPos);
      ref.material.opacity = 0.6 - i * 0.18;
    });
  });

  return (
    <group>
      {/* Main bullet */}
      <mesh ref={meshRef} position={[bullet.fromX, 0.8, bullet.fromZ]}>
        <capsuleGeometry args={[0.04, 0.18, 4, 8]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={3}
          metalness={1}
          roughness={0}
        />
      </mesh>

      {/* Trail */}
      {[0, 1, 2].map(i => (
        <mesh
          key={i}
          ref={el => trailRefs.current[i] = el}
          position={[bullet.fromX, 0.8, bullet.fromZ]}
        >
          <sphereGeometry args={[0.05 - i * 0.01, 6, 6]} />
          <meshStandardMaterial
            color="#FF6600"
            emissive="#FF4400"
            emissiveIntensity={2}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}