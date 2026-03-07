import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ResultOverlay({
  players, teams, winner,
  gameType, playerCount,
}) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);

  const winningTeam = winner !== null && playerCount > 1
    ? teams[winner]
    : null;

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
    >
      <div style={{
        background:   "#0D1B2A",
        border:       "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32,
        padding:      "48px 56px",
        textAlign:    "center",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.6)",
        animation:    "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth:     460,
      }}>
        <style>{`
          @keyframes modalPop {
            from{opacity:0;transform:scale(0.85) translateY(20px)}
            to  {opacity:1;transform:scale(1)    translateY(0)}
          }
          @keyframes zombieBob {
            0%,100%{transform:translateY(0)}
            50%    {transform:translateY(-10px)}
          }
        `}</style>

        <div style={{
          fontSize: 64, marginBottom: 12,
          animation: "zombieBob 1s ease-in-out infinite",
          display: "inline-block",
        }}>
          {playerCount === 1 ? "💀" : winningTeam ? "🏆" : "🤝"}
        </div>

        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      42, color: "#fff",
          letterSpacing: 1, marginBottom: 28,
          textShadow:    winningTeam
            ? `0 0 30px ${TEAM_COLORS[winner]}60`
            : "0 0 20px rgba(239,68,68,0.4)",
        }}>
          {playerCount === 1
            ? "Game Over!"
            : winningTeam
              ? `${winningTeam.name} Wins!`
              : "It's a Draw!"}
        </div>

        {/* Score cards */}
        <div className="flex gap-4 justify-center mb-8">
          {players.map(player => {
            const tc       = TEAM_COLORS[player.id];
            const team     = teams[player.id];
            const isWinner = player.id === winner;

            return (
              <div key={player.id} style={{
                flex:         1,
                padding:      "20px 24px",
                borderRadius: 20,
                background:   isWinner
                  ? `${tc}20`
                  : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isWinner
                  ? tc
                  : "rgba(255,255,255,0.08)"}`,
                boxShadow:    isWinner
                  ? `0 8px 32px ${tc}25`
                  : "none",
              }}>
                {isWinner && playerCount > 1 && (
                  <div style={{ fontSize: 24, marginBottom: 6 }}>🥇</div>
                )}
                {playerCount > 1 && (
                  <div style={{
                    fontFamily:    "'Baloo 2', cursive",
                    fontSize:      13, fontWeight: 900,
                    color:         tc, letterSpacing: 1,
                    marginBottom:  8,
                  }}>
                    {team?.name}
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  <span style={{ fontSize: 28 }}>🧟</span>
                  <span style={{
                    fontFamily: "'Lilita One', cursive",
                    fontSize:   52, color: "#fff", lineHeight: 1,
                    textShadow: `0 0 20px ${tc}60`,
                  }}>
                    {player.score}
                  </span>
                </div>
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.3)",
                  fontWeight: 800, marginTop: 4,
                }}>
                  zombies killed
                </div>
                <div style={{
                  marginTop:    8,
                  fontSize:     11,
                  color:        player.health > 0 ? "#22C55E" : "#EF4444",
                  fontWeight:   900,
                }}>
                  {player.health > 0
                    ? `❤️ ${player.health} HP remaining`
                    : "💀 Eliminated"}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleHome}
          className="w-full py-4 rounded-2xl cursor-pointer"
          style={{
            background:    "linear-gradient(135deg, #EF4444, #DC2626)",
            fontFamily:    "'Lilita One', cursive",
            fontSize:      22, color: "#fff",
            border:        "none", letterSpacing: 1,
            boxShadow:     "0 6px 24px rgba(239,68,68,0.4)",padding:'10px 20px',marginTop:'10px'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}