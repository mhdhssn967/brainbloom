const TEAM_COLORS = {
  0: { hex: "#EF4444", light: "#FCA5A5" },
  1: { hex: "#3B82F6", light: "#93C5FD" },
};

export default function QuestionPanel({
  playerId,
  question,
  lockedOpts,
  onAnswer,
  disabled,
  score,
}) {
  const color = TEAM_COLORS[playerId];

  return (
    <div
      className="flex flex-col h-full"
      style={{
        background: `linear-gradient(180deg, ${color.hex}10 0%, transparent 60%)`,
        borderTop:  `2px solid ${color.hex}40`,
      }}
    >
      {/* Score */}
      <div className="flex items-center justify-between px-3 pt-2 pb-1 flex-shrink-0">
        <div style={{
          fontSize:      10,
          fontWeight:    900,
          color:         "rgba(255,255,255,0.3)",
          letterSpacing: 2,
        }}>
          KILLS
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 16 }}>🧟</span>
          <span style={{
            fontFamily: "'Lilita One', cursive",
            fontSize:   26,
            color:      "#fff",
            lineHeight: 1,
            textShadow: `0 0 16px ${color.hex}80`,
          }}>
            {score}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="flex flex-col items-center justify-center flex-1 px-3 gap-2">
        <div
          key={question?.id}
          className="text-center w-full"
          style={{ animation: "qSlide 0.25s ease both" }}
        >
          <div style={{
            fontFamily:  "'Baloo 2', cursive",
            fontSize:    clampSize(question?.text ?? ""),
            fontWeight:  900,
            color:       "#fff",
            lineHeight:  1.1,
            textShadow:  "0 2px 8px rgba(0,0,0,0.6)",
            marginBottom: question?.subtext ? 4 : 0,
          }}>
            {question?.text}
          </div>
          {question?.subtext && (
            <div style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize:   20, fontWeight: 900,
              color:      color.light,
            }}>
              {question.subtext}
            </div>
          )}
        </div>

        {/* Options 2x2 */}
        <div className="grid grid-cols-2 gap-1.5 w-50">
          {(question?.options ?? []).map((opt, i) => {
            const isLocked = lockedOpts?.has(opt);
            return (
              <button
                key={`${question?.id}-${opt}-${i}`}
                disabled={isLocked || disabled}
                onClick={() => !isLocked && !disabled && onAnswer(opt)}
                style={{
                  all:           "unset",
                  cursor:        isLocked || disabled ? "default" : "pointer",
                  padding:       "8px 6px",
                  borderRadius:  12,
                  background:    isLocked
                    ? "rgba(239,68,68,0.12)"
                    : `${color.hex}18`,
                  border:        `2px solid ${isLocked
                    ? "#EF444460"
                    : `${color.hex}40`}`,
                  textAlign:     "center",
                  fontFamily:    "'Baloo 2', cursive",
                  fontSize:      20,
                  fontWeight:    900,
                  color:         isLocked ? "#EF4444" : "#fff",
                  transform:     isLocked ? "scale(0.96)" : "scale(1)",
                  transition:    "all 0.12s ease",
                  animation:     isLocked
                    ? "wrongShake 0.3s ease both"
                    : `optPop 0.2s ${i * 0.04}s ease both`,
                  opacity:       isLocked ? 0.55 : 1,
                }}
                onMouseDown={e => {
                  if (!isLocked && !disabled)
                    e.currentTarget.style.transform = "scale(0.92)";
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function clampSize(text) {
  if (text.length <= 8)  return 26;
  if (text.length <= 14) return 20;
  return 16;
}