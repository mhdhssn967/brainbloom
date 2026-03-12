import { useEffect, useRef } from "react";
import { BIOMES } from "@/data/foodChainData";

export default function BiomeBackground({ biomeId, side }) {
  const biome    = BIOMES[biomeId];
  const emojis   = biome.ambient;

  return (
    <div style={{
      position:      "absolute", inset: 0,
      pointerEvents: "none",
      overflow:      "hidden",
    }}>
      {/* Sky gradient */}
      <div style={{
        position:   "absolute", inset: 0,
        background: `linear-gradient(180deg, ${biome.skyFrom} 0%, ${biome.skyTo} 60%, ${biome.ground}40 100%)`,
        opacity:    0.4,
      }} />

      {/* Floating ambient emojis */}
      {emojis.map((emoji, i) => (
        <div key={i} style={{
          position:  "absolute",
          left:      `${15 + i * 22}%`,
          top:       `${10 + (i % 3) * 25}%`,
          fontSize:  `${14 + (i % 3) * 6}px`,
          opacity:   0.2,
          animation: `ambientFloat ${4 + i * 1.5}s ${i * 0.8}s ease-in-out infinite`,
        }}>
          {emoji}
        </div>
      ))}

      {/* Ground strip */}
      <div style={{
        position:   "absolute",
        bottom:     0, left: 0, right: 0,
        height:     40,
        background: `linear-gradient(to top, ${biome.ground}30, transparent)`,
      }} />
    </div>
  );
}