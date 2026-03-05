// src/pages/Home/index.jsx
import { useState } from "react";
import { GAMES } from "@/data/games";
import GameCard from "./Gamecard";
import GameModal from "./Gamemodal";
// import FloatingElements from "./FloatingElements";
import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";

export default function Home() {
  const navigate      = useNavigate();
  const startSession  = useSessionStore(s => s.startSession);
  const initTeams     = useTeamStore(s => s.initTeams);
  const [activeGame, setActiveGame] = useState(null);

  function handlePlay(game, mode) {
    const teamCount = mode === "single" ? 1 : 2;
    initTeams(teamCount);
    startSession(game.id, mode);
    navigate(game.route);
  }

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#FF8FC",
      fontFamily: "'Nunito', sans-serif",
      overflow: "hidden",
      display: "flex", flexDirection: "column",
      alignItems: "center",
      position: "relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@600;700;800&display=swap');

        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp  { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes modalPop { from { opacity: 0; transform: translate(-50%,-48%) scale(0.94); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
      `}</style>

      {/* Background floating shapes */}
      {/* <FloatingElements /> */}

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center items-center" style={{
        paddingTop: 48, paddingBottom: 28,
         zIndex: 1,
        animation: "slideUp 0.5s ease both"
      }}>
        {/* Logo slot — replace emoji div with <img> when ready */}
        

        <img src="/public/assets/images/logo.png" width={"300px"} alt="" />

        <p style={{
          fontSize: 14, color: "#999",
          fontWeight: 700, marginTop: 8,
          letterSpacing: 0.3,
        }}>
          Gamified classroom learning. Pick a game and start playing.
        </p>
      </div>

      {/* ── GAME GRID ─────────────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        padding: "0 40px",
        width: "100%",
        maxWidth: 1200,
        position: "relative", zIndex: 1,
        animation: "slideUp 0.5s 0.15s both",
      }}>
        {GAMES.map((game, i) => (
          <GameCard
            key={game.id}
            game={game}
            index={i}
            onClick={() => setActiveGame(game)}
          />
        ))}
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