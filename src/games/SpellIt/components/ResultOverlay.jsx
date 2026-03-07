import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import { SPELL_IT_DATA } from "@/data/spellItData";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ResultOverlay({ collection, teams }) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);

  const left  = collection[0] ?? [];
  const right = collection[1] ?? [];

  const winnerId =
    left.length > right.length  ? 0  :
    right.length > left.length  ? 1  : null;

  const winningTeam = winnerId !== null ? teams[winnerId] : null;

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{background:"rgba(0,0,0,0.8)", backdropFilter:"blur(10px)"}}
    >
      <div style={{
        background:   "#0D1B2A",
        border:       "2px solid rgba(255,255,255,0.1)",
        borderRadius: 32,
        padding:      "44px 52px",
        textAlign:    "center",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.5)",
        animation:    "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth:     520,
        maxWidth:     680,
      }}>

        <div style={{fontSize:64, marginBottom:12}}>
          {winningTeam ? "🏆" : "🤝"}
        </div>

        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      42, color:"#fff",
          letterSpacing: 1, marginBottom:28,
          textShadow:    winningTeam
            ? `0 0 30px ${TEAM_COLORS[winnerId]}60`
            : "none",
        }}>
          {winningTeam
            ? `${winningTeam.name} Wins!`
            : "It's a Draw!"}
        </div>

        {/* Both collections */}
        <div className="flex gap-6 justify-center mb-8">
          {teams.map(team => {
            const col     = collection[team.id] ?? [];
            const color   = TEAM_COLORS[team.id];
            const isWinner = team.id === winnerId;

            return (
              <div key={team.id} style={{
                flex:         1,
                padding:      "16px",
                borderRadius: 20,
                background:   isWinner ? `${color}15` : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isWinner ? color : "rgba(255,255,255,0.08)"}`,
              }}>
                {isWinner && (
                  <div style={{fontSize:22, marginBottom:6}}>🥇</div>
                )}
                <div style={{
                  fontFamily:    "'Baloo 2', cursive",
                  fontSize:      14, fontWeight:900,
                  color, letterSpacing:1, marginBottom:10,
                }}>
                  {team.name}
                </div>
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize:   40, color:"#fff", lineHeight:1,
                  marginBottom: 4,
                }}>
                  {col.length}
                </div>
                <div style={{
                  fontSize:10, color:"rgba(255,255,255,0.3)",
                  fontWeight:800, marginBottom:12,
                }}>
                  collected
                </div>

                {/* Mini collection preview */}
                <div className="flex flex-wrap gap-1 justify-center">
                  {col.map((item, i) => (
                    <img
                      key={i}
                     src={(() => {
  const folder = SPELL_IT_DATA[item.category]?.folder ?? item.category;
  return `/assets/spellit/${folder}/${item.file}`;
})()}
                      alt={item.name}
                      title={item.name}
                      style={{
                        width:32, height:32,
                        objectFit:"contain",
                        background:`${color}15`,
                        borderRadius:8,
                        padding:2,
                      }}
                    />
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
            background:    "linear-gradient(135deg, #FACC15, #F59E0B)",
            fontFamily:    "'Lilita One', cursive",
            fontSize:      22, color:"#78350F",
            border:        "none", letterSpacing:1,
            boxShadow:     "0 6px 24px rgba(250,204,21,0.35)",marginTop:'20px',padding:'20px 10px'
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}