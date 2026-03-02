import { create } from 'zustand'
import { GAME_STATUS } from '@/utils/constants'

export const useSessionStore = create((set) => ({
  gameId:      null,
  mode:        null,
  status:      GAME_STATUS.IDLE,
  difficulty:  'medium',
  roundNum:    1,
  totalRounds: 5,

  startSession:  (gameId, mode) => set({ gameId, mode, status: GAME_STATUS.LOBBY }),
  beginPlay:     ()             => set({ status: GAME_STATUS.PLAYING }),
  pauseSession:  ()             => set({ status: GAME_STATUS.PAUSED }),
  resumeSession: ()             => set({ status: GAME_STATUS.PLAYING }),
  endSession:    ()             => set({ status: GAME_STATUS.FINISHED }),
  setDifficulty: (d)            => set({ difficulty: d }),
  nextRound:     ()             => set(s =>
    s.roundNum < s.totalRounds
      ? { roundNum: s.roundNum + 1 }
      : { status: GAME_STATUS.FINISHED }
  ),
  reset: () => set({
    gameId: null, mode: null,
    status: GAME_STATUS.IDLE,
    roundNum: 1,
  }),
}))