const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function HealthBar({ player, team, maxHealth = 100 }) {
  const pct      = Math.max(0, (player.health / maxHealth) * 100);
  const color    = TEAM_COLORS[player.id];
  const barColor =
    pct > 60 ? "#22C55E" :
    pct > 30 ? "#F59E0B" : "#EF4444";

  return (
    <div className="flex flex-col gap-1 w-full px-3 pt-2 pb-1">

      {/* Team name + heart */}
      <div className="flex items-center justify-between">
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      15,
          color,
          letterSpacing: 1,
          textShadow:    `0 0 12px ${color}60`,
        }}>
          {team?.name}
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              style={{
                fontSize:   14,
                opacity:    i < Math.ceil(pct / 20) ? 1 : 0.2,
                transition: "opacity 0.3s ease",
                filter:     i < Math.ceil(pct / 20)
                  ? "drop-shadow(0 0 4px #EF4444)"
                  : "none",
              }}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* Bar track */}
      <div style={{
        height:       12,
        borderRadius: 99,
        background:   "rgba(0,0,0,0.5)",
        border:       "1.5px solid rgba(255,255,255,0.1)",
        overflow:     "hidden",
        position:     "relative",
      }}>
        {/* Fill */}
        <div style={{
          height:       "100%",
          width:        `${pct}%`,
          background:   `linear-gradient(90deg, ${barColor}cc, ${barColor})`,
          borderRadius: 99,
          transition:   "width 0.3s ease, background 0.5s ease",
          boxShadow:    `0 0 8px ${barColor}80`,
          position:     "relative",
        }}>
          {/* Shine */}
          <div style={{
            position:   "absolute",
            top:        0, left: 0,
            right:      0, height: "40%",
            background: "rgba(255,255,255,0.2)",
            borderRadius: 99,
          }}/>
        </div>

        {/* Segment ticks */}
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{
            position:   "absolute",
            top:        0, bottom: 0,
            left:       `${(i + 1) * 20}%`,
            width:      1,
            background: "rgba(0,0,0,0.4)",
          }}/>
        ))}
      </div>

      {/* Health number */}
      <div style={{
        fontSize:   10,
        color:      "rgba(255,255,255,0.4)",
        fontWeight: 800,
        textAlign:  "right",
        letterSpacing: 0.5,
      }}>
        {player.health} / {maxHealth}
      </div>
    </div>
  );
}