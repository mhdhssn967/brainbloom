import { useState }         from "react";
import { Canvas }           from "@react-three/fiber";
import { Suspense }         from "react";
import { useFrogCatch }     from "./hooks";
import SetupPicker          from "./components/SetupPicker";
import FrogCanvas           from "./components/FrogCanvas";
import QuestionPanel        from "./components/QuestionPanel";
import ResultOverlay        from "./components/ResultOverlay";
import { TEAM_COLORS }      from "./constants";

export default function FrogCatch() {
  const [config, setConfig] = useState(null);

  if (!config) {
    return (
      <SetupPicker
        onStart={(ageGroup, frogCount) => setConfig({ ageGroup, frogCount })}
      />
    );
  }

  return (
    <FrogCatchGame
      ageGroup={config.ageGroup}
      frogCount={config.frogCount}
    />
  );
}

// ── Separated so hook only runs after config chosen ───────────────────────
function FrogCatchGame({ ageGroup, frogCount }) {
  const {
    frogs,
    questions,
    scores,
    lockedOpts,
    catching,
    phase,
    gameOver,
    teams,
    handleAnswer,
  } = useFrogCatch(ageGroup, frogCount);

  const teamLeft  = teams[0] ?? { id: 0, name: "Team Red"  };
  const teamRight = teams[1] ?? { id: 1, name: "Team Blue" };

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: "black", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');

        @keyframes fadeIn {
          from{opacity:0} to{opacity:1}
        }
        @keyframes wrongShake {
          0%,100%{transform:scale(0.96) translateX(0)}
          25%    {transform:scale(0.96) translateX(-6px)}
          75%    {transform:scale(0.96) translateX(6px)}
        }
        @keyframes optionPop {
          from{opacity:0;transform:scale(0.85) translateY(6px)}
          to  {opacity:1;transform:scale(1)    translateY(0)}
        }
        @keyframes questionSlide {
          from{opacity:0;transform:translateY(-8px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes catchPulse {
          from{opacity:0.7;transform:scale(0.97)}
          to  {opacity:1;  transform:scale(1.03)}
        }
        @keyframes frogBounce {
          0%,100%{transform:translateY(0)}
          50%    {transform:translateY(-10px)}
        }
        @keyframes topBarPulse {
          0%,100%{opacity:0.8} 50%{opacity:1}
        }
      `}</style>

      {/* ── TOP BAR ──────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-6"
        style={{
          height:         52,
          background:     "rgba(5,20,5,0.95)",
          borderBottom:   "1px solid rgba(34,197,94,0.15)",
          backdropFilter: "blur(10px)",
          zIndex:         10,
        }}
      >
        {/* Left team score pill */}
        

        {/* Center title */}
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      25, color:"#fff", letterSpacing:2,
        }}>
          Frog<span style={{color:"#22C55E"}}>Catch!</span>
          
        </div>
<span style={{
            fontSize:      40,
            color:         "rgba(255,255,255,0.3)",
            fontWeight:    800,
            letterSpacing: 1,
            marginLeft:    8,
          }}>
            {frogCount - scores[0] - scores[1]} frogs left
          </span>
        {/* Right team score pill */}
        
      </div>
      

      {/* ── CANVAS — top 60% ─────────────────────────────────────────── */}
      <div className="relative flex-shrink-0" style={{ height: "58vh" }}>

        {/* Background pond texture */}
        <div style={{
          position:   "absolute", inset: 0,
          background: "black",
          zIndex:     0,
        }}/>

        {/* Lily pad decorations */}
        <div style={{
          position:   "absolute", inset: 0,
          backgroundImage: `
            radial-gradient(circle at 15% 25%, rgba(34,197,94,0.15) 30px, transparent 31px),
            radial-gradient(circle at 80% 60%, rgba(34,197,94,0.12) 24px, transparent 25px),
            radial-gradient(circle at 45% 80%, rgba(34,197,94,0.1)  18px, transparent 19px),
            radial-gradient(circle at 70% 20%, rgba(34,197,94,0.13) 22px, transparent 23px)
          `,
          zIndex:     4,
          pointerEvents: "none",
        }}/>

        {/* R3F Canvas */}
        <div style={{ position:"absolute", inset:0, zIndex:2 }} className="bg-black">
          <FrogCanvas
            frogs={frogs}
            catching={catching}
          />
        </div>

        {/* Team color side borders */}
        <div style={{
          position:   "absolute", left:0, top:0, bottom:0,
          width:      6,
          background: `linear-gradient(180deg, ${TEAM_COLORS[0].hex}80, transparent)`,
          zIndex:     3,
        }}/>
        <div style={{
          position:   "absolute", right:0, top:0, bottom:0,
          width:      6,
          background: `linear-gradient(180deg, ${TEAM_COLORS[1].hex}80, transparent)`,
          zIndex:     3,
        }}/>

        {/* Frog count badges floating on canvas corners */}
        <div style={{
          position:   "absolute", top:12, left:16,
          background: `${TEAM_COLORS[0].hex}dd`,
          borderRadius: 99, padding:"4px 12px",
          fontFamily: "'Lilita One', cursive",
          fontSize:   34, color:"#fff",
          zIndex:     4,
          boxShadow:  `0 4px 12px ${TEAM_COLORS[0].hex}60`,
        }}>
          🐸 {scores[0]}
        </div>
        <div style={{
          position:   "absolute", top:12, right:16,
          background: `${TEAM_COLORS[1].hex}dd`,
          borderRadius: 99, padding:"4px 12px",
          fontFamily: "'Lilita One', cursive",
          fontSize:   34, color:"#fff",
          zIndex:     4,
          boxShadow:  `0 4px 12px ${TEAM_COLORS[1].hex}60`,
        }}>
          🐸 {scores[1]}
        </div>
      </div>

      {/* ── QUESTION PANELS — bottom 40% ─────────────────────────────── */}
      <div
        className="flex flex-1 min-h-0"
        style={{ borderTop: "2px solid rgba(34,197,94,0.2)" }}
      >
        {/* Left — Team Red */}
        <div className="flex-1 min-w-0" style={{
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>
          <QuestionPanel
            teamId={0}
            team={teamLeft}
            question={questions[0]}
            score={scores[0]}
            frogCount={frogCount}
            onAnswer={(opt) => handleAnswer(0, opt)}
            lockedOpts={lockedOpts[0]}
            catching={catching}
          />
        </div>

        {/* Center divider */}
        <div style={{
          width:      2, flexShrink:0,
          background: "linear-gradient(180deg, rgba(34,197,94,0.3), transparent)",
        }}/>

        {/* Right — Team Blue */}
        <div className="flex-1 min-w-0">
          <QuestionPanel
            teamId={1}
            team={teamRight}
            question={questions[1]}
            score={scores[1]}
            frogCount={frogCount}
            onAnswer={(opt) => handleAnswer(1, opt)}
            lockedOpts={lockedOpts[1]}
            catching={catching}
          />
        </div>
      </div>

      {/* ── GAME OVER ─────────────────────────────────────────────────── */}
      {gameOver && (
        <ResultOverlay
          scores={scores}
          teams={teams}
          frogCount={frogCount}
        />
      )}
    </div>
  );
}

// ── Score pill in top bar ─────────────────────────────────────────────────
function ScorePill({ team, score, frogCount, color }) {
  const pct = frogCount > 0 ? (score / frogCount) * 100 : 0;

  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      gap:          10,
      background:   `${color}15`,
      border:       `1.5px solid ${color}40`,
      borderRadius: 99,
      padding:      "6px 16px",
      minWidth:     160,
    }}>
      <span style={{fontSize:18}}>🐸</span>
      <div style={{flex:1}}>
        <div style={{
          fontFamily:    "'Baloo 2', cursive",
          fontSize:      11, fontWeight:900,
          color,         letterSpacing:1,
          marginBottom:  2,
        }}>
          {team?.name}
        </div>
        {/* Progress bar */}
        <div style={{
          height:       5, borderRadius:99,
          background:   "rgba(255,255,255,0.1)",
          overflow:     "hidden",
        }}>
          <div style={{
            height:     "100%",
            width:      `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: "width 0.4s ease",
          }}/>
        </div>
      </div>
      <div style={{
        fontFamily: "'Lilita One', cursive",
        fontSize:   22, color:"#fff", lineHeight:1,
      }}>
        {score}
      </div>
    </div>
  );
}