// src/pages/Home/GameCard.jsx
import { useState } from "react";

export default function GameCard({ game, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        all: "unset",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        border: `1.5px solid ${hovered ? game.accentColor + "40" : "#EBEBEB"}`,
        boxShadow: hovered
          ? `0 12px 28px ${game.accentColor}18, 0 2px 8px rgba(0,0,0,0.05)`
          : "0 1px 4px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Image area */}
      <div style={{
        height: 220,
        background: hovered ? `${game.accentColor}0e` : "#FAFAFA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s ease",
        position: "relative",
      }}>
        
          <img
            src={game.icon}
            alt={game.name}
            style={{ width: '100%', height: '100%', objectFit: "cover",
              transform: hovered ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.2s ease" }}
          />
      
       
        {/* Subject badge */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          fontSize: 15, fontWeight: 800,
          color: game.accentColor,
          background: `white`,
          padding: "2px 8px", borderRadius: 99,
          letterSpacing: 0.5,
        }}>
          {game.subject}
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize: 15, fontWeight: 800,
          color: "#111", marginBottom: 4, lineHeight: 1.1,
        }}>
          {game.name}
        </div>
        <div style={{
          fontSize: 11, color: "#999",
          fontWeight: 600, lineHeight: 1.5,
        }}>
          {game.tagline}
        </div>
      </div>
    </button>
  );
}