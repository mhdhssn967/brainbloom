// src/games/BalloonBattle/components/QuestionDisplay.jsx

export default function QuestionDisplay({ question, remaining }) {
  if (!question) return null;

  const timerColor =
    remaining > 10 ? "#22C55E" :
    remaining > 5  ? "#F97316" : "#EF4444";

  const isUrgent = remaining <= 5;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
    }}>

      {/* Expression */}
      <div style={{
        fontFamily: "'Lilita One', cursive",
        fontSize: 64,
        color: "#fff",
        letterSpacing: 3,
        lineHeight: 1,
        textAlign: "center",
        textShadow: "0 4px 20px rgba(0,0,0,0.5)",
        whiteSpace: "nowrap",
      }}>
        {question.expression}
      </div>

      {/* = ? */}
      <div style={{
        fontFamily: "'Lilita One', cursive",
        fontSize: 44,
        color: "rgba(255,255,255,0.5)",
        letterSpacing: 2,
        lineHeight: 1,
        marginTop: -8,
      }}>
        = ?
      </div>

      {/* Timer */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 72, height: 72,
        borderRadius: "50%",
        border: `5px solid ${timerColor}`,
        boxShadow: `0 0 24px ${timerColor}60`,
        background: `${timerColor}18`,
        animation: isUrgent ? "timerTick 0.5s ease-in-out infinite" : "none",
        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
        marginTop: 4,
      }}>
        <span style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 30, fontWeight: 900,
          color: timerColor,
          lineHeight: 1,
          transition: "color 0.3s ease",
        }}>
          {remaining}
        </span>
      </div>

    </div>
  );
}