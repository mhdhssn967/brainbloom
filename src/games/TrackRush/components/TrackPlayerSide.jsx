import { useRef, useCallback } from "react";
import TrackCanvas from "./TrackCanvas";

const SWIPE_THRESHOLD = 30;

export default function TrackPlayerSide({
  playerId, player, spawnKey, question,
  team, teamColor, onSwipe, onPortalHit, started,
}) {
  const pointerStart = useRef(null);

  const onPointerDown = useCallback((e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    pointerStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback((e) => {
    if (!pointerStart.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    pointerStart.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dy) > Math.abs(dx) * 1.1) return;
    onSwipe(dx > 0 ? 1 : -1);
  }, [onSwipe]);

  const q = question;

  return (
    <div
      style={{
        flex:          1,
        position:      "relative",
        overflow:      "hidden",
        display:       "flex",
        flexDirection: "column",
        borderRight:   playerId === 0 ? "2px solid rgba(255,255,255,0.1)" : "none",
        touchAction:   "none",
        userSelect:    "none",
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {/* ── Score + team name ── */}
      <div style={{
        position:       "absolute",
        top: 0, left: 0, right: 0,
        zIndex:         20,
        display:        "flex",
        flexDirection:'column',

        // justifyContent: "space-between",
        alignItems:     "center",
        padding:        "10px 16px 8px",
        // background:     "linear-gradient(to bottom, rgba(0,0,0,0.45) 60%, transparent)",
        pointerEvents:  "none",
      }}>
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      "clamp(34px, 2.2vw, 20px)",
          color:         teamColor,
          // textShadow:    `0 2px 8px rgba(0,0,0,0.6), 0 0 14px ${teamColor}80`,
          letterSpacing: 2,
        }}>
          {team?.name}
        </div>
        <div style={{
          fontFamily:  "'Lilita One', cursive",
          fontSize:    "clamp(78px, 4.5vw, 44px)",
          color:       "#fff",
          // textShadow:  `0 2px 10px rgba(0,0,0,0.7), 0 0 20px ${teamColor}80`,
          lineHeight:  1,
        }}>
          {player.score}
          <span style={{
            fontSize:   "clamp(9px, 1vw, 11px)",
            color:      "rgba(255,255,255,0.6)",
            fontFamily: "'Baloo 2', cursive",
            marginLeft: 4,
          }}>PTS</span>
        </div>
      </div>

      {/* ── 3D Canvas ── */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <TrackCanvas
          playerId={playerId}
          player={player}
          spawnKey={spawnKey}
          question={q}
          teamColor={teamColor}
          onPortalHit={onPortalHit}
          started={started}
        />
      </div>

      {/* ── Phase overlays ── */}
      {player.phase === "stumble" && (
        <div style={{
          position:      "absolute", inset: 0,
          background:    "rgba(239,68,68,0.18)",
          pointerEvents: "none",
          zIndex:        15,
          animation:     "redFlash 0.12s ease-in-out 4",
        }}>
          <style>{`@keyframes redFlash{0%,100%{opacity:0}50%{opacity:1}}`}</style>
        </div>
      )}

      {player.phase === "celebrating" && (
        <div style={{
          position:       "absolute", inset: 0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          zIndex:         15,
        }}>
          <div style={{
            fontFamily:    "'Lilita One', cursive",
            fontSize:      "clamp(36px, 7vw, 64px)",
            color:         "#fff",
            textShadow:    `0 0 30px ${teamColor}, 0 4px 20px rgba(0,0,0,0.8)`,
            animation:     "popIn 0.28s cubic-bezier(0.34,1.56,0.64,1) both",
          }}>
            +10 ✨
          </div>
          <style>{`@keyframes popIn{from{transform:scale(0.2);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
        </div>
      )}

      {/* ── Swipe hint ── */}
      {!started && (
        <div style={{
          position:       "absolute", inset: 0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          zIndex:         15,
        }}>
          <div style={{
            fontFamily:    "'Lilita One', cursive",
            fontSize:      "clamp(12px, 1.6vw, 15px)",
            color:         "rgba(255,255,255,0.55)",
            letterSpacing: 2,
            textShadow:    "0 2px 6px rgba(0,0,0,0.5)",
          }}>
            ← SWIPE TO CHANGE LANE →
          </div>
        </div>
      )}
    </div>
  );
}