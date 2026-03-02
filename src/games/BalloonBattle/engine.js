import { BALLOON_COUNT } from "./constants";

/**
 * Build the initial balloon state for N teams.
 * @param {number} teamCount
 * @returns {{ 0: 20, 1: 20 }}
 */
export function initBalloons(teamCount = 2) {
  const balloons = {};
  for (let i = 0; i < teamCount; i++) {
    balloons[i] = BALLOON_COUNT;
  }
  return balloons;
}

/**
 * Correct answer — opponent loses a balloon.
 * @param {object} balloons   current balloon counts e.g. { 0: 20, 1: 18 }
 * @param {number} scoringTeamId   the team that answered correctly
 * @param {number} teamCount
 * @returns new balloons object (never mutates original)
 */
export function applyCorrectAnswer(balloons, scoringTeamId, teamCount = 2) {
  const updated = { ...balloons };

  for (let i = 0; i < teamCount; i++) {
    if (i !== scoringTeamId) {
      updated[i] = Math.max(0, updated[i] - 1);
    }
  }

  return updated;
}

/**
 * Wrong answer — the answering team loses their own balloon.
 * @param {object} balloons
 * @param {number} penalisedTeamId
 * @returns new balloons object
 */
export function applyWrongAnswer(balloons, penalisedTeamId) {
  return {
    ...balloons,
    [penalisedTeamId]: Math.max(0, balloons[penalisedTeamId] - 1),
  };
}

/**
 * Check if the game should end.
 * Game ends when any team reaches 0 balloons.
 * @param {object} balloons
 * @returns {boolean}
 */
export function isGameOver(balloons) {
  return Object.values(balloons).some(count => count === 0);
}

/**
 * Get the winning team id.
 * Winner is the team with the most balloons remaining.
 * Returns null if it's a draw.
 * @param {object} balloons
 * @returns {number|null} winning team id
 */
export function getWinner(balloons) {
  const entries = Object.entries(balloons).map(([id, count]) => ({
    id: Number(id),
    count,
  }));

  const sorted = entries.sort((a, b) => b.count - a.count);

  if (sorted[0].count === sorted[1].count) return null;  // draw
  return sorted[0].id;
}