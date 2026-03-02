import { useState, useRef, useCallback, useEffect } from "react";

const TEAM_COLORS = {
  0: { fill: "#EF444430", stroke: "#EF4444", glow: "#EF444460", text: "#FCA5A5" },
  1: { fill: "#3B82F630", stroke: "#3B82F6", glow: "#3B82F660", text: "#93C5FD" },
};

export default function DraggableState({
  state,
  activeTeam,
  phase,
  onDrop,
  spawnX,
  spawnY,
  mapRef,       // ref to IndiaMap — used to get path data
}) {
  const [pos,      setPos]      = useState({ x: spawnX, y: spawnY });
  const [dragging, setDragging] = useState(false);
  const [pathData, setPathData] = useState(null);
  const dragOffset              = useRef({ x: 0, y: 0 });
  const colors                  = TEAM_COLORS[activeTeam] ?? TEAM_COLORS[0];
  const locked                  = phase !== "playing";

  // Get path data from SVG when state changes
  useEffect(() => {
    if (!state || !mapRef?.current) return;
    setPos({ x: spawnX, y: spawnY });

    // Small delay to ensure SVG is rendered
    const t = setTimeout(() => {
      const data = mapRef.current.getPathData(state.id);
      setPathData(data);
    }, 100);

    return () => clearTimeout(t);
  }, [state?.id, spawnX, spawnY]);

  const resetPos = useCallback(() => {
    setPos({ x: spawnX, y: spawnY });
  }, [spawnX, spawnY]);

  // ── Mouse drag ────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    if (locked) return;
    e.preventDefault();
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);

    const onMove = (e) => setPos({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });

    const onUp = (e) => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      onDrop(e.clientX, e.clientY);
      setTimeout(resetPos, 150);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
  };

  // ── Touch drag (smartboard) ───────────────────────────────────────────
  const onTouchStart = (e) => {
    if (locked) return;
    const t = e.touches[0];
    dragOffset.current = { x: t.clientX - pos.x, y: t.clientY - pos.y };
    setDragging(true);

    const onMove = (e) => {
      const t = e.touches[0];
      setPos({
        x: t.clientX - dragOffset.current.x,
        y: t.clientY - dragOffset.current.y,
      });
    };

    const onEnd = (e) => {
      setDragging(false);
      const t = e.changedTouches[0];
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onEnd);
      onDrop(t.clientX, t.clientY);
      setTimeout(resetPos, 150);
    };

    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onEnd);
  };

  if (!state || !pathData) return null;

  const { d, bbox } = pathData;

  // Render the path in a viewBox cropped tightly around the state
  const padding  = 8;
  const vbX      = bbox.x - padding;
  const vbY      = bbox.y - padding;
  const vbW      = bbox.width  + padding * 2;
  const vbH      = bbox.height + padding * 2;

  // Display size — scale so longest dimension is ~160px
  const maxDim    = 160;
  const scale     = maxDim / Math.max(vbW, vbH);
  const dispW     = vbW * scale;
  const dispH     = vbH * scale;

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      style={{
        position:    "fixed",
        left:        pos.x,
        top:         pos.y,
        transform:   "translate(-50%, -50%)",
        cursor:      locked ? "default" : dragging ? "grabbing" : "grab",
        zIndex:      dragging ? 1000 : 50,
        userSelect:  "none",
        touchAction: "none",
        filter:      dragging
          ? `drop-shadow(0 0 16px ${colors.glow})`
          : `drop-shadow(0 4px 12px ${colors.glow})`,
        transition:  dragging ? "none" : "filter 0.2s ease",
      }}
    >
      {/* Actual state shape */}
      <svg
        width={dispW}
        height={dispH}
        viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
        style={{ display: "block", overflow: "visible" }}
      >
        <path
          d={d}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={2 / scale}   // keep stroke visually consistent
          strokeLinejoin="round"
        />
      </svg>

      {/* State name below shape */}
      <div style={{
        textAlign:     "center",
        fontFamily:    "'Nunito', sans-serif",
        fontSize:      13,
        fontWeight:    900,
        color:         colors.text,
        marginTop:     6,
        letterSpacing: 0.5,
        textShadow:    `0 0 12px ${colors.glow}`,
      }}>
        {state.name}
      </div>
    </div>
  );
}