// src/pages/Home/GameModal.jsx
import { useState, useEffect } from "react";
import { X, Users, User, Play } from "lucide-react";

const MODES = [
  { id: "single", label: "Solo Play",    icon: User,  sub: "One player vs the clock" },
  { id: "multi",  label: "Team Battle",  icon: Users, sub: "Two squads, one winner"   },
];

export default function GameModal({ game, onClose, onPlay }) {
  const [selectedMode, setSelectedMode] = useState(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Reset mode when game changes
  useEffect(() => { setSelectedMode(null); }, [game?.id]);

  if (!game) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          animation: "fadeIn 0.2s ease both",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 460,
        background: "#fff",
        borderRadius: 28,
        zIndex: 101,
        overflow: "hidden",
        boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
        animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            all: "unset", cursor: "pointer",
            position: "absolute", top: 16, right: 16, zIndex: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} color="#555" />
        </button>

        {/* Hero area */}
        <div style={{
          height: 160,
          background: `${game.accentColor}12`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40,
            width: 160, height: 160, borderRadius: "50%",
            background: `${game.accentColor}10`,
          }} />
          <div style={{
            position: "absolute", bottom: -20, left: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: `${game.accentColor}08`,
          }} />

          {/* Icon — replace div with <img src={game.icon}> when ready */}
          <img src={game.icon} style={{ width: '100%', height: '100%', objectFit:"cover",
        
              transition: "transform 0.2s ease" }} alt="" />
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px 24px" }}>
          {/* Subject pill */}
          <div style={{
            display: "inline-flex",
            fontSize: 10, fontWeight: 800,
            color: game.accentColor,
            background: `${game.accentColor}12`,
            padding: "3px 10px", borderRadius: 99,
            letterSpacing: 0.8, marginBottom: 8,
          }}>
            {game.subject}
          </div>

          <div style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 22, fontWeight: 900, color: "#111",
            lineHeight: 1.1, marginBottom: 4,
          }}>
            {game.name}
          </div>

          <div style={{
            fontSize: 12, color: "#777", fontWeight: 600,
            lineHeight: 1.7, marginBottom: 20,
          }}>
            {game.description}
          </div>

          {/* Mode selector */}
          <div style={{ fontSize: 11, fontWeight: 900, color: "#bbb", letterSpacing: 1, marginBottom: 8 }}>
            CHOOSE MODE
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
            {MODES.map(mode => {
              const active = selectedMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                  style={{
                    all: "unset", cursor: "pointer",
                    padding: "12px 14px", borderRadius: 16,
                    border: active
                      ? `2px solid ${game.accentColor}`
                      : "2px solid #EBEBEB",
                    background: active ? `${game.accentColor}0c` : "#FAFAFA",
                    display: "flex", alignItems: "center", gap: 10,
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: active ? `${game.accentColor}18` : "#F0F0F0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "background 0.15s ease",
                  }}>
                    <mode.icon size={17} color={active ? game.accentColor : "#999"} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 800,
                      color: active ? game.accentColor : "#333",
                      lineHeight: 1.1,
                    }}>{mode.label}</div>
                    <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, marginTop: 1 }}>
                      {mode.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Play button */}
          <button
            disabled={!selectedMode}
            onClick={() => selectedMode && onPlay(game, selectedMode)}
            style={{
              all: "unset",
              width: "100%",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 10,
              padding: "14px 0",
              borderRadius: 16,
              background: selectedMode ? game.accentColor : "#F0F0F0",
              cursor: selectedMode ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              boxShadow: selectedMode ? `0 8px 24px ${game.accentColor}40` : "none",
              transform: selectedMode ? "scale(1)" : "scale(0.98)",
            }}
          >
            <Play
              size={20}
              color={selectedMode ? "#fff" : "#ccc"}
              fill={selectedMode ? "#fff" : "#ccc"}
            />
            <span style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: 20, letterSpacing: 1,
              color: selectedMode ? "#fff" : "#ccc",
            }}>
              {selectedMode ? "Let's Play!" : "Choose a Mode"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}