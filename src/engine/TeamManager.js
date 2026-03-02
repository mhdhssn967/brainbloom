import { TEAM_COLORS, TEAM_NAMES_DEFAULT, DEFAULT_LIVES, STREAK_THRESHOLD, STREAK_MULTIPLIER } from '@/utils/constants'

/**
 * TeamManager handles all team state operations.
 * Pure class — no React. Used by teamStore internally.
 */
export class TeamManager {
  constructor(count = 2) {
    this.teams = Array.from({ length: count }, (_, i) => ({
      id:     i,
      name:   TEAM_NAMES_DEFAULT[i],
      color:  TEAM_COLORS[i],
      score:  0,
      streak: 0,
      lives:  DEFAULT_LIVES,
    }))
  }

  setName(teamId, name) {
    this._get(teamId).name = name
    return this
  }

  /**
   * Add points to a team. Applies streak multiplier if threshold hit.
   * @param {number} teamId
   * @param {number} basePoints
   * @returns {number} actual points added
   */
  addScore(teamId, basePoints) {
    const team = this._get(teamId)
    team.streak++
    const multiplier = team.streak >= STREAK_THRESHOLD ? STREAK_MULTIPLIER : 1
    const actual = basePoints * multiplier
    team.score += actual
    return actual
  }

  wrongAnswer(teamId) {
    const team = this._get(teamId)
    team.streak = 0
    team.lives  = Math.max(0, team.lives - 1)
    return this
  }

  resetStreak(teamId) {
    this._get(teamId).streak = 0
    return this
  }

  isEliminated(teamId) {
    return this._get(teamId).lives === 0
  }

  getLeader() {
    return [...this.teams].sort((a, b) => b.score - a.score)[0]
  }

  getStandings() {
    return [...this.teams].sort((a, b) => b.score - a.score)
  }

  reset() {
    this.teams.forEach(t => {
      t.score  = 0
      t.streak = 0
      t.lives  = DEFAULT_LIVES
    })
    return this
  }

  _get(id) {
    const t = this.teams.find(t => t.id === id)
    if (!t) throw new Error(`Team ${id} not found`)
    return t
  }
}