import { useState, useEffect, useRef } from "react";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function TileGrid({
  playerId,
  gridSize,
  pattern,
  correctTaps,
  wrongTile,
  phase,
  onTap,
}) {
  const total       = gridSize * gridSize;
  const teamColor   = TEAM_COLORS[playerId];
  const [flipped, setFlipped] = useState(new Set());
  const prevPattern = useRef(null);

  // Trigger flip animation when pattern changes (show phase)
  useEffect(() => {
    if (phase !== "show") return;
    if (prevPattern.current === pattern) return;
    prevPattern.current = pattern;

    // Stagger flip-in for each lit tile
    const newFlipped = new Set();
    pattern.forEach((idx, i) => {
      setTimeout(() => {
        newFlipped.add(idx);
        setFlipped(new Set(newFlipped));
      }, i * 120);
    });

    return () => setFlipped(new Set());
  }, [pattern, phase]);

  // Clear flipped when phase changes away from show
  useEffect(() => {
    if (phase !== "show") setFlipped(new Set());
  }, [phase]);

  const tileSize   = Math.min(Math.floor(300 / gridSize), 80);
  const gap        = Math.max(4, 8 - gridSize);

  return (
    <div style={{
      display:             "grid",
      gridTemplateColumns: `repeat(${gridSize}, ${tileSize}px)`,
      gridTemplateRows:    `repeat(${gridSize}, ${tileSize}px)`,
      gap:                 gap,
      perspective:         800,
    }}>
      {Array.from({ length: total }, (_, idx) => {
        const isLit        = phase === "show" && pattern.includes(idx);
        const isFlipping   = flipped.has(idx);
        const isCorrect    = correctTaps.includes(idx);
        const isWrong      = wrongTile === idx;
        const isAdvancing  = phase === "advancing";
        const canTap       = phase === "recall" && !isCorrect;

        // Determine tile color
        let bg        = "rgba(255,255,255,0.06)";
        let border    = "rgba(255,255,255,0.1)";
        let glow      = "none";
        let scale     = "scale(1)";
        let rotateY   = "rotateY(0deg)";

        if (isLit && isFlipping) {
          bg      = teamColor;
          border  = teamColor;
          glow    = `0 0 20px ${teamColor}80, 0 0 40px ${teamColor}40`;
          rotateY = "rotateY(360deg)";
        } else if (isLit) {
          bg    = teamColor;
          border = teamColor;
          glow  = `0 0 20px ${teamColor}80`;
        } else if (isCorrect) {
          bg    = "#22C55E";
          border = "#22C55E";
          glow  = "0 0 16px #22C55E80";
          scale = "scale(0.92)";
        } else if (isWrong) {
          bg    = "#EF4444";
          border = "#EF4444";
          glow  = "0 0 20px #EF444480";
          scale = "scale(1.08)";
        } else if (isAdvancing) {
          bg    = "#22C55E";
          border = "#22C55E";
          glow  = "0 0 12px #22C55E60";
          scale = "scale(0.95)";
        }

        return (
          <div
            key={idx}
            onClick={() => canTap && onTap(idx)}
            style={{
              width:        tileSize,
              height:       tileSize,
              borderRadius: Math.max(8, tileSize * 0.15),
              background:   bg,
              border:       `2px solid ${border}`,
              boxShadow:    glow,
              cursor:       canTap ? "pointer" : "default",
              transform:    `${scale} ${rotateY}`,
              transition:   isFlipping
                ? "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease, box-shadow 0.3s ease"
                : isCorrect || isWrong
                  ? "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.15s ease, box-shadow 0.2s ease"
                  : "background 0.3s ease, box-shadow 0.3s ease, border 0.3s ease",
              position:     "relative",
              overflow:     "hidden",
            }}
            onMouseDown={e => {
              if (canTap) e.currentTarget.style.transform = "scale(0.88)";
            }}
            onMouseUp={e => {
              if (canTap) e.currentTarget.style.transform = scale;
            }}
          >
            {/* Shine overlay */}
            {(isLit || isCorrect) && (
              <div style={{
                position:    "absolute",
                top:         0, left: 0,
                right:       0, height: "40%",
                background:  "rgba(255,255,255,0.15)",
                borderRadius: `${tileSize * 0.15}px ${tileSize * 0.15}px 0 0`,
                pointerEvents: "none",
              }} />
            )}
            {/* Correct checkmark */}
            {isCorrect && (
              <div style={{
                position:       "absolute", inset: 0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       tileSize * 0.4,
                animation:      "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
              }}>
                ✓
              </div>
            )}
            {/* Wrong X */}
            {isWrong && (
              <div style={{
                position:       "absolute", inset: 0,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                fontSize:       tileSize * 0.4,
                color:          "#fff",
                animation:      "shakeX 0.3s ease both",
              }}>
                ✕
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}