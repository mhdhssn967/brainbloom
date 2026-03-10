import { useState } from "react";
import { TIMER_OPTIONS, DEFAULT_TIMER } from "../constants";

export default function TimerPicker({ onStart }) {
  const [seconds, setSeconds] = useState(DEFAULT_TIMER);

  function adjust(delta) {
    const idx  = TIMER_OPTIONS.indexOf(seconds);
    const next = TIMER_OPTIONS[idx + delta];
    if (next !== undefined) setSeconds(next);
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

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
        @keyframes bob {
          0%,100%{transform:translateY(0)}
          50%    {transform:translateY(-8px)}
        }
        @keyframes popIn {
          from{opacity:0;transform:scale(0.8)}
          to  {opacity:1;transform:scale(1)}
        }
        @keyframes shakeX {
          0%,100%{transform:translateX(0)}
          25%    {transform:translateX(-6px)}
          75%    {transform:translateX(6px)}
        }
      `}</style>

      {/* Icon */}
      <div style={{
        fontSize: 64,
        animation: "bob 2s ease-in-out infinite",
        display: "inline-block",
        filter: "drop-shadow(0 0 24px #6366F180)",
      }}>
        🧠
      </div>

      {/* Title */}
      <div style={{
        fontFamily:    "'Lilita One', cursive",
        fontSize:      52, color: "#fff", letterSpacing: 2,
        textShadow:    "0 0 40px rgba(99,102,241,0.6)",
        animation:     "slideUp 0.4s ease both",
        textAlign:     "center",
      }}>
        Memory<span style={{ color: "#6366F1" }}>Matrix</span>
      </div>

      {/* Timer picker */}
      <div
        style={{
          animation:    "slideUp 0.5s ease both",
          textAlign:    "center",
        }}
      >
        <div style={{
          fontSize: 11, fontWeight: 900,
          color: "rgba(255,255,255,0.4)", letterSpacing: 2,
          marginBottom: 16,
        }}>
          SELECT GAME DURATION
        </div>

        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        24,
          background: "rgba(255,255,255,0.04)",
          border:     "2px solid rgba(99,102,241,0.3)",
          borderRadius: 24,
          padding:    "24px 36px",
        }}>
          {/* Minus */}
          <button
            onClick={() => adjust(-1)}
            disabled={seconds <= TIMER_OPTIONS[0]}
            style={{
              all:          "unset",
              cursor:       seconds <= TIMER_OPTIONS[0] ? "default" : "pointer",
              width:        52, height: 52,
              borderRadius: "50%",
              background:   seconds <= TIMER_OPTIONS[0]
                ? "rgba(255,255,255,0.05)"
                : "rgba(99,102,241,0.2)",
              border:       `2px solid ${seconds <= TIMER_OPTIONS[0]
                ? "rgba(255,255,255,0.1)"
                : "rgba(99,102,241,0.5)"}`,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     28, color: "#fff",
              opacity:      seconds <= TIMER_OPTIONS[0] ? 0.3 : 1,
              transition:   "all 0.15s ease",
            }}
          >
            −
          </button>

          {/* Time display */}
          <div style={{
            minWidth:   120,
            textAlign:  "center",
          }}>
            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize:   64,
              color:      "#fff",
              lineHeight: 1,
              textShadow: "0 0 32px rgba(99,102,241,0.8)",
            }}>
              {mins > 0
                ? `${mins}:${String(secs).padStart(2, "0")}`
                : `${secs}s`}
            </div>
            <div style={{
              fontSize:   11, fontWeight: 900,
              color:      "rgba(255,255,255,0.3)",
              letterSpacing: 2, marginTop: 4,
            }}>
              {seconds === DEFAULT_TIMER ? "DEFAULT" : "CUSTOM"}
            </div>
          </div>

          {/* Plus */}
          <button
            onClick={() => adjust(+1)}
            disabled={seconds >= TIMER_OPTIONS[TIMER_OPTIONS.length - 1]}
            style={{
              all:          "unset",
              cursor:       seconds >= TIMER_OPTIONS[TIMER_OPTIONS.length - 1]
                ? "default" : "pointer",
              width:        52, height: 52,
              borderRadius: "50%",
              background:   seconds >= TIMER_OPTIONS[TIMER_OPTIONS.length - 1]
                ? "rgba(255,255,255,0.05)"
                : "rgba(99,102,241,0.2)",
              border:       `2px solid ${seconds >= TIMER_OPTIONS[TIMER_OPTIONS.length - 1]
                ? "rgba(255,255,255,0.1)"
                : "rgba(99,102,241,0.5)"}`,
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              fontSize:     28, color: "#fff",
              opacity:      seconds >= TIMER_OPTIONS[TIMER_OPTIONS.length - 1]
                ? 0.3 : 1,
              transition:   "all 0.15s ease",
            }}
          >
            +
          </button>
        </div>

        {/* Option pills */}
        <div style={{marginTop:'20px'}} className="flex gap-2 justify-center flex-wrap mt-4">
          {TIMER_OPTIONS.map(t => (
            <button
              key={t}
              onClick={() => setSeconds(t)}
              style={{
                all:          "unset",
                cursor:       "pointer",
                padding:      "5px 14px",
                borderRadius: 99,
                background:   seconds === t
                  ? "#6366F1"
                  : "rgba(255,255,255,0.05)",
                border:       `1.5px solid ${seconds === t
                  ? "#6366F1"
                  : "rgba(255,255,255,0.1)"}`,
                fontFamily:   "'Baloo 2', cursive",
                fontSize:     12, fontWeight: 900,
                color:        "#fff",
                transition:   "all 0.15s ease",
                boxShadow:    seconds === t
                  ? "0 0 16px #6366F180"
                  : "none",
              }}
            >
              {t >= 60
                ? `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`
                : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{
        animation:  "slideUp 0.6s ease both",
        display:    "flex",
        gap:        12,
        maxWidth:   480,
        flexWrap:   "wrap",
        justifyContent: "center",
      }}>
        {[
          { icon: "👁️", text: "Watch tiles light up" },
          { icon: "🧠", text: "Memorize the pattern" },
          { icon: "👆", text: "Tap all correct tiles" },
          { icon: "🏆", text: "Most levels wins!" },
        ].map((h, i) => (
          <div key={i} style={{
            display:      "flex",
            alignItems:   "center",
            gap:          8,
            background:   "rgba(255,255,255,0.04)",
            border:       "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding:      "8px 14px",
          }}>
            <span style={{ fontSize: 18 }}>{h.icon}</span>
            <span style={{
              fontSize:   11, fontWeight: 800,
              color:      "rgba(255,255,255,0.5)",
            }}>
              {h.text}
            </span>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(seconds)}
        style={{
          all:          "unset",
          cursor:       "pointer",
          background:   "linear-gradient(135deg, #6366F1, #4F46E5)",
          borderRadius: 20,
          padding:      "18px 64px",
          fontFamily:   "'Lilita One', cursive",
          fontSize:     28, color: "#fff",
          letterSpacing: 1,
          boxShadow:    "0 8px 32px rgba(99,102,241,0.5), 0 4px 0 #3730A3",
          animation:    "slideUp 0.7s ease both",
          transition:   "transform 0.1s ease",
        }}
        onMouseDown={e => {
          e.currentTarget.style.transform = "translateY(3px)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4), 0 1px 0 #3730A3";
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.5), 0 4px 0 #3730A3";
        }}
      >
        🧠 Start Game
      </button>
    </div>
  );
}