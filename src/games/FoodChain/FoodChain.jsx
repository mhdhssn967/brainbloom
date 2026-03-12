import { useState }        from "react";
import { useFoodChain }    from "./hooks";
import SetupScreen         from "./components/SetupScreen";
import ChainDisplay        from "./components/ChainDisplay";
import OptionCards         from "./components/OptionCards";
import BiomeBackground     from "./components/BiomeBackground";
import ResultOverlay       from "./components/ResultOverlay";
import { BIOMES }          from "@/data/foodChainData";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function FoodChain() {
  const [config, setConfig] = useState(null);

  if (!config) return <SetupScreen onStart={setConfig} />;
  return <FoodChainGame {...config} />;
}

function FoodChainGame({ biomeId, totalSeconds }) {
  const {
    players, timeLeft, gameOver, winner,
    started, teams, handleAnswer, startCountdown,
  } = useFoodChain({ biomeId, totalSeconds });

  const biome  = BIOMES[biomeId];
  const mins   = Math.floor(timeLeft / 60);
  const secs   = timeLeft % 60;
  const urgent = timeLeft <= 10;

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

        @keyframes nodePop {
          from { transform:scale(0.6); opacity:0; }
          to   { transform:scale(1);   opacity:1; }
        }
        @keyframes shakeCard {
          0%,100% { transform:translateX(0) scale(0.95);  }
          25%     { transform:translateX(-6px) scale(0.95); }
          75%     { transform:translateX(6px)  scale(0.95); }
        }
        @keyframes cardFloat {
          0%,100% { transform:translateY(0);   }
          50%     { transform:translateY(-5px); }
        }
        @keyframes ambientFloat {
          0%,100% { transform:translateY(0)   rotate(0deg);   }
          50%     { transform:translateY(-12px) rotate(10deg); }
        }
        @keyframes pulse {
          0%,100% { opacity:0.5; transform:scale(1);    }
          50%     { opacity:1;   transform:scale(1.15); }
        }
        @keyframes arrowPulse {
          from { color:rgba(255,255,255,0.3); }
          to   { color:rgba(255,255,255,0.9); }
        }
        @keyframes timerUrgent {
          0%,100% { transform:scale(1);    }
          50%     { transform:scale(1.1);  }
        }
        @keyframes completeGlow {
          0%,100% { opacity:0.8; }
          50%     { opacity:1;   }
        }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div style={{
        height:         52, flexShrink: 0,
        background:     "rgba(5,5,20,0.95)",
        borderBottom:   `1px solid ${biome.accent}30`,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        position:       "relative",
        zIndex:         10,
        padding:        "0 16px",
      }}>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize:   "clamp(13px, 2vw, 18px)",
          color:      "#fff", letterSpacing: 2,
          position:   "absolute", left: 16,
          display:    "flex", alignItems: "center", gap: 8,
        }}>
          <span>{biome.emoji}</span>
          Food<span style={{ color: biome.accent }}>Chain</span>
        </div>

        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize:   "clamp(22px, 4vw, 34px)",
          color:      urgent ? "#EF4444" : "#fff",
          textShadow: urgent
            ? "0 0 20px rgba(239,68,68,0.8)"
            : `0 0 16px ${biome.accent}60`,
          animation:  urgent ? "timerUrgent 0.5s ease-in-out infinite" : "none",
        }}>
          {mins}:{String(secs).padStart(2, "0")}
        </div>

        {!started && (
          <button
            onPointerDown={(e) => {
              e.currentTarget.releasePointerCapture(e.pointerId);
              startCountdown();
            }}
            style={{
              all: "unset", cursor: "pointer",
              position: "fixed",top:'50%',
              background: biome.accent,
              color: "#060B18",
              fontFamily: "'Lilita One', cursive",
              fontSize: "clamp(31px, 1.5vw, 14px)",
              padding: "6px 20px", borderRadius: 99,
              letterSpacing: 1,
              boxShadow: `0 4px 16px ${biome.accent}60`,
              fontWeight: 900,
            }}
          >
            ▶ START
          </button>
        )}
      </div>

      {/* ── SPLIT SCREEN ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        {[0, 1].map(playerId => {
          const p     = players[playerId];
          const team  = teams[playerId] ?? { name: playerId === 0 ? "Team Red" : "Team Blue" };
          const color = TEAM_COLORS[playerId];
          const rs    = p.roundState;

          return (
            <div
              key={playerId}
              style={{
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "space-between",
                position:       "relative",
                overflow:       "hidden",
                padding:        "12px 8px",
                borderRight:    playerId === 0
                  ? "2px solid rgba(255,255,255,0.06)"
                  : "none",
              }}
            >
              {/* Biome bg */}
              <BiomeBackground biomeId={biomeId} side={playerId} />

              {/* ── Team header ───────────────────────────── */}
              <div style={{
                position:  "relative", zIndex: 1,
                textAlign: "center", width: "100%",
                flexShrink: 0,
              }}>
                <div style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "center",
                  padding:        "0 8px",
                }}>
                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      "clamp(16px, 2.5vw, 24px)",
                    color,
                    textShadow:    `0 0 16px ${color}60`,
                    letterSpacing: 2,
                  }}>
                    {team.name}
                  </div>

                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      "clamp(20px, 3.5vw, 32px)",
                    color:         "#fff",
                    textShadow:    `0 0 20px ${color}60`,
                  }}>
                    {p.score}
                    <span style={{
                      fontSize:   "clamp(9px, 1.2vw, 11px)",
                      color:      "rgba(255,255,255,0.4)",
                      fontFamily: "'Baloo 2', cursive",
                      marginLeft: 4,
                    }}>
                      PTS
                    </span>
                  </div>
                </div>

                {/* Round + blank counter */}
                <div style={{
                  display:        "flex",
                  justifyContent: "center",
                  gap:            8,
                  marginTop:      6,
                }}>
                  <div style={{
                    background:    `${color}20`,
                    border:        `1.5px solid ${color}40`,
                    borderRadius:  99, padding: "2px 12px",
                    fontSize:      "clamp(9px, 1.2vw, 11px)",
                    fontWeight:    900, color,
                  }}>
                    Round {p.round}
                  </div>
                  <div style={{
                    background:    "rgba(255,255,255,0.06)",
                    border:        "1px solid rgba(255,255,255,0.1)",
                    borderRadius:  99, padding: "2px 12px",
                    fontSize:      "clamp(9px, 1.2vw, 11px)",
                    fontWeight:    900,
                    color:         "rgba(255,255,255,0.4)",
                  }}>
                    {rs.answers.length} blank{rs.answers.length > 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* ── Phase label ───────────────────────────── */}
              <div style={{
                position:  "relative", zIndex: 1,
                textAlign: "center", minHeight: 24, flexShrink: 0,
              }}>
                {p.phase === "round_complete" && (
                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      "clamp(14px, 2vw, 18px)",
                    color:         "#22C55E",
                    textShadow:    "0 0 20px #22C55E80",
                    animation:     "completeGlow 0.5s ease-in-out infinite",
                    letterSpacing: 2,
                  }}>
                    ✓ CHAIN COMPLETE!
                  </div>
                )}
                {p.phase === "wrong_flash" && (
                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      "clamp(14px, 2vw, 18px)",
                    color:         "#EF4444",
                    textShadow:    "0 0 20px #EF444480",
                    animation:     "shakeCard 0.4s ease both",
                    letterSpacing: 2,
                  }}>
                    ✗ WRONG!
                  </div>
                )}
                {p.phase === "playing" && (
                  <div style={{
                    fontSize:   "clamp(10px, 1.4vw, 12px)",
                    fontWeight: 900,
                    color:      "rgba(255,255,255,0.3)",
                    letterSpacing: 2,
                  }}>
                    TAP THE CORRECT CREATURE
                  </div>
                )}
              </div>

              {/* ── Chain display ─────────────────────────── */}
              <div style={{
                position:  "relative", zIndex: 1,
                width:     "100%", flexShrink: 0,
                background: "rgba(0,0,0,0.25)",
                borderRadius: 16,
                border:    `1px solid rgba(255,255,255,0.06)`,
                backdropFilter: "blur(4px)",
              }}>
                <ChainDisplay
                  display={rs.display}
                  roles={rs.roles}
                  color={color}
                  currentBlank={rs.currentBlank}
                  blankIndices={rs.blankIndices}
                  phase={p.phase}
                />
              </div>

              {/* ── Option cards ──────────────────────────── */}
              <div style={{
                position:  "relative", zIndex: 1,
                width:     "100%", flexShrink: 0,
              }}>
                <OptionCards
                  options={rs.options}
                  onTap={(opt) => started && handleAnswer(playerId, opt)}
                  wrongCard={p.wrongCard}
                  phase={p.phase}
                  color={color}
                />
              </div>

            </div>
          );
        })}
      </div>

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