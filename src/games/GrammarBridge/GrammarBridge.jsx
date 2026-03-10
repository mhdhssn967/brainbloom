import { useState }          from "react";
import { useNavigate }       from "react-router-dom";
import { useTeamStore }      from "@/store/teamStore";
import { useSessionStore }   from "@/store/sessionStore";
import { useGrammarBridge }  from "./hooks";
import SetupPicker           from "./components/SetupPicker";
import BridgeScene           from "./components/BridgeScene";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };
const ACCENT      = "#818CF8";

export default function GrammarBridge() {
  const [config, setConfig] = useState(null);
  if (!config) return <SetupPicker onStart={setConfig} />;
  return <GrammarBridgeGame {...config} />;
}

function GrammarBridgeGame({ rounds, difficulty }) {
  const navigate     = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams   = useTeamStore(s => s.reset);
  const { teams }    = useTeamStore();

  const {
    playerStates,
    lockedOpts,
    confetti,
    gameOver,
    winner,
    playerRounds,
    totalRounds,
    handleAnswer,
  } = useGrammarBridge({ totalRounds: rounds, difficulty });

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes optPop {
          from{opacity:0;transform:scale(0.85)}
          to  {opacity:1;transform:scale(1)}
        }
        @keyframes wrongShake {
          0%,100%{transform:scale(0.96)translateX(0)}
          25%    {transform:scale(0.96)translateX(-5px)}
          75%    {transform:scale(0.96)translateX(5px)}
        }
        @keyframes confettiFall {
          0%  {transform:translateY(-20px) rotate(0deg);opacity:1}
          100%{transform:translateY(100px) rotate(720deg);opacity:0}
        }
        @keyframes slideUp {
          from{opacity:0;transform:translateY(20px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes modalPop {
          from{opacity:0;transform:scale(0.85)}
          to  {opacity:1;transform:scale(1)}
        }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-5"
        style={{
          height: 48, background: "rgba(5,5,20,0.95)",
          borderBottom: `1px solid ${ACCENT}30`,
        }}
      >
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 20, color: "#fff", letterSpacing: 2,
        }}>
          Grammar<span style={{ color: ACCENT }}>Bridge</span>
        </div>
        <div style={{ fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
          {difficulty?.replace("-", " ").toUpperCase()}
        </div>
      </div>

      {/* ── SPLIT SCREEN ────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">
        {[0, 1].map(playerId => {
          const state    = playerStates[playerId];
          const color    = TEAM_COLORS[playerId];
          const team     = teams[playerId];
          const round    = playerRounds.current[playerId];
          const hasConf  = confetti[playerId];
          const locked   = lockedOpts[playerId];
          const isWalking = state?.phase === "walking" || state?.phase === "bridge_complete";

          return (
            <div
              key={playerId}
              className="flex flex-col flex-1 min-w-0 relative"
              style={{
                borderRight: playerId === 0
                  ? "2px solid rgba(255,255,255,0.06)"
                  : "none",
              }}
            >
              {/* Round indicator */}
              <div
                className="flex items-center justify-between px-4 flex-shrink-0"
                style={{
                  height: 40,
                  background: `${color}12`,
                  borderBottom: `1px solid ${color}30`,
                }}
              >
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize: 16, color,
                  textShadow: `0 0 12px ${color}60`,
                }}>
                  {team?.name}
                </div>
                <div style={{
                  fontSize: 31, fontWeight: 900,
                  color: "rgba(255,255,255,0.4)", letterSpacing: 1,
                }}>
                  ROUND {round} / {totalRounds}
                </div>
                {/* Round progress dots */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalRounds, 10) }, (_, i) => (
                    <div key={i} style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: i < round - 1
                        ? color
                        : i === round - 1
                          ? "#fff"
                          : "rgba(255,255,255,0.15)",
                      transition: "background 0.3s ease",
                    }} />
                  ))}
                  {totalRounds > 10 && (
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 800 }}>
                      +{totalRounds - 10}
                    </div>
                  )}
                </div>
              </div>

              {/* 3D Bridge Scene — top 55% */}
              <div style={{ height: "55%", flexShrink: 0, position: "relative" }}>
                {state && (
                  <BridgeScene
                    playerId={playerId}
                    playerState={state}
                    teamColor={color}
                  />
                )}

                {/* Confetti overlay */}
                {hasConf && <ConfettiOverlay color={color} />}

                {/* Walking overlay message */}
                {isWalking && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ pointerEvents: "none" }}
                  >
                    <div style={{
                      fontFamily: "'Lilita One', cursive",
                      fontSize: 28, color: "#fff",
                      textShadow: `0 0 24px ${color}`,
                      animation: "slideUp 0.3s ease both",
                      background: "rgba(0,0,0,0.4)",
                      padding: "10px 28px",
                      borderRadius: 16,
                      backdropFilter: "blur(4px)",
                    }}>
                      🎉 Bridge Complete!
                    </div>
                  </div>
                )}
              </div>

              {/* Image + sentence display — middle */}
              

              {/* Answer options — bottom */}
              <div
                className="flex flex-col items-center justify-center flex-1 min-h-0 px-4 gap-2"
                style={{
                  background: `linear-gradient(180deg, ${color}08 0%, transparent 80%)`,
                }}
              >
                <div style={{
                  fontSize: 10, fontWeight: 900,
                  color: "rgba(255,255,255,0.3)", letterSpacing: 2,
                  marginBottom: 2,
                }}>
                  {isWalking ? "GET READY FOR NEXT ROUND" : "CHOOSE THE CORRECT WORD"}
                </div>

                <div className="grid grid-cols-2 gap-2" style={{ width: "100%", maxWidth: 320 }}>
                  {(state?.options ?? []).map((opt, i) => {
                    const isLocked = locked?.has(opt);
                    return (
                      <button
                        key={`${state?.question?.image}-${opt}-${i}`}
                        disabled={isLocked || isWalking}
                        onClick={() => !isLocked && !isWalking && handleAnswer(playerId, opt)}
                        style={{
                          all:          "unset",
                          cursor:       isLocked || isWalking ? "default" : "pointer",
                          padding:      "12px 8px",
                          borderRadius: 14,
                          background:   isLocked
                            ? "rgba(239,68,68,0.1)"
                            : `${color}15`,
                          border:       `2px solid ${isLocked
                            ? "#EF444450"
                            : `${color}35`}`,
                          textAlign:    "center",
                          fontFamily:   "'Baloo 2', cursive",
                          fontSize:     18,
                          fontWeight:   900,
                          color:        isLocked ? "#EF4444" : "#fff",
                          transition:   "all 0.12s ease",
                          animation:    isLocked
                            ? "wrongShake 0.3s ease both"
                            : `optPop 0.15s ${i * 0.04}s ease both`,
                          opacity:      isLocked || isWalking ? 0.5 : 1,
                        }}
                        onMouseDown={e => {
                          if (!isLocked && !isWalking)
                            e.currentTarget.style.transform = "scale(0.93)";
                        }}
                        onMouseUp={e   => { e.currentTarget.style.transform = "scale(1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── GAME OVER ───────────────────────────────────────────── */}
      {gameOver && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
        >
          <div style={{
            background: "#0D1B2A",
            border: "2px solid rgba(255,255,255,0.1)",
            borderRadius: 32, padding: "48px 56px",
            textAlign: "center",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            animation: "modalPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
            minWidth: 400,
          }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>🏆</div>
            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: 42, color: "#fff", letterSpacing: 1, marginBottom: 8,
              textShadow: winner !== null
                ? `0 0 30px ${TEAM_COLORS[winner]}60`
                : "none",
            }}>
              {winner !== null
                ? `${teams[winner]?.name} Wins!`
                : "Draw!"}
            </div>
            <div style={{
              fontSize: 14, color: "rgba(255,255,255,0.4)",
              fontWeight: 800, marginBottom: 36,
            }}>
              Bridge builder champion 🌉
            </div>
            <button
              onClick={handleHome}
              style={{
                all: "unset", cursor: "pointer",
                display: "block", width: "100%",
                padding: "18px",
                background: "linear-gradient(135deg, #6366F1, #4F46E5)",
                borderRadius: 20,
                fontFamily: "'Lilita One', cursive",
                fontSize: 22, color: "#fff",
                boxShadow: "0 6px 24px rgba(99,102,241,0.4)",
                textAlign: "center",
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Confetti ──────────────────────────────────────────────────────────────
function ConfettiOverlay({ color }) {
  const pieces = Array.from({ length: 28 }, (_, i) => ({
    id:    i,
    x:     Math.random() * 100,
    delay: Math.random() * 0.8,
    size:  6 + Math.random() * 8,
    hue:   Math.random() > 0.5 ? color : "#FFD700",
    dur:   1.2 + Math.random() * 0.8,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 10 }}>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position:  "absolute",
            left:      `${p.x}%`,
            top:       -16,
            width:     p.size,
            height:    p.size,
            background: p.hue,
            borderRadius: Math.random() > 0.5 ? "50%" : 2,
            animation: `confettiFall ${p.dur}s ${p.delay}s ease-in both`,
          }}
        />
      ))}
    </div>
  );
}