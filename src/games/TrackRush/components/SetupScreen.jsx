import { useState, useEffect } from "react";
import { getAllSetsForSchool }  from "@/offline/db";
import useSchoolStore           from "@/store/useSchoolStore";
import { adaptType1ToTrackRush } from "@/data/packAdapter";
import {
  Search, BookOpen, Hash, GraduationCap,
  User, ChevronDown, ChevronUp, X, Loader2,
} from "lucide-react";
import { LEVEL_KEYS, LEVEL_NAMES, TIMER_OPTIONS, DEFAULT_TIMER } from "@/data/trackRushData";

const ACCENT = "#F59E0B";

function Step({ n, label, done }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
      <div style={{
        width:28, height:28, borderRadius:"50%", flexShrink:0,
        background:  done ? ACCENT : `${ACCENT}18`,
        border:      `2px solid ${done ? ACCENT : `${ACCENT}40`}`,
        display:     "flex", alignItems:"center", justifyContent:"center",
        fontSize:11, fontWeight:900,
        color:    done ? "#000" : ACCENT,
        transition: "all 0.3s ease",
      }}>
        {done ? "✓" : n}
      </div>
      <span style={{
        fontSize:10, fontWeight:900, letterSpacing:2,
        color: done ? ACCENT : "rgba(255,255,255,0.35)",
        textTransform:"uppercase",
      }}>
        {label}
      </span>
    </div>
  );
}

export default function SetupScreen({ onStart }) {
  const { schoolData }    = useSchoolStore();
  const [mode, setMode]           = useState(null);        // "custom" | "builtin"
const [packs, setPacks]         = useState([]);
const [loading, setLoading]     = useState(true);
const [search, setSearch]       = useState("");
const [selectedPack, setSelectedPack] = useState(null);
const [level, setLevel]         = useState(null);
const [seconds, setSeconds]     = useState(DEFAULT_TIMER);
const [showPicker, setShowPicker] = useState(false);

const canStart =
  mode === "custom"  ? !!selectedPack :
  mode === "builtin" ? !!level        : false;

  useEffect(() => {
    getAllSetsForSchool(schoolData.id).then((all) => {
      // Only type1 packs work with TrackRush
      const compatible = all.filter((s) => s.type === "type1");
      setPacks(compatible);
      setLoading(false);
    });
  }, []);

  const filtered = packs.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.packId?.toString().includes(q) ||
      p.subject?.toLowerCase().includes(q) ||
      p.teacherName?.toLowerCase().includes(q)
    );
  });

  const tidx   = TIMER_OPTIONS.indexOf(seconds);
  const mins   = Math.floor(seconds / 60);
  const secs   = seconds % 60;
  // const canStart = !!selectedPack;

  const handleStart = () => {
  if (!canStart) return;

  if (mode === "custom") {
    const adapted = adaptType1ToTrackRush(selectedPack.questions);
    onStart({
      questions:    adapted,
      totalSeconds: seconds,
      packTitle:    selectedPack.title,
    });
  } else {
    // Built-in — use original levelKey path
    onStart({
      levelKey:     level,
      totalSeconds: seconds,
    });
  }
};

  return (
    <div style={{
      width:"100vw", minHeight:"100vh",
      background:"#060B18",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"'Nunito', sans-serif",
      padding:"24px 16px", boxSizing:"border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes runBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes panelIn   { from{opacity:0;transform:scale(0.94) translateY(18px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes rowIn     { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin      { to{transform:rotate(360deg)} }
        .tr-row { animation: rowIn 0.25s ease both; }
      `}</style>

      <div style={{
        width:"100%", maxWidth:600,
        padding:"32px 36px 36px",
        boxSizing:"border-box",
        background:"rgba(2,8,20,0.88)",
        backdropFilter:"blur(28px)",
        borderRadius:32,
        border:`1.5px solid ${ACCENT}28`,
        boxShadow:`0 40px 80px rgba(0,0,0,0.75), 0 0 60px ${ACCENT}10, inset 0 1px 0 rgba(255,255,255,0.04)`,
        animation:"panelIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both",
        display:"flex", flexDirection:"column", gap:22,
      }}>

        {/* Title */}
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:50, animation:"runBounce 1.8s ease-in-out infinite", display:"inline-block" }}>
            🏃
          </div>
          <div style={{
            fontFamily:"'Lilita One', cursive",
            fontSize:"clamp(28px,5vw,44px)",
            color:"#fff", letterSpacing:2, lineHeight:1.1,
            textShadow:`0 0 40px ${ACCENT}55`,
          }}>
            Track<span style={{ color:ACCENT }}>Rush</span>
          </div>
          <div style={{
            fontSize:10, fontWeight:800,
            color:"rgba(255,255,255,0.25)",
            letterSpacing:3, marginTop:5,
          }}>
            SWIPE TO DODGE · RUN THROUGH THE RIGHT ANSWER
          </div>
        </div>

        {/* Step 1 — Pick a pack */}
        <div className="tr-row">
  <Step n="1" label="Question Mode" done={!!mode} />
  <div style={{ display:"flex", gap:10 }}>
    {[
      {
        key:   "builtin",
        emoji: "🧮",
        title: "Built-in Questions",
        desc:  "Auto-generated math questions",
      },
      {
        key:   "custom",
        emoji: "📚",
        title: "Custom Pack",
        desc:  "Questions created by your teachers",
      },
    ].map((m) => {
      const active = mode === m.key;
      return (
        <button
          key={m.key}
          onClick={() => {
            setMode(m.key);
            setSelectedPack(null);
            setLevel(null);
          }}
          style={{
            all:      "unset",
            cursor:   "pointer",
            flex:     1,
            padding:  "14px 16px",
            borderRadius: 16,
            background: active ? `${ACCENT}15` : "rgba(255,255,255,0.03)",
            border:     `1.5px solid ${active ? ACCENT : "rgba(255,255,255,0.08)"}`,
            display:    "flex",
            flexDirection: "column",
            gap:        4,
            transition: "all 0.2s ease",
            boxShadow:  active ? `0 4px 20px ${ACCENT}25` : "none",
          }}
        >
          <span style={{ fontSize:22 }}>{m.emoji}</span>
          <span style={{
            fontSize:13, fontWeight:900,
            color: active ? ACCENT : "rgba(255,255,255,0.7)",
            fontFamily:"'Nunito', sans-serif",
          }}>
            {m.title}
          </span>
          <span style={{
            fontSize:10, fontWeight:700,
            color: active ? `${ACCENT}99` : "rgba(255,255,255,0.25)",
            fontFamily:"'Nunito', sans-serif",
          }}>
            {m.desc}
          </span>
        </button>
      );
    })}
  </div>
</div>

{/* Step 2 — Level (built-in) or Pack (custom) */}
{mode === "builtin" && (
  <div className="tr-row">
    <Step n="2" label="Class Level" done={!!level} />
    <div style={{ display:"flex", gap:9, flexWrap:"wrap", justifyContent:"center" }}>
      {LEVEL_KEYS.map((key) => (
        <button key={key} onClick={() => setLevel(key)} style={{
          all:"unset", cursor:"pointer",
          padding:"10px 22px", borderRadius:14,
          background:  level === key ? `${ACCENT}20` : "rgba(255,255,255,0.04)",
          border:      `1.5px solid ${level === key ? ACCENT : "rgba(255,255,255,0.08)"}`,
          color:       level === key ? ACCENT : "rgba(255,255,255,0.5)",
          fontFamily:  "'Baloo 2', cursive", fontSize:13, fontWeight:900,
          boxShadow:   level === key ? `0 4px 16px ${ACCENT}30` : "none",
          transform:   level === key ? "translateY(-2px)" : "none",
          transition:  "all 0.18s ease",
        }}>
          📚 {LEVEL_NAMES[key]}
        </button>
      ))}
    </div>
  </div>
)}

{mode === "custom" && (
  <div className="tr-row">
    <Step n="2" label="Question Pack" done={!!selectedPack} />

    {selectedPack ? (
      <div style={{
        display:"flex", alignItems:"center", gap:10,
        background:`${ACCENT}12`,
        border:`1.5px solid ${ACCENT}40`,
        borderRadius:16, padding:"12px 16px",
        cursor:"pointer",
      }}
        onClick={() => setShowPicker(true)}
      >
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{
            fontSize:15, fontWeight:900,
            color:"#fff", margin:"0 0 3px",
            whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
          }}>
            {selectedPack.title}
          </p>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, fontWeight:700, color:`${ACCENT}aa`, display:"flex", alignItems:"center", gap:3 }}>
              <Hash size={10} />{selectedPack.packId}
            </span>
            <span style={{ fontSize:11, fontWeight:700, color:`${ACCENT}aa`, display:"flex", alignItems:"center", gap:3 }}>
              <BookOpen size={10} />{selectedPack.subject}
            </span>
            <span style={{ fontSize:11, fontWeight:700, color:`${ACCENT}aa`, display:"flex", alignItems:"center", gap:3 }}>
              <GraduationCap size={10} />{selectedPack.grade}
            </span>
            <span style={{ fontSize:11, fontWeight:700, color:`${ACCENT}aa` }}>
              {selectedPack.questions?.length} questions
            </span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedPack(null); }}
          style={{
            background:"rgba(255,255,255,0.08)",
            border:"1px solid rgba(255,255,255,0.15)",
            borderRadius:8, padding:6,
            color:"rgba(255,255,255,0.5)",
            cursor:"pointer",
          }}
        >
          <X size={14} />
        </button>
      </div>
    ) : (
      <button
        onClick={() => setShowPicker(true)}
        style={{
          all:"unset", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          width:"100%", boxSizing:"border-box",
          background:"rgba(255,255,255,0.04)",
          border:`1.5px dashed ${ACCENT}30`,
          borderRadius:16, padding:"14px 18px",
          color:"rgba(255,255,255,0.35)",
          fontSize:13, fontWeight:800,
          fontFamily:"'Nunito', sans-serif",
        }}
      >
        {loading
          ? <span style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Loader2 size={15} style={{ animation:"spin 0.8s linear infinite" }} />
              Loading packs...
            </span>
          : packs.length === 0
            ? "No compatible packs found — sync first"
            : `Choose from ${packs.length} available pack${packs.length !== 1 ? "s" : ""}`
        }
        <ChevronDown size={16} />
      </button>
    )}

    {/* Pack picker dropdown */}
    {showPicker && (
      <div style={{
        marginTop:8,
        background:"rgba(2,8,20,0.97)",
        border:`1.5px solid ${ACCENT}25`,
        borderRadius:20,
        overflow:"hidden",
        boxShadow:`0 20px 60px rgba(0,0,0,0.8)`,
        maxHeight:300,
        display:"flex", flexDirection:"column",
      }}>
        <div style={{ padding:"10px 12px", borderBottom:"1px solid rgba(255,255,255,0.06)", position:"relative" }}>
          <Search size={14} style={{
            position:"absolute", left:22,
            top:"50%", transform:"translateY(-50%)",
            color:"rgba(255,255,255,0.3)",
          }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packs..."
            autoFocus
            style={{
              width:"100%", boxSizing:"border-box",
              background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:10,
              padding:"8px 10px 8px 32px",
              fontSize:13, fontWeight:700,
              color:"#fff", outline:"none",
              fontFamily:"'Nunito', sans-serif",
            }}
          />
        </div>

        <div style={{ overflowY:"auto", flex:1 }}>
          {filtered.length === 0 ? (
            <div style={{
              padding:"24px", textAlign:"center",
              color:"rgba(255,255,255,0.3)",
              fontSize:13, fontWeight:700,
            }}>
              {search ? "No packs match" : "No packs available"}
            </div>
          ) : filtered.map((pack) => (
            <button
              key={pack.packId}
              onClick={() => { setSelectedPack(pack); setShowPicker(false); setSearch(""); }}
              style={{
                all:"unset", cursor:"pointer",
                display:"flex", alignItems:"center", gap:12,
                width:"100%", boxSizing:"border-box",
                padding:"12px 16px",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
                transition:"background 0.12s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = `${ACCENT}10`}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width:36, height:36, borderRadius:10, flexShrink:0,
                background:`${ACCENT}18`,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <BookOpen size={16} style={{ color:ACCENT }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{
                  fontSize:14, fontWeight:800,
                  color:"rgba(255,255,255,0.9)",
                  margin:"0 0 3px",
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
                }}>
                  {pack.title}
                </p>
                <div style={{ display:"flex", gap:8 }}>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", gap:2 }}>
                    <Hash size={9} />{pack.packId}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", gap:2 }}>
                    <BookOpen size={9} />{pack.subject}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)", display:"flex", alignItems:"center", gap:2 }}>
                    <User size={9} />{pack.teacherName}
                  </span>
                </div>
              </div>
              <span style={{
                fontSize:11, fontWeight:800,
                color:"rgba(255,255,255,0.25)",
                background:"rgba(255,255,255,0.05)",
                borderRadius:6, padding:"3px 8px",
                flexShrink:0,
              }}>
                {pack.questions?.length}q
              </span>
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
)}

        {/* Step 3 — Timer (identical to before) */}
        {selectedPack && (
          <div className="tr-row">
            <Step n="2" label="Game Duration" done={false} />
            <div style={{
              background:"rgba(255,255,255,0.03)",
              border:`1.5px solid ${ACCENT}18`,
              borderRadius:20, padding:"16px 24px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:12,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:22 }}>
                <button
                  onClick={() => tidx > 0 && setSeconds(TIMER_OPTIONS[tidx - 1])}
                  style={{
                    all:"unset", cursor: tidx > 0 ? "pointer" : "not-allowed",
                    width:42, height:42, borderRadius:"50%",
                    background:`${ACCENT}14`, border:`2px solid ${ACCENT}40`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, color:"#fff", opacity: tidx <= 0 ? 0.25 : 1,
                  }}
                >−</button>

                <div style={{
                  fontFamily:"'Lilita One', cursive",
                  fontSize:50, color:"#fff",
                  lineHeight:1, textShadow:`0 0 24px ${ACCENT}55`,
                  minWidth:100, textAlign:"center",
                }}>
                  {mins > 0 ? `${mins}:${String(secs).padStart(2,"0")}` : `${secs}s`}
                </div>

                <button
                  onClick={() => tidx < TIMER_OPTIONS.length - 1 && setSeconds(TIMER_OPTIONS[tidx + 1])}
                  style={{
                    all:"unset", cursor: tidx < TIMER_OPTIONS.length - 1 ? "pointer" : "not-allowed",
                    width:42, height:42, borderRadius:"50%",
                    background:`${ACCENT}14`, border:`2px solid ${ACCENT}40`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:24, color:"#fff", opacity: tidx >= TIMER_OPTIONS.length - 1 ? 0.25 : 1,
                  }}
                >+</button>
              </div>

              <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center" }}>
                {TIMER_OPTIONS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSeconds(t)}
                    style={{
                      all:"unset", cursor:"pointer",
                      padding:"3px 12px", borderRadius:99,
                      background:  seconds === t ? ACCENT : "rgba(255,255,255,0.05)",
                      border:      `1.5px solid ${seconds === t ? ACCENT : "rgba(255,255,255,0.1)"}`,
                      fontSize:11, fontWeight:900,
                      color: seconds === t ? "#000" : "rgba(255,255,255,0.5)",
                      transition:"all 0.15s ease",
                    }}
                  >
                    {t >= 60 ? `${Math.floor(t/60)}m${t%60>0?` ${t%60}s`:""}` : `${t}s`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          style={{
            all:"unset", cursor: canStart ? "pointer" : "not-allowed",
            display:"block", width:"100%", padding:"16px 0",
            borderRadius:20, textAlign:"center",
            background: canStart
              ? `linear-gradient(135deg, ${ACCENT} 0%, #d97706 100%)`
              : "rgba(255,255,255,0.05)",
            fontFamily:"'Lilita One', cursive",
            fontSize:"clamp(18px,3vw,24px)",
            color: canStart ? "#fff" : "rgba(255,255,255,0.18)",
            letterSpacing:1.5,
            boxShadow: canStart ? `0 8px 28px ${ACCENT}45, 0 3px 0 #92400e` : "none",
            opacity: canStart ? 1 : 0.5,
            transition:"all 0.25s ease",
          }}
        >
          {canStart ? "🏃 Start Running!" : "Choose a question pack to start ↑"}
        </button>

        {canStart && (
  <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", marginTop:-12 }}>
    {mode === "custom" && selectedPack && [
      { label:`📚 ${selectedPack.subject}`               },
      { label:`🎓 ${selectedPack.grade}`                 },
      { label:`⏱ ${mins > 0 ? `${mins}m` : `${secs}s`}` },
      { label:`❓ ${selectedPack.questions?.length} questions` },
    ].map((c, i) => (
      <div key={i} style={{
        padding:"3px 12px", borderRadius:99,
        background:`${ACCENT}18`, border:`1px solid ${ACCENT}35`,
        fontSize:11, fontWeight:900, color:ACCENT, letterSpacing:0.5,
      }}>
        {c.label}
      </div>
    ))}

    {mode === "builtin" && level && [
      { label:`📚 ${LEVEL_NAMES[level]}`                 },
      { label:`⏱ ${mins > 0 ? `${mins}m` : `${secs}s`}` },
      { label:"🧠 Built-in Questions"                    },
    ].map((c, i) => (
      <div key={i} style={{
        padding:"3px 12px", borderRadius:99,
        background:`${ACCENT}18`, border:`1px solid ${ACCENT}35`,
        fontSize:11, fontWeight:900, color:ACCENT, letterSpacing:0.5,
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