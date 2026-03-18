import { useState } from "react";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { schoolSignIn } from "@/firebase/auth";
import { getSchoolByUid, getSchoolByEmail } from "@/firebase/db";
import useSchoolStore from "@/store/useSchoolStore";

export default function SchoolLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSchool } = useSchoolStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await schoolSignIn(email, password);

      let school = await getSchoolByUid(cred.user.uid);
      if (!school) school = await getSchoolByEmail(cred.user.email);

      if (!school) {
        setError("No school account found. Contact BrainBloom support.");
        setLoading(false);
        return;
      }

      if (!school.active) {
        setError("This school account is deactivated. Contact BrainBloom support.");
        setLoading(false);
        return;
      }

      setSchool(school);
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "#060B18",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Nunito', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lilita+One&family=Baloo+2:wght@700;800;900&family=Nunito:wght@600;700;800;900&display=swap');

        @keyframes glow {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.9; }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50%     { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Background grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none",
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }} />

      {/* Glow blobs */}
      {[
        { x: "15%", y: "20%", color: "#818CF8", size: 400 },
        { x: "80%", y: "70%", color: "#3B82F6", size: 350 },
        { x: "50%", y: "50%", color: "#EF4444", size: 300 },
      ].map((blob, i) => (
        <div key={i} style={{
          position: "fixed",
          left: blob.x, top: blob.y,
          width: blob.size, height: blob.size,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${blob.color}15 0%, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          animation: `glow ${4 + i}s ease-in-out infinite`,
          animationDelay: `${i * 0.8}s`,
          pointerEvents: "none",
        }} />
      ))}

      {/* Card */}
      <div style={{
        width: "100%",
        maxWidth: 420,
        zIndex: 10,
        animation: "fadeUp 0.5s ease both",
        padding: "0 24px",
      }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }} className="flex justify-center">
          <img
            src="/assets/images/logo.png"
            alt="BrainBloom"
            style={{
              width: 200,
              filter: "drop-shadow(0 0 32px rgba(129,140,248,0.6))",
            }}
          />
          <p style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 12,
            fontWeight: 800,
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 3,
            textTransform: "uppercase",
            marginTop: 8,
          }}>
            Game Platform
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28,
          padding: 32,
          backdropFilter: "blur(12px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        }}>
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 22,
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 4px 0",
          }}>
            School Sign In
          </h2>
          <p style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.35)",
            fontWeight: 700,
            marginBottom: 24,
          }}>
            Sign in to access your question packs
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourschool.edu.in"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: "12px 14px 12px 40px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    outline: "none",
                    fontFamily: "'Nunito', sans-serif",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(129,140,248,0.6)";
                    e.target.style.background = "rgba(129,140,248,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{
                fontSize: 11,
                fontWeight: 800,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: 2,
                textTransform: "uppercase",
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  style={{
                    position: "absolute",
                    left: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "rgba(255,255,255,0.3)",
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    padding: "12px 14px 12px 40px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#fff",
                    outline: "none",
                    fontFamily: "'Nunito', sans-serif",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.target.style.border = "1px solid rgba(129,140,248,0.6)";
                    e.target.style.background = "rgba(129,140,248,0.08)";
                  }}
                  onBlur={(e) => {
                    e.target.style.border = "1px solid rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                  }}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 12,
                padding: "10px 14px",
              }}>
                <AlertCircle size={15} style={{ color: "#EF4444", flexShrink: 0 }} />
                <p style={{
                  color: "#FCA5A5",
                  fontSize: 13,
                  fontWeight: 700,
                  margin: 0,
                }}>
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading
                  ? "rgba(129,140,248,0.3)"
                  : "linear-gradient(135deg, #818CF8, #6366F1)",
                border: "none",
                borderRadius: 14,
                padding: "14px",
                fontSize: 15,
                fontWeight: 900,
                color: "#fff",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 8,
                fontFamily: "'Nunito', sans-serif",
                boxShadow: loading ? "none" : "0 8px 24px rgba(99,102,241,0.4)",
                transition: "all 0.2s ease",
                letterSpacing: 1,
              }}
            >
              {loading ? (
                <span style={{
                  width: 18,
                  height: 18,
                  border: "3px solid rgba(255,255,255,0.3)",
                  borderTop: "3px solid #fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                }} />
              ) : (
                <LogIn size={17} />
              )}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.15)",
          fontSize: 12,
          fontWeight: 700,
          marginTop: 24,
          letterSpacing: 1,
        }}>
          BRAINBLOOM · GAME PLATFORM
        </p>
        <p className="text-indigo-50/30">Test Credentials
        <ul> <li>test@mail.com</li></ul>
        <ul><li>test@123</li></ul>
        </p>
      </div>
    </div>
  );
}