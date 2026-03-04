import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import { getWinner }       from "../engine";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ResultOverlay({ scores, teams }) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);
  const winnerId     = getWinner(scores);
  const winningTeam  = winnerId !== null ? teams[winnerId] : null;

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background:     "rgba(0,0,0,0.8)",
        backdropFilter: "blur(10px)",
        animation:      "fadeIn 0.3s ease both",
      }}
    >
      <div style={{
        background:   "#0D1B2A",
        border:       "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32,
        padding:      "48px 60px",
        textAlign:    "center",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.5)",
        animation:    "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth:     460,
      }}>

        <div style={{ fontSize: 72, marginBottom: 16 }}>
          {winningTeam ? "🏆" : "🤝"}
        </div>

        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      44,
          color:         "#fff",
          letterSpacing: 1,
          marginBottom:  32,
          textShadow:    winningTeam
            ? `0 0 30px ${TEAM_COLORS[winnerId]}60`
            : "none",
        }}>
          {winningTeam ? `${winningTeam.name} Wins!` : "It's a Draw!"}
        </div>

        {/* Score cards */}
        <div className="flex gap-4 justify-center mb-10">
          {teams.map(team => {
            const color    = TEAM_COLORS[team.id];
            const isWinner = team.id === winnerId;
            return (
              <div key={team.id} style={{
                flex:         1,
                padding:      "20px 28px",
                borderRadius: 24,
                background:   isWinner ? `${color}20` : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isWinner ? color : "rgba(255,255,255,0.08)"}`,
                boxShadow:    isWinner ? `0 8px 32px ${color}25` : "none",
              }}>
                {isWinner && (
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🥇</div>
                )}
                <div style={{
                  fontSize:      11,
                  fontWeight:    900,
                  color,
                  letterSpacing: 1,
                  marginBottom:  8,
                }}>
                  {team.name}
                </div>
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize:   56,
                  color:      "#fff",
                  lineHeight: 1,
                  textShadow: `0 0 20px ${color}60`,
                }}>
                  {scores[team.id] ?? 0}
                </div>
                <div style={{
                  fontSize:   10,
                  color:      "rgba(255,255,255,0.3)",
                  fontWeight: 800,
                  marginTop:  6,
                }}>
                  points
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleHome}
          className="w-full py-4 rounded-2xl text-white cursor-pointer"
          style={{
            background:  "#F97316",
            fontFamily:  "'Lilita One', cursive",
            fontSize:    24,
            letterSpacing: 1,
            border:      "none",
            boxShadow:   "0 6px 24px rgba(249,115,22,0.45)",padding:"10px 20px",marginTop:'20px'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}