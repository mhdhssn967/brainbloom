import { create } from 'zustand'
import { TEAM_COLORS, TEAM_NAMES_DEFAULT, DEFAULT_LIVES, STREAK_THRESHOLD, STREAK_MULTIPLIER } from '@/utils/constants'

export const useTeamStore = create((set, get) => ({
  teams: [],

  initTeams: (count = 2, customNames = []) => set({
    teams: Array.from({ length: count }, (_, i) => ({
      id:     i,
      name:   customNames[i] || TEAM_NAMES_DEFAULT[i],
      color:  TEAM_COLORS[i],
      score:  0,
      streak: 0,
      lives:  DEFAULT_LIVES,
    }))
  }),

  setTeamName: (teamId, name) => set(s => ({
    teams: s.teams.map(t => t.id === teamId ? { ...t, name } : t)
  })),

  addScore: (teamId, basePoints) => set(s => ({
    teams: s.teams.map(t => {
      if (t.id !== teamId) return t
      const newStreak = t.streak + 1
      const multiplier = newStreak >= STREAK_THRESHOLD ? STREAK_MULTIPLIER : 1
      return { ...t, score: t.score + basePoints * multiplier, streak: newStreak }
    })
  })),

  wrongAnswer: (teamId) => set(s => ({
    teams: s.teams.map(t =>
      t.id === teamId
        ? { ...t, streak: 0, lives: Math.max(0, t.lives - 1) }
        : t
    )
  })),

  resetStreak: (teamId) => set(s => ({
    teams: s.teams.map(t => t.id === teamId ? { ...t, streak: 0 } : t)
  })),

  getLeader: () => {
    const { teams } = get()
    return [...teams].sort((a, b) => b.score - a.score)[0]
  },

  getStandings: () => {
    const { teams } = get()
    return [...teams].sort((a, b) => b.score - a.score)
  },

  reset: () => set(s => ({
    teams: s.teams.map(t => ({ ...t, score: 0, streak: 0, lives: DEFAULT_LIVES }))
  })),
}))