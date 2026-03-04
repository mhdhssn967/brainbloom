import { useState }             from "react";
import { SPELL_IT_DATA }        from "@/data/spellItData";
import { MIN_ROUNDS, MAX_ROUNDS, DEFAULT_ROUNDS } from "../constants";

const CATEGORY_KEYS = Object.keys(SPELL_IT_DATA);

export default function CategoryPicker({ onStart }) {
  const [category,    setCategory]    = useState(null);
  const [rounds,      setRounds]      = useState(DEFAULT_ROUNDS);
  const [hovered,     setHovered]     = useState(null);

  const canStart = category !== null;

  const options = [
    { key: "random", label: "Random Mix", emoji: "🎲",
      desc: "Mix of all categories" },
    ...CATEGORY_KEYS.map(k => ({
      key:   k,
      label: SPELL_IT_DATA[k].label,
      emoji: SPELL_IT_DATA[k].emoji,
      desc:  `${SPELL_IT_DATA[k].words.length} words`,
    })),
  ];

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-8"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes slideUp {
          from{opacity:0;transform:translateY(20px)}
          to  {opacity:1;transform:translateY(0)}
        }
      `}</style>

      {/* Header */}
      <div className="text-center" style={{animation:"slideUp 0.4s ease both"}}>
        <div style={{fontSize:52, marginBottom:8}}>✏️</div>
        <div style={{
          fontFamily:"'Lilita One', cursive",
          fontSize:52, color:"#fff", letterSpacing:2,
          textShadow:"0 0 40px rgba(250,204,21,0.5)",
        }}>
          Spell<span style={{color:"#FACC15"}}>It!</span>
        </div>
        <div style={{
          fontSize:14, color:"rgba(255,255,255,0.4)",
          fontWeight:800, marginTop:6, letterSpacing:1,
        }}>
          Choose a category and number of rounds
        </div>
      </div>

      {/* Category grid */}
      <div className="grid gap-4 px-10"
        style={{
          gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, 1fr)`,
          animation:"slideUp 0.4s 0.1s ease both",
        }}
      >
        {options.map((opt, i) => {
          const isSelected = category === opt.key;
          const isHov      = hovered === opt.key;

          return (
            <button
              key={opt.key}
              onClick={() => setCategory(opt.key)}
              onMouseEnter={() => setHovered(opt.key)}
              onMouseLeave={() => setHovered(null)}
              style={{
                all:          "unset",
                cursor:       "pointer",
                background:   isSelected
                  ? "rgba(250,204,21,0.15)"
                  : isHov
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.03)",
                border:       `2.5px solid ${isSelected
                  ? "#FACC15"
                  : isHov
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(255,255,255,0.08)"}`,
                borderRadius: 20,
                padding:      "20px 24px",
                textAlign:    "center",
                transform:    isSelected
                  ? "translateY(-6px) scale(1.03)"
                  : isHov
                    ? "translateY(-3px)"
                    : "translateY(0)",
                transition:   "all 0.2s ease",
                boxShadow:    isSelected
                  ? "0 12px 32px rgba(250,204,21,0.2)"
                  : "none",
                minWidth:     140,
              }}
            >
              <div style={{fontSize:36, marginBottom:8}}>{opt.emoji}</div>
              <div style={{
                fontFamily:    "'Baloo 2', cursive",
                fontSize:      16, fontWeight:900, color:"#fff",
                letterSpacing: 0.5, marginBottom:4,
              }}>
                {opt.label}
              </div>
              <div style={{
                fontSize:9, color:"rgba(255,255,255,0.3)",
                fontWeight:700, letterSpacing:1,
              }}>
                {opt.desc}
              </div>
              {isSelected && (
                <div style={{
                  marginTop:    8,
                  background:   "#FACC15",
                  borderRadius: 99,
                  padding:      "2px 10px",
                  fontSize:     10,
                  fontWeight:   900,
                  color:        "#78350F",
                  display:      "inline-block",
                }}>
                  ✓ Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Round selector */}
      <div className="flex flex-col items-center gap-3"
        style={{animation:"slideUp 0.4s 0.2s ease both"}}
      >
        <div style={{
          fontSize:13, fontWeight:900,
          color:"rgba(255,255,255,0.5)", letterSpacing:2,
        }}>
          NUMBER OF ROUNDS
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRounds(r => Math.max(MIN_ROUNDS, r - 1))}
            style={{
              all:"unset", cursor:"pointer",
              width:40, height:40, borderRadius:"50%",
              background:"rgba(255,255,255,0.08)",
              border:"2px solid rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, color:"#fff", fontWeight:900,
            }}
          >−</button>

          <div style={{
            fontFamily:"'Lilita One', cursive",
            fontSize:52, color:"#FACC15",
            textShadow:"0 0 24px rgba(250,204,21,0.5)",
            minWidth:60, textAlign:"center", lineHeight:1,
          }}>
            {rounds}
          </div>

          <button
            onClick={() => setRounds(r => Math.min(MAX_ROUNDS, r + 1))}
            style={{
              all:"unset", cursor:"pointer",
              width:40, height:40, borderRadius:"50%",
              background:"rgba(255,255,255,0.08)",
              border:"2px solid rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:22, color:"#fff", fontWeight:900,
            }}
          >+</button>
        </div>
        <div style={{
          fontSize:11, color:"rgba(255,255,255,0.25)",
          fontWeight:700,
        }}>
          {MIN_ROUNDS} – {MAX_ROUNDS} rounds
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => canStart && onStart(category, rounds)}
        style={{
          all:          "unset",
          cursor:       canStart ? "pointer" : "default",
          background:   canStart
            ? "linear-gradient(135deg, #FACC15, #F59E0B)"
            : "rgba(255,255,255,0.08)",
          border:       "none",
          borderRadius: 20,
          padding:      "18px 56px",
          fontFamily:   "'Lilita One', cursive",
          fontSize:     26,
          color:        canStart ? "#78350F" : "rgba(255,255,255,0.2)",
          letterSpacing: 1,
          boxShadow:    canStart
            ? "0 8px 32px rgba(250,204,21,0.4), 0 4px 0 #D97706"
            : "none",
          transform:    canStart ? "translateY(0)" : "none",
          transition:   "all 0.2s ease",
          animation:    "slideUp 0.4s 0.3s ease both",
        }}
        onMouseDown={e => {
          if (canStart) e.currentTarget.style.transform = "translateY(3px)";
        }}
        onMouseUp={e => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {canStart ? "🚀 Let's Spell!" : "← Pick a category"}
      </button>
    </div>
  );
}