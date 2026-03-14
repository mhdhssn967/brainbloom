import { useEffect }        from "react";
import { useNavigate }       from "react-router-dom";
import { useTeamStore }      from "@/store/teamStore";
import { useSessionStore }   from "@/store/sessionStore";
import TrackRush             from "./TrackRush";

export default function TrackRushIndex() {
  const navigate  = useNavigate();
  const { teams } = useTeamStore();
  const { startSession } = useSessionStore();

  useEffect(() => {
    if (!teams || !teams[0] || !teams[1]) {
      navigate("/");
      return;
    }
    startSession("track-rush");
  }, []); // eslint-disable-line

  if (!teams?.[0] || !teams?.[1]) return null;
  return <TrackRush />;
}