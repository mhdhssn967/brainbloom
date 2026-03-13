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
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)",
    }}>
      <style>{`
        @keyframes resultPop {
          from { opacity:0; transform:scale(0.85); }
          to   { opacity:1; transform:scale(1);    }
        }
      `}</style>
      <div style={{
        background: "#0D1B2A",
        border: "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32, padding: "44px 52px",
        textAlign: "center", minWidth: 400,
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
        animation: "resultPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <div style={{ fontSize: 52, marginBottom: 10 }}>🦎</div>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 38, color: "#fff", marginBottom: 24,
          textShadow: winner !== null ? `0 0 30px ${TEAM_COLORS[winner]}60` : "none",
        }}>
          {winner !== null ? `${teams[winner]?.name} Wins!` : "It's a Draw!"}
        </div>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", marginBottom: 24 }}>
          {[0,1].map(id => {
            const color    = TEAM_COLORS[id];
            const isWinner = id === winner;
            return (
              <div key={id} style={{
                flex: 1, padding: "18px 20px", borderRadius: 20,
                background: isWinner ? `${color}20` : "rgba(255,255,255,0.04)",
                border: `2px solid ${isWinner ? color : "rgba(255,255,255,0.08)"}`,
              }}>
                {isWinner && <div style={{ fontSize: 22, marginBottom: 4 }}>🥇</div>}
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: 12, fontWeight: 900, color, marginBottom: 6 }}>
                  {teams[id]?.name}
                </div>
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize: 44, color: "#fff", lineHeight: 1,
                  textShadow: `0 0 20px ${color}60`,
                }}>
                  {players[id]?.score ?? 0}
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 800, marginTop: 3, letterSpacing: 1 }}>
                  POINTS · ROUND {(players[id]?.round ?? 0) + 1}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onPointerDown={(e) => { e.currentTarget.releasePointerCapture(e.pointerId); handleHome(); }}
          style={{
            all: "unset", cursor: "pointer",
            width: "100%", padding: "14px 0",
            borderRadius: 16, display: "block",
            background: "linear-gradient(135deg, #84cc16, #4d7c0f)",
            fontFamily: "'Lilita One', cursive",
            fontSize: 20, color: "#fff",
            textAlign: "center", letterSpacing: 1,
            boxShadow: "0 6px 20px rgba(132,204,22,0.4)",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}