import { useState, useRef } from "react";

export default function GameCard({ game, index, onClick }) {
  const [hovered,  setHovered]  = useState(false);
  const [pressed,  setPressed]  = useState(false);
  const [ripples,  setRipples]  = useState([]);
  const cardRef = useRef();

  function addRipple(e) {
    const rect = cardRef.current.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const id   = Date.now();
    setRipples(r => [...r, { id, x, y }]);
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 600);
  }

  const accent = game.accentColor;

  return (
    <>
      <style>{`
        @keyframes rippleOut {
          from { transform: scale(0); opacity: 0.5; }
          to   { transform: scale(4); opacity: 0;   }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes badgePop {
          from { transform: scale(0.8); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>

      <button
        ref={cardRef}
        onClick={(e) => { addRipple(e); onClick(); }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        style={{
          all:           "unset",
          cursor:        "pointer",
          display:       "flex",
          flexDirection: "column",
          borderRadius:  20,
          overflow:      "hidden",
          position:      "relative",
          background:    hovered
            ? `linear-gradient(145deg, ${accent}18, rgba(255,255,255,0.04))`
            : "rgba(255,255,255,0.04)",
          border:        `1.5px solid ${hovered ? accent + "60" : "rgba(255,255,255,0.08)"}`,
          boxShadow:     hovered
            ? `0 20px 48px ${accent}25, 0 0 0 1px ${accent}20, inset 0 1px 0 rgba(255,255,255,0.1)`
            : "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
          transform:     pressed
            ? "translateY(1px) scale(0.985)"
            : hovered
              ? "translateY(-6px) scale(1.02)"
              : "translateY(0) scale(1)",
          transition:    "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
          backdropFilter:"blur(8px)",
        }}
      >
        {/* ── Ripple effect ──────────────────────────────────────── */}
        {ripples.map(rp => (
          <div key={rp.id} style={{
            position:     "absolute",
            left:         rp.x, top: rp.y,
            width:        80, height: 80,
            marginLeft:   -40, marginTop: -40,
            borderRadius: "50%",
            background:   `${accent}40`,
            animation:    "rippleOut 0.6s ease-out both",
            pointerEvents:"none",
            zIndex:       10,
          }} />
        ))}

        {/* ── Shimmer overlay on hover ───────────────────────────── */}
        {hovered && (
          <div style={{
            position:   "absolute", inset: 0,
            background: `linear-gradient(105deg, transparent 40%, ${accent}12 50%, transparent 60%)`,
            backgroundSize: "200% 100%",
            animation:  "shimmer 1.2s ease-in-out infinite",
            pointerEvents: "none",
            zIndex:     1,
          }} />
        )}

        {/* ── Cover image ───────────────────────────────────────── */}
        <div style={{
          height:     200,
          position:   "relative",
          overflow:   "hidden",
          flexShrink: 0,
        }}>
          {/* Image */}
          <img
            src={game.icon}
            alt={game.name}
            style={{
              width:      "100%",
              height:     "100%",
              objectFit:  "cover",
              transform:  hovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.4s ease",
              display:    "block",
            }}
            onError={e => { e.target.style.display = "none"; }}
          />

          {/* Dark gradient over image bottom */}
          <div style={{
            position:   "absolute", inset: 0,
            background: `linear-gradient(to bottom,
              transparent 40%,
              rgba(6,11,24,0.7) 80%,
              rgba(6,11,24,0.95) 100%
            )`,
          }} />

          {/* Top gradient + accent tint on hover */}
          <div style={{
            position:   "absolute", inset: 0,
            background: hovered ? `${accent}18` : "transparent",
            transition: "background 0.3s ease",
          }} />

          {/* Subject badge — top left */}
          <div style={{
            position:      "absolute",
            top:           10, left: 10,
            background:    `${accent}`,
            color:         "#fff",
            fontSize:      10,
            fontWeight:    900,
            padding:       "3px 10px",
            borderRadius:  99,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            boxShadow:     `0 4px 12px ${accent}60`,
            animation:     "badgePop 0.4s ease both",
          }}>
            {game.subject}
          </div>

          {/* Mode badge — top right */}
          {/* <div style={{
            position:      "absolute",
            top:           10, right: 10,
            background:    "rgba(0,0,0,0.55)",
            border:        "1px solid rgba(255,255,255,0.12)",
            backdropFilter:"blur(6px)",
            color:         "rgba(255,255,255,0.8)",
            fontSize:      9,
            fontWeight:    900,
            padding:       "3px 9px",
            borderRadius:  99,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}>
            {game.modes?.[0] ?? "Multiplayer"}
          </div> */}

          {/* Emoji — bottom left of image area */}
          <div style={{
            position:   "absolute",
            bottom:     10, right: 12,
            fontSize:   32,
            lineHeight: 1,
            filter:     `drop-shadow(0 2px 8px ${accent}80)`,
            transform:  hovered ? "scale(1.2) rotate(8deg)" : "scale(1) rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}>
            {game.mockupEmoji}
          </div>
        </div>

        {/* ── Text area ─────────────────────────────────────────── */}
        <div style={{
          padding:    "14px 16px 16px",
          position:   "relative",
          zIndex:     2,
          flexGrow:   1,
        }}>
          {/* Accent bar */}
          <div style={{
            width:        hovered ? "100%" : "32px",
            height:       2,
            background:   `linear-gradient(90deg, ${accent}, transparent)`,
            borderRadius: 99,
            marginBottom: 8,
            transition:   "width 0.3s ease",
          }} />

          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize:   17,
            color:      "#fff",
            marginBottom: 4,
            lineHeight: 1.15,
            letterSpacing: 0.3,
            textShadow: hovered ? `0 0 20px ${accent}60` : "none",
            transition: "text-shadow 0.3s ease",
          }}>
            {game.name}
          </div>

          <div style={{
            fontSize:   11,
            color:      "rgba(255,255,255,0.4)",
            fontWeight: 700,
            lineHeight: 1.5,
          }}>
            {game.tagline}
          </div>

          {/* Play button — appears on hover */}
          <div style={{
            marginTop:    10,
            display:      "flex",
            alignItems:   "center",
            gap:          6,
            opacity:      hovered ? 1 : 0,
            transform:    hovered ? "translateY(0)" : "translateY(6px)",
            transition:   "all 0.25s ease",
          }}>
            <div style={{
              background:    accent,
              color:         "#fff",
              fontSize:      11,
              fontWeight:    900,
              padding:       "5px 14px",
              borderRadius:  99,
              letterSpacing: 1,
              textTransform: "uppercase",
              boxShadow:     `0 4px 16px ${accent}50`,
            }}>
              Play Now
            </div>
            <div style={{
              fontSize: 14,
              color:    accent,
              fontWeight: 900,
            }}>
              →
            </div>
          </div>
        </div>

        {/* ── Bottom accent glow ────────────────────────────────── */}
        <div style={{
          position:   "absolute",
          bottom:     0, left: 0, right: 0,
          height:     2,
          background: hovered
            ? `linear-gradient(90deg, transparent, ${accent}, transparent)`
            : "transparent",
          transition: "background 0.3s ease",
        }} />
      </button>
    </>
  );
}