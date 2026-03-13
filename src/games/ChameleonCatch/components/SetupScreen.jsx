import { useState } from "react";
import { SUBJECTS, LEVEL_KEYS, LEVEL_NAMES } from "@/data/chameleonData";
import { TIMER_OPTIONS as T_OPT, DEFAULT_TIMER as D_TIMER } from "../constants";

const SUBJECT_LIST = Object.values(SUBJECTS);

function SectionLabel({ n, text, done }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background:  done ? "#84cc16" : "rgba(132,204,22,0.14)",
        border:      `2px solid ${done ? "#84cc16" : "rgba(132,204,22,0.36)"}`,
        display:     "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 900,
        color:    done ? "#000" : "#84cc16",
        transition: "all 0.3s ease",
      }}>
        {done ? "✓" : n}
      </div>
      <span style={{
        fontSize: 10, fontWeight: 900, letterSpacing: 2,
        color:    done ? "#84cc16" : "rgba(255,255,255,0.36)",
        textTransform: "uppercase",
        transition: "color 0.3s ease",
      }}>
        {text}
      </span>
    </div>
  );
}

function SubjectBtn({ active, color, onClick, emoji, name, description }) {
  return (
    <button onClick={onClick} style={{
      all: "unset", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
      padding: "14px 14px",
      borderRadius: 18,
      background:  active ? `${color}20` : "rgba(255,255,255,0.04)",
      border:      `2px solid ${active ? color : "rgba(255,255,255,0.08)"}`,
      color:       active ? color : "rgba(255,255,255,0.5)",
      fontFamily:  "'Baloo 2', cursive", fontWeight: 900, fontSize: 14,
      boxShadow:   active ? `0 0 20px ${color}35, 0 4px 14px ${color}22` : "none",
      transform:   active ? "translateY(-2px)" : "none",
      transition:  "all 0.2s ease",
      minWidth: 96,
      textAlign: "center",
    }}>
      <span style={{ fontSize: 26 }}>{emoji}</span>
      <span>{name}</span>
      {description && (
        <span style={{
          fontSize: 9, fontWeight: 700,
          color: active ? `${color}bb` : "rgba(255,255,255,0.22)",
          lineHeight: 1.3, maxWidth: 100, textAlign: "center",
        }}>
          {description}
        </span>
      )}
    </button>
  );
}

function LevelBtn({ active, onClick, label }) {
  return (
    <button onClick={onClick} style={{
      all: "unset", cursor: "pointer",
      padding: "10px 22px", borderRadius: 14,
      background:  active ? "#84cc1620" : "rgba(255,255,255,0.04)",
      border:      `1.5px solid ${active ? "#84cc16" : "rgba(255,255,255,0.08)"}`,
      color:       active ? "#84cc16" : "rgba(255,255,255,0.5)",
      fontFamily:  "'Baloo 2', cursive", fontSize: 13, fontWeight: 900,
      boxShadow:   active ? "0 4px 14px rgba(132,204,22,0.28)" : "none",
      transform:   active ? "translateY(-2px)" : "none",
      transition:  "all 0.2s ease",
    }}>
      📚 {label}
    </button>
  );
}

export default function SetupScreen({ onStart }) {
  const [subject, setSubject] = useState(null);
  const [level,   setLevel]   = useState(null);
  const [seconds, setSeconds] = useState(D_TIMER);

  const canStart = !!(subject && level);
  const tidx     = T_OPT.indexOf(seconds);
  const mins     = Math.floor(seconds / 60);
  const secs     = seconds % 60;

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#060B18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Nunito', sans-serif",
      padding: "24px 16px",
      boxSizing: "border-box",
      overflowY: "auto",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes bobCham { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes panelIn { from{opacity:0;transform:scale(0.94) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes rowIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .setup-row { animation: rowIn 0.25s ease both; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: 660,
        padding: "32px 36px 36px",
        boxSizing: "border-box",
        background: "rgba(2,8,20,0.86)",
        backdropFilter: "blur(28px)",
        borderRadius: 32,
        border: "1.5px solid rgba(132,204,22,0.2)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.04)",
        animation: "panelIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both",
        display: "flex", flexDirection: "column", gap: 22,
      }}>

        {/* Title */}
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontSize: 52, display: "inline-block",
            animation: "bobCham 2.8s ease-in-out infinite",
          }}>🦎</div>
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(26px, 5vw, 42px)",
            color: "#fff", letterSpacing: 2, lineHeight: 1.1,
            textShadow: "0 0 40px rgba(132,204,22,0.55)",
          }}>
            Chameleon<span style={{ color: "#84cc16" }}>Catch</span>
          </div>
          <div style={{
            fontSize: 10, fontWeight: 800,
            color: "rgba(255,255,255,0.26)",
            letterSpacing: 3, marginTop: 5,
          }}>
            CATCH THE RIGHT ANSWERS · SCORE THE MOST
          </div>
        </div>

        {/* ── STEP 1: Subject ── */}
        <div className="setup-row">
          <SectionLabel n="1" text="Choose Subject" done={!!subject} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {SUBJECT_LIST.map(s => (
              <SubjectBtn
                key={s.id}
                active={subject === s.id}
                color={s.color}
                emoji={s.emoji}
                name={s.name}
                description={s.description}
                onClick={() => { setSubject(s.id); setLevel(null); }}
              />
            ))}
          </div>
        </div>

        {/* ── STEP 2: Class Level ── */}
        {subject && (
          <div className="setup-row">
            <SectionLabel n="2" text="Class Level" done={!!level} />
            <div style={{ display: "flex", gap: 9, flexWrap: "wrap", justifyContent: "center" }}>
              {LEVEL_KEYS.map(key => (
                <LevelBtn
                  key={key}
                  active={level === key}
                  label={LEVEL_NAMES[key]}
                  onClick={() => setLevel(key)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Timer ── */}
        {level && (
          <div className="setup-row">
            <SectionLabel n="3" text="Game Duration" done={false} />
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1.5px solid rgba(132,204,22,0.14)",
              borderRadius: 20, padding: "18px 24px",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                <button onClick={() => tidx > 0 && setSeconds(T_OPT[tidx - 1])} style={{
                  all: "unset", cursor: tidx > 0 ? "pointer" : "not-allowed",
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(132,204,22,0.12)", border: "2px solid rgba(132,204,22,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, color: "#fff", opacity: tidx <= 0 ? 0.25 : 1,
                }}>−</button>

                <div style={{
                  fontFamily: "'Lilita One', cursive", fontSize: 52, color: "#fff",
                  lineHeight: 1, textShadow: "0 0 24px rgba(132,204,22,0.55)",
                  minWidth: 100, textAlign: "center",
                }}>
                  {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${secs}s`}
                </div>

                <button onClick={() => tidx < T_OPT.length - 1 && setSeconds(T_OPT[tidx + 1])} style={{
                  all: "unset", cursor: tidx < T_OPT.length - 1 ? "pointer" : "not-allowed",
                  width: 44, height: 44, borderRadius: "50%",
                  background: "rgba(132,204,22,0.12)", border: "2px solid rgba(132,204,22,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, color: "#fff", opacity: tidx >= T_OPT.length - 1 ? 0.25 : 1,
                }}>+</button>
              </div>

              {/* Quick preset pills */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {T_OPT.map(t => (
                  <button key={t} onClick={() => setSeconds(t)} style={{
                    all: "unset", cursor: "pointer",
                    padding: "3px 13px", borderRadius: 99,
                    background:  seconds === t ? "#84cc16" : "rgba(255,255,255,0.05)",
                    border:      `1.5px solid ${seconds === t ? "#84cc16" : "rgba(255,255,255,0.1)"}`,
                    fontSize: 11, fontWeight: 900,
                    color:    seconds === t ? "#000" : "rgba(255,255,255,0.5)",
                    transition: "all 0.15s ease",
                    boxShadow: seconds === t ? "0 2px 10px rgba(132,204,22,0.4)" : "none",
                  }}>
                    {t >= 60 ? `${Math.floor(t / 60)}m` : `${t}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Start button ── */}
        <button
          onClick={() => canStart && onStart({ subjectId: subject, levelKey: level, totalSeconds: seconds })}
          disabled={!canStart}
          onMouseDown={e => canStart && (e.currentTarget.style.transform = "translateY(2px)")}
          onMouseUp={e   => canStart && (e.currentTarget.style.transform = "translateY(0)")}
          style={{
            all: "unset", cursor: canStart ? "pointer" : "not-allowed",
            display: "block", width: "100%", padding: "17px 0",
            borderRadius: 20, textAlign: "center",
            background: canStart
              ? "linear-gradient(135deg, #84cc16 0%, #4d7c0f 100%)"
              : "rgba(255,255,255,0.05)",
            fontFamily: "'Lilita One', cursive",
            fontSize: "clamp(18px, 3vw, 24px)",
            color: canStart ? "#fff" : "rgba(255,255,255,0.18)",
            letterSpacing: 1.5,
            boxShadow: canStart ? "0 8px 28px rgba(132,204,22,0.42), 0 3px 0 #3a5c0a" : "none",
            opacity: canStart ? 1 : 0.5,
            transition: "all 0.25s ease",
          }}
        >
          {canStart ? "🦎 Start Game!" : "Choose subject & level to start ↑"}
        </button>

        {/* Summary chips */}
        {canStart && (
          <div style={{
            display: "flex", gap: 7, flexWrap: "wrap",
            justifyContent: "center", marginTop: -12,
          }}>
            {[
              { color: SUBJECTS[subject].color, label: `${SUBJECTS[subject].emoji} ${SUBJECTS[subject].name}` },
              { color: "#84cc16",               label: `📚 ${LEVEL_NAMES[level]}` },
              { color: "#84cc16",               label: `⏱ ${mins > 0 ? `${mins}m${secs > 0 ? ` ${secs}s` : ""}` : `${secs}s`}` },
            ].map((chip, i) => (
              <div key={i} style={{
                padding: "3px 13px", borderRadius: 99,
                background: `${chip.color}18`,
                border: `1px solid ${chip.color}38`,
                fontSize: 11, fontWeight: 900,
                color: chip.color, letterSpacing: 0.5,
              }}>
                {chip.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}