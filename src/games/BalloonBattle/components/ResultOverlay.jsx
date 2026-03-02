import { useNavigate }    from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }   from "@/store/teamStore";

export default function ResultOverlay({ winner, balloons, teams }) {
    console.log(balloons, teams)
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);

  const winningTeam = balloons[0] > balloons[1] ? 0 : 1;
  

  function handlePlayAgain() {
    resetTeams();
    navigate("/");
  }

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(6px)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "fadeIn 0.3s ease both",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 32,
        padding: "40px 48px",
        textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth: 380,
      }}>

        {/* Result emoji */}
        <div style={{ fontSize: 64, marginBottom: 12 }}>
          {winningTeam ? "🏆" : "🤝"}
        </div>

        {/* Winner text */}
        <div
  style={{
    fontFamily: "'Lilita One', cursive",
    fontSize: 36,
    color: `${teams[winningTeam].color}`,
    letterSpacing: 1,
    marginBottom: 6,
  }}
>
  {winningTeam !== null
    ? `${teams[winningTeam].name} Wins!`
    : "It's a Draw!"}
</div>

        {/* Scores */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 24,
          margin: "20px 0 28px",
        }}>
          {teams.map(team => (
            <div key={team.id} style={{
              padding: "12px 20px",
              borderRadius: 16,
              background: team.id === winner ? `${team.color}15` : "#F9FAFB",
              border: `2px solid ${team.id === winner ? team.color : "#E5E7EB"}`,
              minWidth: 110,
            }}>
              <div style={{
                fontSize: 50, fontWeight: 900,
                color: team.color, letterSpacing: 0.8,
                marginBottom: 4,
              }}>
                {team.name}
              </div>
              <div style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: 130, fontWeight: 900, color: "#111",
                lineHeight: 1,
              }}>
                {balloons[team.id]}
              </div>
              <div style={{
                fontSize: 50, color: "#aaa",
                fontWeight: 700, marginTop: 2,
              }}>
                balloons left
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handlePlayAgain}
            style={{
              all: "unset", cursor: "pointer",
              flex: 1, padding: "14px 0",
              borderRadius: 14,
              background: "#F3F4F6",
              fontFamily: "'Baloo 2', cursive",
              fontSize: 16, fontWeight: 800,
              color: "#555", textAlign: "center",
            }}
          >
            Home
          </button>
          <button
            onClick={handleHome}
            style={{
              all: "unset", cursor: "pointer",
              flex: 1, padding: "14px 0",
              borderRadius: 14,
              background: "#F97316",
              fontFamily: "'Lilita One', cursive",
              fontSize: 18, color: "#fff",
              textAlign: "center",
              boxShadow: "0 4px 16px rgba(249,115,22,0.4)",
              letterSpacing: 0.5,
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}