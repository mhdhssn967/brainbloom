import { Billboard, Text } from "@react-three/drei";

export function WordLabel({ x, word, color = "#ffffff", isBlank = false }) {
  return (
    <Billboard
      position={[x, -2.7, 0.8]}  // slightly in front and above block
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <Text
font="/fonts/LuckiestGuy-Regular.ttf"   // kid friendly font
        fontSize={0.3}
        color="rgb(240, 224, 4)"                         // bright yellow
        outlineWidth={0.1}
        outlineColor="black"                  // bright blue stroke
        anchorX="center"
        anchorY="middle"
        maxWidth={1.2}
        textAlign="center"      >
        {isBlank ? "?" : word}
      </Text>
    </Billboard>
  );
}