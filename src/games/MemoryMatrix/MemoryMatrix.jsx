import { useState }         from "react";
import { useMemoryGame }    from "./hooks";
import TileGrid             from "./components/TileGrid";
import TimerPicker          from "./components/TimerPicker";
import ResultOverlay        from "./components/ResultOverlay";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };
const ACCENT      = "#6366F1";

export default function MemoryMatrix() {
  const [totalSeconds, setTotalSeconds] = useState(null);

  if (!totalSeconds) {
    return <TimerPicker onStart={(s) => setTotalSeconds(s)} />;
  }

  return <MemoryMatrixGame totalSeconds={totalSeconds} />;
}

function MemoryMatrixGame({ totalSeconds }) {
  const {
    players,
    timeLeft,
    gameOver,
    winner,
    started,
    teams,
    handleTap,
    startCountdown,
  } = useMemoryGame({ totalSeconds });

  const mins    = Math.floor(timeLeft / 60);
  const secs    = timeLeft % 60;
  const urgent  = timeLeft <= 10;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#060B18",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes popIn {
          from{opacity:0;transform:scale(0.5)}
          to  {opacity:1;transform:scale(1)}
        }
        @keyframes shakeX {
          0%,100%{transform:translateX(0)}
          25%    {transform:translateX(-6px)}
          75%    {transform:translateX(6px)}
        }
        @keyframes timerUrgent {
          0%,100%{transform:scale(1)   }
          50%    {transform:scale(1.08)}
        }
        @keyframes advanceFlash {
          0%  {opacity:0;transform:scale(0.8)}
          40% {opacity:1;transform:scale(1.05)}
          100%{opacity:0;transform:scale(1.1)}
        }
        @keyframes pulseGlow {
          0%,100%{opacity:0.5}
          50%    {opacity:1}
        }
        @keyframes levelUp {
          0%  {opacity:0;transform:translateY(10px)}
          30% {opacity:1;transform:translateY(0)}
          80% {opacity:1}
          100%{opacity:0}
        }
      `}</style>

      {/* ── TOP BAR ───────────────────────────────────────────────── */}
      <div style={{
        height:         52,
        background:     "rgba(5,5,20,0.95)",
        borderBottom:   `1px solid ${ACCENT}30`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
        gap:            24,
        position:       "relative",
        zIndex:         10,
      }}>
        {/* Title */}
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      20, color: "#fff", letterSpacing: 2,
          position:      "absolute", left: 20,
        }}>
          Memory<span style={{ color: ACCENT }}>Matrix</span>
        </div>

        {/* Timer */}
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      52,
          position:'fixed',top:'40%',
          color:         urgent ? "#EF4444" : "#fff",
          textShadow:    urgent
            ? "0 0 20px rgba(239,68,68,0.8)"
            : `0 0 16px ${ACCENT}60`,
          animation:     urgent
            ? "timerUrgent 0.5s ease-in-out infinite"
            : "none",
          minWidth:      80,
          textAlign:     "center",
        }}>
          {mins}:{String(secs).padStart(2, "0")}
        </div>

        {/* Start button — shows until countdown begins */}
        {!started && (
          <button
            onClick={startCountdown}
            style={{
              all:          "unset",
              cursor:       "pointer",
              position:'fixed',
              top:'50%',
              background:   ACCENT,
              color:        "#fff",
              fontFamily:   "'Lilita One', cursive",
              fontSize:     33,
              padding:      "6px 20px",
              borderRadius: 99,
              letterSpacing: 1,
              boxShadow:    `0 4px 16px ${ACCENT}60`,
            }}
          >
            ▶ START
          </button>
        )}
      </div>

      {/* ── SPLIT SCREEN ──────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {[0, 1].map(playerId => {
          const p     = players[playerId];
          const team  = teams[playerId] ?? {
            name: playerId === 0 ? "Team Red" : "Team Blue",
          };
          const color = TEAM_COLORS[playerId];

          return (
            <div
              key={playerId}
              style={{
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "space-between",
                padding:        "20px 16px",
                position:       "relative",
                borderRight:    playerId === 0
                  ? "2px solid rgba(255,255,255,0.06)"
                  : "none",
              }}
            >
              {/* BG tint */}
              <div style={{
                position:      "absolute", inset: 0,
                background:    `radial-gradient(ellipse at center 15%, ${color}12 0%, transparent 60%)`,
                pointerEvents: "none",
              }} />

              {/* ── Team name + level ──────────────────────────── */}
              <div style={{
                position:  "relative", zIndex: 1,
                textAlign: "center",
              }}>
                <div style={{
                  fontFamily:    "'Lilita One', cursive",
                  fontSize:      46, color,
                  textShadow:    `0 0 20px ${color}60`,
                  letterSpacing: 2,
                }}>
                  {team.name}
                </div>
                <div style={{
                  display:       "flex",
                  alignItems:    "center",
                  justifyContent:"center",
                  gap:           8,
                  marginTop:     6,
                }}>
                  <div style={{
                    background:    `${color}20`,
                    border:        `1.5px solid ${color}50`,
                    borderRadius:  99,
                    padding:       "3px 14px",
                    fontFamily:    "'Baloo 2', cursive",
                    fontSize:      33, fontWeight: 900,
                    color,
                  }}>
                    Level {p.level}
                  </div>
                  <div style={{
                    background:    "rgba(255,255,255,0.06)",
                    border:        "1px solid rgba(255,255,255,0.1)",
                    borderRadius:  99,
                    padding:       "3px 14px",
                    fontSize:      33, fontWeight: 900,
                    color:         "rgba(255,255,255,0.4)",
                    letterSpacing: 1,
                  }}>
                    {p.stage.gridSize}×{p.stage.gridSize} · {p.stage.lit} tiles
                  </div>
                </div>
              </div>

              {/* ── Phase label ────────────────────────────────── */}
              <div style={{
                position:  "relative", zIndex: 1,
                textAlign: "center",
                minHeight: 28,
              }}>
                {p.phase === "show" && (
                  <div style={{
                    fontFamily:    "'Baloo 2', cursive",
                    fontSize:      14, fontWeight: 900,
                    color,
                    letterSpacing: 2,
                    animation:     "pulseGlow 1s ease-in-out infinite",
                  }}>
                    👁 MEMORISE
                  </div>
                )}
                {p.phase === "recall" && (
                  <div style={{
                    fontFamily:    "'Baloo 2', cursive",
                    fontSize:      14, fontWeight: 900,
                    color:         "#fff",
                    letterSpacing: 2,
                  }}>
                    👆 TAP {p.stage.lit - p.correctTaps.length} MORE
                  </div>
                )}
                {p.phase === "advancing" && (
                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      18,
                    color:         "#22C55E",
                    textShadow:    "0 0 20px #22C55E80",
                    letterSpacing: 2,
                    animation:     "levelUp 0.6s ease both",
                  }}>
                    ✓ LEVEL UP!
                  </div>
                )}
                {p.phase === "wrong_flash" && (
                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      18,
                    color:         "#EF4444",
                    textShadow:    "0 0 20px #EF444480",
                    letterSpacing: 2,
                    animation:     "shakeX 0.3s ease both",
                  }}>
                    ✗ TRY AGAIN
                  </div>
                )}
              </div>

              {/* ── Tile grid ──────────────────────────────────── */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <TileGrid
                  playerId={playerId}
                  gridSize={p.stage.gridSize}
                  pattern={p.pattern}
                  correctTaps={p.correctTaps}
                  wrongTile={p.wrongTile}
                  phase={p.phase}
                  onTap={(idx) => started && handleTap(playerId, idx)}
                />
              </div>

              {/* Progress dots */}
              <div style={{
                display:        "flex",
                gap:            5,
                justifyContent: "center",
                flexWrap:       "wrap",
                maxWidth:       200,
                position:       "relative",
                zIndex:         1,
              }}>
                {p.pattern.map((_, i) => (
                  <div key={i} style={{
                    width:        10, height: 10,
                    borderRadius: "50%",
                    background:   i < p.correctTaps.length
                      ? "#22C55E"
                      : `${color}40`,
                    border:       `1.5px solid ${i < p.correctTaps.length
                      ? "#22C55E"
                      : `${color}60`}`,
                    transition:   "background 0.2s ease",
                    boxShadow:    i < p.correctTaps.length
                      ? "0 0 8px #22C55E80"
                      : "none",
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── GAME OVER ─────────────────────────────────────────────── */}
      {gameOver && (
        <ResultOverlay
          teams={teams}
          winner={winner}
          players={players}
        />
      )}
    </div>
  );
}