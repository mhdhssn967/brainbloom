import { useState } from "react";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ImageTile({
  option, imageUrl, teamId,
  onTap, disabled,
  isCorrect, isWrong, phase,
}) {
  const [pressed, setPressed] = useState(false);
  const color   = TEAM_COLORS[teamId];
  const loading = !imageUrl;

  const getBorder = () => {
    if (isCorrect) return "3px solid #22C55E";
    if (isWrong)   return "3px solid #EF4444";
    if (pressed)   return `3px solid ${color}`;
    return "3px solid rgba(255,255,255,0.08)";
  };

  const getAnimation = () => {
    if (isCorrect) return "correctPulse 0.6s ease both";
    if (isWrong)   return "wrongShake 0.4s ease both";
    return "none";
  };

  return (
    <button
      disabled={disabled || loading}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={() => !disabled && !loading && onTap(option.wiki)}
      className="relative rounded-2xl overflow-hidden w-50 flex justify-center items-center"
      style={{

        cursor:      disabled || loading ? "default" : "pointer",
        display:     "block",
        borderRadius: 16,
        overflow:    "hidden",
        border:      getBorder(),
        boxShadow:   isCorrect
          ? "0 0 24px rgba(34,197,94,0.5)"
          : isWrong
            ? "0 0 16px rgba(239,68,68,0.4)"
            : pressed
              ? `0 0 16px ${color}50`
              : "0 4px 12px rgba(0,0,0,0.3)",
        transform:   pressed ? "scale(0.95)" : "scale(1)",
        transition:  "transform 0.1s ease, box-shadow 0.15s ease",
        animation:   getAnimation(),
        background:  "#0D1B2A",
        aspectRatio: "1",
      }}
    >
      {loading ? (
        <div className="w-full h-full flex items-center justify-center"
          style={{background:"rgba(255,255,255,0.03)"}}
        >
          <div style={{
            width:40, height:40, borderRadius:"50%",
            border:`3px solid ${color}`, borderTopColor:"transparent",
            animation:"spin 0.8s linear infinite",
          }}/>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={option.name}
          style={{
            objectFit:"contain",
            display:    "block",
            transform:  pressed ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.15s ease",
          }}
        />
      )}

      {/* Correct overlay */}
      {isCorrect && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{background:"rgba(34,197,94,0.3)", animation:"fadeIn 0.2s ease both"}}
        >
          <span style={{fontSize:36}}>✅</span>
        </div>
      )}

      {/* Wrong overlay */}
      {isWrong && (
        <div className="absolute inset-0 flex items-center justify-center"
          style={{background:"rgba(239,68,68,0.3)", animation:"fadeIn 0.2s ease both"}}
        >
          <span style={{fontSize:36}}>❌</span>
        </div>
      )}
    </button>
  );
}