import { openDB } from 'idb'

const DB_NAME    = 'brainbloom-db'
const DB_VERSION = 1

/**
 * Open (or create) the IndexedDB database
 */
async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('sessions'))
        db.createObjectStore('sessions', { keyPath: 'id', autoIncrement: true })
      if (!db.objectStoreNames.contains('custom-questions'))
        db.createObjectStore('custom-questions', { keyPath: 'id', autoIncrement: true })
      if (!db.objectStoreNames.contains('leaderboard'))
        db.createObjectStore('leaderboard', { keyPath: 'id', autoIncrement: true })
    }
  })
}

const OfflineSync = {
  /** Save a completed session result */
  async saveSession(result) {
    const db = await getDB()
    return db.add('sessions', { ...result, savedAt: Date.now() })
  },

  /** Get all saved sessions */
  async getSessions() {
    const db = await getDB()
    return db.getAll('sessions')
  },

  /** Save teacher's custom question set */
  async saveCustomQuestions(gameId, questions) {
    const db = await getDB()
    return db.put('custom-questions', { id: gameId, questions, updatedAt: Date.now() })
  },

  /** Load custom questions for a game */
  async getCustomQuestions(gameId) {
    const db = await getDB()
    const record = await db.get('custom-questions', gameId)
    return record?.questions || []
  },

  /** Save leaderboard entry */
  async saveLeaderboardEntry(entry) {
    const db = await getDB()
    return db.add('leaderboard', { ...entry, date: Date.now() })
  },

  /** Get top N leaderboard entries */
  async getLeaderboard(limit = 10) {
    const db      = await getDB()
    const entries = await db.getAll('leaderboard')
    return entries
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
  },

  /** Clear all data (reset) */
  async clearAll() {
    const db = await getDB()
    await db.clear('sessions')
    await db.clear('leaderboard')
  },
}

export default OfflineSync