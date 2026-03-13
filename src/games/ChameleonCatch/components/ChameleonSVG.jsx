import { useEffect, useRef, useState } from "react";

/**
 * All coordinates (tongue target, divTop) are in the CANVAS DIV space —
 * the same space that bug.x / bug.y live in.
 *
 * Props:
 *   flip     — true for right player (SVG mirrored)
 *   tongue   — { targetX, targetY } in canvas-div px, or null
 *   dizzy    — boolean
 *   canvasW  — actual rendered width of the canvas div in px
 *   divTop   — CSS top of this SVG div inside the canvas div
 *   scale    — SVG scale factor (default 0.72)
 */
export default function ChameleonSVG({ flip, tongue, dizzy, canvasW, divTop, scale = 0.72 }) {
  const [eyeX,  setEyeX]  = useState(0);
  const [eyeY,  setEyeY]  = useState(0);
  const [blink, setBlink] = useState(false);
  const frameRef = useRef(0);

  // ── Elastic tongue + jaw state ──
  const [jawAngle,  setJawAngle]  = useState(0);   // degrees jaw has dropped
  const [tongueTip, setTongueTip] = useState(null); // { x, y, cx, cy } in SVG coords | null
  const tongueAnimRef = useRef();
  const phaseRef      = useRef("idle"); // idle | opening | shoot | hold | retract | closing
  const prevTongueRef = useRef(null);   // last non-null tongue prop value

  // Eye wander
  useEffect(() => {
    let raf;
    function tick(now) {
      const t = Math.floor(now / 600);
      if (t !== frameRef.current) {
        frameRef.current = t;
        if (Math.random() < 0.25) {
          setEyeX((Math.random() - 0.5) * 5);
          setEyeY((Math.random() - 0.5) * 4);
        }
      }
      if (Math.random() < 0.003) { setBlink(true); setTimeout(() => setBlink(false), 110); }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const VW = 444.82;
  const VH = 229.45;
  const W  = VW * scale;
  const H  = VH * scale;

  const MOUTH_SVG_X = 439;
  const MOUTH_SVG_Y = 84;

  // ── Convert canvas-div coords → SVG viewBox coords ──
  function toSVG(cx, cy) {
    let svgX = flip ? (canvasW - cx) / scale : cx / scale;
    const svgY = (cy - divTop) / scale;
    return { svgX, svgY };
  }

  // ── Fire elastic tongue animation whenever tongue prop changes to non-null ──
  useEffect(() => {
    if (!tongue) return;                          // ignore null (cleanup handled separately)
    if (phaseRef.current !== "idle") return;      // already animating

    prevTongueRef.current = tongue;
    const { svgX: targetX, svgY: targetY } = toSVG(tongue.targetX, tongue.targetY);

    cancelAnimationFrame(tongueAnimRef.current);

    const dx = targetX - MOUTH_SVG_X;
    const dy = targetY - MOUTH_SVG_Y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    // perpendicular unit vector for bezier bulge
    const px = -dy / len;
    const py =  dx / len;
    const bulge = len * 0.30;

    const OPEN_MS    = 85;
    const SHOOT_MS   = 200;
    const HOLD_MS    = 100;
    const RETRACT_MS = 170;
    const CLOSE_MS   = 120;
    const MAX_JAW    = 20;

    const easeOut   = t => 1 - Math.pow(1 - t, 3);
    const easeIn    = t => t * t * t;
    const easeInOut = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2;

    let startTime = null;
    phaseRef.current = "opening";

    const tick = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      if (phaseRef.current === "opening") {
        const t = Math.min(elapsed / OPEN_MS, 1);
        setJawAngle(easeOut(t) * MAX_JAW);
        if (t >= 1) { phaseRef.current = "shoot"; startTime = now; }

      } else if (phaseRef.current === "shoot") {
        const t  = Math.min(elapsed / SHOOT_MS, 1);
        const et = easeOut(t);
        const tx = MOUTH_SVG_X + dx * et;
        const ty = MOUTH_SVG_Y + dy * et;
        const b  = Math.sin(t * Math.PI) * bulge;
        setTongueTip({
          tx, ty,
          cx: MOUTH_SVG_X + dx * 0.5 + px * b,
          cy: MOUTH_SVG_Y + dy * 0.5 + py * b,
        });
        setJawAngle(MAX_JAW);
        if (t >= 1) { phaseRef.current = "hold"; startTime = now; }

      } else if (phaseRef.current === "hold") {
        setTongueTip({
          tx: targetX, ty: targetY,
          cx: MOUTH_SVG_X + dx * 0.5,
          cy: MOUTH_SVG_Y + dy * 0.5,
        });
        if (elapsed >= HOLD_MS) { phaseRef.current = "retract"; startTime = now; }

      } else if (phaseRef.current === "retract") {
        const t  = Math.min(elapsed / RETRACT_MS, 1);
        const et = easeIn(t);
        const tx = targetX + (MOUTH_SVG_X - targetX) * et;
        const ty = targetY + (MOUTH_SVG_Y - targetY) * et;
        const b  = Math.sin((1 - t) * Math.PI) * bulge * 0.4;
        setTongueTip({
          tx, ty,
          cx: MOUTH_SVG_X + dx * 0.5 * (1 - et) + px * b,
          cy: MOUTH_SVG_Y + dy * 0.5 * (1 - et) + py * b,
        });
        // jaw starts closing halfway through retract
        setJawAngle(MAX_JAW * (1 - easeInOut(Math.max(0, (t - 0.5) / 0.5))));
        if (t >= 1) {
          setTongueTip(null);
          phaseRef.current = "closing";
          startTime = now;
        }

      } else if (phaseRef.current === "closing") {
        const t = Math.min(elapsed / CLOSE_MS, 1);
        setJawAngle(MAX_JAW * (1 - easeOut(t)));
        if (t >= 1) {
          setJawAngle(0);
          phaseRef.current = "idle";
          return; // stop RAF
        }
      }

      tongueAnimRef.current = requestAnimationFrame(tick);
    };

    tongueAnimRef.current = requestAnimationFrame(tick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tongue]);   // re-fires each time parent passes a new tongue object

  useEffect(() => () => cancelAnimationFrame(tongueAnimRef.current), []);

  // ── Derived mouth metrics ──
  const cavityH     = (jawAngle / 20) * 13;          // cavity height grows with jaw
  const tongueExitY = MOUTH_SVG_Y + (jawAngle / 20) * 4; // tongue exits slightly lower as jaw opens

  // Hinge point where jaw rotates
  const HINGE_X = 388;
  const HINGE_Y = 82;

  const C = {
    body:"#0baa3b", bodyAlt:"#04af38",
    hi1:"#8ace9f",  hi2:"#9eddb0",
    white:"#f3fff6", pale:"#cef4d9",
    dark:"#48522f",  branch:"#89634b",
  };

  return (
    <div style={{
      position:      "absolute",
      left:          flip ? undefined : 0,
      right:         flip ? 0 : undefined,
      top:           divTop,
      width:         W,
      height:        H,
      userSelect:    "none",
      pointerEvents: "none",
      filter: dizzy
        ? "hue-rotate(285deg) saturate(2.5) brightness(1.15)"
        : "drop-shadow(0 8px 20px rgba(0,160,50,.22))",
      transition: "filter .15s ease",
    }}>
      <style>{`
        @keyframes ch-sway    { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(.8deg)} }
        @keyframes ch-tail    { 0%,100%{transform:rotate(0deg)}  33%{transform:rotate(5deg)}  66%{transform:rotate(-3deg)} }
        @keyframes ch-breathe { 0%,100%{transform:scaleY(1)}     50%{transform:scaleY(1.025)} }
        @keyframes ch-head    { 0%,100%{transform:rotate(0deg)}  30%{transform:rotate(2deg)}  70%{transform:rotate(-1.5deg)} }
        @keyframes ch-leg     { 0%,100%{transform:rotate(0deg)}  50%{transform:rotate(3.5deg) translateY(2px)} }
        @keyframes dizzyOrbit { 0%{transform:rotate(0deg) translateX(24px);opacity:1} 100%{transform:rotate(360deg) translateX(24px);opacity:0} }
      `}</style>

      <svg viewBox={`0 0 ${VW} ${VH}`} width={W} height={H}
        style={{ overflow:"visible", display:"block" }}>

        {/* ── clipPath for mouth cavity — unique id per side ── */}
        <defs>
          <clipPath id={`mouthClip-${flip ? "r" : "l"}`}>
            <rect x={388} y={76} width={58} height={22} rx={4}/>
          </clipPath>
        </defs>

        {/* Flip wrapper */}
        <g transform={flip ? `scale(-1,1) translate(-${VW},0)` : ""}>

          {/* ── Full body sway ── */}
          <g style={{ transformOrigin:"220px 130px", animation:"ch-sway 5s ease-in-out infinite" }}>

            {/* Branch */}
            <path d="M -60 168 Q 60 148 180 154 Q 300 160 470 144"
              fill="none" stroke="#5c2e0a" strokeWidth={30} strokeLinecap="round"/>
            <path d="M -60 168 Q 60 148 180 154 Q 300 160 470 144"
              fill="none" stroke="#89634b" strokeWidth={20} strokeLinecap="round"/>
            <path d="M -60 168 Q 60 148 180 154 Q 300 160 470 144"
              fill="none" stroke="#b07840" strokeWidth={8}  strokeLinecap="round" opacity={0.3}/>
            <ellipse cx={60}  cy={152} rx={11} ry={7} fill="#5c2e0a"/>
            <ellipse cx={190} cy={156} rx={9}  ry={6} fill="#5c2e0a"/>
            <ellipse cx={340} cy={150} rx={8}  ry={5} fill="#5c2e0a"/>
            <circle  cx={-55} cy={168} r={13}          fill="#6b3410"/>
            <path d="M 120 153 Q 108 136 100 140" fill="none" stroke="#5c2e0a" strokeWidth={6} strokeLinecap="round"/>
            <ellipse cx={98}  cy={137} rx={14} ry={5} fill="#1a5220" transform="rotate(18 98 137)"/>
            <path d="M 280 150 Q 268 132 260 136" fill="none" stroke="#5c2e0a" strokeWidth={5} strokeLinecap="round"/>
            <ellipse cx={258} cy={132} rx={13} ry={5} fill="#1a5220" transform="rotate(12 258 132)"/>

            {/* Leg shadow */}
            <g style={{ transformOrigin:"220px 150px", animation:"ch-leg 3.8s .4s ease-in-out infinite" }}>
              <path fill={C.branch} d="M435.27,104.06c-7.51,3.21-16.03,2.39-24.2,2.49-28.03.32-55.68,12.09-83.36,9.03-2.36-.26-4.73.09-6.98.83-15.03,4.98-34.85.94-49.58,6.2-5.81,2.08-11.03,5.5-16.39,8.56-45.96,26.26-101.96,25.98-154.8,22.96-8.74-.5-17.59-1.05-26.2.56-6.91,1.29-13.48,3.94-20.13,6.2-16.31,5.53-33.4,8.76-50.6,9.57-.73,3.21-2.28,7.37-3.01,10.58,17.73.12,35.47-1.88,52.73-5.93,12.93-3.03,25.62-7.23,38.78-9,17.17-2.31,34.9-.38,51.17,5.57,3.3,1.21,6.63,2.6,10.14,2.65,3.63.06,7.1-1.3,10.52-2.51,28.16-9.95,58.63-10.63,88.5-11.21,8.28-8.23,18.41-16.21,29.31-20.41,6.88-2.65,14.31-3.45,21.64-4.22,28.02-2.97,56.07-5.95,84.23-6.91,19.79-.68,40.67-.64,57.79-10.59-3.16-5.21-6.4-9.23-9.55-14.43Z"/>
            </g>

            {/* Tail */}
            <g style={{ transformOrigin:"165px 155px", animation:"ch-tail 4.5s ease-in-out infinite" }}>
              <path fill={C.body} d="M360.68,101.02s9.38-36.87-9.89-64.21c-19.27-27.34-69.3-52.71-109.84-16.6-40.54,36.11-44.59,86.24-64.63,96.05-20.04,9.82-37.04-.17-49.14-3.9-19.53-6.03-70.58,5.66-70.18,62.02.4,56.36,100.32,72.26,108.77,34.61,8.46-37.65-12.32-55.78-39.15-58.49-26.83-2.71-31.44,23.99-23.23,31.74,8.21,7.74,23.37,5.78,22.85.22-.52-5.56-5.92-11.29-11.34-11.23-5.42.06-3.33-15.61,13.22-10.77,16.55,4.84,23.92,29.64,14.03,39.96-9.89,10.31-43.82,9.68-54.86-10.36-11.04-20.03-8.01-43.64,12.59-51.46,20.6-7.81,32.35,13.68,78.18,19.53,45.83,5.85,70.1-40,79.16-50.89,9.06-10.89,76.11,8.06,103.45-6.23Z"/>
            </g>

            {/* Main body */}
            <g style={{ transformOrigin:"222px 110px", animation:"ch-breathe 3.2s ease-in-out infinite" }}>
              <path fill={C.body} d="M360.68,101.02s9.38-36.87-9.89-64.21c-19.27-27.34-69.3-52.71-109.84-16.6-40.54,36.11-44.59,86.24-64.63,96.05-20.04,9.82-37.04-.17-49.14-3.9-19.53-6.03-70.58,5.66-70.18,62.02.4,56.36,100.32,72.26,108.77,34.61,8.46-37.65-12.32-55.78-39.15-58.49-26.83-2.71-31.44,23.99-23.23,31.74,8.21,7.74,23.37,5.78,22.85.22-.52-5.56-5.92-11.29-11.34-11.23-5.42.06-3.33-15.61,13.22-10.77,16.55,4.84,23.92,29.64,14.03,39.96-9.89,10.31-43.82,9.68-54.86-10.36-11.04-20.03-8.01-43.64,12.59-51.46,20.6-7.81,32.35,13.68,78.18,19.53,45.83,5.85,70.1-40,79.16-50.89,9.06-10.89,76.11,8.06,103.45-6.23Z"/>
              <ellipse cx="121.01" cy="116.08" rx="2.62" ry="4.63" transform="rotate(-78.36 121.01 116.08)" fill={C.hi1}/>
              <ellipse cx="107.73" cy="116.1"  rx="4.62" ry="2.63" transform="rotate(-4.56 107.73 116.1)"   fill={C.hi1}/>
              <path fill={C.body} d="M246.43,104.18s-7.14-12.37,4.71-20.42c11.85-8.04,29.53-2.54,32.54,1.13,7.92,9.64-6.2,31.12-8.69,35.18-2.49,4.06,9.55-5.18,15.68-.57,6.14,4.61,6.16,11.39,1.37,12.15-4.8.76-19.8-.45-24.13,5.25-4.33,5.7-10.95,7.77-10.9,3.04.06-4.73,10.76-34.35,9.11-34.72-1.66-.36-9.75,11.86-19.68-1.04Z"/>
              <path fill={C.body} d="M310.96,132.54s-2.66-.85-1.14-4.28c1.52-3.43,7.17-3.93,4.5-7.67-2.67-3.74-14.93-10.99-16.02-19.08-1.08-8.09,7.22-15.2,17.25-18.64,10.04-3.44,19.67-.39,21.76,8.06,2.09,8.45-6.4,12.56-13.48,12.22-7.08-.34-6.3,6.61-1.18,9.88,5.12,3.27,10.22,7.01,14.86,6.14,4.64-.86,13.24.62,12.55,4.29-.7,3.68-.62,11.41-8.5,5.79-7.88-5.62-22.02,3.57-30.6,3.3Z"/>
            </g>

            {/* ── HEAD GROUP ── */}
            <g style={{ transformOrigin:"390px 52px", animation:"ch-head 7s ease-in-out infinite" }}>
              <path fill={C.bodyAlt} d="M337.52,39.88s18.28-36.98,52.8-29.24c34.53,7.74,47.6,50.17,48.16,61.68.56,11.51,6.04,23.04-24.19,31.3-30.23,8.25-51.03-.79-59.72-5.57-8.69-4.78-23.47-48.34-17.05-58.16Z"/>
              <path fill={C.bodyAlt} d="M390.42,13.78S367.69.91,363.6.28c-20.25-3.16-32.4,21.13-28.35,44.13,4.06,23,61.93-.27,55.16-30.63Z"/>
              <ellipse cx="407.75" cy="22.61" rx="2.62" ry="4.64" transform="rotate(-52.03 407.75 22.61)" fill={C.hi2}/>
              <ellipse cx="395.73" cy="16.52" rx="2.62" ry="4.64" transform="rotate(-67.99 395.73 16.52)" fill={C.hi2}/>
              <ellipse cx="365.21" cy="5.63"  rx="2.62" ry="4.64" transform="rotate(-67.99 365.21 5.63)"  fill={C.hi2}/>
              <ellipse cx="354.46" cy="7.74"  rx="2.63" ry="4.62" transform="rotate(-86.06 354.46 7.74)"  fill={C.hi2}/>
              <ellipse cx="315.6"  cy="23.13" rx="3.7"  ry="5.67" transform="rotate(-52.03 315.6 23.13)"  fill={C.hi1}/>
              <ellipse cx="302.63" cy="12.92" rx="3.71" ry="5.66" transform="rotate(-74.6 302.63 12.92)"  fill={C.hi1}/>
              <ellipse cx="288.31" cy="14.59" rx="3.71" ry="5.66" transform="rotate(-74.6 288.31 14.59)"  fill={C.hi1}/>

              {/* Eye */}
              <ellipse cx="397.4"  cy="52.04" rx="21.05" ry="21.33" transform="rotate(-52.03 397.4 52.04)"  fill={C.white}/>
              <ellipse cx="399.14" cy="51.73" rx="19.81" ry="20.07" transform="rotate(-52.03 399.14 51.73)" fill={C.pale}/>
              <ellipse
                cx={410.4+eyeX} cy={53.82+eyeY} rx="5.89" ry={blink?1.2:5.97}
                transform="rotate(-52.03 410.4 53.82)" fill={C.dark}
                style={{ transition:"cx .35s ease,cy .35s ease,ry .1s ease" }}
              />
              <circle cx={413.5+eyeX} cy={50.5+eyeY} r="1.8" fill="rgba(255,255,255,.65)"/>

              {/* ── LAYER 1: MOUTH CAVITY — clipped, grows with jaw ── */}
              <g clipPath={`url(#mouthClip-${flip ? "r" : "l"})`}>
                {/* deep throat */}
                <ellipse cx={416} cy={83} rx={26} ry={Math.max(0.5, cavityH * 1.1)} fill="#0d1a08"/>
                {/* pink tongue bed */}
                <ellipse cx={414} cy={83 + cavityH * 0.3} rx={22} ry={Math.max(0.2, cavityH * 0.65)} fill="#c2185b" opacity={0.9}/>
                {/* roof highlight */}
                <ellipse cx={412} cy={81} rx={16} ry={Math.max(0.1, cavityH * 0.25)} fill="#ff80ab" opacity={0.5}/>
              </g>

              {/* ── LAYER 2: LOWER JAW — rotates down around hinge ── */}
              <g style={{
                transformOrigin: `${HINGE_X}px ${HINGE_Y}px`,
                transform: `rotate(${jawAngle}deg)`,
              }}>
                {/* head-colour underside so hinge blends */}
                <path fill={C.bodyAlt}
                  d="M388,82 C 400,80 420,81 440,84 C 440,90 420,93 400,91 C 392,90 388,87 388,82 Z"/>
                {/* original jaw detail */}
                {/* <path fill={C.dark}
                  d="M439.17,83.94s-3.75-2.53-6.44-2.58c-2.68-.05-26.48,12.13-35.93,7.16
                     s-9.49-6.62-9.49-6.62c0,0,3.68,8.01,12.81,9.59,9.13,1.57,29.17-8.25,31.78-8.4
                     c2.6-.15,3.56.53,4.97,1.1c1.41.56,2.49,1.55,2.22-.06"/> */}
                {/* lower gum line */}
                <path fill="none" stroke="#8fbc5a" strokeWidth={1.2}
                  d="M392 84 C 405 83 422 84 438 85" opacity={0.55}/>
              </g>

              {/* ── LAYER 3: HINGE COVER — hides rotation seam ── */}
              <ellipse cx={HINGE_X} cy={HINGE_Y - 1} rx={10} ry={7} fill={C.bodyAlt}/>

              {/* ── LAYER 4: UPPER LIP LINE — fixed, defines closed mouth ── */}
              {/* <path fill="none" stroke="#2d4a1a" strokeWidth={2} strokeLinecap="round"
                d="M390 82 C 404 80 421 81 438 83"/> */}

              {/* ── ELASTIC TONGUE — on top of everything, exits from between lips ── */}
              {tongueTip && (
                <g pointerEvents="none">
                  {/* bezier body */}
                  <path
                    d={`M ${MOUTH_SVG_X} ${tongueExitY} Q ${tongueTip.cx} ${tongueTip.cy} ${tongueTip.tx} ${tongueTip.ty}`}
                    stroke="#FF4FA3" strokeWidth="6" fill="none" strokeLinecap="round"
                  />
                  {/* sticky tip */}
                  <circle cx={tongueTip.tx} cy={tongueTip.ty} r="9" fill="#FF1493"
                    style={{ filter:"drop-shadow(0 0 5px #ff69b4)" }}/>
                  {/* tip highlight */}
                  <circle cx={tongueTip.tx - 2} cy={tongueTip.ty - 2} r="3"
                    fill="rgba(255,255,255,0.4)"/>
                </g>
              )}
            </g>
            {/* end head group */}

            {dizzy && [0,1,2].map(i => (
              <text key={i} x="400" y="10" fontSize="20"
                style={{ animation:`dizzyOrbit .75s ${i*.25}s ease-in-out infinite`, transformOrigin:"400px 10px" }}>
                ⭐
              </text>
            ))}

          </g>
          {/* end body sway */}
        </g>
        {/* end flip wrapper */}
      </svg>
    </div>
  );
}