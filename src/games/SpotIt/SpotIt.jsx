import { useState, useEffect } from "react";
import Swal                    from "sweetalert2";
import { useSpotIt }           from "./hooks";
import CategoryPicker          from "./components/CategoryPicker";
import ImageTile               from "./components/ImageTile";
import QuestionDisplay         from "./components/QuestionDisplay";
import ResultOverlay           from "./components/ResultOverlay";
import { TOTAL_ROUNDS }        from "./constants";
import ScoreBoard from "./components/ScoreBoard";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };

export default function SpotIt() {
  const [category, setCategory] = useState(null);
  if (!category) return <CategoryPicker onSelect={setCategory} />;
  return <SpotItGame category={category} />;
}

function SpotItGame({ category }) {
  const {
    currentRound,
    roundIndex,
    phase,
    imageCache,
    scores,
    floats,
    correctWiki,
    answered,
    remaining,
    gameOver,
    teams,
    handleTap,
  } = useSpotIt(category);

  const teamLeft  = teams[0] ?? { id: 0, name: "Team Red",  score: 0 };
  const teamRight = teams[1] ?? { id: 1, name: "Team Blue", score: 0 };

  // SweetAlert2 streak celebration
  useEffect(() => {
    const score = scores[0] + scores[1];
    if (score > 0 && score % 50 === 0) {
      Swal.fire({
        title:            "🔥 On Fire!",
        text:             "Keep it up!",
        icon:             "success",
        timer:            1200,
        showConfirmButton: false,
        background:       "#0D1B2A",
        color:            "#fff",
      });
    }
  }, [scores]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col relative"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes floatUp {
          0%   { opacity:1; transform:translateX(-50%) translateY(0) scale(1);    }
          50%  { opacity:1; transform:translateX(-50%) translateY(-50px) scale(1.2); }
          100% { opacity:0; transform:translateX(-50%) translateY(-90px) scale(0.9); }
        }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes modalPop {
          from{opacity:0;transform:scale(0.9) translateY(16px)}
          to  {opacity:1;transform:scale(1)   translateY(0)}
        }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes timerTick {
          0%,100%{transform:scale(1)} 50%{transform:scale(1.08)}
        }
        @keyframes correctPulse {
          0%  {box-shadow:0 0 0 0 rgba(34,197,94,0.7)}
          70% {box-shadow:0 0 0 16px rgba(34,197,94,0)}
          100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}
        }
        @keyframes wrongShake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        @keyframes bgPulse {
          0%,100%{opacity:0.6} 50%{opacity:1}
        }
      `}</style>

      {/* BG blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div style={{
          position:"absolute", width:500, height:500,
          borderRadius:"50%", top:"-15%", left:"-8%",
          background:`radial-gradient(circle, ${TEAM_COLORS[0]}12, transparent 65%)`,
          animation:"bgPulse 8s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", width:500, height:500,
          borderRadius:"50%", bottom:"-15%", right:"-8%",
          background:`radial-gradient(circle, ${TEAM_COLORS[1]}12, transparent 65%)`,
          animation:"bgPulse 10s 2s ease-in-out infinite",
        }}/>
        <div style={{
          position:"absolute", inset:0,
          backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize:"40px 40px",
        }}/>
      </div>

      {/* ── TOP BAR ─────────────────────────────────────────────────── */}
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
          Spot<span style={{color:"#F97316"}}>It!</span>
        </div>

        {/* Round pills */}
        <div className="flex items-center gap-2">
          {Array.from({length: TOTAL_ROUNDS}, (_,i) => (
            <div key={i} style={{
              width:   i < roundIndex ? 10 : i === roundIndex ? 14 : 8,
              height:  i < roundIndex ? 10 : i === roundIndex ? 14 : 8,
              borderRadius: "50%",
              background:
                i < roundIndex  ? "#22C55E" :
                i === roundIndex ? "#F97316" :
                "rgba(255,255,255,0.15)",
              transition: "all 0.3s ease",
            }}/>
          ))}
        </div>

        <div style={{
          fontSize:11, fontWeight:900,
          color:"rgba(255,255,255,0.35)", letterSpacing:1.5,
        }}>
          {roundIndex + 1} / {TOTAL_ROUNDS}
        </div>
      </div>

      {/* ── MAIN AREA ─────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative z-10">

        {/* LEFT TEAM PANEL */}
        <TeamColumn
          team={teamLeft}
          score={scores[0]}
          floats={floats}
          options={currentRound?.options ?? []}
          imageCache={imageCache}
          onTap={(wiki) => handleTap(0, wiki)}
          disabled={phase !== "playing" || answered[0] !== null}
          tapped={answered[0]}
          correctWiki={correctWiki}
          phase={phase}
          remaining={remaining}
          side="left"
        />

        {/* CENTER DIVIDER + QUESTION */}
        <div className="flex flex-col items-center justify-center flex-shrink-0"
          style={{
            width:       220,
            borderLeft:  "1px solid rgba(255,255,255,0.06)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding:     "16px 8px",
          }}
        >
          <QuestionDisplay
            round={currentRound}
            remaining={remaining}
            phase={phase}
            roundIndex={roundIndex}
            total={TOTAL_ROUNDS}
          />
        </div>

        {/* RIGHT TEAM PANEL */}
        <TeamColumn
          team={teamRight}
          score={scores[1]}
          floats={floats}
          options={currentRound?.options ?? []}
          imageCache={imageCache}
          onTap={(wiki) => handleTap(1, wiki)}
          disabled={phase !== "playing" || answered[1] !== null}
          tapped={answered[1]}
          correctWiki={correctWiki}
          phase={phase}
          remaining={remaining}
          side="right"
        />
      </div>

      {/* Loading overlay */}
      {phase === "loading" && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
          style={{background:"rgba(6,11,24,0.9)", backdropFilter:"blur(4px)"}}
        >
          <div className="flex flex-col items-center gap-4">
            <div style={{
              width:48, height:48, borderRadius:"50%",
              border:"4px solid #F97316", borderTopColor:"transparent",
              animation:"spin 0.8s linear infinite",
            }}/>
            <div style={{
              fontFamily:"'Baloo 2', cursive",
              fontSize:15, color:"rgba(255,255,255,0.4)", letterSpacing:2,
            }}>
              Loading images...
            </div>
          </div>
        </div>
      )}

      {gameOver && <ResultOverlay scores={scores} teams={teams} />}
    </div>
  );
}

// ── TeamColumn ────────────────────────────────────────────────────────────
// Full side: scoreboard on top, 2x2 image grid at bottom

function TeamColumn({
  team, score, floats,
  options, imageCache, onTap,
  disabled, tapped, correctWiki, phase,
  remaining, side,
}) {
  const color = TEAM_COLORS[team?.id ?? 0];
  const isLeft = side === "left";

  return (
    <div className="flex flex-col flex-1 min-w-0 relative overflow-hidden"
      style={{
        background: `linear-gradient(${isLeft ? "135deg" : "225deg"}, ${color}0A 0%, transparent 50%)`,
      }}
    >
      {/* ── SCOREBOARD — top ───────────────────────────────────────── */}

      <ScoreBoard team={team} score={score} floats={floats}/>

      {/* Divider */}
      <div style={{
        height:     1,
        background: `linear-gradient(90deg, transparent, ${color}30, transparent)`,
        margin:     "0 16px",
        flexShrink: 0,
      }}/>

      {/* ── 2x2 IMAGE GRID — bottom, compact ───────────────────────── */}
      <div className="flex justify-center h-full items-end pb-6 px-4 pt-4" style={{paddingBottom:'120px',marginTop:'20px'}}>
        <div className="grid grid-cols-2 gap-10"
         
        >
          {options.map((option, i) => (
            <ImageTile
              key={`${team?.id}-${option.wiki}-${i}`}
              option={option}
              imageUrl={imageCache[option.wiki]}
              teamId={team?.id ?? 0}
              onTap={onTap}
              disabled={disabled}
              isCorrect={phase === "result" && option.wiki === correctWiki}
              isWrong={
                phase === "result" &&
                tapped === option.wiki &&
                option.wiki !== correctWiki
              }
              phase={phase}
            />
          ))}
        </div>
      </div>
    </div>
  );
}