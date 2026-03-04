// Center panel — shows the name to find + timer

export default function QuestionDisplay({ round, remaining, phase, roundIndex, total }) {
  const timerColor =
    remaining > 6 ? "#22C55E" :
    remaining > 3 ? "#F97316" : "#EF4444";

  const isUrgent = remaining <= 3;

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full"
      style={{ padding: "0 8px" }}
    >
      {/* Round counter */}
      <div style={{
        fontSize:      12,
        fontWeight:    900,
        color:         "rgba(255,255,255,0.3)",
        letterSpacing: 2,
      }}>
        ROUND {roundIndex + 1} / {total}
      </div>

      {/* FIND label */}
      <div style={{
        fontSize:      11,
        fontWeight:    900,
        color:         "rgba(255,255,255,0.4)",
        letterSpacing: 3,
        textTransform: "uppercase",
      }}>
        Find
      </div>

      {/* The name to find — BIG */}
      <div
        key={round?.id}
        style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      clampFontSize(round?.correctName ?? ""),
          color:         "#fff",
          textAlign:     "center",
          lineHeight:    1.1,
          letterSpacing: 1,
          textShadow:    "0 4px 24px rgba(0,0,0,0.5)",
          animation:     "questionPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
          wordBreak:     "break-word",
          padding:       "0 4px",
        }}
      >
        {round?.correctName ?? ""}
      </div>

      {/* Timer */}
      {phase === "playing" && (
        <div style={{
          width:        64, height: 64,
          borderRadius: "50%",
          border:       `5px solid ${timerColor}`,
          boxShadow:    `0 0 24px ${timerColor}60`,
          background:   `${timerColor}15`,
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
          animation:    isUrgent ? "timerTick 0.5s ease-in-out infinite" : "none",
          transition:   "border-color 0.3s ease",
        }}>
          <span style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize:   26, fontWeight: 900,
            color:      timerColor,
          }}>
            {remaining}
          </span>
        </div>
      )}

      {/* Result phase label */}
      {phase === "result" && (
        <div style={{
          fontFamily:    "'Baloo 2', cursive",
          fontSize:      18,
          fontWeight:    900,
          color:         "#22C55E",
          letterSpacing: 1,
          animation:     "fadeIn 0.2s ease both",
        }}>
          ✓ Next up...
        </div>
      )}

    </div>
  );
}

// Scale font size down for long names
function clampFontSize(name) {
  if (name.length <= 10) return 48;
  if (name.length <= 18) return 36;
  return 28;
}