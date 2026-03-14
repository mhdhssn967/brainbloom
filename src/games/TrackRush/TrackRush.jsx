import { useState, memo }    from "react";
import { useTrackRush }       from "./hooks";
import TrackPlayerSide        from "./components/TrackPlayerSide";
import SetupScreen            from "./components/SetupScreen";
import ResultOverlay          from "./components/ResultOverlay";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };
const ACCENT      = "#F59E0B";

export default function TrackRush() {
  const [config, setConfig] = useState(null);
  if (!config) return <SetupScreen onStart={setConfig} accent={ACCENT} />;
  return <TrackRushGame {...config} />;
}

const TrackRushGame = memo(function TrackRushGame({ levelKey, questions: questionsProp, totalSeconds, packTitle }) {
  const {
    players, timeLeft, gameOver, winner,
    started, teams, qIndex,
    questions,   // ← just "questions" — this comes from the hook, not the prop
    spawnKey, onPortalHit, changeLane, startGame,
  } = useTrackRush({ levelKey, questions: questionsProp, totalSeconds });

  const question = questions[qIndex];
  const mins     = Math.floor(timeLeft / 60);
  const secs     = timeLeft % 60;
  const urgent   = timeLeft <= 10;

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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes timerUrgent  { 0%,100%{transform:scale(1)}   50%{transform:scale(1.12)} }
        @keyframes questionPop  { from{transform:scale(0.88) translateY(-10px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes shimmer      { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{
        height:         "auto",
        flexShrink:     0,
        background:     "rgba(4,6,18,0.97)",
        borderBottom:   `1px solid ${ACCENT}30`,
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        position:       "relative",
        zIndex:         30,
        padding:        "8px 16px",
      }}>
        {/* Row 1: title | timer | start */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            fontFamily:    "'Lilita One', cursive",
            fontSize:      "clamp(32px, 1.6vw, 16px)",
            color:         "#fff",
            letterSpacing: 2,
            display:       "flex",
            alignItems:    "center",
            gap:           6,
          }}>
            🏃 Track<span style={{ color: ACCENT }}>Rush</span>
          </div>

          {/* Timer */}
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize:   "clamp(64px, 4vw, 36px)",
            color:      urgent ? "#EF4444" : "#fff",
            textShadow: urgent
              ? "0 0 24px rgba(239,68,68,0.9)"
              : `0 0 18px ${ACCENT}60`,
            animation:  urgent ? "timerUrgent 0.5s ease-in-out infinite" : "none",
            lineHeight: 1,
          }}>
            {mins}:{String(secs).padStart(2, "0")}
          </div>

          {!started ? (
            <button
              onPointerDown={(e) => {
                e.currentTarget.releasePointerCapture(e.pointerId);
                startGame();
              }}
              style={{
                position:'fixed !important',
                top:'50%',
                left:'50%',transform:'translateX(-50%)',
                all:          "unset",
                cursor:       "pointer",
                background:   ACCENT,
                color:        "#060B18",
                fontFamily:   "'Lilita One', cursive",
                fontSize:     "clamp(41px, 1.4vw, 14px)",
                padding:      "6px 20px",
                borderRadius: 99,
                letterSpacing:1,
                boxShadow:    `0 4px 16px ${ACCENT}55`,
              }}
            >
              ▶ START
            </button>
          ) : (
            <div style={{ width: 80 }} />
          )}
        </div>

        {/* Row 2: Question banner */}
        {started && question && (
          <div
            key={qIndex}
            style={{
              marginTop:      6,
              display:        "flex",
              alignItems:     "center",
              gap:            10,
              background:     `rgba(245,158,11,0.1)`,
              border:         `1.5px solid ${ACCENT}40`,
              borderRadius:   16,
              padding:        "6px 20px",
              animation:      "questionPop 0.35s cubic-bezier(0.34,1.3,0.64,1) both",
              maxWidth:       "400px",
              position:'fixed',top:'50%',backgroundColor:'rgb(3, 17, 63)'
            }}
          >
            <span style={{ fontSize: "clamp(16px, 2.5vw, 22px)" }}>{question.emoji}</span>
            <span style={{
              fontFamily:    "'Baloo 2', cursive",
              fontSize:      "clamp(34px, 1.8vw, 17px)",
              fontWeight:    900,
              color:         "#fff",
              letterSpacing: 0.3,
              textAlign:     "center",
            }}>
              {question.question}
            </span>
            <span style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize:   "clamp(9px, 1vw, 11px)",
              color:      `${ACCENT}bb`,
              fontWeight: 900,
              marginLeft: 4,
            }}>
              Q{qIndex + 1}/{questions.length}
            </span>
          </div>
        )}
      </div>

      {/* ── SPLIT SCREEN ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {[0, 1].map(pid => (
          <TrackPlayerSide
            key={pid}
            playerId={pid}
            player={players[pid]}
            spawnKey={spawnKey}
            question={question}
            team={teams[pid]}
            teamColor={TEAM_COLORS[pid]}
            onSwipe={(dir) => changeLane(pid, dir)}
            onPortalHit={onPortalHit}
            started={started}
          />
        ))}
      </div>

      {gameOver && (
        <ResultOverlay
          teams={teams}
          winner={winner}
          players={players}
          accentColor={ACCENT}
        />
      )}
    </div>
  );
});