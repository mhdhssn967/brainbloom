import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";

export function HitLabel({ label }) {
  const groupRef  = useRef();
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = (Date.now() - startTime.current) / 1200;
    groupRef.current.position.y = 1.5 + progress * 2.5;
    groupRef.current.material && (
      groupRef.current.material.opacity = 1 - progress
    );
  });

  const isHeadshot = label.isHeadshot;
  const text       = isHeadshot ? `💥 HEADSHOT +${label.points}` : `+${label.points}`;
  const color      = isHeadshot ? "#FFD700" : "#ffffff";
  const size       = isHeadshot ? 0.55 : 0.4;

  return (
    <Billboard
      position={[label.x, 1.5, label.z]}
      follow={true}
    >
      <group ref={groupRef}>
        <Text
          fontSize={size}
          color={color}
          fontWeight="bold"
          outlineWidth={0.04}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {text}
        </Text>
      </group>
    </Billboard>
  );
}