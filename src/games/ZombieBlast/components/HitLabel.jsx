import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";

export function HitLabel({ label }) {
  const groupRef  = useRef();
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = (Date.now() - startTime.current) / 1200;
    groupRef.current.position.y = progress * 1.5;
  });

  const isHeadshot = label.isHeadshot;
  const text       = isHeadshot ? `💥 HEADSHOT +${label.points}` : `+${label.points}`;
  const color      = isHeadshot ? "#FFD700" : "#00FF88";
  const size       = isHeadshot ? 1 : 1.2;

  // Headshot appears high center, normal kill appears mid center
  const baseY = isHeadshot ? 2 : 2;
  const baseZ = 0; // center of arena

  return (
    <Billboard position={[0, baseY, baseZ]} follow={true}>
      <group ref={groupRef}>
        <Text
          fontSize={size}
          color={color}
          fontWeight="bold"
          outlineWidth={0.06}
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