import { useEffect, useRef, useState, useMemo } from "react";

function Firefly({ sx, sy }) {
  const pos = useRef({ x: sx, y: sy });
  const vel = useRef({ vx: (Math.random() - .5) * .028, vy: (Math.random() - .5) * .022 });
  const [p, setP]   = useState({ x: sx, y: sy });
  const [on, setOn] = useState(Math.random() > .5);
  const raf = useRef();

  useEffect(() => {
    let prev = performance.now();
    const tick = now => {
      const dt = Math.min(now - prev, 32); prev = now;
      pos.current.x += vel.current.vx * dt * 0.13;
      pos.current.y += vel.current.vy * dt * 0.13;
      vel.current.vx += (Math.random() - .5) * .001;
      vel.current.vy += (Math.random() - .5) * .001;
      vel.current.vx = Math.max(-.045, Math.min(.045, vel.current.vx));
      vel.current.vy = Math.max(-.036, Math.min(.036, vel.current.vy));
      if (pos.current.x < 1)  vel.current.vx =  Math.abs(vel.current.vx);
      if (pos.current.x > 99) vel.current.vx = -Math.abs(vel.current.vx);
      if (pos.current.y < 2)  vel.current.vy =  Math.abs(vel.current.vy);
      if (pos.current.y > 78) vel.current.vy = -Math.abs(vel.current.vy);
      setP({ x: pos.current.x, y: pos.current.y });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setOn(v => !v), 1400 + Math.random() * 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
      pointerEvents: "none", zIndex: 2,
      transition: "left 1.4s linear, top 1.4s linear",
    }}>
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: on ? "#fef08a" : "#713f12",
        boxShadow: on ? "0 0 16px 8px rgba(254,240,138,.45), 0 0 5px 3px #fbbf24" : "none",
        transition: "background 1.8s ease, box-shadow 1.8s ease",
      }} />
    </div>
  );
}

function Stars() {
  const stars = useMemo(() => Array.from({ length: 72 }, (_, i) => ({
    id: i, x: Math.random() * 100, y: Math.random() * 52,
    sz: 0.5 + Math.random() * 2.1, dur: 2.2 + Math.random() * 3, del: Math.random() * 6,
  })), []);
  return <>
    {stars.map(s => (
      <div key={s.id} style={{
        position: "absolute", left: `${s.x}%`, top: `${s.y}%`,
        width: s.sz, height: s.sz, borderRadius: "50%", background: "#fff", opacity: 0.75,
        animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        pointerEvents: "none",
      }} />
    ))}
  </>;
}

function Moon() {
  return (
    <div style={{ position: "absolute", top: 68, right: "40%", zIndex: 1, pointerEvents: "none" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "radial-gradient(circle at 36% 36%, #fef9c3, #fde68a 52%, #f59e0b)",
        boxShadow: "0 0 50px 22px rgba(253,230,138,.13), 0 0 100px 50px rgba(253,230,138,.06)",
      }} />
      <div style={{ position:"absolute", top:16, left:16, width:13, height:13, borderRadius:"50%", background:"rgba(0,0,0,.09)" }}/>
      <div style={{ position:"absolute", top:40, left:40, width: 9, height: 9, borderRadius:"50%", background:"rgba(0,0,0,.07)" }}/>
      <div style={{ position:"absolute", top:24, left:44, width: 6, height: 6, borderRadius:"50%", background:"rgba(0,0,0,.06)" }}/>
    </div>
  );
}

function Foliage() {
  return (
    <svg viewBox="0 0 1280 200" width="100%" height={200} preserveAspectRatio="none"
      style={{ position:"absolute", bottom:0, left:0, zIndex:3, pointerEvents:"none" }}>
      <ellipse cx={70}   cy={182} rx={148} ry={82} fill="#0a2210"/>
      <ellipse cx={330}  cy={186} rx={188} ry={78} fill="#082010"/>
      <ellipse cx={620}  cy={182} rx={210} ry={82} fill="#0a2210"/>
      <ellipse cx={930}  cy={184} rx={195} ry={80} fill="#082010"/>
      <ellipse cx={1220} cy={182} rx={170} ry={78} fill="#0a2210"/>
      <ellipse cx={0}    cy={192} rx={118} ry={66} fill="#123618"/>
      <ellipse cx={220}  cy={192} rx={162} ry={70} fill="#0e3016"/>
      <ellipse cx={490}  cy={192} rx={185} ry={72} fill="#123618"/>
      <ellipse cx={758}  cy={192} rx={174} ry={68} fill="#0e3016"/>
      <ellipse cx={1020} cy={192} rx={180} ry={70} fill="#123618"/>
      <ellipse cx={1280} cy={192} rx={150} ry={66} fill="#0e3016"/>
      <path d="M -10 200 Q 74 118 158 200"   fill="#184e1e"/>
      <path d="M 148 200 Q 258 106 368 200"  fill="#13561a"/>
      <path d="M 358 200 Q 480 100 602 200"  fill="#184e1e"/>
      <path d="M 592 200 Q 716 108 840 200"  fill="#13561a"/>
      <path d="M 830 200 Q 954 102 1078 200" fill="#184e1e"/>
      <path d="M 1068 200 Q 1190 106 1312 200" fill="#13561a"/>
    </svg>
  );
}

export default function ForestBackground() {
  const fireflies = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i, sx: 2 + Math.random() * 96, sy: 4 + Math.random() * 72,
  })), []);

  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      <style>{`
        @keyframes twinkle {
          0%,100% { opacity:.8; transform:scale(1);   }
          50%     { opacity:.1; transform:scale(.6);  }
        }
      `}</style>
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(180deg,#010810 0%,#021220 44%,#031608 100%)",
      }}/>
      <div style={{
        position:"absolute", top:"6%", left:"15%", width:"60%", height:"35%",
        borderRadius:"50%",
        background:"radial-gradient(ellipse, rgba(34,197,94,.04) 0%, transparent 70%)",
      }}/>
      <Stars/>
      <Moon/>
      {fireflies.map(f => <Firefly key={f.id} sx={f.sx} sy={f.sy}/>)}
      <Foliage/>
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:120,
        background:"linear-gradient(transparent,rgba(2,16,8,.92))",
        zIndex:4,
      }}/>
    </div>
  );
}