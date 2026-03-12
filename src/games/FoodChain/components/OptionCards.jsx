import { useState } from "react";

export default function OptionCards({ options, onTap, wrongCard, phase, color }) {
  const [pressed, setPressed] = useState(null);
  const disabled = phase !== "playing";

  return (
    <div style={{
      display:        "flex",
      flexWrap:       "wrap",
      gap:            10,
      justifyContent: "center",
      padding:        "0 8px",
    }}>
      {options.map((opt, i) => {
        const isWrong = wrongCard === opt;
        const emoji   = opt.split(" ")[0];
        const label   = opt.split(" ").slice(1).join(" ");

        return (
          <button
            key={opt}
            onPointerDown={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              if (!disabled) {
                setPressed(opt);
                onTap(opt);
                setTimeout(() => setPressed(null), 200);
              }
            }}
            style={{
              all:          "unset",
              cursor:       disabled ? "default" : "pointer",
              display:      "flex",
              flexDirection:"column",
              alignItems:   "center",
              justifyContent:"center",
              gap:          4,
              padding:      "10px 14px",
              borderRadius: 16,
              minWidth:     "clamp(60px, 10vw, 80px)",
              background:   isWrong
                ? "rgba(239,68,68,0.2)"
                : pressed === opt
                  ? `${color}30`
                  : "rgba(255,255,255,0.06)",
              border:       `2px solid ${
                isWrong   ? "#EF4444" :
                pressed === opt ? color :
                "rgba(255,255,255,0.1)"
              }`,
              boxShadow:    isWrong
                ? "0 0 16px rgba(239,68,68,0.4)"
                : pressed === opt
                  ? `0 0 16px ${color}50`
                  : "none",
              transform:    isWrong
                ? "scale(0.95)"
                : pressed === opt
                  ? "scale(0.92)"
                  : "scale(1)",
              animation:    isWrong
                ? "shakeCard 0.4s ease both"
                : `cardFloat ${1.5 + i * 0.3}s ease-in-out infinite`,
              transition:   "background 0.15s ease, border 0.15s ease, box-shadow 0.15s ease",
              opacity:      disabled && !isWrong ? 0.6 : 1,
            }}
          >
            <div style={{ fontSize: "clamp(20px, 4vw, 32px)", lineHeight: 1 }}>{emoji}</div>
            <div style={{
              fontSize:   "clamp(9px, 1.2vw, 11px)",
              fontWeight: 900,
              color:      "rgba(255,255,255,0.7)",
              textAlign:  "center",
              maxWidth:   72,
              lineHeight: 1.2,
            }}>
              {label}
            </div>
          </button>
        );
      })}
    </div>
  );
}