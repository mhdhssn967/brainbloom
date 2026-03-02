import { useEffect }        from "react";
import { useNavigate }      from "react-router-dom";
import { useSessionStore }  from "@/store/sessionStore";
import { useTeamStore }     from "@/store/teamStore";
import BalloonBattle        from "./BalloonBattle";

export default function BalloonBattlePage() {
  const navigate  = useNavigate();
  const gameId    = useSessionStore(s => s.gameId);
  const teams     = useTeamStore(s => s.teams);

  // Guard — if no session or no teams, send back home
  useEffect(() => {
    if (!gameId || teams.length === 0) {
      navigate("/");
    }
  }, [gameId, teams]);

  if (!gameId || teams.length === 0) return null;

  return <BalloonBattle />;
}