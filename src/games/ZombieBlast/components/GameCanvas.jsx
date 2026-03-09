import { Canvas }                      from "@react-three/fiber";
import { OrthographicCamera }          from "@react-three/drei";
import { Suspense, useRef, useEffect, memo } from "react";
import { Character }                   from "./Character";
import { Zombie }                      from "./Zombie";
import { Bullet }                      from "./Bullet";
import { HitLabel }                    from "./HitLabel";
import { CHARACTER_Z }                 from "../constants";

// Memoize the entire canvas so it never remounts due to parent re-renders
const GameCanvas = memo(function GameCanvas({
  playerId,
  player,
  zombies,
  bullets,
  hitLabels,
  primaryTargetId,
  onZombieAttack,
  onUpdateZombieState,
  playerCount,
}) {
  const characterRef    = useRef();
  const prevBulletCount = useRef(0);

  const playerLabels  = hitLabels.filter(l => l.playerId === playerId);
  const primaryTarget = zombies.find(
    z => z.id === primaryTargetId &&
         z.state !== "dying" &&
         z.state !== "dead"
  ) ?? null;

  // Fire shoot animation when a new bullet appears
useEffect(() => {
  const count = bullets.length;
  console.log("bullets changed:", count, "prev:", prevBulletCount.current, "ref:", characterRef.current);
  if (count > prevBulletCount.current && characterRef.current) {
    console.log("calling shoot on ref");
    characterRef.current.shoot();
  }
  prevBulletCount.current = count;
}, [bullets]);

  return (
    <Canvas
      shadows={false}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
      // Prevent canvas from being recreated on re-render
      frameloop="always"
    >
      <OrthographicCamera
        makeDefault
        position={[0, 7, 10]}
        rotation={[-Math.PI / 5.2, 0, 0]}
        zoom={playerCount === 2 ? 50 : 65}
        near={0.1}
        far={200}
      />

      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 15, 5]} intensity={2} color="#fff8e7" />
      <pointLight
        position={[0, 8, CHARACTER_Z]}
        intensity={1.4}
        color="#ff4400"
        distance={14}
      />

      {/* Single Suspense wrapping everything — no nested Suspense */}
      <Suspense fallback={null}>
        <SceneContents
          playerId={playerId}
          player={player}
          zombies={zombies}
          bullets={bullets}
          playerLabels={playerLabels}
          primaryTarget={primaryTarget}
          primaryTargetId={primaryTargetId}
          characterRef={characterRef}
          onZombieAttack={onZombieAttack}
          onUpdateZombieState={onUpdateZombieState}
          playerCount={playerCount}
        />
      </Suspense>
    </Canvas>
  );
});

export default GameCanvas;

// ── All 3D objects in one stable component ────────────────────────────────
function SceneContents({
  playerId,
  player,
  zombies,
  bullets,
  playerLabels,
  primaryTarget,
  primaryTargetId,
  characterRef,
  onZombieAttack,
  onUpdateZombieState,
}) {
  return (
    <>
      <group position={[0, 0, CHARACTER_Z]}>
        <Character
          ref={characterRef}
          playerId={playerId}
          health={player.health}
          primaryTarget={primaryTarget}
        />
      </group>

      {zombies
        .filter(z => z.state !== "dead")
        .map(zombie => (
          <Zombie
            key={zombie.id}
            zombie={zombie}
            isPrimaryTarget={zombie.id === primaryTargetId}
            onReachCharacter={() => onZombieAttack(playerId)}
            onUpdateState={(id, state) =>
              onUpdateZombieState(playerId, id, state)
            }
          />
        ))
      }

      {bullets.map(bullet => (
        <Bullet key={bullet.id} bullet={bullet} />
      ))}

      {playerLabels.map(label => (
        <HitLabel key={label.id} label={label} />
      ))}
    </>
  );
}