import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function ResultOverlay({ teams, winner, players }) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);

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
        borderRadius: 32, padding: "48px 56px",
        textAlign:    "center",
        boxShadow:    "0 40px 80px rgba(0,0,0,0.6)",
        animation:    "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        minWidth:     460,
      }}>
        <style>{`
          @keyframes modalPop {
            from{opacity:0;transform:scale(0.85)}
            to  {opacity:1;transform:scale(1)}
          }
        `}</style>

        <div style={{ fontSize: 64, marginBottom: 12 }}>🧠</div>

        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      42, color: "#fff",
          letterSpacing: 1, marginBottom: 28,
          textShadow:    winner !== null
            ? `0 0 30px ${TEAM_COLORS[winner]}60`
            : "none",
        }}>
          {winner !== null
            ? `${teams[winner]?.name} Wins!`
            : "It's a Draw!"}
        </div>

        {/* Score cards */}
        <div className="flex gap-4 justify-center mb-8">
          {[0, 1].map(id => {
            const color     = TEAM_COLORS[id];
            const isWinner  = id === winner;
            const p         = players[id];

            return (
              <div key={id} style={{
                flex:         1,
                padding:      "20px 24px",
                borderRadius: 20,
                background:   isWinner ? `${color}20` : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isWinner ? color : "rgba(255,255,255,0.08)"}`,
                boxShadow:    isWinner ? `0 8px 32px ${color}25` : "none",
              }}>
                {isWinner && <div style={{ fontSize: 24, marginBottom: 6 }}>🥇</div>}
                <div style={{
                  fontFamily:    "'Baloo 2', cursive",
                  fontSize:      13, fontWeight: 900,
                  color, letterSpacing: 1, marginBottom: 8,
                }}>
                  {teams[id]?.name}
                </div>
                <div style={{
                  fontFamily:    "'Lilita One', cursive",
                  fontSize:      48, color: "#fff", lineHeight: 1,
                  textShadow:    `0 0 20px ${color}60`,
                }}>
                  {p?.level ?? 1}
                </div>
                <div style={{
                  fontSize:   10, color: "rgba(255,255,255,0.3)",
                  fontWeight: 800, marginTop: 4,
                }}>
                  LEVELS REACHED
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleHome}
          className="w-full py-4 rounded-2xl cursor-pointer"
          style={{
            background:    "linear-gradient(135deg, #6366F1, #4F46E5)",
            fontFamily:    "'Lilita One', cursive",
            fontSize:      22, color: "#fff",
            border:        "none", letterSpacing: 1,
            boxShadow:     "0 6px 24px rgba(99,102,241,0.4)",padding:'10px 10px',marginTop:'20px'
          }}
        >
          Back to Home 
        </button>
      </div>
    </div>
  );
}