// Cute yellow keyboard — child friendly
// Each key is a rounded yellow button
// Used-correct keys turn green, used keys show feedback

import { KEYBOARD_ROWS } from "../constants";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function Keyboard({ teamId, onKey, disabled, filled, slots, blanks }) {
  const color = TEAM_COLORS[teamId];

  // Which letters have been correctly placed by this team
  const correctLetters = new Set(
    Object.values(filled).map(l => l.toUpperCase())
  );

  return (
    <div className="flex flex-col items-center gap-2 pb-3 pt-2 w-full" style={{marginBottom:'40px',marginTop:'20px'}}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {row.map(letter => (
            <Key
              key={letter}
              letter={letter}
              onKey={onKey}
              disabled={disabled}
              isCorrect={correctLetters.has(letter)}
              teamColor={color}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function Key({ letter, onKey, disabled, isCorrect, teamColor }) {
  return (
    <button
      onClick={() => !disabled && onKey(letter)}
      disabled={disabled}
      style={{
        all:           "unset",
        cursor:        disabled ? "default" : "pointer",
        width:         40,
        height:        44,
        borderRadius:  10,
        background:    isCorrect
          ? "linear-gradient(180deg, #4ADE80, #16A34A)"
          : "linear-gradient(180deg, #FDE68A, #F59E0B)",
        border:        isCorrect
          ? "2px solid #15803D"
          : "2px solid #D97706",
        boxShadow:     isCorrect
          ? "0 4px 0 #15803D, 0 6px 12px rgba(34,197,94,0.3)"
          : "0 4px 0 #B45309, 0 6px 12px rgba(245,158,11,0.2)",
        display:       "flex",
        alignItems:    "center",
        justifyContent: "center",
        fontFamily:    "'Baloo 2', cursive",
        fontSize:      18,
        fontWeight:    900,
        color:         isCorrect ? "#fff" : "#78350F",
        transform:     "translateY(0)",
        transition:    "all 0.08s ease",
        userSelect:    "none",
        WebkitUserSelect: "none",
        touchAction:   "manipulation",
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform   = "translateY(3px)";
        e.currentTarget.style.boxShadow   = isCorrect
          ? "0 1px 0 #15803D"
          : "0 1px 0 #B45309";
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform   = "translateY(0)";
        e.currentTarget.style.boxShadow   = isCorrect
          ? "0 4px 0 #15803D, 0 6px 12px rgba(34,197,94,0.3)"
          : "0 4px 0 #B45309, 0 6px 12px rgba(245,158,11,0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform   = "translateY(0)";
        e.currentTarget.style.boxShadow   = isCorrect
          ? "0 4px 0 #15803D, 0 6px 12px rgba(34,197,94,0.3)"
          : "0 4px 0 #B45309, 0 6px 12px rgba(245,158,11,0.2)";
      }}
      onTouchStart={e => {
        e.currentTarget.style.transform   = "translateY(3px)";
      }}
      onTouchEnd={e => {
        e.currentTarget.style.transform   = "translateY(0)";
        if (!disabled) onKey(letter);
      }}
    >
      {letter}
    </button>
  );
}