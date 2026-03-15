import { useState, useEffect } from "react";
import { GAMES }               from "@/data/games";
import GameCard                from "./Gamecard";
import GameModal               from "./Gamemodal";
import { useNavigate }         from "react-router-dom";
import { useSessionStore }     from "@/store/sessionStore";
import { useTeamStore }        from "@/store/teamStore";
import SyncBadge from "@/components/ui/SyncBadge";
import { Library } from "lucide-react";

// Floating particle
function Particle({ style }) {
  return <div style={style} />;
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size:   4 + Math.random() * 6,
  x:      Math.random() * 100,
  y:      Math.random() * 100,
  dur:    6 + Math.random() * 8,
  delay:  Math.random() * 6,
  color:  ["#EF4444","#3B82F6","#FACC15","#22C55E","#818CF8","#F97316"][
    Math.floor(Math.random() * 6)
  ],
}));

export default function Home() {
  const navigate     = useNavigate();
  const startSession = useSessionStore(s => s.startSession);
  const initTeams    = useTeamStore(s => s.initTeams);
  const [activeGame, setActiveGame] = useState(null);
  const [mounted,    setMounted]    = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  function handlePlay(game, mode) {
    const teamCount = mode === "single" ? 1 : 2;
    initTeams(teamCount);
    startSession(game.id, mode);
    navigate(game.route);
  }

  return (
    <div style={{
  width: "100vw",
  minHeight: "100vh",      // ← add this
  background: "#060B18",
  overflowX: "hidden",
  overflowY: "auto",
  display: "flex", flexDirection: "column",
  alignItems: "center",
  position: "relative",
}}>
<div style={{
  position: "fixed",
  top: 20,
  right: 20,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  gap: 8,
}}>
  <button
    onClick={() => navigate("/library")}
    style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 999,
      padding: "6px 14px",
      color: "rgba(255,255,255,0.5)",
      fontSize: 25, fontWeight: 800,
      cursor: "pointer",
      fontFamily: "'Nunito', sans-serif",
      backdropFilter: "blur(8px)",
    }}
  >
    <Library size={25} />
    Library
  </button>
  <SyncBadge />
</div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@600;700;800;900&display=swap');

        @keyframes floatUp {
          0%   { transform: translateY(0px)   rotate(0deg);   opacity: 0.7; }
          50%  { transform: translateY(-28px) rotate(180deg); opacity: 1;   }
          100% { transform: translateY(0px)   rotate(360deg); opacity: 0.7; }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes pulse {
          0%,100% { opacity: 0.6; transform: scale(1);    }
          50%     { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes glow {
          0%,100% { opacity: 0.4; }
          50%     { opacity: 0.9; }
        }
        .card-wrap {
          opacity: 0;
          animation: cardIn 0.5s ease both;
        }
      `}</style>

      {/* ── Background grid ──────────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      {/* ── Radial glow blobs ─────────────────────────────────────────── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
      }}>
        {[
          { x: "15%",  y: "20%",  color: "#EF4444", size: 400 },
          { x: "80%",  y: "15%",  color: "#3B82F6", size: 350 },
          { x: "50%",  y: "60%",  color: "#818CF8", size: 500 },
          { x: "10%",  y: "75%",  color: "#22C55E", size: 300 },
          { x: "85%",  y: "80%",  color: "#FACC15", size: 280 },
        ].map((blob, i) => (
          <div key={i} style={{
            position:     "absolute",
            left:         blob.x, top: blob.y,
            width:        blob.size, height: blob.size,
            borderRadius: "50%",
            background:   `radial-gradient(circle, ${blob.color}18 0%, transparent 70%)`,
            transform:    "translate(-50%, -50%)",
            animation:    `glow ${4 + i}s ease-in-out infinite`,
            animationDelay: `${i * 0.7}s`,
          }} />
        ))}
      </div>

      {/* ── Floating particles ────────────────────────────────────────── */}
      {PARTICLES.map(p => (
        <div key={p.id} style={{
          position:     "fixed",
          left:         `${p.x}%`,
          top:          `${p.y}%`,
          width:        p.size,
          height:       p.size,
          borderRadius: Math.random() > 0.5 ? "50%" : 3,
          background:   p.color,
          opacity:      0.5,
          pointerEvents:"none",
          zIndex:       0,
          animation:    `floatUp ${p.dur}s ${p.delay}s ease-in-out infinite`,
          boxShadow:    `0 0 ${p.size * 2}px ${p.color}80`,
        }} />
      ))}

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div style={{
        paddingTop:    52,
        paddingBottom: 36,
        zIndex:        1,
        textAlign:     "center",
        animation:     "heroIn 0.6s ease both",
        position:      "relative",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 16, display: "inline-block" }}>
          <img
            src="/assets/images/logo.png"
            alt="BrainBloom"
            style={{ width: 250 }}
          />
        </div>

        {/* Tagline */}
        <div style={{
          fontFamily:    "'Baloo 2', cursive",
          fontSize:      15,
          fontWeight:    800,
          color:         "rgba(255,255,255,0.35)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginTop:     4,
        }}>
          Gamified classroom learning · Pick a game · Start playing
        </div>

        {/* Stats row */}
        <div style={{
          display:        "flex",
          gap:            32,
          justifyContent: "center",
          marginTop:      24,
        }}>
          {[
            { label: "Games",    value: GAMES.length, color: "#818CF8" },
            { label: "Subjects", value: "5+",         color: "#22C55E" },
            { label: "Players",  value: "2",          color: "#EF4444" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Lilita One', cursive",
                fontSize:   28,
                color:      s.color,
                lineHeight: 1,
                textShadow: `0 0 20px ${s.color}60`,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize:      10,
                fontWeight:    800,
                color:         "rgba(255,255,255,0.3)",
                letterSpacing: 2,
                marginTop:     2,
              }}>
                {s.label.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── GAME GRID ─────────────────────────────────────────────────── */}
      <div style={{
        display:               "grid",
        gridTemplateColumns: "repeat(4, minmax(200px, 1fr))",
        gap:                   40,
        padding:               "0 40px 60px",
        width:                 "100%",
        maxWidth:              1280,
        position:              "relative",
        zIndex:                1,
      }}>
        {GAMES.map((game, i) => (
          <div
            key={game.id}
            className="card-wrap"
            style={{ animationDelay: `${0.1 + i * 0.07}s` }}
          >
            <GameCard
              game={game}
              index={i}
              onClick={() => setActiveGame(game)}
            />
          </div>
        ))}
        <div class="game-card more-card">
  <img src="/assets/images/games/more.png" alt="More Games Coming Soon" />
</div>
      </div>

      {/* ── MODAL ─────────────────────────────────────────────────────── */}
      <GameModal
        game={activeGame}
        onClose={() => setActiveGame(null)}
        onPlay={handlePlay}
      />
    </div>
  );
}