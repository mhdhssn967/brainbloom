import { useState }         from "react";
import { useSpellIt }       from "./hooks";
import CategoryPicker       from "./components/CategoryPicker";
import Collection           from "./components/Collection";
import WordDisplay          from "./components/WordDisplay";
import Keyboard             from "./components/Keyboard";
import WinAnimation         from "./components/WinAnimation";
import ResultOverlay        from "./components/ResultOverlay";

export default function SpellIt() {
  const [config, setConfig] = useState(null);

  if (!config) {
    return <CategoryPicker onStart={(category, rounds) =>
      setConfig({ category, rounds })
    } />;
  }

  return <SpellItGame category={config.category} totalRounds={config.rounds} />;
}

function SpellItGame({ category, totalRounds }) {
  const {
    currentWord,
    roundIndex,
    totalRounds: actualTotal,
    slots,
    blanks,
    phase,
    filled,
    activeBlank,
    shaking,
    roundWinner,
    collection,
    gameOver,
    teams,
    imagePath,
    handleKey,
  } = useSpellIt(category, totalRounds);

  const teamLeft  = teams[0] ?? { id: 0, name: "Team Red"  };
  const teamRight = teams[1] ?? { id: 1, name: "Team Blue" };

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');

        @keyframes fadeIn {
          from{opacity:0} to{opacity:1}
        }
        @keyframes modalPop {
          from{opacity:0;transform:scale(0.9) translateY(16px)}
          to  {opacity:1;transform:scale(1)   translateY(0)}
        }
        @keyframes cardPop {
          from{opacity:0;transform:scale(0.5) rotate(-8deg)}
          to  {opacity:1;transform:scale(1)   rotate(0deg)}
        }
        @keyframes correctPop {
          0%  {transform:scale(1)}
          50% {transform:scale(1.25)}
          100%{transform:scale(1)}
        }
        @keyframes wrongShake {
          0%,100%{transform:translateX(0)}
          20%    {transform:translateX(-8px)}
          40%    {transform:translateX(8px)}
          60%    {transform:translateX(-6px)}
          80%    {transform:translateX(6px)}
        }
        @keyframes activePulse {
          0%,100%{box-shadow:0 0 8px  rgba(255,255,255,0.2)}
          50%    {box-shadow:0 0 20px rgba(255,255,255,0.5)}
        }
        @keyframes cursorBlink {
          0%,100%{opacity:1} 50%{opacity:0}
        }
        @keyframes imageFloat {
          0%,100%{transform:translateY(0px)}
          50%    {transform:translateY(-8px)}
        }
        @keyframes spin { to{transform:rotate(360deg)} }

        @keyframes bgDrift1 {
          0%,100%{transform:translate(0,0)}
          50%    {transform:translate(16px,-12px)}
        }
        @keyframes bgDrift2 {
          0%,100%{transform:translate(0,0)}
          50%    {transform:translate(-12px,16px)}
        }
      `}</style>

      {/* BG blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div style={{
          position:"absolute", width:400, height:400, borderRadius:"50%",
          top:"-10%", left:"-5%",
          background:"radial-gradient(circle, #EF444412, transparent 65%)",
          animation:"bgDrift1 14s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", width:400, height:400, borderRadius:"50%",
          bottom:"-10%", right:"-5%",
          background:"radial-gradient(circle, #3B82F612, transparent 65%)",
          animation:"bgDrift2 16s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize:"40px 40px",
        }}/>
      </div>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between flex-shrink-0 px-6"
        style={{
          height:         52,
          background:     "rgba(10,15,30,0.9)",
          borderBottom:   "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{
          fontFamily:"'Lilita One', cursive",
          fontSize:22, color:"#fff", letterSpacing:2,
        }}>
          Spell<span style={{color:"#FACC15"}}>It!</span>
        </div>

        {/* Round dots */}
        <div className="flex items-center gap-2">
          {Array.from({length: actualTotal}, (_, i) => (
            <div key={i} style={{
              width:        i === roundIndex ? 14 : 8,
              height:       i === roundIndex ? 14 : 8,
              borderRadius: "50%",
              background:
                i < roundIndex  ? "#22C55E" :
                i === roundIndex ? "#FACC15" :
                "rgba(255,255,255,0.15)",
              transition: "all 0.3s ease",
            }}/>
          ))}
        </div>

        <div style={{
          fontSize:11, fontWeight:900,
          color:"rgba(255,255,255,0.35)", letterSpacing:1.5,
        }}>
          {roundIndex + 1} / {actualTotal}
        </div>
      </div>

      {/* ── MAIN AREA ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative z-10 overflow-hidden">

        {/* ── LEFT SIDE ─────────────────────────────────────────────── */}
        <TeamSide
          team={teamLeft}
          filled={filled[0] ?? {}}
          activeBlank={activeBlank[0]}
          shaking={shaking[0]}
          slots={slots}
          blanks={blanks}
          collection={collection[0] ?? []}
          onKey={(letter) => handleKey(0, letter)}
          disabled={phase !== "playing"}
          side="left"
        />

        {/* ── CENTER — shared image ─────────────────────────────────── */}
        <div
          className="flex flex-col items-center justify-center flex-shrink-0"
          style={{
            width:       280,
            borderLeft:  "1px solid rgba(255,255,255,0.06)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding:     "12px 8px",
            gap:         16,
          }}
        >
          {/* Animal image */}
          <div style={{
            width:    200,
            height:   200,
            display:  "flex",
            alignItems:"center",
            justifyContent:"center",
            animation:"imageFloat 3s ease-in-out infinite",
            filter:   "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
            flexShrink: 0,
          }}>
            {imagePath ? (
              <img
                key={imagePath}
                src={imagePath}
                alt={currentWord?.name}
                style={{
                  width:"100%", height:"100%",
                  objectFit:"contain",
                  animation:"fadeIn 0.4s ease both",
                }}
              />
            ) : (
              <div style={{
                width:48, height:48, borderRadius:"50%",
                border:"4px solid #FACC15", borderTopColor:"transparent",
                animation:"spin 0.8s linear infinite",
              }}/>
            )}
          </div>

          {/* Word name hint below image */}
          <div style={{
            fontFamily:    "'Lilita One', cursive",
            fontSize:      13,
            color:         "rgba(255,255,255,0.25)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            {currentWord?.name.replace(/./g, "·")}
          </div>

          {/* Round label */}
          <div style={{
            background:   "rgba(250,204,21,0.1)",
            border:       "1.5px solid rgba(250,204,21,0.3)",
            borderRadius: 99,
            padding:      "4px 14px",
            fontSize:     11,
            fontWeight:   900,
            color:        "#FACC15",
            letterSpacing: 1,
          }}>
            Round {roundIndex + 1}
          </div>
        </div>

        {/* ── RIGHT SIDE ────────────────────────────────────────────── */}
        <TeamSide
          team={teamRight}
          filled={filled[1] ?? {}}
          activeBlank={activeBlank[1]}
          shaking={shaking[1]}
          slots={slots}
          blanks={blanks}
          collection={collection[1] ?? []}
          onKey={(letter) => handleKey(1, letter)}
          disabled={phase !== "playing"}
          side="right"
        />
      </div>

      {/* ── WIN ANIMATION ─────────────────────────────────────────────── */}
      {phase === "won" && roundWinner !== null && (
        <WinAnimation
          winner={roundWinner}
          imagePath={imagePath}
          wordName={currentWord?.name ?? ""}
          teams={teams}
        />
      )}

      {/* ── GAME OVER ─────────────────────────────────────────────────── */}
      {gameOver && (
        <ResultOverlay
          collection={collection}
          teams={teams}
        />
      )}
    </div>
  );
}

// ── TeamSide ──────────────────────────────────────────────────────────────
// Full column: collection top, word display middle, keyboard bottom

function TeamSide({
  team, filled, activeBlank, shaking,
  slots, blanks, collection,
  onKey, disabled, side,
}) {
  const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };
  const color       = TEAM_COLORS[team?.id ?? 0];
  const isLeft      = side === "left";

  return (
    <div
      className="flex flex-col flex-1 min-w-0 overflow-hidden relative"
      style={{
        background: `linear-gradient(${isLeft ? "135deg" : "225deg"}, ${color}08 0%, transparent 50%)`,
      }}
    >
      {/* Team name strip */}
      <div className="flex items-center justify-center flex-shrink-0 py-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      22,
          color,
          letterSpacing: 2,
          textShadow:    `0 0 20px ${color}50`,
        }}>
          {team?.name}
        </div>
      </div>

      {/* Collection panel */}
      <div className="flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", minHeight: 72 }}
      >
        <Collection
          team={team}
          collection={collection}
          side={side}
        />
      </div>

      {/* Word display — center vertically */}
      <div className="flex flex-1 items-center justify-center px-3 py-4">
        <WordDisplay
          slots={slots}
          filled={filled}
          activeBlank={activeBlank}
          shaking={shaking}
          teamId={team?.id ?? 0}
        />
      </div>

      {/* Keyboard — pinned to bottom */}
      <div className="flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Keyboard
          teamId={team?.id ?? 0}
          onKey={onKey}
          disabled={disabled}
          filled={filled}
          slots={slots}
          blanks={blanks}
        />
      </div>
    </div>
  );
}