import { describe, it, expect, beforeEach } from 'vitest'
import { TeamManager } from '@/engine/TeamManager'

describe('TeamManager', () => {
  let tm

  beforeEach(() => { tm = new TeamManager(2) })

  it('initialises with correct team count', () => {
    expect(tm.teams).toHaveLength(2)
  })

  it('adds score correctly', () => {
    tm.addScore(0, 10)
    expect(tm.teams[0].score).toBe(10)
  })

  it("applies streak multiplier at threshold", () => {
  tm.addScore(0, 10) // streak 1 → score 10
  tm.addScore(0, 10) // streak 2 → score 20
  tm.addScore(0, 10) // streak 3 → multiplier kicks in → score 40
  expect(tm.teams[0].score).toBe(40) // 10 + 10 + (10×2)
})

  it('resets streak on wrong answer', () => {
    tm.addScore(0, 10)
    tm.wrongAnswer(0)
    expect(tm.teams[0].streak).toBe(0)
  })

  it('loses a life on wrong answer', () => {
    tm.wrongAnswer(0)
    expect(tm.teams[0].lives).toBe(2)
  })

  it('getLeader returns highest scorer', () => {
    tm.addScore(0, 10)
    tm.addScore(1, 50)
    expect(tm.getLeader().id).toBe(1)
  })
})