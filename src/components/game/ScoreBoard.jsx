import { useTeamStore } from '@/store/teamStore'
import { formatScore }  from '@/utils/format'

/**
 * ScoreBoard — shows all teams with live scores.
 * Reads directly from teamStore, no props needed.
 */
export default function ScoreBoard() {
  const teams = useTeamStore(s => s.teams)

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {teams.map(team => (
        <div key={team.id} style={{
          background: `${team.color}18`,
          border: `2px solid ${team.color}`,
          borderRadius: 16, padding: '10px 20px',
          textAlign: 'center', minWidth: 120,
        }}>
          <div style={{
            fontFamily: "'Boogaloo', cursive",
            fontSize: 14, color: team.color,
            letterSpacing: 1, marginBottom: 4,
          }}>{team.name}</div>
          <div style={{
            fontFamily: "'Lilita One', cursive",
            fontSize: 32, color: '#fff',
            lineHeight: 1,
          }}>{formatScore(team.score)}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 6 }}>
            {Array.from({ length: team.lives }).map((_, i) => (
              <span key={i} style={{ fontSize: 14 }}>❤️</span>
            ))}
          </div>
          {team.streak >= 2 && (
            <div style={{
              marginTop: 4, fontSize: 11, fontWeight: 800,
              color: '#FFD700', letterSpacing: 0.5,
            }}>🔥 ×{team.streak} streak</div>
          )}
        </div>
      ))}
    </div>
  )
}