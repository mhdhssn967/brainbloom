import { useState } from "react";
import { CATEGORIES } from "@/data/spotItData";

export default function CategoryPicker({ onSelect }) {
  const [hovered, setHovered] = useState(null);

  const options = [
    { key: "random", label: "Random Mix", emoji: "🎲",
      desc: "Questions from all categories" },
    ...Object.entries(CATEGORIES).map(([key, val]) => ({
      key,
      label: val.label,
      emoji: val.emoji,
      desc:  `${val.entries.length} entries`,
    })),
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(20px) }
          to   { opacity:1; transform:translateY(0) }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40,
        animation: "slideUp 0.4s ease both" }}
      >
        <div style={{ fontSize: 52, marginBottom: 8 }}>🔍</div>
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      48,
          color:         "#fff",
          letterSpacing: 2,
          textShadow:    "0 0 40px rgba(249,115,22,0.4)",
        }}>
          Spot<span style={{ color: "#F97316" }}>It!</span>
        </div>
        <div style={{
          fontSize:      14,
          color:         "rgba(255,255,255,0.4)",
          fontWeight:    800,
          marginTop:     6,
          letterSpacing: 1,
        }}>
          Choose a category to begin
        </div>
      </div>

      {/* Category grid */}
      <div style={{
        display:             "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap:                 16,
        padding:             "0 40px",
        maxWidth:            900,
        width:               "100%",
        animation:           "slideUp 0.4s 0.1s ease both",
      }}>
        {options.map((opt, i) => {
          const isHovered = hovered === opt.key;
          const isRandom  = opt.key === "random";

          return (
            <button
              key={opt.key}
              onMouseEnter={() => setHovered(opt.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(opt.key)}
              style={{
                all:          "unset",
                cursor:       "pointer",
                background:   isHovered
                  ? isRandom ? "#F9731620" : "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.04)",
                border:       `2px solid ${isHovered
                  ? isRandom ? "#F97316" : "rgba(255,255,255,0.2)"
                  : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20,
                padding:      "20px 16px",
                textAlign:    "center",
                transform:    isHovered ? "translateY(-4px)" : "translateY(0)",
                transition:   "all 0.2s ease",
                boxShadow:    isHovered
                  ? isRandom
                    ? "0 12px 32px rgba(249,115,22,0.2)"
                    : "0 12px 32px rgba(255,255,255,0.05)"
                  : "none",
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 10 }}>{opt.emoji}</div>
              <div style={{
                fontFamily:    "'Baloo 2', cursive",
                fontSize:      16,
                fontWeight:    900,
                color:         isRandom && isHovered ? "#F97316" : "#fff",
                letterSpacing: 0.5,
                marginBottom:  4,
              }}>
                {opt.label}
              </div>
              <div style={{
                fontSize:   11,
                color:      "rgba(255,255,255,0.3)",
                fontWeight: 700,
              }}>
                {opt.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}