/**
 * Format seconds into MM:SS string
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

/**
 * Format a score number with commas
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  return score.toLocaleString()
}

/**
 * Get ordinal string for a rank number
 * @param {number} n
 * @returns {string}  e.g. "1st", "2nd", "3rd"
 */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}