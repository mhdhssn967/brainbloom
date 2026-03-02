import { GAME_STATUS } from '@/utils/constants'

/**
 * GameSession manages the lifecycle of a single game session.
 * Pure class — no React, no Zustand. Can be unit tested in isolation.
 */
export class GameSession {
  constructor({ gameId, mode, totalRounds = 5, difficulty = 'medium' }) {
    this.gameId      = gameId
    this.mode        = mode
    this.totalRounds = totalRounds
    this.difficulty  = difficulty
    this.status      = GAME_STATUS.IDLE
    this.roundNum    = 1
    this.startedAt   = null
    this.endedAt     = null
  }

  /** Move session to lobby (team setup screen) */
  toLobby() {
    this.status = GAME_STATUS.LOBBY
    return this
  }

  /** Begin the actual gameplay */
  start() {
    if (this.status !== GAME_STATUS.LOBBY) {
      throw new Error('Session must be in lobby before starting')
    }
    this.status    = GAME_STATUS.PLAYING
    this.startedAt = Date.now()
    return this
  }

  pause() {
    if (this.status === GAME_STATUS.PLAYING) {
      this.status = GAME_STATUS.PAUSED
    }
    return this
  }

  resume() {
    if (this.status === GAME_STATUS.PAUSED) {
      this.status = GAME_STATUS.PLAYING
    }
    return this
  }

  /** Advance to next round. Returns false if game should end. */
  nextRound() {
    if (this.roundNum >= this.totalRounds) return false
    this.roundNum++
    return true
  }

  end() {
    this.status  = GAME_STATUS.FINISHED
    this.endedAt = Date.now()
    return this
  }

  /** Duration in seconds */
  getDuration() {
    if (!this.startedAt) return 0
    const end = this.endedAt || Date.now()
    return Math.floor((end - this.startedAt) / 1000)
  }

  isPlaying()  { return this.status === GAME_STATUS.PLAYING }
  isPaused()   { return this.status === GAME_STATUS.PAUSED }
  isFinished() { return this.status === GAME_STATUS.FINISHED }
}