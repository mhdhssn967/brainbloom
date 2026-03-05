import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import { getWinner }       from "../engine";
import { TEAM_COLORS }     from "../constants";

export default function ResultOverlay({ scores, teams, frogCount }) {
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
      style={{background:"rgba(0,0,0,0.85)", backdropFilter:"blur(10px)"}}
    >
      <div style={{
        background:   "#0D1B2A",
        border:       "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32,
        padding:      "48px 60px",
        textAlign:    "center",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.5)",
        animation:    "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth:     480,
      }}>

        <div style={{
          fontSize:72, marginBottom:16,
          animation:"frogBounce 0.8s ease-in-out infinite",
          display:"inline-block",
        }}>
          {winningTeam ? "🏆" : "🤝"}
        </div>

        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      44, color:"#fff",
          letterSpacing: 1, marginBottom:32,
          textShadow:    winningTeam
            ? `0 0 30px ${TEAM_COLORS[winnerId].hex}60`
            : "none",
        }}>
          {winningTeam ? `${winningTeam.name} Wins!` : "It's a Draw!"}
        </div>

        {/* Score cards */}
        <div className="flex gap-6 justify-center mb-10">
          {teams.map(team => {
            const tc       = TEAM_COLORS[team.id];
            const isWinner = team.id === winnerId;
            const caught   = scores[team.id] ?? 0;

            return (
              <div key={team.id} style={{
                flex:         1,
                padding:      "24px 28px",
                borderRadius: 24,
                background:   isWinner ? `${tc.hex}20` : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isWinner ? tc.hex : "rgba(255,255,255,0.08)"}`,
                boxShadow:    isWinner ? `0 8px 32px ${tc.hex}25` : "none",
              }}>
                {isWinner && (
                  <div style={{fontSize:28, marginBottom:8}}>🥇</div>
                )}
                <div style={{
                  fontFamily:    "'Baloo 2', cursive",
                  fontSize:      14, fontWeight:900,
                  color:         tc.hex, letterSpacing:1,
                  marginBottom:  8,
                }}>
                  {team.name}
                </div>

                {/* Frog count */}
                <div className="flex items-center justify-center gap-2">
                  <span style={{fontSize:36}}>🐸</span>
                  <span style={{
                    fontFamily: "'Lilita One', cursive",
                    fontSize:   56, color:"#fff", lineHeight:1,
                    textShadow: `0 0 20px ${tc.hex}60`,
                  }}>
                    {caught}
                  </span>
                </div>
                <div style={{
                  fontSize:10, color:"rgba(255,255,255,0.3)",
                  fontWeight:800, marginTop:4,
                }}>
                  frogs caught
                </div>

                {/* Frog emojis */}
                <div className="flex flex-wrap gap-1 justify-center mt-3"
                  style={{maxWidth:140}}
                >
                  {Array.from({length: caught}, (_, i) => (
                    <span key={i} style={{fontSize:16}}>🐸</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleHome}
          className="w-full py-4 rounded-2xl cursor-pointer"
          style={{
            background:    "linear-gradient(135deg, #22C55E, #16A34A)",
            fontFamily:    "'Lilita One', cursive",
            fontSize:      24, color:"#fff",
            border:        "none", letterSpacing:1,
            boxShadow:     "0 6px 24px rgba(34,197,94,0.4)",padding:"20px 10px",marginTop:'10px'
          }}
        >
          Back to Home 
        </button>
      </div>

      <style>{`
        @keyframes modalPop {
          from{opacity:0;transform:scale(0.9) translateY(16px)}
          to  {opacity:1;transform:scale(1)   translateY(0)}
        }
        @keyframes frogBounce {
          0%,100%{transform:translateY(0)}
          50%    {transform:translateY(-10px)}
        }
      `}</style>
    </div>
  );
}