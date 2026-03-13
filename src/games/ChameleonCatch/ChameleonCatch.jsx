import { useState }          from "react";
import { useChameleonCatch }  from "./hooks";
import SetupScreen            from "./components/SetupScreen";
import PlayerSide             from "./components/PlayerSide";
import ResultOverlay          from "./components/ResultOverlay";
import ForestBackground from "./components/ForestBackground";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };
const ACCENT      = "#84cc16";

export default function ChameleonCatch() {
  const [config, setConfig] = useState(null);
  if (!config) return <SetupScreen onStart={setConfig} />;
  return <ChameleonCatchGame {...config} />;
}

function ChameleonCatchGame({ subjectId, levelKey, totalSeconds }) {
  const {
    players, timeLeft, gameOver, winner,
    started, teams, handleBugTap, startCountdown,
    bugType, getCurrentRound,
  } = useChameleonCatch({ subjectId, levelKey, totalSeconds });

  const mins   = Math.floor(timeLeft / 60);
  const secs   = timeLeft % 60;
  const urgent = timeLeft <= 10;

  return (
    <div style={{
      width:         "100vw",
      height:        "100vh",
      background:    "#060B18",
      display:       "flex",
      flexDirection: "column",
      overflow:      "hidden",
      fontFamily:    "'Nunito', sans-serif",
    }}>
      <ForestBackground/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes timerUrgent { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }
      `}</style>

     {/* ── TOP BAR: Team Red | Score | [Round] | TIMER | [Round] | Score | Team Blue ── */}
      <div style={{
        flexShrink: 0, zIndex: 20, position: "relative",

        display:'flex', justifyContent:'space-between',
        padding: "0 56px",
        gap: 8,
      }}>
        {/* LEFT: Team Red info */}
        <div style={{ display: "flex", alignItems: "center", gap: 16,flexDirection:'column',padding:'20px',margin:'50px',borderRadius:'20px'}}className="bg-red-300/10 border border-red-400">
          <div>
            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: "clamp(23px,1.8vw,18px)",
              color: TEAM_COLORS[0],
              textShadow: `0 0 12px ${TEAM_COLORS[0]}60`,
              letterSpacing: 1,
            }}>{teams[0]?.name ?? "Team Red"}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,.3)", letterSpacing: 1 }}>
              Round {(players[0]?.round ?? 0) + 1}
            </div>
          </div>
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(40px,3.5vw,32px)",
            color: "#fff",
            textShadow: `0 0 18px ${TEAM_COLORS[0]}70`,
            lineHeight: 1,
          }}>
            {players[0]?.score ?? 0}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: "'Baloo 2',cursive", marginLeft: 4 }}>PTS</span>
          </div>
        </div>

       
        

        {/* RIGHT: Team Blue info */}
        <div style={{ display: "flex", alignItems: "center", gap: 16,flexDirection:'column',padding:'20px',margin:'50px',borderRadius:'20px'}}className="bg-blue-300/10 border border-blue-400" >
          
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: "clamp(23px,1.8vw,18px)",
              color: TEAM_COLORS[1],
              textShadow: `0 0 12px ${TEAM_COLORS[1]}60`,
              letterSpacing: 1,
            }}>{teams[1]?.name ?? "Team Blue"}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,.3)", letterSpacing: 1 }}>
              Round {(players[1]?.round ?? 0) + 1}
            </div>
          </div>
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(40px,3.5vw,32px)",
            color: "#fff",
            textShadow: `0 0 18px ${TEAM_COLORS[1]}70`,
            lineHeight: 1,
            textAlign: "right",
          }}>
            {players[1]?.score ?? 0}
            <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)", fontFamily: "'Baloo 2',cursive", marginLeft: 4 }}>PTS</span>
          </div>
        </div>
      </div>

 {/* CENTER: Timer + Start */}
<div style={{ display: "flex", flexDirection: "column",zIndex:'10', alignItems: "center", gap: 20,position:'fixed',top:'40%',left:'50%',transform:'translate(-50%)' }}>
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(26px,4vw,38px)",
            color: urgent ? "#EF4444" : "#fff",
            textShadow: urgent ? "0 0 24px rgba(239,68,68,.9)" : `0 0 16px ${ACCENT}55`,
            lineHeight: 1,
            animation: urgent ? "urgentPulse 0.5s ease-in-out infinite" : "none",
          }}>
            {mins}:{String(secs).padStart(2, "0")}
          </div>
          {!started && (
            <button
              onPointerDown={e => { e.currentTarget.releasePointerCapture(e.pointerId); startCountdown(); }}
              style={{
                all: "unset", cursor: "pointer",
                background: `linear-gradient(135deg,${ACCENT},#4d7c0f)`,
                color: "#fff", fontFamily: "'Lilita One',cursive",
                fontSize: 33, padding: "4px 20px", borderRadius: 99,
                letterSpacing: 1, boxShadow: `0 3px 14px ${ACCENT}55`,
              }}
            >▶ START</button>
          )}
        </div>


      {/* ── SPLIT SCREEN ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {[0, 1].map(playerId => (
          <PlayerSide
            key={playerId}
            playerId={playerId}
            player={players[playerId]}
            team={teams[playerId]}
            teamColor={TEAM_COLORS[playerId]}
            bugType={bugType}
            getCurrentRound={getCurrentRound}
            onBugTap={(bugId) => handleBugTap(playerId, bugId)}
            started={started}
            flip={playerId === 1}
          />
        ))}
      </div>

      {gameOver && (
        <ResultOverlay teams={teams} winner={winner} players={players} />
      )}
    </div>
  );
}