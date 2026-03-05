import { useState }  from "react";
import {
  MIN_FROGS, MAX_FROGS, DEFAULT_FROGS,
  DIFFICULTY, AGE_GROUP_KEYS,
} from "../constants";

export default function SetupPicker({ onStart }) {
  const [frogCount, setFrogCount] = useState(DEFAULT_FROGS);
  const [ageGroup,  setAgeGroup]  = useState(null);

  const canStart = ageGroup !== null;

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
        @keyframes frogBounce {
          0%,100%{transform:translateY(0)}
          50%    {transform:translateY(-12px)}
        }
      `}</style>

      {/* Header */}
      <div className="text-center" style={{animation:"slideUp 0.4s ease both"}}>
        <div style={{
          fontSize:52, marginBottom:8,
          animation:"frogBounce 1s ease-in-out infinite",
          display:"inline-block",
        }}>
          🐸
        </div>
        <div style={{
          fontFamily:"'Lilita One', cursive",
          fontSize:52, color:"#fff", letterSpacing:2,
          textShadow:"0 0 40px rgba(34,197,94,0.5)",
        }}>
          Frog<span style={{color:"#22C55E"}}>Catch!</span>
        </div>
        <div style={{
          fontSize:14, color:"rgba(255,255,255,0.4)",
          fontWeight:800, marginTop:6, letterSpacing:1,
        }}>
          Set up your game
        </div>
      </div>

      {/* Age group picker */}
      <div className="flex flex-col items-center gap-4"
        style={{animation:"slideUp 0.4s 0.1s ease both"}}
      >
        <div style={{
          fontSize:12, fontWeight:900,
          color:"rgba(255,255,255,0.4)", letterSpacing:2,
        }}>
          SELECT CLASS GROUP
        </div>
        <div className="grid grid-cols-4 gap-3">
          {AGE_GROUP_KEYS.map(key => {
            const diff       = DIFFICULTY[key];
            const isSelected = ageGroup === key;

            return (
              <button
                key={key}
                onClick={() => setAgeGroup(key)}
                style={{
                  all:          "unset",
                  cursor:       "pointer",
                  padding:      "20px 24px",
                  borderRadius: 20,
                  background:   isSelected
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(255,255,255,0.04)",
                  border:       `2.5px solid ${isSelected
                    ? "#22C55E"
                    : "rgba(255,255,255,0.08)"}`,
                  textAlign:    "center",
                  transform:    isSelected ? "translateY(-4px)" : "none",
                  transition:   "all 0.2s ease",
                  boxShadow:    isSelected
                    ? "0 12px 28px rgba(34,197,94,0.2)"
                    : "none",
                  minWidth:     140,
                }}
              >
                <div style={{fontSize:32, marginBottom:8}}>{diff.emoji}</div>
                <div style={{
                  fontFamily:    "'Lilita One', cursive",
                  fontSize:      20, color:"#fff", marginBottom:6,
                }}>
                  {diff.label}
                </div>
                <div style={{
                  fontSize:10, color:"rgba(255,255,255,0.35)",
                  fontWeight:700, lineHeight:1.4,
                }}>
                  {diff.description}
                </div>
                {isSelected && (
                  <div style={{
                    marginTop:    8,
                    background:   "#22C55E",
                    borderRadius: 99,
                    padding:      "2px 10px",
                    fontSize:     10,
                    fontWeight:   900,
                    color:        "#fff",
                    display:      "inline-block",
                  }}>
                    ✓ Selected
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frog count picker */}
      <div className="flex flex-col items-center gap-3"
        style={{animation:"slideUp 0.4s 0.2s ease both"}}
      >
        <div style={{
          fontSize:12, fontWeight:900,
          color:"rgba(255,255,255,0.4)", letterSpacing:2,
        }}>
          NUMBER OF FROGS
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setFrogCount(c => Math.max(MIN_FROGS, c - 5))}
            style={{
              all:"unset", cursor:"pointer",
              width:44, height:44, borderRadius:"50%",
              background:"rgba(255,255,255,0.08)",
              border:"2px solid rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center",
              justifyContent:"center",
              fontSize:24, color:"#fff", fontWeight:900,
            }}
          >−</button>

          <div className="flex flex-col items-center">
            <div style={{
              fontFamily:"'Lilita One', cursive",
              fontSize:64, color:"#22C55E",
              textShadow:"0 0 24px rgba(34,197,94,0.5)",
              lineHeight:1,
            }}>
              {frogCount}
            </div>
            <div style={{
              fontSize:11, color:"rgba(255,255,255,0.25)",
              fontWeight:700, letterSpacing:1,
            }}>
              frogs
            </div>
          </div>

          <button
            onClick={() => setFrogCount(c => Math.min(MAX_FROGS, c + 5))}
            style={{
              all:"unset", cursor:"pointer",
              width:44, height:44, borderRadius:"50%",
              background:"rgba(255,255,255,0.08)",
              border:"2px solid rgba(255,255,255,0.15)",
              display:"flex", alignItems:"center",
              justifyContent:"center",
              fontSize:24, color:"#fff", fontWeight:900,
            }}
          >+</button>
        </div>

        {/* Frog count visual indicator */}
        <div className="flex flex-wrap gap-1 justify-center"
          style={{maxWidth:320}}
        >
          {Array.from({length: frogCount}, (_, i) => (
            <span key={i} style={{
              fontSize:     14,
              lineHeight:   1,
              opacity:      0.7,
              transition:   "all 0.1s ease",
            }}>
              🐸
            </span>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={() => canStart && onStart(ageGroup, frogCount)}
        style={{
          all:          "unset",
          cursor:       canStart ? "pointer" : "default",
          background:   canStart
            ? "linear-gradient(135deg, #22C55E, #16A34A)"
            : "rgba(255,255,255,0.08)",
          borderRadius: 20,
          padding:      "18px 60px",
          fontFamily:   "'Lilita One', cursive",
          fontSize:     28,
          color:        canStart ? "#fff" : "rgba(255,255,255,0.2)",
          letterSpacing: 1,
          boxShadow:    canStart
            ? "0 8px 32px rgba(34,197,94,0.4), 0 4px 0 #15803D"
            : "none",
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
        {canStart ? "🐸 Start Game!" : "← Pick a class group"}
      </button>
    </div>
  );
}