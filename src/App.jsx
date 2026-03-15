import { useEffect } from "react";
import Router from "@/router";
import "@/index.css";
import "@/styles/animations.css";
import { onAuthChanged } from "@/firebase/auth";
import { getSchoolByUid, getSchoolByEmail } from "@/firebase/db";
import useSchoolStore from "@/store/useSchoolStore";
import SchoolLogin from "@/pages/SchoolLogin";
import { Gamepad2 } from "lucide-react";
import LoadingScreen from "./components/ui/LoadingScreen";

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
      <LoadingScreen/>
    );
  }

  // ── Not logged in ──
  if (!schoolData) {
    return <SchoolLogin />;
  }

  // ── Logged in — render full game platform ──
  return <Router />;
}