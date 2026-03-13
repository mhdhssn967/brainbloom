// ─── Shape SVG map ────────────────────────────────────────────────────────────
const SHAPE_PATHS = {
  circle:        <circle cx="24" cy="24" r="18" />,
  square:        <rect x="6" y="6" width="36" height="36" rx="3" />,
  triangle:      <polygon points="24,5 43,43 5,43" />,
  rectangle:     <rect x="4" y="12" width="40" height="24" rx="3" />,
  star:          <polygon points="24,4 29,18 44,18 33,27 37,42 24,33 11,42 15,27 4,18 19,18" />,
  heart:         <path d="M24,40 C24,40 6,28 6,16 A10,10 0 0 1 24,12 A10,10 0 0 1 42,16 C42,28 24,40 24,40Z" />,
  pentagon:      <polygon points="24,4 44,18 37,40 11,40 4,18" />,
  hexagon:       <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" />,
  octagon:       <polygon points="16,4 32,4 44,16 44,32 32,44 16,44 4,32 4,16" />,
  oval:          <ellipse cx="24" cy="24" rx="22" ry="14" />,
  diamond:       <polygon points="24,4 44,24 24,44 4,24" />,
  arrow:         <polygon points="24,4 44,24 34,24 34,44 14,44 14,24 4,24" />,
  trapezoid:     <polygon points="8,40 40,40 36,12 16,12" />,
  parallelogram: <polygon points="12,40 44,40 36,8 4,8" />,
  crescent:      <path d="M24,6 A18,18 0 1 0 24,42 A12,12 0 1 1 24,6Z" />,
  cross:         <path d="M16,4 H32 V16 H44 V32 H32 V44 H16 V32 H4 V16 H16Z" />,
};

// ─── Named export used by PlayerSide instruction banner ───────────────────────
export function ShapeSVG({ shapeKey, color, size }) {
  const shape = SHAPE_PATHS[shapeKey] ?? SHAPE_PATHS.circle;
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 48 48"
      style={{ display: "block", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))", flexShrink: 0 }}
    >
      <g fill={color} stroke="rgba(255,255,255,0.55)" strokeWidth="2">
        {shape}
      </g>
    </svg>
  );
}

// ─── Colour Bug ───────────────────────────────────────────────────────────────
function ColourBug({ value, size, isFlashing }) {
  return (
    <div style={{
      width:        size * 0.88,
      height:       size * 0.88,
      borderRadius: "50%",
      background:   value,
      border:       `3px solid rgba(255,255,255,${isFlashing ? 1 : 0.55})`,
      boxShadow:    `0 4px 18px ${value}80, 0 0 0 ${isFlashing ? "5px" : "0px"} rgba(255,255,255,0.45)`,
      transition:   "box-shadow 0.1s ease",
      flexShrink:   0,
    }} />
  );
}

// ─── Shape Bug ────────────────────────────────────────────────────────────────
function ShapeBug({ value, teamColor, size, isFlashing }) {
  return (
    <ShapeSVG
      shapeKey={value}
      color={isFlashing ? "#EF4444" : teamColor}
      size={size * 0.88}
    />
  );
}

// ─── Text Bug ─────────────────────────────────────────────────────────────────
function TextBug({ value, emoji, teamColor, size, isFlashing }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{
        fontSize:  size * 0.50,
        lineHeight: 1,
        animation: "bugWing 0.45s ease-in-out infinite",
        filter:    "drop-shadow(0 2px 4px rgba(0,0,0,0.45))",
      }}>
        {emoji}
      </div>
      <div style={{
        background:    isFlashing ? "rgba(239,68,68,0.92)" : "rgba(0,0,0,0.80)",
        border:        `1.5px solid ${isFlashing ? "#EF4444" : teamColor}`,
        borderRadius:  99,
        padding:       "2px 9px",
        fontSize:      Math.min(size * 2, 23),
        fontWeight:    900,
        color:         "#fff",
        fontFamily:    "'Baloo 2', cursive",
        whiteSpace:    "nowrap",
        letterSpacing: 0.4,
        boxShadow:     `0 2px 8px rgba(0,0,0,0.4)`,
        maxWidth:      size * 2.4,
        textAlign:     "center",
        overflow:      "hidden",
        textOverflow:  "ellipsis",
      }}>
        {value}
      </div>
    </div>
  );
}

// ─── Main Bug Component ───────────────────────────────────────────────────────
export default function Bug({ bug, onTap, teamColor }) {
  if (bug.caught) return null;

  const { bugType, value, label, emoji, size, flashing: isFlashing } = bug;
  // Support both .value (new) and .label (legacy)
  const displayValue = value ?? label;

  return (
    <div
      onPointerDown={(e) => {
        e.currentTarget.releasePointerCapture(e.pointerId);
        e.stopPropagation();
        onTap(bug.id);
      }}
      style={{
        position:       "absolute",
        left:           bug.x - bug.size / 2,
        top:            bug.y - bug.size / 2,
        width:          bug.size,
        height:         bug.size,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        cursor:         "pointer",
        userSelect:     "none",
        zIndex:         5,
        animation:      isFlashing
          ? "bugFlash 0.15s ease-in-out 3"
          : `bugFloat 3s ease-in-out infinite ${(bug.phase ?? 0) * 0.16}s`,
        willChange:     "transform",
      }}
    >
      <style>{`
        @keyframes bugWing  { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(0.80)} }
        @keyframes bugFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes bugFlash {
          0%,100%{filter:brightness(0.3) saturate(2) hue-rotate(-20deg);transform:scale(1)}
          50%    {filter:brightness(1.7);transform:scale(1.2)}
        }
      `}</style>

      {bugType === "colour" && (
        <ColourBug value={displayValue} size={size} isFlashing={isFlashing} />
      )}
      {bugType === "shape" && (
        <ShapeBug value={displayValue} teamColor={teamColor} size={size} isFlashing={isFlashing} />
      )}
      {(!bugType || bugType === "text") && (
        <TextBug value={displayValue} emoji={emoji} teamColor={teamColor} size={size} isFlashing={isFlashing} />
      )}
    </div>
  );
}