import { useEffect } from "react";
import Router from "@/router";
import "@/index.css";
import "@/styles/animations.css";
import { onAuthChanged } from "@/firebase/auth";
import { getSchoolByUid, getSchoolByEmail } from "@/firebase/db";
import useSchoolStore from "@/store/useSchoolStore";
import SchoolLogin from "@/pages/SchoolLogin";
import { Gamepad2 } from "lucide-react";

export default function App() {
  const { schoolData, loading, setSchool, clearSchool } = useSchoolStore();

  useEffect(() => {
    const unsub = onAuthChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          let school = await getSchoolByUid(firebaseUser.uid);
          if (!school) school = await getSchoolByEmail(firebaseUser.email);

          if (school && school.active) {
            setSchool(school);
          } else {
            clearSchool();
          }
        } catch {
          clearSchool();
        }
      } else {
        clearSchool();
      }
    });

    return () => unsub();
  }, []);

  // ── Loading — checking Firebase Auth session ──
  if (loading) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        background: "#060B18",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        fontFamily: "'Nunito', sans-serif",
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: "4px solid rgba(129,140,248,0.2)",
          borderTop: "4px solid #818CF8",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 1,
        }}>
          Loading BrainBloom...
        </p>
      </div>
    );
  }

  // ── Not logged in ──
  if (!schoolData) {
    return <SchoolLogin />;
  }

  // ── Logged in — render full game platform ──
  return <Router />;
}