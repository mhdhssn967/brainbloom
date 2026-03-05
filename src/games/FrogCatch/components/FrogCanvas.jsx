import { useMemo }                    from "react";
import { Canvas, useThree }          from "@react-three/fiber";
import { Suspense }                  from "react";
import { Frog }                      from "./Frog";
import CatchSquare                   from "./CatchSquare";
import { CAMERA_HEIGHT, TEAM_COLORS } from "../constants";
import { OrbitControls } from "@react-three/drei";

// How far back the camera sits on Z — controls the tilt angle.
// 0 = dead top-down, higher = more angled (isometric-ish).
// 0.6 × height gives a nice ~30° tilt without losing the top-down readability.
const CAMERA_TILT_Z = CAMERA_HEIGHT * 2;

// ── Inner scene — lives inside Canvas so useThree works ──────────────────────
function Scene({ frogs, catching, frogPosRefs }) {
  const { viewport } = useThree();

  const halfW = (viewport.width  / 2) * 0.90;
  const halfH = (viewport.height / 2) * 0.95;

  const bounds = useMemo(
    () => ({ halfW, halfH }),
    [halfW, halfH]
  );

  return (
    <>
    
      {/* Key light from slightly in front so the tilt reads depth */}
      <ambientLight intensity={1.6} />
      <directionalLight position={[0, 10, 6]}  intensity={1.8} />
      <directionalLight position={[0, 6,  -4]} intensity={0.4} color="#446655" />
{/* <OrbitControls/> */}
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[viewport.width * 1.4, viewport.height * 1.4]} />
        <meshStandardMaterial color="black" roughness={1}  />
      </mesh>

      <Suspense fallback={null}>
        {frogs.map(frog => (
          <Frog
            key={frog.id}
            frog={frog}
            posRef={frogPosRefs.get(frog.id)}
            bounds={bounds}
          />
        ))}
      </Suspense>

      <CatchSquare
        catching={catching}
        frogs={frogs}
        frogPosRefs={frogPosRefs}
        teamColors={TEAM_COLORS}
      />
    </>
  );
}

// ── Canvas wrapper ────────────────────────────────────────────────────────────
export default function FrogCanvas({ frogs, catching }) {

  const frogPosRefs = useMemo(() => {
    const map = new Map();
    frogs.forEach(f => map.set(f.id, { current: { x: f.x, z: f.z } }));
    return map;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Canvas
      orthographic
      camera={{
        // Pulling the camera back on Z tilts the view forward —
        // frogs near the bottom of screen appear closer, top appears further away.
        // This gives the classic top-down RPG / isometric depth feel.
        position: [0, CAMERA_HEIGHT, CAMERA_TILT_Z],
        // Camera looks at ground center
        up: [0, 1, 0],
        zoom: 50,
        near: 0.1,
        far:  300,
      }}
      shadows={false}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => {
        // Make sure camera points at the ground center, not world origin
        camera.lookAt(0, 0, 0);
      }}
    >
      <Scene frogs={frogs} catching={catching} frogPosRefs={frogPosRefs} />
    </Canvas>
  );
}