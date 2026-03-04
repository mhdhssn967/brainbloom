// Shows the word with filled and blank letter boxes
// Active blank is highlighted, correct fills flash green, wrong shakes

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function WordDisplay({
  slots,
  filled,
  activeBlank,
  shaking,
  teamId,
}) {
  const color = TEAM_COLORS[teamId];

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 px-2">
      {slots.map((slot) => {
        if (slot.isSpace) {
          return <div key={slot.index} style={{ width: 12 }} />;
        }

        if (!slot.isBlank) {
          // Shown letter — static
          return (
            <div key={slot.index} style={{
              width:          44,
              height:         52,
              borderRadius:   10,
              background:     "rgba(255,255,255,0.06)",
              border:         "2px solid rgba(255,255,255,0.12)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     "'Baloo 2', cursive",
              fontSize:       28,
              fontWeight:     900,
              color:          "#fff",
            }}>
              {slot.char}
            </div>
          );
        }

        // Blank slot
        const isFilled   = !!filled[slot.index];
        const isActive   = activeBlank === slot.index;
        const letter     = filled[slot.index];
        const isShaking  = shaking && isActive;

        return (
          <div
            key={slot.index}
            style={{
              width:          44,
              height:         52,
              borderRadius:   10,
              background:     isFilled
                ? `${color}25`
                : isActive
                  ? `${color}15`
                  : "rgba(255,255,255,0.03)",
              border:         isFilled
                ? `2px solid ${color}`
                : isActive
                  ? `2.5px solid ${color}`
                  : "2px dashed rgba(255,255,255,0.2)",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              fontFamily:     "'Baloo 2', cursive",
              fontSize:       28,
              fontWeight:     900,
              color:          isFilled ? color : "transparent",
              boxShadow:      isActive
                ? `0 0 16px ${color}50`
                : "none",
              animation:      isShaking
                ? "wrongShake 0.4s ease both"
                : isFilled
                  ? "correctPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both"
                  : isActive
                    ? "activePulse 1.5s ease-in-out infinite"
                    : "none",
              transition:     "background 0.2s ease, border 0.2s ease",
              position:       "relative",
            }}
          >
            {letter ?? ""}

            {/* Cursor blink for active empty box */}
            {isActive && !isFilled && (
              <div style={{
                position:   "absolute",
                bottom:     8,
                left:       "50%",
                transform:  "translateX(-50%)",
                width:      20,
                height:     3,
                borderRadius: 2,
                background: color,
                animation:  "cursorBlink 1s ease-in-out infinite",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}