import { useEffect }        from "react";
import { useMemoryGame }    from "./hooks";
import TileGrid             from "./components/TileGrid";
import RoundDisplay         from "./components/RoundDisplay";
import ResultOverlay        from "./components/ResultOverlay";
import { TOTAL_ROUNDS }     from "./constants";

export default function MemoryMatrix() {
  const {
    round,
    phase,
    pattern,
    leftTaps,
    rightTaps,
    evaluation,
    remaining,
    gameOver,
    teams,
    tappingLocked,
    startGame,
    handleTap,
  } = useMemoryGame();

  useEffect(() => { startGame(); }, []);

  const teamLeft  = teams[0] ?? { id: 0, name: "Team Red",  color: "#EF4444", score: 0 };
  const teamRight = teams[1] ?? { id: 1, name: "Team Blue", color: "#3B82F6", score: 0 };

  return (
    <div style={{
      width: "100vw", height: "100vh",
      background: "#060B18",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes timerTick {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.1); }
        }
        @keyframes tileReveal {
          from { transform: scale(0.7) rotate(-4deg); opacity: 0; }
          to   { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes scoreFlash {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }
      `}</style>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
      <div style={{
        height: 160,width:300,
        background: "#0A0F1E",zIndex:'100',padding:'20px',
        border: "1px solid rgba(255,255,255,0.07)",borderRadius:'40px',
        flexShrink: 0,position:'fixed',left:'50%',top:'20%',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",transform:'translate(-50%)'
      }}>
        <RoundDisplay
          round={round}
          total={TOTAL_ROUNDS}
          phase={phase}
          remaining={remaining}
        />
      </div>

      {/* ── MAIN AREA ────────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        position: "relative",
      }}>
        <TeamSide
          team={teamLeft}
          phase={phase}
          pattern={pattern}
          taps={leftTaps}
          evaluation={evaluation?.left ?? null}
          onTap={(i) => handleTap(0, i)}
          tappingLocked={tappingLocked}
        />

        {/* CENTER DIVIDER */}
        <div style={{
          width: 2,
          background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent)",
          flexShrink: 0,
          alignSelf: "stretch",
          animation: "pulseGlow 3s ease-in-out infinite",
        }} />

        <TeamSide
          team={teamRight}
          phase={phase}
          pattern={pattern}
          taps={rightTaps}
          evaluation={evaluation?.right ?? null}
          onTap={(i) => handleTap(1, i)}
          tappingLocked={tappingLocked}
        />
      </div>

      {gameOver && <ResultOverlay teams={teams} />}
    </div>
  );
}

// ─── TeamSide ─────────────────────────────────────────────────────────────
function TeamSide({ team, phase, pattern, taps, evaluation, onTap, tappingLocked }) {
  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      padding: "20px 0 16px",
    }}>

      {/* Subtle bg tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at center 20%, ${team.color}10 0%, transparent 65%)`,
        pointerEvents: "none",
      }} />

      {/* ── SCOREBOARD — top, with background ───────────────────────── */}
      <div style={{
        position: "relative", zIndex: 1,
        background: `linear-gradient(135deg, ${team.color}25, ${team.color}10)`,
        border: `2px solid ${team.color}40`,
        borderRadius: 24,
        padding: "16px 40px",
        textAlign: "center",
        boxShadow: `0 8px 32px ${team.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`,
        backdropFilter: "blur(8px)",
        minWidth: 200,
      }}>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 72,
          color: "#fff",
          lineHeight: 1,
          letterSpacing: 2,
          textShadow: `0 0 40px ${team.color}80, 0 4px 0 rgba(0,0,0,0.3)`,
          animation: "scoreFlash 0.3s ease both",
        }}>
          {team.score}
        </div>
        <div style={{
          fontSize: 11, fontWeight: 900,
          color: team.color,
          letterSpacing: 3,
          marginTop: 2,
          textShadow: `0 0 12px ${team.color}60`,
        }}>
          POINTS
        </div>
      </div>

      {/* ── SPACER — pushes grid down ────────────────────────────────── */}
      <div style={{ flex: 1 }} />

      {/* ── TILE GRID — bottom aligned, compact size ─────────────────── */}
      <div style={{
        position: "relative", zIndex: 1,
        width: "min(340px, 88%)",   // compact — not full width
        marginBottom: 8,
      }}>
        <TileGrid
          phase={phase}
          pattern={pattern}
          taps={taps}
          evaluation={evaluation}
          onTap={onTap}
          disabled={tappingLocked}
        />
      </div>

      {/* ── TEAM NAME — bottom ───────────────────────────────────────── */}
      <div style={{
        position: "relative", zIndex: 1,
        textAlign: "center",
        paddingTop: 8,marginTop:'20px'
      }}>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 34,
          color: team.color,
          letterSpacing: 2,
          textShadow: `0 0 20px ${team.color}50, 2px 2px 0 rgba(0,0,0,0.4)`,
          lineHeight: 1,
        }}>
          {team.name}
        </div>
      </div>

    </div>
  );
}