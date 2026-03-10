import { useEffect }       from "react";
import { useNavigate }     from "react-router-dom";
import { useSessionStore } from "@/store/sessionStore";
import { useTeamStore }    from "@/store/teamStore";
import GrammarBridge       from "./GrammarBridge";


export default function GrammarBridgePage() {
    
  const navigate = useNavigate();
  const gameId   = useSessionStore(s => s.gameId);
  const teams    = useTeamStore(s => s.teams);

  useEffect(() => {
    if (!gameId || teams.length === 0) navigate("/");
  }, [gameId, teams]);

  if (!gameId || teams.length === 0) return null;
  return <GrammarBridge />;
}