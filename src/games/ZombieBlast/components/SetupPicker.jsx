import { useState } from "react";
import {
  MODES, GAME_TYPES, DIFFICULTY_KEYS,
  DIFFICULTY, TIME_OPTIONS, DEFAULT_TIME,
} from "../constants";

export default function SetupPicker({ onStart }) {
  const [step,       setStep]       = useState(1);  // 1=mode 2=difficulty 3=gametype
  const [mode,       setMode]       = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [gameType,   setGameType]   = useState(null);
  const [timeLimit,  setTimeLimit]  = useState(DEFAULT_TIME);

  function handleStart() {
    onStart({ mode, difficulty, gameType, timeLimit });
  }

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center gap-8"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes slideUp {
          from{opacity:0;transform:translateY(20px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes zombieBob {
          0%,100%{transform:translateY(0) rotate(-3deg)}
          50%    {transform:translateY(-8px) rotate(3deg)}
        }
      `}</style>

      {/* Header */}
      <div className="text-center" style={{ animation: "slideUp 0.4s ease both" }}>
        <div style={{
          fontSize:  52, marginBottom: 4,
          animation: "zombieBob 1.5s ease-in-out infinite",
          display:   "inline-block",
        }}>
          🧟
        </div>
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      52, color: "#fff", letterSpacing: 2,
          textShadow:    "0 0 40px rgba(239,68,68,0.5)",
        }}>
          Zombie<span style={{ color: "#EF4444" }}>Blast!</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-3">
            <div style={{
              width:        s <= step ? 32 : 24,
              height:       s <= step ? 32 : 24,
              borderRadius: "50%",
              background:   s < step
                ? "#22C55E"
                : s === step
                  ? "#EF4444"
                  : "rgba(255,255,255,0.1)",
              border:       `2px solid ${s === step ? "#EF4444" : "transparent"}`,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontFamily:   "'Baloo 2', cursive",
              fontSize:     14, fontWeight: 900,
              color:        "#fff",
              transition:   "all 0.3s ease",
              boxShadow:    s === step ? "0 0 16px #EF444480" : "none",
            }}>
              {s < step ? "✓" : s}
            </div>
            {s < 3 && (
              <div style={{
                width:      32, height: 2,
                background: s < step
                  ? "#22C55E"
                  : "rgba(255,255,255,0.1)",
                transition: "background 0.3s ease",
              }} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1 — MODE ─────────────────────────────────────────── */}
      {step === 1 && (
        <div
          className="flex flex-col items-center gap-4"
          style={{ animation: "slideUp 0.3s ease both" }}
        >
          <div style={{
            fontSize: 12, fontWeight: 900,
            color: "rgba(255,255,255,0.4)", letterSpacing: 2,
          }}>
            SELECT MODE
          </div>
          <div className="flex gap-4">
            {Object.values(MODES).map(m => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setStep(2); }}
                style={{
                  all:          "unset",
                  cursor:       "pointer",
                  padding:      "28px 40px",
                  borderRadius: 24,
                  background:   "rgba(255,255,255,0.04)",
                  border:       "2px solid rgba(255,255,255,0.1)",
                  textAlign:    "center",
                  transition:   "all 0.2s ease",
                  minWidth:     180,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                  e.currentTarget.style.border = "2px solid #EF444460";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.border = "2px solid rgba(255,255,255,0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 10 }}>{m.emoji}</div>
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize: 22, color: "#fff", marginBottom: 6,
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontSize: 11, color: "rgba(255,255,255,0.3)",
                  fontWeight: 700,
                }}>
                  {m.id === "single"
                    ? "One player vs zombies"
                    : "Two players compete"}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── STEP 2 — DIFFICULTY ───────────────────────────────────── */}
      {step === 2 && (
        <div
          className="flex flex-col items-center gap-4"
          style={{ animation: "slideUp 0.3s ease both" }}
        >
          <div style={{
            fontSize: 12, fontWeight: 900,
            color: "rgba(255,255,255,0.4)", letterSpacing: 2,
          }}>
            SELECT DIFFICULTY
          </div>
          <div className="grid grid-cols-4 gap-3">
            {DIFFICULTY_KEYS.map(key => {
              const d = DIFFICULTY[key];
              return (
                <button
                  key={key}
                  onClick={() => { setDifficulty(key); setStep(3); }}
                  style={{
                    all:          "unset",
                    cursor:       "pointer",
                    padding:      "20px 20px",
                    borderRadius: 20,
                    background:   "rgba(255,255,255,0.04)",
                    border:       `2px solid rgba(255,255,255,0.08)`,
                    textAlign:    "center",
                    transition:   "all 0.2s ease",
                    minWidth:     130,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${d.color}18`;
                    e.currentTarget.style.border = `2px solid ${d.color}60`;
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = `0 12px 28px ${d.color}20`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.border = "2px solid rgba(255,255,255,0.08)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{d.emoji}</div>
                  <div style={{
                    fontFamily: "'Lilita One', cursive",
                    fontSize: 18, color: "#fff", marginBottom: 6,
                  }}>
                    {d.label}
                  </div>
                  <div style={{
                    fontSize: 9, color: "rgba(255,255,255,0.3)",
                    fontWeight: 700, lineHeight: 1.4,
                  }}>
                    {d.description}
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setStep(1)}
            style={{
              all: "unset", cursor: "pointer",
              fontSize: 12, color: "rgba(255,255,255,0.3)",
              fontWeight: 800, letterSpacing: 1,
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* ── STEP 3 — GAME TYPE ────────────────────────────────────── */}
      {step === 3 && (
        <div
          className="flex flex-col items-center gap-6"
          style={{ animation: "slideUp 0.3s ease both" }}
        >
          <div style={{
            fontSize: 12, fontWeight: 900,
            color: "rgba(255,255,255,0.4)", letterSpacing: 2,
          }}>
            SELECT GAME TYPE
          </div>

          <div className="flex gap-4">
            {Object.values(GAME_TYPES).map(gt => (
              <button
                key={gt.id}
                onClick={() => setGameType(gt.id)}
                style={{
                  all:          "unset",
                  cursor:       "pointer",
                  padding:      "24px 36px",
                  borderRadius: 20,
                  background:   gameType === gt.id
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(255,255,255,0.04)",
                  border:       `2px solid ${gameType === gt.id
                    ? "#EF4444"
                    : "rgba(255,255,255,0.08)"}`,
                  textAlign:    "center",
                  transform:    gameType === gt.id ? "translateY(-4px)" : "none",
                  transition:   "all 0.2s ease",
                  minWidth:     160,
                  boxShadow:    gameType === gt.id
                    ? "0 12px 28px rgba(239,68,68,0.2)"
                    : "none",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 8 }}>{gt.emoji}</div>
                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize: 20, color: "#fff", marginBottom: 4,
                }}>
                  {gt.label}
                </div>
                <div style={{
                  fontSize: 10, color: "rgba(255,255,255,0.3)",
                  fontWeight: 700,
                }}>
                  {gt.id === "timed"
                    ? "Most kills in time limit"
                    : "Last one alive wins"}
                </div>
              </button>
            ))}
          </div>

          {/* Time selector — only for timed mode */}
          {gameType === "timed" && (
            <div
              className="flex flex-col items-center gap-3"
              style={{ animation: "slideUp 0.2s ease both" }}
            >
              <div style={{
                fontSize: 11, fontWeight: 900,
                color: "rgba(255,255,255,0.4)", letterSpacing: 2,
              }}>
                TIME LIMIT
              </div>
              <div className="flex flex-wrap gap-2 justify-center"
                style={{ maxWidth: 420 }}
              >
                {TIME_OPTIONS.map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeLimit(t)}
                    style={{
                      all:          "unset",
                      cursor:       "pointer",
                      padding:      "8px 16px",
                      borderRadius: 12,
                      background:   timeLimit === t
                        ? "#EF4444"
                        : "rgba(255,255,255,0.06)",
                      border:       `1.5px solid ${timeLimit === t
                        ? "#EF4444"
                        : "rgba(255,255,255,0.1)"}`,
                      fontFamily:   "'Baloo 2', cursive",
                      fontSize:     14, fontWeight: 900,
                      color:        "#fff",
                      transition:   "all 0.15s ease",
                    }}
                  >
                    {t >= 60 ? `${t / 60}m` : `${t}s`}
                    {t === 60 ? " ⭐" : ""}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Start button */}
          {gameType && (
            <button
              onClick={handleStart}
              style={{
                all:          "unset",
                cursor:       "pointer",
                background:   "linear-gradient(135deg, #EF4444, #DC2626)",
                borderRadius: 20,
                padding:      "18px 60px",
                fontFamily:   "'Lilita One', cursive",
                fontSize:     28, color: "#fff", letterSpacing: 1,
                boxShadow:    "0 8px 32px rgba(239,68,68,0.5), 0 4px 0 #991B1B",
                animation:    "slideUp 0.3s ease both",
                transition:   "transform 0.1s ease",
              }}
              onMouseDown={e => {
                e.currentTarget.style.transform = "translateY(3px)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(239,68,68,0.4), 0 1px 0 #991B1B";
              }}
              onMouseUp={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(239,68,68,0.5), 0 4px 0 #991B1B";
              }}
            >
              🧟 Start Game!
            </button>
          )}

          <button
            onClick={() => setStep(2)}
            style={{
              all: "unset", cursor: "pointer",
              fontSize: 12, color: "rgba(255,255,255,0.3)",
              fontWeight: 800, letterSpacing: 1,
            }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}