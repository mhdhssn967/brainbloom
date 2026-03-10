import { Canvas }                              from "@react-three/fiber";
import { OrthographicCamera, Billboard, Text, OrbitControls } from "@react-three/drei";
import { Suspense, memo }                      from "react";
import { BridgeCharacter }                     from "./BridgeCharacter";
import { BridgeBlock }                         from "./BridgeBlock";
import { WordLabel }                           from "./WordLabel";
import { IslandPlatform }                      from "./IslandPlatform";
import { FlagPole }                            from "./FlagPole";

const BridgeScene = memo(function BridgeScene({
  playerId,
  playerState,
  teamColor,
}) {
  const { blocks, phase, characterX, question } = playerState;


  
  const firstBlock  = blocks[0];
  const lastBlock   = blocks[blocks.length - 1];
  const startX      = firstBlock?.x ?? -4;
  const endX        = lastBlock?.x  ??  4;

  // Camera centers on bridge
  const bridgeCenterX = (startX + endX) / 2;

  // Island positions — just outside the bridge on each side
  const startIslandX = startX - 1.6;
  const endIslandX   = endX   + 1.6;

  // Character rests on start island initially
  const charStartX   = startIslandX;

  return (
    <Canvas
      shadows={false}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
        {/* <OrbitControls/> */}
      <OrthographicCamera
        makeDefault
        position={[bridgeCenterX, 0, 10]}
        zoom={55}
        near={0.1}
        far={200}
      />

      <ambientLight intensity={1} />
      <directionalLight
        position={[bridgeCenterX, 10, 8]}
        intensity={1.8}
        color="#fff8e7"
      />
      <pointLight
        position={[bridgeCenterX, 6, 6]}
        intensity={1}
        color="#a5b4fc"
        distance={20}
      />

      <Suspense fallback={null}>
        <SceneContents
          blocks={blocks}
          phase={phase}
          characterX={characterX}
          question={question}
          teamColor={teamColor}
          bridgeCenterX={bridgeCenterX}
          startIslandX={startIslandX}
          endIslandX={endIslandX}
          charStartX={charStartX}
          startX={startX}
          endX={endIslandX}
        />
      </Suspense>
    </Canvas>
  );
});

export default BridgeScene;

function SceneContents({
  blocks, phase, characterX,
  question, teamColor, bridgeCenterX,
  startIslandX, endIslandX,
  charStartX, startX, endX,
}) {
  return (
    <>
      {/* ── Start island — character begins here ──────────────── */}
      <IslandPlatform
        position={[startIslandX, -0.25, 0]}
        scale={[1.2, 1.2, 1.2]}
      />

      {/* ── End island — has flag ─────────────────────────────── */}
      <IslandPlatform
        position={[endIslandX+0.5, -0.25, 0]}
        scale={[1.2, 1.2, 1.2]}
      />
      <FlagPole position={[endIslandX+1, -2.2, -0.2]} />

      {/* ── Sign board above start island ────────────────────── */}
      <SignBoard
        question={question}
        x={startIslandX}
      />

      {/* ── Bridge blocks + word labels ───────────────────────── */}
      {blocks.map(block => {
        const isGap = block.isMissing && !block.isFilled;
        return (
          <group key={block.index}>
            <BridgeBlock
              block={block}
              teamColor={teamColor}
              isGap={isGap}
            />
            <WordLabel
              x={block.x+0.4}
              word={block.word}
              isBlank={isGap}
              color={
                isGap
                  ? `${teamColor}70`
                  : block.isMissing && block.isFilled
                    ? "#ffffff"
                    : "rgba(255,255,255,0.9)"
              }
            />
          </group>
        );
      })}

      {/* ── Character ─────────────────────────────────────────── */}
   
<BridgeCharacter
  phase={phase}
  characterX={charStartX}   // ← always the START position from state
  startX={charStartX}
  endX={endIslandX}    // ← the destination island X
  teamColor={teamColor}    
/>

      {/* ── Abyss ground ──────────────────────────────────────── */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[bridgeCenterX, -0.55, 0]}
      >
        {/* <planeGeometry args={[40, 12]} /> */}
        <meshStandardMaterial color="#020617" roughness={1} />
      </mesh>
    </>
  );
}

// ── 3D Sign board ──────────────────────────────────────────────────────
function SignBoard({ question, x }) {
  return (
    <group position={[x+5, 2.2, -2]}>

      {/* Left post */}
      

      {/* Board back — dark wood depth */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[4.2, 3.2, 0.14]} />
        <meshStandardMaterial color="#78350F" roughness={0.9} />
      </mesh>

      {/* Board main face */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.0, 3.0, 0.12]} />
        <meshStandardMaterial color="#FEF3C7" roughness={0.7} />
      </mesh>

      {/* Board inner recess */}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[3.7, 2.7, 0.04]} />
        <meshStandardMaterial color="#FDE68A" roughness={0.8} />
      </mesh>

      {/* Top trim */}
      <mesh position={[0, 1.46, 0.05]}>
        <boxGeometry args={[4.2, 0.2, 0.16]} />
        <meshStandardMaterial color="#92400E" roughness={0.9} />
      </mesh>

      {/* Bottom trim */}
      <mesh position={[0, -1.46, 0.05]}>
        <boxGeometry args={[4.2, 0.2, 0.16]} />
        <meshStandardMaterial color="#92400E" roughness={0.9} />
      </mesh>

      {/* Corner bolts */}
      {[[-1.7, 1.2], [1.7, 1.2], [-1.7, -1.2], [1.7, -1.2]].map(([bx, by], i) => (
        <mesh key={i} position={[bx, by, 0.14]}>
          <cylinderGeometry args={[0.07, 0.07, 0.1, 8]} />
          <meshStandardMaterial color="#78716C" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Text */}
     <Billboard position={[0, 0, 0.16]} follow>
  <Text
    fontSize={0.4}
    color="#1E293B"
    anchorX="center"
    anchorY="middle"
    maxWidth={3.4}
    textAlign="center"
    fontWeight="bold"
    lineHeight={1.3}
  >
    {question?.sentence
      ?.map((word, i) =>
        question?.blanks?.includes(i) ? " ___ " : word + " "
      )
      .join("")}
  </Text>
</Billboard>
    </group>
  );
}