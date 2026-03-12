import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ResultOverlay({ teams, winner, players }) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);

  function handleHome() { resetSession(); resetTeams(); navigate("/"); }

  return (
    <div style={{
      position:       "fixed", inset: 0, zIndex: 50,
      display:        "flex", alignItems: "center", justifyContent: "center",
      background:     "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
    }}>
      <style>{`
        @keyframes resultPop {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1);    }
        }
      `}</style>
      <div style={{
        background:   "#0D1B2A",
        border:       "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32, padding: "48px 56px",
        textAlign:    "center", minWidth: 420,
        boxShadow:    "0 40px 80px rgba(0,0,0,0.6)",
        animation:    "resultPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🌿</div>
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      40, color: "#fff", marginBottom: 28,
          textShadow:    winner !== null ? `0 0 30px ${TEAM_COLORS[winner]}60` : "none",
        }}>
          {winner !== null ? `${teams[winner]?.name} Wins!` : "It's a Draw!"}
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 28 }}>
          {[0, 1].map(id => {
            const color    = TEAM_COLORS[id];
            const isWinner = id === winner;
            return (
              <div key={id} style={{
                flex:         1, padding: "20px 24px", borderRadius: 20,
                background:   isWinner ? `${color}20` : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isWinner ? color : "rgba(255,255,255,0.08)"}`,
              }}>
                {isWinner && <div style={{ fontSize: 24, marginBottom: 6 }}>🥇</div>}
                <div style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: 13, fontWeight: 900, color, marginBottom: 8,
                }}>
                  {teams[id]?.name}
                </div>
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize: 48, color: "#fff", lineHeight: 1,
                  textShadow: `0 0 20px ${color}60`,
                }}>
                  {players[id]?.score ?? 0}
                </div>
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.3)",
                  fontWeight: 800, marginTop: 4, letterSpacing: 1,
                }}>
                  POINTS · ROUND {players[id]?.round ?? 1}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onPointerDown={(e) => {
            e.currentTarget.releasePointerCapture(e.pointerId);
            handleHome();
          }}
          style={{
            all:        "unset", cursor: "pointer",
            width:      "100%", padding: "16px 0",
            borderRadius: 18, display: "block",
            background: "linear-gradient(135deg, #52b788, #2d6a4f)",
            fontFamily: "'Lilita One', cursive",
            fontSize:   22, color: "#fff",
            textAlign:  "center", letterSpacing: 1,
            boxShadow:  "0 6px 24px rgba(82,183,136,0.4)",
          }}
        >
          Back to Home 🏠
        </button>
      </div>
    </div>
  );
}