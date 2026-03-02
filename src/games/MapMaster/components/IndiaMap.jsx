import { useEffect, useImperativeHandle, forwardRef } from "react";

const TEAM_COLORS   = { 0: "#EF4444", 1: "#3B82F6" };
const PRESHOWN_FILL = "#3D5A80";
const EMPTY_FILL    = "transparent";
const EMPTY_STROKE  = "transparent";

const IndiaMap = forwardRef(function IndiaMap({
  svgContent,
  preShownStates,
  placedStates,
  currentState,
  activeTeam,
  phase,
  onSvgReady,outlineContent
}, ref) {

  // Expose the inner SVG element via ref
  useImperativeHandle(ref, () => ({
    getPathData: (stateId) => {
      const svg  = document.getElementById("india-svg-main");
      if (!svg) return null;
      const path = svg.querySelector(`#${stateId}`);
      if (!path) return null;
      const bbox = path.getBBox();
      const d    = path.getAttribute("d");
      return { d, bbox };
    }
  }));

  useEffect(() => {
    const svg = document.getElementById("india-svg-main");
    if (!svg) return;

    // IDs of all states
    const allPaths = svg.querySelectorAll("path[id]");

    // Reset everything to invisible
 allPaths.forEach(path => {
  path.style.fill        = EMPTY_FILL;
  path.style.stroke      = EMPTY_STROKE;
  path.style.strokeWidth = "0";
});

    // Pre-shown states — solid fill + white border
    preShownStates.forEach(state => {
      const path = svg.querySelector(`#${state.id}`);
      if (!path) return;
      path.style.fill        = PRESHOWN_FILL;
      path.style.stroke      = "#1A2740";
      path.style.strokeWidth = "0.8";
    });

    // Placed states — team colour
    placedStates.forEach(state => {
      const path = svg.querySelector(`#${state.id}`);
      if (!path) return;
      path.style.fill        = TEAM_COLORS[state.teamId];
      path.style.stroke      = "#0A0F1E";
      path.style.strokeWidth = "1";
      path.style.transition  = "fill 0.3s ease";
    });

    // Current state being placed — keep invisible on map (it's shown as draggable)
    if (currentState) {
      const path = svg.querySelector(`#${currentState.id}`);
      if (path) {
        path.style.fill   = EMPTY_FILL;
        path.style.stroke = EMPTY_STROKE;
      }
    }

    onSvgReady?.();

  }, [preShownStates, placedStates, currentState, activeTeam]);

  // State name labels for visible states
  const labelledStates = [
    ...preShownStates.map(s => ({ ...s, teamId: null })),
    ...placedStates,
  ];

  return (
    <div
  style={{
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1.1", // adjust if needed
  }}
>

  {/* Outline */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      opacity: 0.6,
      pointerEvents: "none",top:'120px'
    }}
    dangerouslySetInnerHTML={{
      __html: outlineContent
        .replace(
          /<svg/i,
          `<svg style="width:90%;height:90%;display:block;" preserveAspectRatio="xMidYMid meet"`
        )
        .replace(/fill="[^"]*"/gi, `fill="none"`)
        .replace(/stroke="[^"]*"/gi, `stroke="rgba(147,197,253,0.6)"`)
    }}
  />

  {/* States */}
  <div
    id="india-svg-container"
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 1,
      opacity: 0.04,top:'120px'
    }}
    dangerouslySetInnerHTML={{
      __html: svgContent.replace(
        /<svg/i,
        `<svg style="width:90%;height:90%;display:block;" preserveAspectRatio="xMidYMid meet"`
      ),
    }}
  />

  <StateLabels states={labelledStates} svgId="india-svg-main" />
</div>
  );
});

export default IndiaMap;

// ── StateLabels ───────────────────────────────────────────────────────────
// Reads each path's bbox from the rendered SVG and positions a label
// at the visual center of the state

function StateLabels({ states, svgId }) {
  if (typeof window === "undefined") return null;

  return (
    <>
      {states.map(state => (
        <StateLabel key={state.id} state={state} svgId={svgId} />
      ))}
    </>
  );
}

function StateLabel({ state, svgId }) {
  const svg  = document.getElementById(svgId);
  if (!svg) return null;

  const path = svg.querySelector(`#${state.id}`);
  if (!path) return null;

  const bbox      = path.getBBox();
  const svgRect   = svg.getBoundingClientRect();
  const container = document.getElementById("india-svg-container");
  if (!container) return null;
  const containerRect = container.getBoundingClientRect();

  const scale = svgRect.width / 1000;

  // Center of bounding box in screen coords
  const cx = (bbox.x + bbox.width  / 2) * scale + (svgRect.left - containerRect.left);
  const cy = (bbox.y + bbox.height / 2) * scale + (svgRect.top  - containerRect.top);

  const TEAM_TEXT = { 0: "#FECACA", 1: "#BFDBFE", null: "rgba(255,255,255,0.7)" };
  const color     = TEAM_TEXT[state.teamId ?? null];

  // Font size scales with state size — bigger states get bigger labels
  const stateW   = bbox.width * scale;
  const fontSize = Math.min(11, Math.max(6, stateW / 10));

  return (
    <div style={{
      position:   "absolute",
      left:       cx,
      top:        cy+120,
      transform:  "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex:     10,
    }}>
      <div style={{
        fontFamily:    "'Nunito', sans-serif",
        fontSize,
        fontWeight:    800,
        color,
        whiteSpace:    "nowrap",
        textShadow:    "0 1px 4px rgba(0,0,0,0.9)",
        letterSpacing: 0.2,
        textAlign:     "center",
      }}>
        {state.name}
      </div>
    </div>
  );
}