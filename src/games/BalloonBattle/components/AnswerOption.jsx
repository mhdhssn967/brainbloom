// src/games/BalloonBattle/components/AnswerOption.jsx
import { useState } from "react";

export default function AnswerOption({
  option,
  onSelect,
  disabled,
  side,
  accentColor,
}) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onClick={() => !disabled && onSelect(option)}
      style={{width:'150px',height:'150px',
        all: "unset",
        cursor: disabled ? "not-allowed" : "pointer",
        // width: "100%",
        borderRadius: 20,
        background: pressed
          ? `${accentColor}40`
          : `${accentColor}18`,
        border: `3px solid ${pressed ? accentColor : accentColor + "50"}`,
        boxShadow: pressed
          ? `0 0 0 4px ${accentColor}30, inset 0 2px 0 rgba(255,255,255,0.1)`
          : `0 4px 16px rgba(0,0,0,0.2)`,
        transform: pressed ? "scale(0.97)" : "scale(1)",
        transition: "all 0.1s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <span style={{
        fontFamily: "'Lilita One', cursive",
        fontSize: 84,
        color: "#fff",
        letterSpacing: 1,
        lineHeight: 1,
        textShadow: `0 2px 8px rgba(0,0,0,0.4), 0 0 20px ${accentColor}60`,
      }}>
        {option}
      </span>
    </button>
  );
}