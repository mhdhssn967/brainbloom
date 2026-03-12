export default function ChainDisplay({ display, roles, color, currentBlank, blankIndices, phase }) {
  return (
    <div style={{
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      flexWrap:       "wrap",
      gap:            8,
      padding:        "12px 8px",
    }}>
      {display.map((item, i) => {
        const isBlank        = item === null;
        const isCurrentBlank = isBlank && blankIndices[currentBlank] === i;
        const isFilled       = !isBlank && blankIndices.includes(i);
        const isComplete     = phase === "round_complete";

        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Node */}
            <div style={{
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              width:          isBlank ? "clamp(56px, 9vw, 80px)" : "clamp(64px, 10vw, 88px)",
              height:         isBlank ? "clamp(56px, 9vw, 80px)" : "clamp(64px, 10vw, 88px)",
              borderRadius:   "50%",
              background:     isBlank
                ? "rgba(255,255,255,0.04)"
                : isFilled
                  ? `${color}30`
                  : "rgba(255,255,255,0.08)",
              border:         isCurrentBlank
                ? `3px dashed ${color}`
                : isFilled
                  ? `2px solid ${color}`
                  : isBlank
                    ? "2px dashed rgba(255,255,255,0.2)"
                    : "2px solid rgba(255,255,255,0.15)",
              boxShadow:      isCurrentBlank
                ? `0 0 20px ${color}60`
                : isFilled && isComplete
                  ? `0 0 16px ${color}50`
                  : "none",
              animation:      isFilled ? "nodePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
              transition:     "all 0.3s ease",
              padding:        4,
              textAlign:      "center",
            }}>
              {isBlank ? (
                <div style={{
                  fontSize:   isCurrentBlank ? "clamp(18px, 3vw, 24px)" : 14,
                  color:      isCurrentBlank ? color : "rgba(255,255,255,0.2)",
                  animation:  isCurrentBlank ? "pulse 1s ease-in-out infinite" : "none",
                }}>
                  {isCurrentBlank ? "?" : "✓"}
                </div>
              ) : (
                <>
                  <div style={{ fontSize: "clamp(18px, 3vw, 26px)", lineHeight: 1 }}>
                    {item.split(" ")[0]}
                  </div>
                  <div style={{
                    fontSize:   "clamp(8px, 1vw, 10px)",
                    fontWeight: 800,
                    color:      isFilled ? color : "rgba(255,255,255,0.5)",
                    marginTop:  2,
                    textAlign:  "center",
                    maxWidth:   70,
                    lineHeight: 1.2,
                  }}>
                    {item.split(" ").slice(1).join(" ")}
                  </div>
                </>
              )}
            </div>

            {/* Arrow — not after last item */}
            {i < display.length - 1 && (
              <div style={{
                fontSize:   "clamp(12px, 2vw, 18px)",
                color:      "rgba(255,255,255,0.3)",
                animation:  phase === "round_complete"
                  ? "arrowPulse 0.4s ease-in-out infinite alternate"
                  : "none",
              }}>
                →
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}