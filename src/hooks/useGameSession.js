import { useSessionStore } from '@/store/sessionStore'
import { useTeamStore }    from '@/store/teamStore'
import { useNavigate }     from 'react-router-dom'
import { ROUTES }          from '@/utils/constants'

/**
 * Convenience hook combining session + team actions for game components.
 */
export function useGameSession() {
  const navigate  = useNavigate()
  const session   = useSessionStore()
  const teamStore = useTeamStore()

  function exitToHome() {
    session.reset()
    teamStore.reset()
    navigate(ROUTES.HOME)
  }

  function finishGame() {
    session.endSession()
    navigate(ROUTES.RESULTS)
  }

  return { ...session, ...teamStore, exitToHome, finishGame }
}