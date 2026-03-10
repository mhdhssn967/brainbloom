import { useState, useEffect, useRef } from "react";
import { X, Play, ChevronRight }       from "lucide-react";

export default function GameModal({ game, onClose, onPlay }) {
  const [tab,    setTab]    = useState("about");  // "about" | "how"
  const [exiting, setExiting] = useState(false);
  const backdropRef = useRef();

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    setTab("about");
    setExiting(false);
  }, [game?.id]);

  function handleClose() {
    setExiting(true);
    setTimeout(onClose, 220);
  }

  if (!game) return null;

  const accent = game.accentColor;

  return (
    <>
      <style>{`
        @keyframes backdropIn  { from{opacity:0} to{opacity:1} }
        @keyframes backdropOut { from{opacity:1} to{opacity:0} }
        @keyframes modalIn  {
          from { opacity:0; transform:translate(-50%,-46%) scale(0.92); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1);    }
        }
        @keyframes modalOut {
          from { opacity:1; transform:translate(-50%,-50%) scale(1);    }
          to   { opacity:0; transform:translate(-50%,-46%) scale(0.92); }
        }
        @keyframes stepIn {
          from { opacity:0; transform:translateX(-12px); }
          to   { opacity:1; transform:translateX(0);     }
        }
        @keyframes shimmerModal {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        style={{
          position:       "fixed", inset: 0,
          background:     "rgba(0,0,0,0.75)",
          backdropFilter: "blur(8px)",
          zIndex:         100,
          animation:      `${exiting ? "backdropOut" : "backdropIn"} 0.22s ease both`,
        }}
      />

      {/* Modal */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:     "fixed",
          top: "50%", left: "50%",
          width:        500,
          maxHeight:    "88vh",
          overflowY:    "auto",
          background:   "#0D1B2A",
          border:       `1.5px solid ${accent}40`,
          borderRadius: 28,
          zIndex:       101,
          boxShadow:    `0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px ${accent}20`,
          animation:    `${exiting ? "modalOut" : "modalIn"} 0.28s cubic-bezier(0.34,1.56,0.64,1) both`,
          scrollbarWidth: "none",
        }}
      >
        {/* ── Hero image ──────────────────────────────────────────── */}
        <div style={{
          height:   200,
          position: "relative",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <img
            src={game.icon}
            alt={game.name}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", display: "block",
            }}
            onError={e => { e.target.style.display = "none"; }}
          />

          {/* Gradient over image */}
          <div style={{
            position:   "absolute", inset: 0,
            background: `linear-gradient(to bottom,
              ${accent}22 0%,
              transparent 40%,
              rgba(13,27,42,0.7) 70%,
              rgba(13,27,42,1) 100%
            )`,
          }} />

          {/* Shimmer sweep */}
          <div style={{
            position:       "absolute", inset: 0,
            background:     `linear-gradient(105deg, transparent 40%, ${accent}18 50%, transparent 60%)`,
            backgroundSize: "200% 100%",
            animation:      "shimmerModal 2.5s ease-in-out infinite",
          }} />

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              all:          "unset",
              cursor:       "pointer",
              position:     "absolute",
              top: 12, right: 12,
              width:        34, height: 34,
              borderRadius: "50%",
              background:   "rgba(0,0,0,0.55)",
              border:       "1.5px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              transition:   "background 0.2s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.5)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.55)"}
          >
            <X size={15} color="#fff" />
          </button>

          {/* Subject badge */}
          <div style={{
            position:      "absolute",
            top: 12, left: 12,
            background:    accent,
            color:         "#fff",
            fontSize:      10,
            fontWeight:    900,
            padding:       "3px 10px",
            borderRadius:  99,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            boxShadow:     `0 4px 12px ${accent}60`,
          }}>
            {game.subject}
          </div>

          {/* Emoji */}
          <div style={{
            position:   "absolute",
            bottom:     14, right: 16,
            fontSize:   40,
            filter:     `drop-shadow(0 0 12px ${accent}80)`,
            lineHeight: 1,
          }}>
            {game.mockupEmoji}
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────── */}
        <div style={{ padding: "20px 24px 28px" }}>

          {/* Title + tagline */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily:    "'Lilita One', cursive",
              fontSize:      26, color: "#fff",
              lineHeight:    1.1, marginBottom: 4,
              textShadow:    `0 0 24px ${accent}50`,
            }}>
              {game.name}
            </div>
            <div style={{
              fontSize:   12, fontWeight: 700,
              color:      accent, letterSpacing: 0.5,
            }}>
              {game.tagline}
            </div>
          </div>

          {/* ── Tabs ──────────────────────────────────────────────── */}
          <div style={{
            display:      "flex",
            gap:          4,
            background:   "rgba(255,255,255,0.05)",
            borderRadius: 12,
            padding:      4,
            marginBottom: 18,
          }}>
            {[
              { id: "about", label: "About"       },
              { id: "how",   label: "How to Play" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  all:          "unset",
                  cursor:       "pointer",
                  flex:         1,
                  padding:      "8px 0",
                  borderRadius: 9,
                  textAlign:    "center",
                  fontFamily:   "'Baloo 2', cursive",
                  fontSize:     13, fontWeight: 900,
                  color:        tab === t.id ? "#fff" : "rgba(255,255,255,0.35)",
                  background:   tab === t.id ? accent : "transparent",
                  boxShadow:    tab === t.id ? `0 4px 12px ${accent}50` : "none",
                  transition:   "all 0.2s ease",
                  letterSpacing: 0.5,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── About tab ─────────────────────────────────────────── */}
          {tab === "about" && (
            <div style={{ animation: "stepIn 0.25s ease both" }}>
              <p style={{
                fontSize:   13, fontWeight: 700,
                color:      "rgba(255,255,255,0.6)",
                lineHeight: 1.8, margin: 0,
                marginBottom: 20,
              }}>
                {game.description}
              </p>

              {/* Modes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  fontSize: 10, fontWeight: 900,
                  color: "rgba(255,255,255,0.3)", letterSpacing: 2,
                  marginBottom: 8,
                }}>
                  GAME MODES
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {game.modes.map(m => (
                    <div key={m} style={{
                      padding:      "5px 14px",
                      borderRadius: 99,
                      background:   `${accent}18`,
                      border:       `1.5px solid ${accent}40`,
                      fontSize:     12, fontWeight: 800,
                      color:        accent,
                      letterSpacing: 0.5,
                    }}>
                      {m}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── How to play tab ───────────────────────────────────── */}
          {tab === "how" && (
            <div style={{ animation: "stepIn 0.25s ease both" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {(game.howToPlay ?? []).map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display:      "flex",
                      alignItems:   "flex-start",
                      gap:          12,
                      padding:      "12px 14px",
                      borderRadius: 14,
                      background:   "rgba(255,255,255,0.04)",
                      border:       "1px solid rgba(255,255,255,0.07)",
                      animation:    `stepIn 0.3s ${i * 0.06}s ease both`,
                    }}
                  >
                    {/* Step number */}
                    <div style={{
                      width:          28, height: 28,
                      borderRadius:   "50%",
                      background:     accent,
                      boxShadow:      `0 4px 12px ${accent}50`,
                      display:        "flex",
                      alignItems:     "center",
                      justifyContent: "center",
                      flexShrink:     0,
                      fontFamily:     "'Lilita One', cursive",
                      fontSize:       13, color: "#fff",
                    }}>
                      {item.step}
                    </div>

                    {/* Step text */}
                    <div style={{
                      fontSize:   13, fontWeight: 700,
                      color:      "rgba(255,255,255,0.75)",
                      lineHeight: 1.55,
                      paddingTop: 4,
                    }}>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Divider ───────────────────────────────────────────── */}
          <div style={{
            height:     1,
            background: `linear-gradient(90deg, transparent, ${accent}40, transparent)`,
            marginBottom: 18,
          }} />

          {/* ── Play button ───────────────────────────────────────── */}
          <button
            onClick={() => onPlay(game, "dual")}
            style={{
              all:            "unset",
              cursor:         "pointer",
              width:          "100%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              gap:            10,
              padding:        "16px 0",
              borderRadius:   18,
              background:     `linear-gradient(135deg, ${accent}, ${accent}cc)`,
              boxShadow:      `0 8px 28px ${accent}50, 0 3px 0 ${accent}80`,
              transition:     "all 0.15s ease",
              position:       "relative",
              overflow:       "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform  = "translateY(-2px)";
              e.currentTarget.style.boxShadow  = `0 12px 36px ${accent}60, 0 3px 0 ${accent}80`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform  = "translateY(0)";
              e.currentTarget.style.boxShadow  = `0 8px 28px ${accent}50, 0 3px 0 ${accent}80`;
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform  = "translateY(2px)";
              e.currentTarget.style.boxShadow  = `0 4px 16px ${accent}40, 0 1px 0 ${accent}80`;
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform  = "translateY(-2px)";
            }}
          >
            {/* Shimmer */}
            <div style={{
              position:       "absolute", inset: 0,
              background:     "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation:      "shimmerModal 2s ease-in-out infinite",
            }} />

            <Play size={20} color="#fff" fill="#fff" />
            <span style={{
              fontFamily:    "'Lilita One', cursive",
              fontSize:      22, color: "#fff",
              letterSpacing: 1.5,
              position:      "relative",
            }}>
              Start Game
            </span>
            <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
          </button>
        </div>
      </div>
    </>
  );
}