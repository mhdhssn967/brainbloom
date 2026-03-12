import { useState } from "react";
import { BIOMES }   from "@/data/foodChainData";
import { TIMER_OPTIONS, DEFAULT_TIMER } from "../constants";

export default function SetupScreen({ onStart }) {
  const [biome,   setBiome]   = useState("forest");
  const [seconds, setSeconds] = useState(DEFAULT_TIMER);

  const biomeList = Object.values(BIOMES);

  function adjust(delta) {
    const idx  = TIMER_OPTIONS.indexOf(seconds);
    const next = TIMER_OPTIONS[idx + delta];
    if (next !== undefined) setSeconds(next);
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div style={{
      width: "100vw", minHeight: "100vh",
      background: "#060B18",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 32, padding: "40px 20px",
      fontFamily: "'Nunito', sans-serif",
      boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        @keyframes bob {
          0%,100% { transform:translateY(0);   }
          50%     { transform:translateY(-8px); }
        }
        .biome-card:hover { transform: translateY(-4px) scale(1.03); }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: "center", animation: "slideUp 0.4s ease both" }}>
        <div style={{ fontSize: 64, animation: "bob 2s ease-in-out infinite" }}>🌿</div>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: "clamp(32px, 5vw, 52px)",
          color: "#fff", letterSpacing: 2, marginTop: 8,
          textShadow: "0 0 40px rgba(82,183,136,0.6)",
        }}>
          Food<span style={{ color: "#52b788" }}>Chain</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 800,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: 2, marginTop: 4,
        }}>
          BUILD THE CHAIN · RACE TO WIN
        </div>
      </div>

      {/* Biome picker */}
      <div style={{ animation: "slideUp 0.5s ease both", width: "100%", maxWidth: 600 }}>
        <div style={{
          fontSize: 10, fontWeight: 900,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: 2, textAlign: "center",
          marginBottom: 12,
        }}>
          SELECT BIOME
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 12,
        }}>
          {biomeList.map(b => (
            <button
              key={b.id}
              className="biome-card"
              onClick={() => setBiome(b.id)}
              style={{
                all: "unset", cursor: "pointer",
                padding: "18px 12px",
                borderRadius: 18,
                background: biome === b.id
                  ? `linear-gradient(135deg, ${b.accent}30, ${b.accent}10)`
                  : "rgba(255,255,255,0.04)",
                border: `2px solid ${biome === b.id ? b.accent : "rgba(255,255,255,0.08)"}`,
                textAlign: "center",
                transition: "all 0.2s ease",
                boxShadow: biome === b.id ? `0 8px 24px ${b.accent}30` : "none",
              }}
            >
              <div style={{ fontSize: 32 }}>{b.emoji}</div>
              <div style={{
                fontFamily: "'Baloo 2', cursive",
                fontSize: 13, fontWeight: 900,
                color: biome === b.id ? b.accent : "rgba(255,255,255,0.6)",
                marginTop: 6,
              }}>
                {b.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timer picker */}
      <div style={{ animation: "slideUp 0.55s ease both", textAlign: "center" }}>
        <div style={{
          fontSize: 10, fontWeight: 900,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: 2, marginBottom: 12,
        }}>
          GAME DURATION
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          background: "rgba(255,255,255,0.04)",
          border: "2px solid rgba(82,183,136,0.3)",
          borderRadius: 20, padding: "20px 32px",
        }}>
          {/* Minus */}
          <button onClick={() => adjust(-1)} style={{
            all: "unset", cursor: "pointer",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(82,183,136,0.15)",
            border: "2px solid rgba(82,183,136,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, color: "#fff",
            opacity: seconds <= TIMER_OPTIONS[0] ? 0.3 : 1,
          }}>−</button>

          <div style={{ minWidth: 100, textAlign: "center" }}>
            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: 52, color: "#fff", lineHeight: 1,
              textShadow: "0 0 24px rgba(82,183,136,0.6)",
            }}>
              {mins > 0 ? `${mins}:${String(secs).padStart(2,"0")}` : `${secs}s`}
            </div>
          </div>

          {/* Plus */}
          <button onClick={() => adjust(+1)} style={{
            all: "unset", cursor: "pointer",
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(82,183,136,0.15)",
            border: "2px solid rgba(82,183,136,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, color: "#fff",
            opacity: seconds >= TIMER_OPTIONS[TIMER_OPTIONS.length-1] ? 0.3 : 1,
          }}>+</button>
        </div>

        {/* Quick picks */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
          {TIMER_OPTIONS.map(t => (
            <button key={t} onClick={() => setSeconds(t)} style={{
              all: "unset", cursor: "pointer",
              padding: "4px 14px", borderRadius: 99,
              background: seconds === t ? "#52b788" : "rgba(255,255,255,0.05)",
              border: `1.5px solid ${seconds === t ? "#52b788" : "rgba(255,255,255,0.1)"}`,
              fontSize: 12, fontWeight: 900, color: "#fff",
              transition: "all 0.15s ease",
            }}>
              {t >= 60 ? `${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}` : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart({ biomeId: biome, totalSeconds: seconds })}
        style={{
          all: "unset", cursor: "pointer",
          background: `linear-gradient(135deg, #52b788, #2d6a4f)`,
          borderRadius: 20, padding: "18px 64px",
          fontFamily: "'Lilita One', cursive",
          fontSize: "clamp(20px, 3vw, 28px)",
          color: "#fff", letterSpacing: 1,
          boxShadow: "0 8px 32px rgba(82,183,136,0.5), 0 4px 0 #1b4332",
          animation: "slideUp 0.65s ease both",
          transition: "transform 0.1s ease",
        }}
        onMouseDown={e => e.currentTarget.style.transform = "translateY(3px)"}
        onMouseUp={e => e.currentTarget.style.transform = "translateY(0)"}
      >
        🌿 Start Game
      </button>
    </div>
  );
}