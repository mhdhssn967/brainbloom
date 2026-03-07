import { useState }          from "react";
import { useZombieBlast }    from "./hooks";
import SetupPicker           from "./components/SetupPicker";
import GameCanvas            from "./components/GameCanvas";
import HealthBar             from "./components/HealthBar";
import QuestionPanel         from "./components/QuestionPanel";
import ResultOverlay         from "./components/ResultOverlay";
import { MAX_HEALTH, DIFFICULTY } from "./constants";

export default function ZombieBlast() {
  const [config, setConfig] = useState(null);
  if (!config) return <SetupPicker onStart={setConfig} />;
  return <ZombieBlastGame {...config} />;
}

function ZombieBlastGame({ mode, difficulty, gameType, timeLimit }) {
  const playerCount = mode === "dual" ? 2 : 1;

  const {
    players,
    zombiesByPlayer,
    bulletsByPlayer,
    questions,
    lockedOpts,
    hitLabels,
    primaryTargets,
    phase,
    gameOver,
    winner,
    elapsed,
    timeLeft,
    currentWave,
    teams,
    handleAnswer,
    zombieAttack,
    updateZombieState,
  } = useZombieBlast({
    playerCount,
    gameType,
    timeLimit,
    difficulty,
    source: { type: "math" },
  });

  const isDual  = playerCount === 2;
  const diff    = DIFFICULTY[difficulty];

  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: "#060B18", fontFamily: "'Nunito', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@700;800;900&display=swap');
        @keyframes fadeIn    { from{opacity:0}to{opacity:1} }
        @keyframes wrongShake {
          0%,100%{transform:scale(0.96)translateX(0)}
          25%    {transform:scale(0.96)translateX(-5px)}
          75%    {transform:scale(0.96)translateX(5px)}
        }
        @keyframes optPop {
          from{opacity:0;transform:scale(0.88)}
          to  {opacity:1;transform:scale(1)}
        }
        @keyframes qSlide {
          from{opacity:0;transform:translateY(-6px)}
          to  {opacity:1;transform:translateY(0)}
        }
        @keyframes timerPulse {
          0%,100%{transform:scale(1)}
          50%    {transform:scale(1.06)}
        }
      `}</style>

      {/* ── TOP BAR ──────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between flex-shrink-0 px-5"
        style={{
          height:         52,
          background:     "rgba(5,5,20,0.95)",
          borderBottom:   "1px solid rgba(239,68,68,0.2)",
          backdropFilter: "blur(10px)",
          zIndex:         10,
        }}
      >
        {/* Title */}
        <div style={{
          fontFamily:    "'Lilita One', cursive",
          fontSize:      20, color: "#fff", letterSpacing: 2,
        }}>
          Zombie<span style={{ color: "#EF4444" }}>Blast!</span>
        </div>

        {/* Center info */}
        <div className="flex items-center gap-4">
          {/* Wave label */}
          <div style={{
            background:   "rgba(239,68,68,0.12)",
            border:       "1.5px solid rgba(239,68,68,0.3)",
            borderRadius: 99,
            padding:      "3px 12px",
            fontSize:     11, fontWeight: 900,
            color:        "#EF4444", letterSpacing: 1,
          }}>
            🧟 {currentWave.label}
          </div>

          {/* Timer — timed mode only */}
          {gameType === "timed" && (
            <div style={{
              fontFamily:    "'Lilita One', cursive",
              fontSize:      26,
              color:         timeLeft <= 10 ? "#EF4444" : "#fff",
              textShadow:    timeLeft <= 10
                ? "0 0 16px rgba(239,68,68,0.8)"
                : "none",
              animation:     timeLeft <= 10
                ? "timerPulse 0.5s ease-in-out infinite"
                : "none",
              minWidth:      60,
              textAlign:     "center",
            }}>
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
            </div>
          )}

          {/* Difficulty badge */}
          <div style={{
            background:   `${diff.color}18`,
            border:       `1.5px solid ${diff.color}40`,
            borderRadius: 99,
            padding:      "3px 12px",
            fontSize:     11, fontWeight: 900,
            color:        diff.color, letterSpacing: 1,
          }}>
            {diff.emoji} {diff.label}
          </div>
        </div>

        {/* Elapsed time */}
        <div style={{
          fontSize:      11, fontWeight: 900,
          color:         "rgba(255,255,255,0.3)", letterSpacing: 1,
        }}>
          {String(Math.floor(elapsed / 60)).padStart(2, "0")}:
          {String(elapsed % 60).padStart(2, "0")}
        </div>
      </div>

      {/* ── MAIN AREA ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {players.map((player, idx) => (
          <div
            key={player.id}
            className="flex flex-col flex-1 min-w-0"
            style={{
              borderRight: idx === 0 && isDual
                ? "2px solid rgba(255,255,255,0.06)"
                : "none",
            }}
          >
            {/* Health bar */}
            <div className="flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <HealthBar
                player={player}
                team={teams[player.id]}
                maxHealth={MAX_HEALTH}
              />
            </div>

            {/* 3D Canvas — top 62% */}
            <div style={{ height: "62%", flexShrink: 0, position: "relative" }}>
              <GameCanvas
  playerId={player.id}
  player={player}
  zombies={zombiesByPlayer[player.id] ?? []}
  bullets={bulletsByPlayer[player.id] ?? []}
  hitLabels={hitLabels}
  primaryTargetId={primaryTargets[player.id]}
  onZombieAttack={zombieAttack}
  onUpdateZombieState={updateZombieState}
  playerCount={playerCount}
/>

              {/* Dead overlay */}
              {player.health <= 0 && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    background:     "rgba(0,0,0,0.7)",
                    backdropFilter: "blur(4px)",
                    animation:      "fadeIn 0.3s ease both",
                    zIndex:         5,
                  }}
                >
                  <div style={{
                    fontFamily:    "'Lilita One', cursive",
                    fontSize:      48, color: "#EF4444",
                    textShadow:    "0 0 32px rgba(239,68,68,0.8)",
                    letterSpacing: 2,
                  }}>
                    💀 ELIMINATED
                  </div>
                </div>
              )}
            </div>

            {/* Question panel — bottom 38% */}
            <div className="flex-1 min-h-0">
              <QuestionPanel
                playerId={player.id}
                question={questions[player.id]}
                lockedOpts={lockedOpts[player.id]}
                onAnswer={(opt) => handleAnswer(player.id, opt)}
                disabled={player.health <= 0 || phase !== "playing"}
                score={player.score}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── GAME OVER ────────────────────────────────────────────── */}
      {gameOver && (
        <ResultOverlay
          players={players}
          teams={teams}
          winner={winner}
          gameType={gameType}
          playerCount={playerCount}
        />
      )}
    </div>
  );
}