import { useState } from "react";
import { LEVEL_KEYS, LEVEL_NAMES, TIMER_OPTIONS, DEFAULT_TIMER } from "@/data/trackRushData";

const ACCENT = "#F59E0B";

function Step({ n, label, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background:  done ? ACCENT : `${ACCENT}18`,
        border:      `2px solid ${done ? ACCENT : `${ACCENT}40`}`,
        display:     "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900,
        color:    done ? "#000" : ACCENT,
        transition: "all 0.3s ease",
      }}>
        {done ? "✓" : n}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 900, letterSpacing: 2,
        color: done ? ACCENT : "rgba(255,255,255,0.35)",
        textTransform: "uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function SetupScreen({ onStart }) {
  const [level,   setLevel]   = useState(null);
  const [seconds, setSeconds] = useState(DEFAULT_TIMER);

  const canStart = !!level;
  const tidx  = TIMER_OPTIONS.indexOf(seconds);
  const mins  = Math.floor(seconds / 60);
  const secs  = seconds % 60;

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#060B18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Nunito', sans-serif",
      padding: "24px 16px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes runBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes panelIn   { from{opacity:0;transform:scale(0.94) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes rowIn     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .tr-row { animation: rowIn 0.25s ease both; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 580,
        padding: "32px 36px 36px",
        boxSizing: "border-box",
        background: "rgba(2,8,20,0.88)",
        backdropFilter: "blur(28px)",
        borderRadius: 32,
        border: `1.5px solid ${ACCENT}28`,
        boxShadow: `0 40px 80px rgba(0,0,0,0.75), 0 0 60px ${ACCENT}10, inset 0 1px 0 rgba(255,255,255,0.04)`,
        animation: "panelIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both",
        display: "flex", flexDirection: "column", gap: 22,
      }}>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 50, animation: "runBounce 1.8s ease-in-out infinite", display: "inline-block" }}>
            🏃
          </div>
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(28px, 5vw, 44px)",
            color: "#fff", letterSpacing: 2, lineHeight: 1.1,
            textShadow: `0 0 40px ${ACCENT}55`,
          }}>
            Track<span style={{ color: ACCENT }}>Rush</span>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 800,
            color: "rgba(255,255,255,0.25)",
            letterSpacing: 3, marginTop: 5,
          }}>
            SWIPE TO DODGE · RUN THROUGH THE RIGHT ANSWER
          </div>
        </div>

        {/* Step 1: Level */}
        <div className="tr-row">
          <Step n="1" label="Class Level" done={!!level} />
          <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "center" }}>
            {LEVEL_KEYS.map(key => (
              <button key={key} onClick={() => setLevel(key)} style={{
                all: "unset", cursor: "pointer",
                padding: "10px 22px", borderRadius: 14,
                background:  level === key ? `${ACCENT}20` : "rgba(255,255,255,0.04)",
                border:      `1.5px solid ${level === key ? ACCENT : "rgba(255,255,255,0.08)"}`,
                color:       level === key ? ACCENT : "rgba(255,255,255,0.5)",
                fontFamily:  "'Baloo 2', cursive", fontSize: 13, fontWeight: 900,
                boxShadow:   level === key ? `0 4px 16px ${ACCENT}30` : "none",
                transform:   level === key ? "translateY(-2px)" : "none",
                transition:  "all 0.18s ease",
              }}>
                📚 {LEVEL_NAMES[key]}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Timer */}
        {level && (
          <div className="tr-row">
            <Step n="2" label="Game Duration" done={false} />
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: `1.5px solid ${ACCENT}18`,
              borderRadius: 20, padding: "16px 24px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <button onClick={() => tidx > 0 && setSeconds(TIMER_OPTIONS[tidx - 1])} style={{
                  all: "unset", cursor: tidx > 0 ? "pointer" : "not-allowed",
                  width: 42, height: 42, borderRadius: "50%",
                  background: `${ACCENT}14`, border: `2px solid ${ACCENT}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, color: "#fff", opacity: tidx <= 0 ? 0.25 : 1,
                }}>−</button>

                <div style={{
                  fontFamily: "'Lilita One', cursive", fontSize: 50, color: "#fff",
                  lineHeight: 1, textShadow: `0 0 24px ${ACCENT}55`,
                  minWidth: 100, textAlign: "center",
                }}>
                  {mins > 0 ? `${mins}:${String(secs).padStart(2,"0")}` : `${secs}s`}
                </div>

                <button onClick={() => tidx < TIMER_OPTIONS.length - 1 && setSeconds(TIMER_OPTIONS[tidx + 1])} style={{
                  all: "unset", cursor: tidx < TIMER_OPTIONS.length - 1 ? "pointer" : "not-allowed",
                  width: 42, height: 42, borderRadius: "50%",
                  background: `${ACCENT}14`, border: `2px solid ${ACCENT}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, color: "#fff", opacity: tidx >= TIMER_OPTIONS.length - 1 ? 0.25 : 1,
                }}>+</button>
              </div>

              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {TIMER_OPTIONS.map(t => (
                  <button key={t} onClick={() => setSeconds(t)} style={{
                    all: "unset", cursor: "pointer",
                    padding: "3px 12px", borderRadius: 99,
                    background:  seconds === t ? ACCENT : "rgba(255,255,255,0.05)",
                    border:      `1.5px solid ${seconds === t ? ACCENT : "rgba(255,255,255,0.1)"}`,
                    fontSize: 11, fontWeight: 900,
                    color:    seconds === t ? "#000" : "rgba(255,255,255,0.5)",
                    transition: "all 0.15s ease",
                  }}>
                    {t >= 60 ? `${Math.floor(t/60)}m${t%60>0?` ${t%60}s`:""}` : `${t}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={() => canStart && onStart({ levelKey: level, totalSeconds: seconds })}
          disabled={!canStart}
          style={{
            all: "unset", cursor: canStart ? "pointer" : "not-allowed",
            display: "block", width: "100%", padding: "16px 0",
            borderRadius: 20, textAlign: "center",
            background: canStart
              ? `linear-gradient(135deg, ${ACCENT} 0%, #d97706 100%)`
              : "rgba(255,255,255,0.05)",
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(18px, 3vw, 24px)",
            color: canStart ? "#fff" : "rgba(255,255,255,0.18)",
            letterSpacing: 1.5,
            boxShadow: canStart ? `0 8px 28px ${ACCENT}45, 0 3px 0 #92400e` : "none",
            opacity: canStart ? 1 : 0.5,
            transition: "all 0.25s ease",
          }}
        >
          {canStart ? "🏃 Start Running!" : "Choose a class level to start ↑"}
        </button>

        {canStart && (
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", justifyContent: "center", marginTop: -12 }}>
            {[
              { label: `📚 ${LEVEL_NAMES[level]}` },
              { label: `⏱ ${mins > 0 ? `${mins}m` : `${secs}s`}` },
              { label: "🧠 General Knowledge" },
            ].map((c, i) => (
              <div key={i} style={{
                padding: "3px 12px", borderRadius: 99,
                background: `${ACCENT}18`, border: `1px solid ${ACCENT}35`,
                fontSize: 11, fontWeight: 900, color: ACCENT, letterSpacing: 0.5,
              }}>
                {c.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}