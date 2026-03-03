// Side panel showing team name, score, and whose turn it is
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function TeamPanel({
  team,
  score,
  isActive,
  side,          // "left" | "right"
}) {
  const color = TEAM_COLORS[team?.id ?? 0];

  const prevScore = useRef(score);

  useEffect(() => {
    if (score > prevScore.current) {
      Swal.fire({
  html: `
    <div style="
      font-family: 'Lilita One', cursive;
      font-size: 48px;
      color: ${color};
      text-shadow: 0 0 30px ${color};
    ">
      +${score - prevScore.current}
    </div>
    <div style="
      font-size: 18px;
      margin-top: 8px;
      letter-spacing: 2px;
    ">
      CORRECT!
    </div>
  `,
  timer: 1000,
  showConfirmButton: false,
  background: "transparent",
  backdrop: "rgba(0,0,0,0.7)",
  customClass: {
    popup: "border-none shadow-none"
  }
});
    }

    prevScore.current = score;
  }, [score]);

  return (
    <div className={`
      flex flex-col items-center justify-center gap-3
      h-full px-6 py-8 relative overflow-hidden
    `}>

      {/* Active glow background */}
      {isActive && (
        <div style={{
          position:     "absolute",
          inset:        0,
          background:   `radial-gradient(ellipse at center, ${color}15 0%, transparent 70%)`,
          pointerEvents: "none",
          animation:    "pulseGlow 2s ease-in-out infinite",
        }} />
      )}

      {/* Active indicator */}
      {isActive && (
        <div style={{
          background:   color,
          borderRadius: 99,
          padding:      "4px 14px",
          fontSize:     11,
          fontWeight:   900,
          color:        "#fff",
          letterSpacing: 1.5,
          boxShadow:    `0 4px 12px ${color}50`,
          animation:    "pulseGlow 1.5s ease-in-out infinite",
        }}>
          YOUR TURN
        </div>
      )}

      {/* Team name */}
      <div style={{
        fontFamily:    "'Lilita One', cursive",
        fontSize:      38,
        color:         isActive ? color : "rgba(255,255,255,0.3)",
        letterSpacing: 2,
        textShadow:    isActive ? `0 0 24px ${color}60` : "none",
        transition:    "color 0.3s ease",
        lineHeight:    1,
      }}>
        {team?.name ?? "Team"}
      </div>

      {/* Score */}
      <div style={{
        background:   isActive ? `${color}20` : "rgba(255,255,255,0.05)",
        border:       `2px solid ${isActive ? color : "rgba(255,255,255,0.08)"}`,
        borderRadius: 20,
        padding:      "12px 32px",
        textAlign:    "center",
        transition:   "all 0.3s ease",
        boxShadow:    isActive ? `0 8px 24px ${color}25` : "none",
      }}>
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      64,
          color:         "#fff",
          lineHeight:    1,
          textShadow:    isActive ? `0 0 30px ${color}80` : "none",
        }}>
          {score}
        </div>
        <div style={{
          fontSize:   10,
          color:      color,
          fontWeight: 900,
          letterSpacing: 2,
          marginTop:  2,
        }}>
          POINTS
        </div>
      </div>

    </div>
  );
}