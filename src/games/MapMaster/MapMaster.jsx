import { useState, useEffect, useRef } from "react";
import { useMapGame }       from "./hooks";
import IndiaMap             from "./components/IndiaMap";
import DraggableState       from "./components/DraggableState";
import TeamPanel            from "./components/TeamPanel";
import ResultOverlay        from "./components/ResultOverlay";
import { STATES_TO_PLACE }  from "./constants";

export default function MapMaster() {
    const [svgContent,    setSvgContent]    = useState("");
    const [outlineContent, setOutlineContent] = useState("");
    const [svgLoaded,     setSvgLoaded]     = useState(false);

  const {
    mapRef,
    preShownStates,
    currentState,
    placedStates,
    activeTeam,
    phase,
    lastResult,
    roundIndex,
    scores,
    gameOver,
    teams,
    handleDrop,
  } = useMapGame();

  // ── Load SVG file ──────────────────────────────────────────────────
  useEffect(() => {
  Promise.all([
    fetch("/assets/maps/india.svg").then(r => r.text()),
    fetch("/assets/maps/in-01.svg").then(r => r.text()),
  ]).then(([mapSvg, outlineSvg]) => {
    setSvgContent(mapSvg.replace(/<svg/i, `<svg id="india-svg-main"`));
    setOutlineContent(outlineSvg);
    setSvgLoaded(true);
  });
}, []);

  // Spawn position — center of each side panel
  // These are fixed positions; state piece appears here at round start
  const leftSpawn  = { x: 120,                      y: window.innerHeight / 2 };
  const rightSpawn = { x: window.innerWidth - 120,  y: window.innerHeight / 2 };
  const spawnPos   = activeTeam === 0 ? leftSpawn : rightSpawn;

  const teamLeft  = teams[0] ?? { id: 0, name: "Team Red",  score: 0 };
  const teamRight = teams[1] ?? { id: 1, name: "Team Blue", score: 0 };

  if (!svgLoaded) return <LoadingScreen />;

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col relative"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');

        @keyframes pulseGlow {
          0%,100% { opacity: 0.7; }
          50%      { opacity: 1;   }
        }
        @keyframes modalPop {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0);    }
        }
        @keyframes snapIn {
          0%   { transform: scale(1.2); opacity: 0.5; }
          60%  { transform: scale(0.95); }
          100% { transform: scale(1);   opacity: 1;   }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-center gap-6 flex-shrink-0"
        style={{
          height:       64,
          background:   "#0A0F1E",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Round counter */}
        <div className="flex items-center gap-2">
          <span style={{
            fontSize: 13, fontWeight: 900,
            color: "rgba(255,255,255,0.35)", letterSpacing: 2,
          }}>
            ROUND
          </span>
          <span style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1,
          }}>
            {roundIndex + 1}
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>
              /{STATES_TO_PLACE}
            </span>
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)" }} />

        {/* Current state name */}
        {currentState && (
          <div style={{
            fontFamily:    "'Lilita One', cursive",
            fontSize:      22,
            color:         activeTeam === 0 ? "#FCA5A5" : "#93C5FD",
            letterSpacing: 1,
            textShadow:    `0 0 20px ${activeTeam === 0 ? "#EF444460" : "#3B82F660"}`,
          }}>
            Place: {currentState.name}
          </div>
        )}

        {/* Phase feedback */}
        {phase === "correct" && (
          <div style={{
            background: "#22C55E20", border: "1.5px solid #22C55E",
            borderRadius: 99, padding: "4px 14px",
            fontSize: 13, fontWeight: 900, color: "#22C55E",
            animation: "fadeIn 0.2s ease both",
          }}>
            ✓ Correct!
          </div>
        )}
        {phase === "wrong" && (
          <div style={{
            background: "#EF444420", border: "1.5px solid #EF4444",
            borderRadius: 99, padding: "4px 14px",
            fontSize: 13, fontWeight: 900, color: "#EF4444",
            animation: "fadeIn 0.2s ease both",
          }}>
            ✗ Both wrong — skipped
          </div>
        )}
      </div>

      {/* ── MAIN AREA ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* LEFT PANEL — Team Red */}
        <div
          className="flex-shrink-0 flex flex-col"
          style={{
            width:       200,
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <TeamPanel
            team={teamLeft}
            score={scores[0]}
            isActive={activeTeam === 0}
            side="left"
          />
        </div>

        {/* CENTER — India Map */}
        <div className="flex-1 flex items-center justify-center p-4 relative">
          <div style={{
            width:    "100%",
            height:   "100%",
            maxWidth: "min(100%, calc(100vh - 120px))",
            margin:   "0 auto",
            position: "relative",
          }}>
            <IndiaMap
              ref={mapRef}
              svgContent={svgContent}
              preShownStates={preShownStates}
              placedStates={placedStates}
              currentState={currentState}
              activeTeam={activeTeam}
              phase={phase}
              outlineContent={outlineContent}
            />
          </div>
        </div>

        {/* RIGHT PANEL — Team Blue */}
        <div
          className="flex-shrink-0 flex flex-col"
          style={{
            width:      200,
            borderLeft: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <TeamPanel
            team={teamRight}
            score={scores[1]}
            isActive={activeTeam === 1}
            side="right"
          />
        </div>
      </div>

      {/* ── DRAGGABLE STATE PIECE ─────────────────────────────────────── */}
      {currentState && phase === "playing" && (
        <DraggableState
          state={currentState}
          activeTeam={activeTeam}
          phase={phase}
          onDrop={handleDrop}
          spawnX={spawnPos.x}
          spawnY={spawnPos.y+280}
          mapRef={mapRef}
          key={`${currentState.id}-${activeTeam}`} 
        />
      )}

      {/* ── GAME OVER ─────────────────────────────────────────────────── */}
      {gameOver && (
        <ResultOverlay
          scores={scores}
          teams={teams}
        />
      )}
    </div>
  );
}

// ── Loading screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center"
      style={{ background: "#060B18" }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
      <div style={{
        fontFamily:    "'Baloo 2', cursive",
        fontSize:      22,
        color:         "rgba(255,255,255,0.4)",
        letterSpacing: 2,
      }}>
        Loading map...
      </div>
    </div>
  );
}