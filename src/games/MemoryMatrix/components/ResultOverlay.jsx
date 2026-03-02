import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";

export default function ResultOverlay({ teams }) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);

  const sorted     = [...teams].sort((a, b) => b.score - a.score);
  const winner     = sorted[0].score !== sorted[1].score ? sorted[0] : null;

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.7)",
      backdropFilter: "blur(8px)",
      zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease both",
    }}>
      <div style={{
        background: "#1A1A2E",
        border: "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32,
        padding: "40px 52px",
        textAlign: "center",
        boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth: 420,
      }}>

        <div style={{ fontSize: 64, marginBottom: 12 }}>
          {winner ? "🏆" : "🤝"}
        </div>

        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 38, color: "#fff",
          letterSpacing: 1, marginBottom: 24,
        }}>
          {winner ? `${winner.name} Wins!` : "It's a Draw!"}
        </div>

        {/* Score cards */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {sorted.map((team, i) => (
            <div key={team.id} style={{
              flex: 1,
              padding: "16px 20px",
              borderRadius: 20,
              background: i === 0 && winner ? `${team.color}20` : "rgba(255,255,255,0.05)",
              border: `2px solid ${i === 0 && winner ? team.color : "rgba(255,255,255,0.08)"}`,
            }}>
              {i === 0 && winner && (
                <div style={{ fontSize: 20, marginBottom: 4 }}>🥇</div>
              )}
              <div style={{
                fontSize: 11, fontWeight: 900,
                color: team.color, letterSpacing: 1,
                marginBottom: 6,
              }}>
                {team.name}
              </div>
              <div style={{
                fontFamily: "'Lilita One', cursive",
                fontSize: 42, color: "#fff", lineHeight: 1,
              }}>
                {team.score}
              </div>
              <div style={{
                fontSize: 10, color: "rgba(255,255,255,0.3)",
                fontWeight: 700, marginTop: 4,
              }}>
                points
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleHome}
          style={{
            all: "unset", cursor: "pointer",
            width: "100%", padding: "16px 0",
            borderRadius: 16,
            background: "#F97316",
            fontFamily: "'Lilita One', cursive",
            fontSize: 22, color: "#fff",
            letterSpacing: 1,
            textAlign: "center",
            boxShadow: "0 6px 20px rgba(249,115,22,0.4)",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}