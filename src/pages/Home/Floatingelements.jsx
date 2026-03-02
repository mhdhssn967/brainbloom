// src/pages/Home/FloatingElements.jsx
// Background decorations — blobs and shapes that float gently.
// Completely self-contained. No props. No logic.

const SHAPES = [
  { size: 320, x: "-5%",  y: "-8%",  color: "#F9731610", blur: 60, speed: 14 },
  { size: 260, x: "82%",  y: "60%",  color: "#3B82F610", blur: 50, speed: 18 },
  { size: 180, x: "40%",  y: "70%",  color: "#10B98110", blur: 40, speed: 12 },
  { size: 140, x: "70%",  y: "-4%",  color: "#EC489910", blur: 35, speed: 20 },
  { size: 100, x: "15%",  y: "72%",  color: "#8B5CF610", blur: 30, speed: 16 },
];

const DOTS = [
  { x: "8%",  y: "18%", color: "#F97316", size: 8  },
  { x: "92%", y: "22%", color: "#3B82F6", size: 6  },
  { x: "5%",  y: "78%", color: "#10B981", size: 10 },
  { x: "88%", y: "80%", color: "#EC4899", size: 7  },
  { x: "50%", y: "88%", color: "#F59E0B", size: 5  },
  { x: "25%", y: "12%", color: "#8B5CF6", size: 6  },
  { x: "75%", y: "45%", color: "#06B6D4", size: 8  },
];

export default function FloatingElements() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes blobFloat {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(12px,-16px) scale(1.04); }
          66%      { transform: translate(-8px,10px) scale(0.97); }
        }
        @keyframes dotBob {
          0%,100% { transform: translateY(0); opacity: 0.5; }
          50%      { transform: translateY(-10px); opacity: 0.8; }
        }
        .blob { animation: blobFloat var(--s) ease-in-out infinite; }
        .dot  { animation: dotBob  var(--s) var(--d) ease-in-out infinite; }
      `}</style>

      {/* Soft gradient blobs */}
      {SHAPES.map((s, i) => (
        <div key={i} className="blob" style={{
          position: "absolute",
          left: s.x, top: s.y,
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: s.color,
          filter: `blur(${s.blur}px)`,
          "--s": `${s.speed}s`,
        }} />
      ))}

      {/* Small accent dots */}
      {DOTS.map((d, i) => (
        <div key={i} className="dot" style={{
          position: "absolute",
          left: d.x, top: d.y,
          width: d.size, height: d.size,
          borderRadius: "50%",
          background: d.color,
          opacity: 0.45,
          "--s": `${3 + i * 0.7}s`,
          "--d": `${i * 0.4}s`,
        }} />
      ))}

      {/* Faint grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, #00000008 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />
    </div>
  );
}