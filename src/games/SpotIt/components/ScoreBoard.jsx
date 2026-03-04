// Shows team name, score, and floating +10 / -5 animations

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ScoreBoard({ team, score, floats, side }) {
  const color = TEAM_COLORS[team?.id ?? 0];

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-4 px-6">

      {/* Floating score animations */}
      {floats
        .filter(f => f.teamId === team?.id)
        .map(f => (
          <FloatLabel key={f.id} points={f.points} />
        ))
      }

      {/* Team name */}
      <div style={{
        fontFamily:    "'Lilita One', cursive",
        fontSize:      40,
        color:         color,
        letterSpacing: 2,
        lineHeight:    1,
        textShadow:    `0 0 24px ${color}60, 2px 2px 0 rgba(0,0,0,0.4)`,
        textAlign:     "center",
      }}>
        {team?.name ?? "Team"}
      </div>

      {/* Score card */}
      <div style={{
        background:   `${color}18`,
        border:       `2.5px solid ${color}50`,
        borderRadius: 24,
        padding:      "16px 36px",
        textAlign:    "center",
        boxShadow:    `0 8px 32px ${color}25`,
        minWidth:     140,
      }}>
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      72,
          color:         "#fff",
          lineHeight:    1,
          textShadow:    `0 0 40px ${color}80, 0 4px 0 rgba(0,0,0,0.3)`,
        }}>
          {score}
        </div>
        <div style={{
          fontSize:      11,
          fontWeight:    900,
          color:         color,
          letterSpacing: 3,
          marginTop:     4,
        }}>
          POINTS
        </div>
      </div>

    </div>
  );
}

// Floating +10 / -5 label
function FloatLabel({ points }) {
  const isPositive = points > 0;
  const color      = isPositive ? "#22C55E" : "#EF4444";
  const label      = isPositive ? `+${points}` : `${points}`;

  return (
    <div style={{
      position:      "absolute",
      top:           "30%",
      left:          "50%",
      transform:     "translateX(-50%)",
      fontFamily:    "'Lilita One', cursive",
      fontSize:      48,
      color,
      letterSpacing: 2,
      textShadow:    `0 0 20px ${color}80`,
      pointerEvents: "none",
      zIndex:        100,
      animation:     "floatUp 2s ease-out forwards",
    }}>
      {label}
    </div>
  );
}