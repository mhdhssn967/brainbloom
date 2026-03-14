import { useRef, useMemo } from "react";
import { useFrame }        from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import * as THREE          from "three";

/**
 * MarioBackground
 *
 * A self-contained R3F component. Drop it anywhere inside a <Canvas>
 * (or inside SceneContents) and it renders completely behind everything else.
 *
 * Usage inside SceneContents:
 *   <MarioBackground centerX={bridgeCenterX} />
 *
 * Props:
 *   centerX  — the bridgeCenterX value so the sky/ground centre on the bridge
 *   width    — how wide the sky plane is (default 80)
 *   height   — how tall the sky plane is (default 40)
 */
export function MarioBackground({ centerX = 0, width = 80, height = 40 }) {
  return (
    <group position={[centerX, 0, -8]}>
      {/* ── Sky gradient plane ── */}
      <SkyPlane width={width} height={height} />

      {/* ── Sun ── */}
      <Sun position={[-width * 0.32, height * 0.3, 0.1]} />

      {/* ── Clouds (various sizes, spread across sky) ── */}
      <Cloud position={[-width*0.28, height*0.18, 0.2]} scale={1.4} speed={0.006} />
      <Cloud position={[-width*0.05, height*0.24, 0.2]} scale={1.0} speed={0.004} offset={1.2} />
      <Cloud position={[ width*0.18, height*0.16, 0.2]} scale={1.6} speed={0.005} offset={2.5} />
      <Cloud position={[ width*0.35, height*0.22, 0.2]} scale={0.9} speed={0.007} offset={0.7} />
      <Cloud position={[-width*0.42, height*0.10, 0.2]} scale={1.1} speed={0.003} offset={3.1} />

      {/* ── Hills in back (far layer) ── */}
      <Hill position={[-width*0.30, -height*0.12, 0.3]} rx={5.5} ry={3.2} color="#5bbd4e"/>
      <Hill position={[-width*0.10, -height*0.15, 0.3]} rx={4.0} ry={2.6} color="#4aaa3e"/>
      <Hill position={[ width*0.12, -height*0.11, 0.3]} rx={6.0} ry={3.5} color="#5bbd4e"/>
      <Hill position={[ width*0.32, -height*0.14, 0.3]} rx={4.5} ry={2.8} color="#4aaa3e"/>

      {/* ── Hills in front (near layer, darker) ── */}
      <Hill position={[-width*0.22, -height*0.20, 0.5]} rx={3.5} ry={2.2} color="#3d9933"/>
      <Hill position={[ width*0.05, -height*0.22, 0.5]} rx={5.0} ry={2.8} color="#3d9933"/>
      <Hill position={[ width*0.28, -height*0.20, 0.5]} rx={3.8} ry={2.2} color="#329929"/>

      {/* ── Ground plane ── */}
      <Ground width={width} centerY={-height * 0.26} />

      {/* ── Floating question-mark boxes ── */}
      <QBox position={[-width*0.18,  height*0.04, 0.4]} />
      <QBox position={[-width*0.14,  height*0.04, 0.4]} />
      <QBox position={[-width*0.10,  height*0.04, 0.4]} />
      <QBox position={[ width*0.08,  height*0.06, 0.4]} />
      <QBox position={[ width*0.20, -height*0.02, 0.4]} />

      {/* ── Pixel-style bushes on the ground ── */}
      <Bush position={[-width*0.25, -height*0.245, 0.6]} scale={1.0}/>
      <Bush position={[ width*0.10, -height*0.245, 0.6]} scale={1.3}/>
      <Bush position={[ width*0.30, -height*0.245, 0.6]} scale={0.8}/>
      <Bush position={[-width*0.42, -height*0.245, 0.6]} scale={1.1}/>

      {/* ── Pipes ── */}
      <Pipe position={[-width*0.38, -height*0.245, 0.7]} />
      <Pipe position={[ width*0.38, -height*0.245, 0.7]} />
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   SKY — vertex-coloured plane fading from bright blue to pale
══════════════════════════════════════════════════════════════ */
function SkyPlane({ width, height }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, height, 1, 4);
    const positions = g.attributes.position;
    const colors = [];
    // Top rows → deep sky blue, bottom rows → pale horizon
    const top    = new THREE.Color("#5ec8f5");
    const mid    = new THREE.Color("#87dcf7");
    const bottom = new THREE.Color("#c9f0ff");
    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const t = (y + height / 2) / height; // 0=bottom 1=top
      const c = t > 0.5
        ? top.clone().lerp(mid, 1 - (t - 0.5) * 2)
        : mid.clone().lerp(bottom, 1 - t * 2);
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [width, height]);

  return (
    <mesh geometry={geo} position={[0, 0, 0]}>
      <meshBasicMaterial vertexColors side={THREE.FrontSide}/>
    </mesh>
  );
}

/* ══════════════════════════════════════════════════════════════
   SUN — bright yellow circle with pulsing glow ring
══════════════════════════════════════════════════════════════ */
function Sun({ position }) {
  const glowRef = useRef();
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const s = 1 + Math.sin(clock.elapsedTime * 1.4) * 0.04;
      glowRef.current.scale.set(s, s, 1);
    }
  });
  return (
    <group position={position}>
      {/* outer glow */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <circleGeometry args={[2.2, 32]}/>
        <meshBasicMaterial color="#fff176" transparent opacity={0.35}/>
      </mesh>
      {/* mid glow */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[1.7, 32]}/>
        <meshBasicMaterial color="#ffee58" transparent opacity={0.55}/>
      </mesh>
      {/* sun body */}
      <mesh>
        <circleGeometry args={[1.2, 32]}/>
        <meshBasicMaterial color="#fdd835"/>
      </mesh>
      {/* face */}
      <SunFace/>
    </group>
  );
}

function SunFace() {
  return (
    <group position={[0, 0, 0.01]}>
      {/* eyes */}
      <mesh position={[-0.32, 0.18, 0]}>
        <circleGeometry args={[0.1, 12]}/>
        <meshBasicMaterial color="#5d4037"/>
      </mesh>
      <mesh position={[ 0.32, 0.18, 0]}>
        <circleGeometry args={[0.1, 12]}/>
        <meshBasicMaterial color="#5d4037"/>
      </mesh>
      {/* smile — arc made of small boxes */}
      {[-0.28,-0.14,0,0.14,0.28].map((x,i) => (
        <mesh key={i} position={[x, -0.15 + Math.abs(x)*0.3, 0]}>
          <boxGeometry args={[0.1, 0.07, 0.01]}/>
          <meshBasicMaterial color="#5d4037"/>
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   CLOUD — three overlapping circles, bobs gently
══════════════════════════════════════════════════════════════ */
function Cloud({ position, scale = 1, speed = 0.005, offset = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed * 60 + offset) * 0.12;
    }
  });
  const s = scale;
  return (
    <group ref={ref} position={position}>
      {/* shadow */}
      <mesh position={[0, -0.6*s, -0.05]}>
        <circleGeometry args={[1.6*s, 20]}/>
        <meshBasicMaterial color="#b3e5fc" transparent opacity={0.18}/>
      </mesh>
      {/* body circles */}
      <mesh position={[0, 0, 0]}>
        <circleGeometry args={[0.9*s, 20]}/>
        <meshBasicMaterial color="#ffffff"/>
      </mesh>
      <mesh position={[-0.8*s, -0.15*s, 0]}>
        <circleGeometry args={[0.65*s, 20]}/>
        <meshBasicMaterial color="#ffffff"/>
      </mesh>
      <mesh position={[0.8*s, -0.15*s, 0]}>
        <circleGeometry args={[0.65*s, 20]}/>
        <meshBasicMaterial color="#ffffff"/>
      </mesh>
      {/* bottom flat cover */}
      <mesh position={[0, -0.5*s, 0.01]}>
        <boxGeometry args={[2.2*s, 0.8*s, 0.01]}/>
        <meshBasicMaterial color="#ffffff"/>
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   HILL — ellipse mound, layered for depth
══════════════════════════════════════════════════════════════ */
function Hill({ position, rx = 4, ry = 2.5, color = "#5bbd4e" }) {
  const geo = useMemo(() => {
    // Build a half-ellipse shape
    const shape = new THREE.Shape();
    shape.moveTo(-rx, 0);
    for (let i = 0; i <= 32; i++) {
      const a = Math.PI * (i / 32);
      shape.lineTo(-rx + Math.cos(Math.PI - a) * rx, Math.sin(a) * ry);
    }
    shape.lineTo(rx, 0);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [rx, ry]);

  const darkColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.82);
    return `#${c.getHexString()}`;
  }, [color]);

  return (
    <group position={position}>
      {/* hill body */}
      <mesh geometry={geo}>
        <meshBasicMaterial color={color}/>
      </mesh>
      {/* dark outline bottom */}
      <mesh geometry={geo} position={[0,0,-0.01]}>
        <meshBasicMaterial color={darkColor}/>
      </mesh>
      {/* white dots decoration */}
      {[[-rx*0.35, ry*0.55], [0, ry*0.72], [rx*0.35, ry*0.55]].map(([dx,dy],i) => (
        <mesh key={i} position={[dx, dy, 0.01]}>
          <circleGeometry args={[rx*0.055, 8]}/>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55}/>
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   GROUND — flat green strip with dark stripe border
══════════════════════════════════════════════════════════════ */
function Ground({ width, centerY }) {
  return (
    <group position={[0, centerY, 0.25]}>
      {/* main grass */}
      <mesh>
        <boxGeometry args={[width, 0.7, 0.1]}/>
        <meshBasicMaterial color="#5bbd4e"/>
      </mesh>
      {/* top dark strip */}
      <mesh position={[0, 0.32, 0.01]}>
        <boxGeometry args={[width, 0.08, 0.01]}/>
        <meshBasicMaterial color="#3d9933"/>
      </mesh>
      {/* dirt below */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[width, 0.4, 0.1]}/>
        <meshBasicMaterial color="#c8a060"/>
      </mesh>
      {/* dirt dark strip */}
      <mesh position={[0, -0.35, 0.01]}>
        <boxGeometry args={[width, 0.07, 0.01]}/>
        <meshBasicMaterial color="#a07840"/>
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   QUESTION-MARK BOX — classic Mario ? block with bob animation
══════════════════════════════════════════════════════════════ */
function QBox({ position }) {
  const ref = useRef();
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.8 + offset) * 0.07;
    }
  });
  return (
    <group ref={ref} position={position}>
      {/* box body */}
      <mesh>
        <boxGeometry args={[0.75, 0.75, 0.18]}/>
        <meshBasicMaterial color="#e8a000"/>
      </mesh>
      {/* darker border — top */}
      <mesh position={[0, 0.34, 0.01]}>
        <boxGeometry args={[0.75, 0.07, 0.05]}/>
        <meshBasicMaterial color="#c07800"/>
      </mesh>
      {/* darker border — bottom */}
      <mesh position={[0, -0.34, 0.01]}>
        <boxGeometry args={[0.75, 0.07, 0.05]}/>
        <meshBasicMaterial color="#c07800"/>
      </mesh>
      {/* darker border — left */}
      <mesh position={[-0.34, 0, 0.01]}>
        <boxGeometry args={[0.07, 0.75, 0.05]}/>
        <meshBasicMaterial color="#c07800"/>
      </mesh>
      {/* darker border — right */}
      <mesh position={[ 0.34, 0, 0.01]}>
        <boxGeometry args={[0.07, 0.75, 0.05]}/>
        <meshBasicMaterial color="#c07800"/>
      </mesh>
      {/* light inner highlight (top-left) */}
      <mesh position={[-0.2, 0.2, 0.1]}>
        <boxGeometry args={[0.22, 0.06, 0.01]}/>
        <meshBasicMaterial color="#ffcc44" transparent opacity={0.7}/>
      </mesh>
      {/* ? mark */}
      <Billboard follow position={[0, 0, 0.11]}>
        <Text fontSize={0.38} color="#ffffff" anchorX="center" anchorY="middle" fontWeight="bold">
          ?
        </Text>
      </Billboard>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   BUSH — Mario-style bush (3 overlapping circles, dark outline)
══════════════════════════════════════════════════════════════ */
function Bush({ position, scale = 1 }) {
  const s = scale;
  return (
    <group position={position}>
      {/* dark outline layer */}
      <mesh position={[0, 0.02*s, -0.01]}>
        <circleGeometry args={[0.62*s, 16]}/>
        <meshBasicMaterial color="#2d7a1f"/>
      </mesh>
      <mesh position={[-0.5*s, -0.08*s, -0.01]}>
        <circleGeometry args={[0.46*s, 16]}/>
        <meshBasicMaterial color="#2d7a1f"/>
      </mesh>
      <mesh position={[0.5*s, -0.08*s, -0.01]}>
        <circleGeometry args={[0.46*s, 16]}/>
        <meshBasicMaterial color="#2d7a1f"/>
      </mesh>
      {/* main green */}
      <mesh position={[0, 0.04*s, 0]}>
        <circleGeometry args={[0.58*s, 16]}/>
        <meshBasicMaterial color="#4caf50"/>
      </mesh>
      <mesh position={[-0.5*s, -0.06*s, 0]}>
        <circleGeometry args={[0.42*s, 16]}/>
        <meshBasicMaterial color="#4caf50"/>
      </mesh>
      <mesh position={[0.5*s, -0.06*s, 0]}>
        <circleGeometry args={[0.42*s, 16]}/>
        <meshBasicMaterial color="#4caf50"/>
      </mesh>
      {/* light specular dots */}
      <mesh position={[-0.12*s, 0.22*s, 0.01]}>
        <circleGeometry args={[0.09*s, 8]}/>
        <meshBasicMaterial color="#81c784" transparent opacity={0.8}/>
      </mesh>
      <mesh position={[ 0.1*s, 0.28*s, 0.01]}>
        <circleGeometry args={[0.06*s, 8]}/>
        <meshBasicMaterial color="#a5d6a7" transparent opacity={0.7}/>
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   PIPE — classic green Mario pipe with cap
══════════════════════════════════════════════════════════════ */
function Pipe({ position }) {
  return (
    <group position={position}>
      {/* pipe shaft */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 1.4, 0.22]}/>
        <meshBasicMaterial color="#388e3c"/>
      </mesh>
      {/* shaft highlight */}
      <mesh position={[-0.18, 0.55, 0.12]}>
        <boxGeometry args={[0.14, 1.4, 0.01]}/>
        <meshBasicMaterial color="#66bb6a" transparent opacity={0.7}/>
      </mesh>
      {/* cap */}
      <mesh position={[0, 1.32, 0]}>
        <boxGeometry args={[0.92, 0.28, 0.28]}/>
        <meshBasicMaterial color="#43a047"/>
      </mesh>
      {/* cap highlight */}
      <mesh position={[-0.22, 1.32, 0.15]}>
        <boxGeometry args={[0.18, 0.28, 0.01]}/>
        <meshBasicMaterial color="#76c442" transparent opacity={0.6}/>
      </mesh>
      {/* cap dark bottom edge */}
      <mesh position={[0, 1.19, 0.01]}>
        <boxGeometry args={[0.92, 0.06, 0.01]}/>
        <meshBasicMaterial color="#2e7d32"/>
      </mesh>
    </group>
  );
}