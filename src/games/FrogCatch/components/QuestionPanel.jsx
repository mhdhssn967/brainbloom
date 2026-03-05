// Question + 4 option buttons for one team

const TEAM_COLORS = {
  0: { hex: "#EF4444", light: "#FCA5A5", dark: "#991B1B" },
  1: { hex: "#3B82F6", light: "#93C5FD", dark: "#1E40AF" },
};

export default function QuestionPanel({
  teamId,
  team,
  question,
  score,
  frogCount,
  onAnswer,
  lockedOpts,
  catching,
}) {
  const color      = TEAM_COLORS[teamId];
  const isCatching = catching?.teamId === teamId;

  return (
    <div className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: `linear-gradient(160deg, ${color.hex}18 0%, transparent 50%)`,
        borderTop:  `3px solid ${color.hex}40`,
      }}
    >
      {/* Catching overlay — brief flash while square falls */}
      {isCatching && (
        <div className="absolute inset-0 z-20 flex items-center justify-center"
          style={{
            background:     `${color.hex}30`,
            backdropFilter: "blur(2px)",
            animation:      "fadeIn 0.2s ease both",
          }}
        >
          <div style={{
            fontFamily:    "'Lilita One', cursive",
            fontSize:      36,
            color:         "#fff",
            textShadow:    `0 0 24px ${color.hex}`,
            animation:     "catchPulse 0.4s ease-in-out infinite alternate",
          }}>
            🎯 Catching!
          </div>
        </div>
      )}

      {/* Score */}
      <div className="flex items-center gap-2">
        
      </div>

      {/* Question */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 gap-3">
        <div
          key={question?.id}
          className="text-center"
          style={{ animation: "questionSlide 0.3s ease both" }}
        >
          {/* Main question text */}
          <div style={{
            fontFamily:    "'Baloo 2', cursive",
            fontSize:      clampSize(question?.text ?? ""),
            fontWeight:    900,
            color:         "#fff",
            lineHeight:    1.2,
            textShadow:    "0 2px 8px rgba(0,0,0,0.4)",
            marginBottom:  question?.subtext ? 4 : 0,
          }}>
            {question?.text}
          </div>

          {/* Subtext for comparison questions */}
          {question?.subtext && (
            <div style={{
              fontFamily: "'Baloo 2', cursive",
              fontSize:   28,
              fontWeight: 900,
              color:      color.light,
            }}>
              {question.subtext}
            </div>
          )}
        </div>

        {/* Options 2x2 grid */}
        <div className="grid grid-cols-2 gap-2 w-75" >
          {(question?.options ?? []).map((opt, i) => {
            const isLocked = lockedOpts?.has(opt);

            return (
              <button
                key={`${question?.id}-${opt}-${i}`}
                disabled={isLocked}
                onClick={() => !isLocked && onAnswer(opt)}
                style={{
                  all:           "unset",
                  cursor:        isLocked ? "not-allowed" : "pointer",
                  padding:       "10px 8px",
                  borderRadius:  14,
                  background:    isLocked
                    ? "rgba(239,68,68,0.15)"
                    : `${color.hex}20`,
                  border:        `2.5px solid ${isLocked
                    ? "#EF4444"
                    : `${color.hex}50`}`,
                  textAlign:     "center",
                  fontFamily:    "'Baloo 2', cursive",
                  fontSize:      22,
                  fontWeight:    900,
                  color:         isLocked ? "#EF4444" : "#fff",
                  boxShadow:     isLocked
                    ? "none"
                    : `0 4px 12px ${color.hex}20`,
                  transform:     isLocked ? "scale(0.96)" : "scale(1)",
                  transition:    "all 0.15s ease",
                  animation:     isLocked
                    ? "wrongShake 0.3s ease both"
                    : "optionPop 0.25s ease both",
                  animationDelay: `${i * 0.05}s`,
                  opacity:       isLocked ? 0.6 : 1,
                }}
                onMouseDown={e => {
                  if (!isLocked)
                    e.currentTarget.style.transform = "scale(0.93)";
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
  if (text.length <= 8)  return 32;
  if (text.length <= 14) return 26;
  return 20;
}