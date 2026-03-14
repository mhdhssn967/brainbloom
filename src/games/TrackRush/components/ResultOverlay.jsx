import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore } from "@/store/teamStore";

const TEAM_COLORS = { 0: "#EF4444", 1: "#3B82F6" };
const ACCENT = "#F59E0B";

export default function ResultOverlay({ teams, winner, players, accentColor = ACCENT }) {
  const canvasRef = useRef(null);

  const navigate = useNavigate();
  const resetSession = useSessionStore(s => s.reset);
  const resetTeams = useTeamStore(s => s.reset);

  function handleHome() {
    resetSession();
    resetTeams();
    navigate("/");
  }

  /* ---------------- Confetti ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext("2d");

    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 10,
      r: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 4,
      vy: 3 + Math.random() * 5,
      vr: (Math.random() - 0.5) * 0.2,
      color: ["#F59E0B","#EF4444","#3B82F6","#22C55E","#EC4899","#A78BFA"][Math.floor(Math.random()*6)]
    }));

    let raf;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        p.vy += 0.08;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);

  }, []);

  const winColor = winner !== null ? TEAM_COLORS[winner] : accentColor;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(6,11,24,0.92)",
      backdropFilter: "blur(12px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100
    }}>

      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      <div style={{
        position: "relative",
        textAlign: "center",
        padding: "44px 52px",
        background: "rgba(2,8,20,0.88)",
        border: `2px solid ${winColor}50`,
        borderRadius: 32,
        boxShadow: `0 0 80px ${winColor}30, 0 40px 80px rgba(0,0,0,0.8)`,
        minWidth: 360,
        animation: "resultIn 0.5s cubic-bezier(0.34,1.4,0.64,1) both"
      }}>

        <style>{`
          @keyframes resultIn {
            from { transform:scale(0.6); opacity:0 }
            to   { transform:scale(1);   opacity:1 }
          }

          @keyframes trophy {
            0%,100% { transform:rotate(-8deg) }
            50%     { transform:rotate(8deg) }
          }
        `}</style>

        <div style={{
          fontSize: 72,
          animation: "trophy 1s ease-in-out infinite"
        }}>
          🏆
        </div>

        {winner !== null ? (
          <>
            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: 16,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: 3,
              marginBottom: 6
            }}>
              WINNER
            </div>

            <div style={{
              fontFamily: "'Lilita One', cursive",
              fontSize: 48,
              color: winColor,
              textShadow: `0 0 30px ${winColor}`,
              letterSpacing: 2
            }}>
              {teams[winner]?.name}
            </div>
          </>
        ) : (
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: 40,
            color: accentColor,
            textShadow: `0 0 30px ${accentColor}`
          }}>
            It's a Tie! 🤝
          </div>
        )}

        {/* Scores */}
        <div style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          marginTop: 24
        }}>
          {[0,1].map(id => {
            const color = TEAM_COLORS[id];
            const isWinner = id === winner;

            return (
              <div key={id} style={{
                padding: "14px 28px",
                borderRadius: 18,
                background: `${color}12`,
                border: `2px solid ${color}${isWinner ? "99" : "33"}`,
                minWidth: 110,
                boxShadow: isWinner ? `0 0 24px ${color}40` : "none"
              }}>
                <div style={{
                  fontFamily: "'Baloo 2', cursive",
                  fontSize: 11,
                  fontWeight: 900,
                  color,
                  letterSpacing: 2,
                  marginBottom: 4
                }}>
                  {teams[id]?.name}
                </div>

                <div style={{
                  fontFamily: "'Lilita One', cursive",
                  fontSize: 42,
                  color: "#fff",
                  lineHeight: 1,
                  textShadow: isWinner ? `0 0 20px ${color}` : "none"
                }}>
                  {players[id]?.score ?? 0}
                </div>

                <div style={{
                  fontSize: 10,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.3)",
                  letterSpacing: 1
                }}>
                  PTS
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <button
          onPointerDown={(e)=>{
            e.currentTarget.releasePointerCapture(e.pointerId);
            handleHome();
          }}
          style={{
            all: "unset",
            cursor: "pointer",
            marginTop: 28,
            width: "100%",
            padding: "14px 0",
            borderRadius: 16,
            background: "#F59E0B",
            fontFamily: "'Lilita One', cursive",
            fontSize: 20,
            color: "#fff",
            letterSpacing: 1,
            boxShadow: "0 6px 20px rgba(132,204,22,0.4)"
          }}
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}