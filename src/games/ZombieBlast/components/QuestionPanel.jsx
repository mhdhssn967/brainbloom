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
          fontSize: 10, fontWeight: 900,
          color: "rgba(255,255,255,0.3)", letterSpacing: 2,
        }}>
          KILLS
        </div>
        <div className="flex items-center gap-1">
          <span style={{ fontSize: 16 }}>🧟</span>
          <span style={{
            fontFamily: "'Lilita One', cursive",
            fontSize:   26, color: "#fff", lineHeight: 1,
            textShadow: `0 0 16px ${color.hex}80`,
          }}>
            {score}
          </span>
        </div>
      </div>

      {/* Question + Options */}
      <div className="flex flex-col items-center justify-center flex-1 px-3 gap-3">

        {/* Math layout */}
        <div
          key={question?.id}
          style={{ animation: "qSlide 0.25s ease both", width: "100%" }}
        >
          <MathDisplay question={question} color={color} />
        </div>

        {/* Options 2x2 */}
        <div className="grid grid-cols-2 gap-1.5" style={{ width: 200 }}>
          {(question?.options ?? []).map((opt, i) => {
            const isLocked = lockedOpts?.has(opt);
            return (
              <button
                key={`${question?.id}-${opt}-${i}`}
                disabled={isLocked || disabled}
                onClick={() => !isLocked && !disabled && onAnswer(opt)}
                style={{
                  all:          "unset",
                  cursor:       isLocked || disabled ? "default" : "pointer",
                  padding:      "8px 6px",
                  borderRadius: 12,
                  background:   isLocked ? "rgba(239,68,68,0.12)" : `${color.hex}18`,
                  border:       `2px solid ${isLocked ? "#EF444460" : `${color.hex}40`}`,
                  textAlign:    "center",
                  fontFamily:   "'Baloo 2', cursive",
                  fontSize:     20, fontWeight: 900,
                  color:        isLocked ? "#EF4444" : "#fff",
                  transform:    isLocked ? "scale(0.96)" : "scale(1)",
                  transition:   "all 0.12s ease",
                  animation:    isLocked
                    ? "wrongShake 0.3s ease both"
                    : `optPop 0.2s ${i * 0.04}s ease both`,
                  opacity:      isLocked ? 0.55 : 1,
                }}
                onMouseDown={e => {
                  if (!isLocked && !disabled)
                    e.currentTarget.style.transform = "scale(0.92)";
                }}
                onMouseUp={e   => { e.currentTarget.style.transform = "scale(1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
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

// ── Math display — stacked layout ────────────────────────────────────────
function MathDisplay({ question, color }) {
  if (!question) return null;

  const text = question.text ?? "";

  // ── Detect question type and parse ───────────────────────────────────

  // Addition:       "16 + 9 = ?"    → stacked
  // Subtraction:    "16 − 9 = ?"    → stacked
  // Multiplication: "6 × 9 = ?"     → stacked
  // Division:       "81 ÷ 9 = ?"    → stacked
  // Missing:        "16 + __ = 25"  → stacked with blank
  // Greater/Smaller/Comparison:     → centered text fallback

  const stackMatch = text.match(
    /^(-?\d+)\s*([\+\-−×÷])\s*(-?\d+|__)\s*=\s*(.+)$/
  );

  const numStyle = {
    fontFamily:  "'Baloo 2', cursive",
    fontWeight:  900,
    color:       "#fff",
    lineHeight:  1,
    textAlign:   "right",
    textShadow:  "0 2px 8px rgba(0,0,0,0.5)",
  };

  const opStyle = {
    fontFamily:  "'Baloo 2', cursive",
    fontWeight:  900,
    color:       color.light,
    lineHeight:  1,
    textAlign:   "right",
  };

  if (stackMatch) {
    const [, a, op, b, result] = stackMatch;
    const isBlank  = result === "?";
    const bIsBlank = b === "__";

    // Font size based on number length
    const maxLen  = Math.max(a.length, b.length);
    const numSize = maxLen >= 4-2 ? 28 : maxLen >= 3 ? 34 : 42;
    const opSize  = numSize;

    return (
      <div style={{
        display:        "flex",
        justifyContent: "center",
        alignItems:     "center",
      }}>
        <div style={{
          display:       "inline-grid",
          gridTemplateColumns: "auto auto",
          columnGap:     6,
          rowGap:        2,
          alignItems:    "center",
          background:    "rgba(0,0,0,0.25)",
          borderRadius:  16,
          padding:       "10px 20px 6px 20px",
          border:        `1.5px solid rgba(255,255,255,0.08)`,
          minWidth:      120,
        }}>

          {/* Row 1 — first number, no operator */}
          <div style={{ ...opStyle, fontSize: opSize, visibility: "hidden" }}>+</div>
          <div style={{ ...numStyle, fontSize: numSize }}>{a}</div>

          {/* Row 2 — operator + second number */}
          <div style={{ ...opStyle, fontSize: opSize }}>{op}</div>
          <div style={{
            ...numStyle,
            fontSize: numSize,
            color: bIsBlank ? color.light : "#fff",
            letterSpacing: bIsBlank ? 2 : 0,
          }}>
            {bIsBlank ? "___" : b}
          </div>

          {/* Divider line spanning both columns */}
          <div style={{
            gridColumn:  "1 / -1",
            height:      2,
            background:  `linear-gradient(90deg, transparent, ${color.hex}, transparent)`,
            margin:      "4px 0",
            borderRadius: 99,
          }} />

          {/* Row 3 — answer */}
          <div style={{ ...opStyle, fontSize: opSize, visibility: "hidden" }}>+</div>
          <div style={{
            ...numStyle,
            fontSize: numSize + 4,
            color:    isBlank ? color.light : "#fff",
            textShadow: isBlank
              ? `0 0 20px ${color.hex}`
              : "0 2px 8px rgba(0,0,0,0.5)",
          }}>
            {isBlank ? "?" : result}
          </div>
        </div>
      </div>
    );
  }

  // ── Fallback for comparison / greater / smaller ───────────────────────
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily:  "'Baloo 2', cursive",
        fontSize:    24, fontWeight: 900,
        color:       "#fff",
        lineHeight:  1.2,
        textShadow:  "0 2px 8px rgba(0,0,0,0.6)",
      }}>
        {text}
      </div>
      {question.subtext && (
        <div style={{
          fontFamily: "'Baloo 2', cursive",
          fontSize:   18, fontWeight: 900,
          color:      color.light, marginTop: 4,
        }}>
          {question.subtext}
        </div>
      )}
    </div>
  );
}