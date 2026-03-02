export default function RoundDisplay({ round, total, phase, remaining }) {
  const phaseLabel = {
    show:   "👀 Memorise!",
    recall: "👆 Tap Now!",
    result: "✅ Result",
    done:   "🏁 Done",
  }[phase] ?? "";

  const phaseColor = {
    show:   "#60A5FA",
    recall: "#FBBF24",
    result: "#22C55E",
    done:   "#A78BFA",
  }[phase] ?? "#fff";

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingTop: 10,
      gap: 6,
    }}>

      {/* Round counter — top, smaller */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <span style={{
          fontSize: 13,
          fontWeight: 900,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: 2,
        }}>
          ROUND
        </span>
        <span style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 22,
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1,
        }}>
          {round}
          <span style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: 16,
          }}>
            /{total}
          </span>
        </span>
      </div>

      {/* Phase label — big, below round */}
      <div style={{
        fontFamily: "'Lilita One', cursive",
        fontSize: 38,
        color: phaseColor,
        letterSpacing: 2,
        lineHeight: 1,
        textShadow: `0 0 24px ${phaseColor}70`,
        transition: "color 0.3s ease, text-shadow 0.3s ease",
      }}>
        {phaseLabel}
      </div>

      {/* Timer — only during recall */}
      {phase === "recall" && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64, height: 64,
          borderRadius: "50%",
          border: `5px solid ${remaining <= 2 ? "#EF4444" : "#FBBF24"}`,
          boxShadow: `0 0 24px ${remaining <= 2 ? "#EF444460" : "#FBBF2460"}`,
          background: `${remaining <= 2 ? "#EF4444" : "#FBBF24"}15`,
          animation: remaining <= 2 ? "timerTick 0.5s ease-in-out infinite" : "none",
          transition: "border-color 0.3s ease",
          marginTop: 4,
        }}>
          <span style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 26, fontWeight: 900,
            color: remaining <= 2 ? "#EF4444" : "#FBBF24",
          }}>
            {remaining}
          </span>
        </div>
      )}

    </div>
  );
}