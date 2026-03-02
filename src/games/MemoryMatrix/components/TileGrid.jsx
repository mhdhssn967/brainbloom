// src/games/MemoryMatrix/components/TileGrid.jsx
// Retapping a selected tile deselects it (during recall phase only)

const COLS = 5;
const ROWS = 5;

function Tile({ index, phase, isPattern, isTapped, isCorrectTap, isWrongTap, onTap, disabled }) {

  const getBackground = () => {
    if (phase === "result") {
      if (isCorrectTap) return "#22C55E";
      if (isWrongTap)   return "#EF4444";
      if (isPattern)    return "#60A5FA";
      return "rgba(255,255,255,0.05)";
    }
    if (phase === "show" && isPattern)   return "#60A5FA";
    if (phase === "recall" && isTapped)  return "rgba(255,255,255,0.28)";
    return "rgba(255,255,255,0.07)";
  };

  const getBorder = () => {
    if (phase === "result") {
      if (isCorrectTap) return "2px solid #16A34A";
      if (isWrongTap)   return "2px solid #DC2626";
      if (isPattern)    return "2px solid #3B82F6";
      return "2px solid rgba(255,255,255,0.06)";
    }
    if (phase === "show" && isPattern)  return "2px solid #93C5FD";
    if (phase === "recall" && isTapped) return "2px solid rgba(255,255,255,0.4)";
    return "2px solid rgba(255,255,255,0.07)";
  };

  const getGlow = () => {
    if (phase === "show" && isPattern)
      return "0 0 18px rgba(96,165,250,0.75), 0 0 36px rgba(96,165,250,0.3)";
    if (phase === "recall" && isTapped)
      return "0 0 10px rgba(255,255,255,0.2)";
    if (phase === "result" && isCorrectTap)
      return "0 0 14px rgba(34,197,94,0.6)";
    if (phase === "result" && isWrongTap)
      return "0 0 14px rgba(239,68,68,0.6)";
    return "none";
  };

  return (
    <button
      onClick={() => !disabled && onTap(index)}
      style={{
        all: "unset",
        cursor: disabled ? "default" : "pointer",
        width: "100%",
        aspectRatio: "1",
        borderRadius: 10,
        background: getBackground(),
        border: getBorder(),
        boxShadow: getGlow(),
        transition: "all 0.18s ease",
        transform: isTapped && phase === "recall" ? "scale(0.91)" : "scale(1)",
        animation: phase === "show" && isPattern
          ? "tileReveal 0.3s cubic-bezier(0.34,1.56,0.64,1) both"
          : "none",
      }}
    />
  );
}

export default function TileGrid({
  phase,
  pattern,
  taps,
  evaluation,
  onTap,
  disabled,
}) {
  const patternSet    = new Set(pattern);
  const tapsSet       = new Set(taps);
  const correctTapSet = new Set(evaluation?.correct ?? []);
  const wrongTapSet   = new Set(evaluation?.wrong   ?? []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${COLS}, 1fr)`,
      gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
      gap: 8,
      width: "100%",
    }}>
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <Tile
          key={i}
          index={i}
          phase={phase}
          isPattern={patternSet.has(i)}
          isTapped={tapsSet.has(i)}
          isCorrectTap={correctTapSet.has(i)}
          isWrongTap={wrongTapSet.has(i)}
          onTap={onTap}
          disabled={disabled}
        />
      ))}
    </div>
  );
}