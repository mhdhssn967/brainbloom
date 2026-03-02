import { useEffect, useState }  from "react";
import { useBalloonGame }        from "./hooks";
import QuestionDisplay           from "./components/QuestionDisplay";
import AnswerOption              from "./components/AnswerOption";
import BalloonGrid               from "./components/BalloonGrid";
import ResultOverlay             from "./components/ResultOverlay";

export default function BalloonBattle() {
  const {
    balloons,
    currentQuestion,
    questionCount,
    remaining,
    poppingTeam,
    flashTeam,
    flashType,
    gameOver,
    winner,
    teams,
    handleAnswer,
    startTimer,
  } = useBalloonGame("easy");

  useEffect(() => { startTimer(); }, []);

  const options = currentQuestion?.options ?? [];

  // Left team gets all 4 options, right team gets same 4 options
  // Each player sees all options on their side and taps their answer
  const teamLeft  = teams[0] ?? { id: 0, name: "Team Red",  color: "#EF4444", score: 0 };
  const teamRight = teams[1] ?? { id: 1, name: "Team Blue", color: "#3B82F6", score: 0 };

  const leftFlash  = flashTeam === 0 ? flashType : null;
  const rightFlash = flashTeam === 1 ? flashType : null;

  return (
    <div style={{
      width: "100vw", height: "100vh",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      fontFamily: "'Nunito', sans-serif",
      background: "#0F0F1A",
      position: "relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');

        @keyframes balloonFloat {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50%      { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes balloonPop {
          0%   { transform: scale(1);    opacity: 1; filter: blur(0px); }
          30%  { transform: scale(1.6);  opacity: 0.9; filter: blur(0px); }
          60%  { transform: scale(2.2);  opacity: 0.4; filter: blur(2px); }
          100% { transform: scale(0);    opacity: 0;   filter: blur(4px); }
        }
        @keyframes burstParticle {
          0%   { transform: translate(0,0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        @keyframes questionPop {
          0%   { transform: scale(0.75) translateY(12px); opacity: 0; }
          70%  { transform: scale(1.04) translateY(-2px); opacity: 1; }
          100% { transform: scale(1)    translateY(0);    opacity: 1; }
        }
        @keyframes flashIn {
          0%   { opacity: 0; transform: scaleX(0.95); }
          100% { opacity: 1; transform: scaleX(1); }
        }
        @keyframes scorePopUp {
          0%   { transform: translateY(0)    scale(1);   opacity: 1; }
          100% { transform: translateY(-40px) scale(1.3); opacity: 0; }
        }
        @keyframes splitPulse {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
        @keyframes timerTick {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* ── TOP SCORE BAR ─────────────────────────────────────────────── */}
      <div
  style={{
    height: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 60px",
    position: "relative",
    zIndex: 10,
  }}
>
  {/* LEFT TEAM CARD */}
  <div
    style={{
      width: 200,
      height: 200,
      borderRadius: 28,
      background: `linear-gradient(135deg, ${teamLeft.color}, ${teamLeft.color}BB)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: `0 20px 40px ${teamLeft.color}55`,
    }}
  >
    

    <div
      style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: 80,
        fontWeight: 900,
        color: "#fff",
        lineHeight: 1,
        textShadow: "4px 4px 0 rgba(0,0,0,0.35)",
      }}
    >
      {(teams[0]?.score ?? 0).toLocaleString()}
    </div>

    <div
      style={{
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: 2,
        color: "rgba(255,255,255,0.85)",
        marginTop: 6,
      }}
    >
      POINTS
    </div>
  </div>

  {/* CENTER ROUND PANEL */}
  <div
    style={{
      width: 220,
      height: 180,
      borderRadius: 20,
      background: "#14142B",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      border: "2px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        fontSize: 14,
        color: "rgba(255,255,255,0.5)",
        fontWeight: 900,
        letterSpacing: 3,
      }}
    >
      ROUND
    </div>

    <div
      style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: 42,
        fontWeight: 900,
        color: "#fff",
        marginTop: 6,
      }}
    >
      {questionCount} / 20
    </div>
  </div>

  {/* RIGHT TEAM CARD */}
  <div
    style={{
      width: 200,
      height: 200,
      borderRadius: 28,
      background: `linear-gradient(135deg, ${teamRight.color}, ${teamRight.color}BB)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: `0 20px 40px ${teamRight.color}55`,
    }}
  >
 

    <div
      style={{
        fontFamily: "'Baloo 2', cursive",
        fontSize: 80,
        fontWeight: 900,
        color: "#fff",
        lineHeight: 1,
        textShadow: "4px 4px 0 rgba(0,0,0,0.35)",
      }}
    >
      {(teams[1]?.score ?? 0).toLocaleString()}
    </div>

    <div
      style={{
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: 2,
        color: "rgba(255,255,255,0.85)",
        marginTop: 6,
      }}
    >
      POINTS
    </div>
  </div>
</div>

      {/* ── MAIN PLAY AREA ────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0,
        position: "relative",
      }}>

        {/* ── LEFT SIDE (Team Red / Team 0) ──────────────────────────── */}
        <TeamSide
          team={teamLeft}
          options={options}
          onAnswer={(val) => handleAnswer(0, val)}
          disabled={gameOver}
          flash={leftFlash}
          balloonCount={balloons[0] ?? 20}
          poppingNow={poppingTeam === 0}
          side="left"
        />

        {/* ── CENTER DIVIDER + QUESTION ──────────────────────────────── */}
        <div style={{
          width: 260,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 5,
        }}>
          {/* Vertical split line */}
          <div style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: "50%", transform: "translateX(-50%)",
            width: 3,
            background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.15) 80%, transparent)",
            animation: "splitPulse 3s ease-in-out infinite",
          }} />

          {/* Question card */}
          <div
            key={currentQuestion?.id}
            style={{
              background: "#1A1A2E",
              border: "3px solid rgba(255,255,255,0.12)",
              borderRadius: 28,
              padding: "24px 20px",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
              zIndex: 6,
              position: "relative",
              animation: "questionPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
              width: "100%",
            }}
          >
            <QuestionDisplay
              question={currentQuestion}
              remaining={remaining}
            />
          </div>
        </div>

        {/* ── RIGHT SIDE (Team Blue / Team 1) ────────────────────────── */}
        <TeamSide
          team={teamRight}
          options={options}
          onAnswer={(val) => handleAnswer(1, val)}
          disabled={gameOver}
          flash={rightFlash}
          balloonCount={balloons[1] ?? 20}
          poppingNow={poppingTeam === 1}
          side="right"
        />
      </div>

      {/* ── GAME OVER ─────────────────────────────────────────────────── */}
      {gameOver && (
        <ResultOverlay
          winner={winner}
          balloons={balloons}
          teams={teams}
        />
      )}
    </div>
  );
}

// ─── TeamSide ─────────────────────────────────────────────────────────────
// One full side of the screen — balloons on top, options in middle,
// team name big at bottom.

function TeamSide({ team, options, onAnswer, disabled, flash, balloonCount, poppingNow, side }) {
  const isLeft  = side === "left";
  const bgColor = isLeft
    ? `linear-gradient(135deg, ${team.color}22 0%, #0F0F1A 60%)`
    : `linear-gradient(225deg, ${team.color}22 0%, #0F0F1A 60%)`;

  const flashBg =
    flash === "correct" ? "rgba(34,197,94,0.12)" :
    flash === "wrong"   ? "rgba(239,68,68,0.12)"  :
    "transparent";

  return (
    <div style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      background: bgColor,
      transition: "background 0.3s ease",
      position: "relative",
      overflow: "hidden", justifyContent:'space-between'
    }}>
      {/* Flash overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: flashBg,
        transition: "background 0.2s ease",
        pointerEvents: "none",
        zIndex: 2,
        borderRadius: flash ? 0 : 0,
        animation: flash ? "flashIn 0.15s ease both" : "none",
      }} />

      {/* Balloon grid */}
      <div style={{
        padding: "12px 16px 8px",
        flexShrink: 0,
        zIndex: 3, position: "relative",paddingTop:'140px',
      }}>
        <BalloonGrid
          count={balloonCount}
          poppingNow={poppingNow}
          color={team.color}
          side={side}
        />
      </div>

      {/* Answer options */}
      <div  className="grid grid-cols-2 gap-5 w-[80%]"
 style={{
        // flex: 1,
        zIndex: 3, position: "relative",margin:'80px'
      }}>
        {options.map((option, i) => (
          <AnswerOption
            key={`${side}-${option}-${i}`}
            option={option}
            onSelect={onAnswer}
            disabled={disabled}
            side={side}
            accentColor={team.color}
          />
        ))}
      </div>

      {/* Team name — big bottom label */}
      <div style={{
        padding: "10px 0 14px",
        textAlign: "center",
        zIndex: 3, position: "relative",
        borderTop: `2px solid ${team.color}30`,
        background: `${team.color}15`,
      }}>
        <div style={{
          fontFamily: "'Lilita One', cursive",
          fontSize: 42,
          color: team.color,
          letterSpacing: 2,
          textShadow: `0 0 30px ${team.color}60, 2px 2px 0 rgba(0,0,0,0.4)`,
          lineHeight: 1,
        }}>
          {team.name}
        </div>
      </div>
    </div>
  );
}

// expose currentQuestion to TeamSide key
let currentQuestion = null;