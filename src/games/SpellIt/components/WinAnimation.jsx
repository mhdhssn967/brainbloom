// When a team wins, the animal SVG flies from center to their panel
// with confetti burst

import { useEffect, useRef } from "react";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function WinAnimation({ winner, imagePath, wordName, teams }) {
  const color     = TEAM_COLORS[winner];
  const teamName  = teams[winner]?.name ?? "Team";
  const isLeft    = winner === 0;

  return (
    <div style={{
      position:       "fixed",
      inset:          0,
      zIndex:         200,
      pointerEvents:  "none",
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
    }}>

      {/* Dark overlay */}
      <div style={{
        position:   "absolute",
        inset:      0,
        background: "rgba(0,0,0,0.35)",
        animation:  "fadeIn 0.2s ease both",
      }} />

      {/* Flying animal */}
      <div style={{
        position:  "relative",
        zIndex:    10,
        animation: `flyToSide${isLeft ? "Left" : "Right"} 1.6s cubic-bezier(0.34,1.2,0.64,1) both`,
        filter:    `drop-shadow(0 0 32px ${color}90)`,
      }}>
        <img
          src={imagePath}
          alt={wordName}
          style={{ width: 180, height: 180, objectFit: "contain" }}
        />
      </div>

      {/* Win label */}
      <div style={{
        position:      "absolute",
        top:           "28%",
        left:          "50%",
        transform:     "translateX(-50%)",
        fontFamily:    "'Lilita One', cursive",
        fontSize:      52,
        color:         "#fff",
        letterSpacing: 2,
        textShadow:    `0 0 40px ${color}80, 0 4px 0 rgba(0,0,0,0.4)`,
        whiteSpace:    "nowrap",
        animation:     "winPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
        zIndex:        10,
      }}>
        🎉 {teamName} got it!
      </div>

      {/* Confetti dots */}
      <Confetti color={color} />

      <style>{`
        @keyframes flyToSideLeft {
          0%   { transform: scale(1.2) translateX(0);     opacity: 1; }
          60%  { transform: scale(1.4) translateX(0);     opacity: 1; }
          100% { transform: scale(0.3) translateX(-600px); opacity: 0; }
        }
        @keyframes flyToSideRight {
          0%   { transform: scale(1.2) translateX(0);     opacity: 1; }
          60%  { transform: scale(1.4) translateX(0);     opacity: 1; }
          100% { transform: scale(0.3) translateX(600px);  opacity: 0; }
        }
        @keyframes winPop {
          from { opacity:0; transform:translateX(-50%) scale(0.6); }
          to   { opacity:1; transform:translateX(-50%) scale(1);   }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// Simple confetti burst — CSS only
function Confetti({ color }) {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    id:    i,
    left:  `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    size:  Math.random() * 10 + 6,
    hue:   Math.random() > 0.5 ? color : "#FDE68A",
    dur:   `${Math.random() * 0.8 + 1}s`,
  }));

  return (
    <>
      {dots.map(dot => (
        <div key={dot.id} style={{
          position:   "fixed",
          top:        "-20px",
          left:       dot.left,
          width:      dot.size,
          height:     dot.size,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          background: dot.hue,
          animation:  `confettiFall ${dot.dur} ${dot.delay} ease-in forwards`,
          zIndex:     5,
        }} />
      ))}
    </>
  );
}