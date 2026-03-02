// src/games/BalloonBattle/components/BalloonGrid.jsx
// 5 columns x 4 rows = 20 balloons total
// Replaces BalloonRow.jsx

import { useState, useEffect, useRef } from "react";
import { BALLOON_COUNT } from "../constants";

// Each balloon gets a fixed colour from this palette
const PALETTE = [
  "#FF6B6B", "#FF9F43", "#FECA57", "#48DBFB", "#FF9FF3",
  "#54A0FF", "#5F27CD", "#00D2D3", "#FF6B81", "#A3CB38",
  "#EE5A24", "#1289A7", "#D980FA", "#FDA7DF", "#C8D6E5",
  "#F8B739", "#6C5CE7", "#00B894", "#E17055", "#74B9FF",
];

// Burst particles — 8 dots shoot out in different directions
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function BurstParticle({ color, angle }) {
  const rad    = (angle * Math.PI) / 180;
  const dist   = 28 + Math.random() * 16;
  const tx     = Math.round(Math.cos(rad) * dist);
  const ty     = Math.round(Math.sin(rad) * dist);

  return (
    <div style={{
      position: "absolute",
      top: "50%", left: "50%",
      width: 10, height: 10,
      borderRadius: "50%",
      background: color,
      transform: "translate(-50%, -50%)",
      animation: "burstParticle 0.45s ease-out forwards",
      "--tx": `${tx}px`,
      "--ty": `${ty}px`,
      boxShadow: `0 0 6px ${color}`,
    }} />
  );
}

function SingleBalloon({ color, alive, popping, floatDelay }) {
  const [showBurst, setShowBurst] = useState(false);
  const prevPopping = useRef(false);

  useEffect(() => {
    if (popping && !prevPopping.current) {
      setShowBurst(true);
      const t = setTimeout(() => setShowBurst(false), 500);
      return () => clearTimeout(t);
    }
    prevPopping.current = popping;
  }, [popping]);

  // Deflated balloon — small flat oval
  if (!alive && !popping) {
    return (
      <div style={{
        width: 32, height: 18,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.08)",
        border: "2px solid rgba(255,255,255,0.1)",
      }} />
    );
  }

  return (
    <div style={{
      position: "relative",
      width: 68, height: 120,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      animation: popping
        ? "balloonPop 0.45s ease forwards"
        : `balloonFloat ${2.5 + floatDelay}s ${floatDelay}s ease-in-out infinite`,
    }}>
      {/* Balloon body */}
      <div style={{
        width: 74, height: 80,
        borderRadius: "50% 50% 46% 46% / 55% 55% 45% 45%",
        background: `radial-gradient(circle at 35% 35%, ${color}FF, ${color}BB)`,
        boxShadow: `
          inset -5px -6px 10px rgba(0,0,0,0.25),
          inset 4px 4px 10px rgba(255,255,255,0.25),
          0 6px 20px ${color}60
        `,
        position: "relative",
        flexShrink: 0,
      }}>
        {/* Shine */}
        <div style={{
          position: "absolute",
          top: 7, left: 8,
          width: 10, height: 14,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.5)",
          transform: "rotate(-30deg)",
        }} />
        {/* Knot at bottom */}
        <div style={{
          position: "absolute",
          bottom: -3, left: "50%",
          transform: "translateX(-50%)",
          width: 6, height: 6,
          borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
          background: color,
          filter: "brightness(0.7)",
        }} />
      </div>

      {/* String */}
      <div style={{
        width: 1.5, height: 10,
        background: "rgba(255,255,255,0.25)",
      }} />

      {/* Burst particles */}
      {showBurst && PARTICLE_ANGLES.map(angle => (
        <BurstParticle key={angle} color={color} angle={angle} />
      ))}
    </div>
  );
}

export default function BalloonGrid({ count, poppingNow, color, side }) {
  const COLS = 5;
  const ROWS = 4;
  // Which index is currently popping (always the last alive balloon)
  const poppingIndex = poppingNow ? count - 1 : -1;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      gap: "6px 8px",
      padding: "4px 8px",
      justifyItems: "center",
    }}>
      {Array.from({ length: BALLOON_COUNT }, (_, i) => (
        <SingleBalloon
          key={i}
          color={PALETTE[i % PALETTE.length]}
          alive={i < count}
          popping={i === poppingIndex}
          floatDelay={((i * 0.17) % 1.8)}
        />
      ))}
    </div>
  );
}