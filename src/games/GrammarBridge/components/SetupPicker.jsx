import { useState } from "react";
import { ROUND_OPTIONS, DEFAULT_ROUNDS, DIFFICULTY_TIERS, DIFFICULTY_KEYS } from "../constants";

export default function SetupPicker({ onStart }) {
  const [rounds,     setRounds]     = useState(DEFAULT_ROUNDS);
  const [difficulty, setDifficulty] = useState(null);

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
      `}</style>

      {/* Title */}
      <div style={{ animation: "slideUp 0.4s ease both", textAlign: "center" }}>
        <div style={{ fontSize: 52, animation: "bob 1.8s ease-in-out infinite", display: "inline-block" }}>🌉</div>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 52, color: "#fff", letterSpacing: 2,
          textShadow: "0 0 40px rgba(99,102,241,0.6)",
        }}>
          Grammar<span style={{ color: "#818CF8" }}>Bridge</span>
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 800, marginTop: 4 }}>
          Build the bridge. Cross to victory.
        </div>
      </div>

      {/* Rounds */}
      <div className="flex flex-col items-center gap-3" style={{ animation: "slideUp 0.5s ease both" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
          NUMBER OF ROUNDS
        </div>
        <div className="flex flex-wrap gap-2 justify-center" style={{ maxWidth: 480 }}>
          {ROUND_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => setRounds(r)}
              style={{
                all: "unset", cursor: "pointer",
                padding: "8px 18px", borderRadius: 12,
                background: rounds === r ? "#818CF8" : "rgba(255,255,255,0.06)",
                border: `1.5px solid ${rounds === r ? "#818CF8" : "rgba(255,255,255,0.1)"}`,
                fontFamily: "'Baloo 2', cursive",
                fontSize: 15, fontWeight: 900, color: "#fff",
                transition: "all 0.15s ease",
                boxShadow: rounds === r ? "0 0 16px #818CF880" : "none",
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div className="flex flex-col items-center gap-3" style={{ animation: "slideUp 0.6s ease both" }}>
        <div style={{ fontSize: 11, fontWeight: 900, color: "rgba(255,255,255,0.4)", letterSpacing: 2 }}>
          DIFFICULTY
        </div>
        <div className="flex gap-3">
          {DIFFICULTY_KEYS.map((key, i) => {
            const d        = DIFFICULTY_TIERS[i];
            const selected = difficulty === key;
            return (
              <button
                key={key}
                onClick={() => setDifficulty(key)}
                style={{
                  all: "unset", cursor: "pointer",
                  padding: "18px 22px", borderRadius: 20, textAlign: "center",
                  minWidth: 120,
                  background: selected ? `${d.color}22` : "rgba(255,255,255,0.04)",
                  border: `2px solid ${selected ? d.color : "rgba(255,255,255,0.08)"}`,
                  transform: selected ? "translateY(-4px)" : "none",
                  transition: "all 0.2s ease",
                  boxShadow: selected ? `0 12px 28px ${d.color}30` : "none",
                }}
              >
                <div style={{ fontSize: 30, marginBottom: 6 }}>{d.emoji}</div>
                <div style={{ fontFamily: "'Lilita One', cursive", fontSize: 16, color: "#fff", marginBottom: 4 }}>
                  {d.label}
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700, lineHeight: 1.4 }}>
                  {d.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start */}
      {difficulty && (
        <button
          onClick={() => onStart({ rounds, difficulty })}
          style={{
            all: "unset", cursor: "pointer",
            background: "linear-gradient(135deg, #6366F1, #4F46E5)",
            borderRadius: 20, padding: "18px 60px",
            fontFamily: "'Lilita One', cursive",
            fontSize: 28, color: "#fff", letterSpacing: 1,
            boxShadow: "0 8px 32px rgba(99,102,241,0.5), 0 4px 0 #3730A3",
            animation: "slideUp 0.3s ease both",
          }}
          onMouseDown={e => {
            e.currentTarget.style.transform = "translateY(3px)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(99,102,241,0.4), 0 1px 0 #3730A3";
          }}
          onMouseUp={e => {
            e.currentTarget.style.transform = "none";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.5), 0 4px 0 #3730A3";
          }}
        >
          🌉 Start Game!
        </button>
      )}
    </div>
  );
}