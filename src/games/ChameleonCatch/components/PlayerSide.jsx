import { useRef, useEffect, useState } from "react";
import Bug          from "./Bug";
import ChameleonSVG from "./ChameleonSVG";
import { ShapeSVG } from "./Bug";

const CHAM_SCALE   = 0.72;
const BRANCH_SVG_Y = 440;

// ─── Instruction banner content ───────────────────────────────────────────────
function InstructionContent({ round, bugType, teamColor }) {
  if (!round) return <span>Get ready…</span>;

  if (bugType === "colour") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width:        32, height: 32, flexShrink: 0,
          borderRadius: "50%",
          background:   round.targetColour ?? "#fff",
          border:       "2.5px solid rgba(255,255,255,0.75)",
          boxShadow:    `0 0 12px ${round.targetColour ?? "#fff"}90`,
        }} />
        <span>{round.instruction}</span>
      </div>
    );
  }

  if (bugType === "shape") {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ShapeSVG
          shapeKey={round.targetShape ?? "circle"}
          color={teamColor}
          size={34}
        />
        <span>{round.instruction}</span>
      </div>
    );
  }

  // text mode
  return <span>{round.instruction}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function PlayerSide({
  playerId, player, team, teamColor,
  bugType,
  getCurrentRound,
  // legacy props still accepted (subjectId, categoryId, levelKey) — ignored if getCurrentRound supplied
  subjectId, categoryId, levelKey,
  onBugTap, started,
  containerW, containerH,
  flip,
}) {
  const p         = player;
  const remaining = p.bugs.filter(b => b.isCorrect && !b.caught).length;
  const total     = p.bugs.filter(b => b.isCorrect).length;
  const caught    = total - remaining;

  // Measure the actual rendered canvas div — all coords (bugs + tongue) are relative to this
  const canvasRef = useRef(null);
  const [canvasW, setCanvasW] = useState(containerW ?? 480);
  const [canvasH, setCanvasH] = useState(containerH ?? 520);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ro = new ResizeObserver(entries => {
      const r = entries[0].contentRect;
      setCanvasW(Math.round(r.width));
      setCanvasH(Math.round(r.height));
    });
    ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  // Chameleon: branch at 20% of canvas height
  const branchY = Math.round(canvasH * 0.2);
  const divTop  = branchY - BRANCH_SVG_Y * CHAM_SCALE+200;

  // tongue target is already in canvas-div coords (bug.x / bug.y from engine)
  const tongue = p.tongue
    ? { targetX: p.tongue.targetX, targetY: p.tongue.targetY }
    : null;

  // Get current round for instruction
  const round = getCurrentRound
    ? getCurrentRound(playerId)
    : null;

  return (
    <div style={{
      flex: 1, position: "relative", 
      display: "flex", flexDirection: "column",
      borderRight: playerId === 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at ${flip ? "95%" : "5%"} 72%, ${teamColor}10 0%, transparent 50%)`,
        zIndex: 1,
      }} />

      {/* ── Team header: name + score ── */}
      
      {/* ── Instruction banner ── */}
      <div style={{
        position:   "relative",
        zIndex:     10,
        textAlign:  "center",
        padding:    "0px 16px 6px",
        flexShrink: 0,
      }}>
        <div style={{
          display:        "inline-flex",
          alignItems:     "center",
          justifyContent: "center",
          background:     p.phase === "dizzy"
            ? "rgba(239,68,68,0.18)"
            : p.phase === "round_complete"
              ? "rgba(34,197,94,0.18)"
              : `${teamColor}18`,
          border: `1.5px solid ${
            p.phase === "dizzy"
              ? "rgba(239,68,68,0.5)"
              : p.phase === "round_complete"
                ? "rgba(34,197,94,0.5)"
                : `${teamColor}44`
          }`,
          borderRadius:  99,
          padding:       "5px 20px",
          fontFamily:    "'Baloo 2', cursive",
          fontSize:      "clamp(31px, 1.5vw, 14px)",
          fontWeight:    900,
          color:         p.phase === "dizzy"
            ? "#EF4444"
            : p.phase === "round_complete"
              ? "#22C55E"
              : teamColor,
          letterSpacing: 0.5,
          transition:    "all 0.2s ease",
          maxWidth:      "96%",
        }}>
          {p.phase === "round_complete"
            ? "✓ Round Complete!"
            : p.phase === "dizzy"
              ? "😵 Wrong!"
              : <InstructionContent round={round} bugType={bugType} teamColor={teamColor} />
          }
        </div>

        {/* Progress dots */}
        {total > 0 && (
          <div style={{
            display:        "flex",
            gap:            5,
            justifyContent: "center",
            marginTop:      6,
            flexWrap:       "wrap",
          }}>
            {Array.from({ length: total }, (_, i) => (
              <div key={i} style={{
                width:        9, height: 9,
                borderRadius: "50%",
                background:   i < caught ? "#22C55E" : `${teamColor}35`,
                border:       `1.5px solid ${i < caught ? "#22C55E" : `${teamColor}55`}`,
                transition:   "background 0.2s",
                boxShadow:    i < caught ? "0 0 7px #22C55E90" : "none",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Canvas: everything inside uses coords relative to THIS div ── */}
      <div ref={canvasRef} style={{ position: "relative", flex: 1, minHeight: 0, zIndex: 5 }}>
        <ChameleonSVG
          flip={flip}
          tongue={tongue}
          dizzy={p.dizzy}
          canvasW={canvasW}
          divTop={divTop}
          scale={CHAM_SCALE}
        />

        {started && p.bugs.map(bug => (
          <Bug
            key={bug.id}
            bug={bug}
            teamColor={teamColor}
            onTap={id => p.phase === "playing" && onBugTap(id)}
          />
        ))}

        {!started && (
          <div style={{
            position:       "absolute", inset: 0,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}>
            <div style={{
              fontFamily:    "'Lilita One', cursive",
              fontSize:      "clamp(13px, 2vw, 17px)",
              color:         "rgba(255,255,255,.2)",
              letterSpacing: 2,
            }}>
              Waiting...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}