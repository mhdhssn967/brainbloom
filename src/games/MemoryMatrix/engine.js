import { shuffle }          from "@/utils/math";
import {
  GRID_SIZE,
  TOTAL_ROUNDS,
  POINTS_PER_TILE,
  WRONG_TAP_PENALTY,
} from "./constants";

/**
 * Pick random tile indices to light up this round.
 * @param {number} tileCount  how many tiles to flip
 * @returns {number[]}  e.g. [3, 11, 19]
 */
export function generatePattern(tileCount = 3) {
  const allIndices = Array.from({ length: GRID_SIZE }, (_, i) => i);
  return shuffle(allIndices).slice(0, tileCount);
}

/**
 * Compare what was shown vs what the student tapped.
 * @param {number[]} pattern  tiles that were lit
 * @param {number[]} taps     tiles the student tapped
 * @returns {{ correct: number[], missed: number[], wrong: number[] }}
 */
export function evaluateTaps(pattern, taps) {
  const patternSet = new Set(pattern);
  const tapsSet    = new Set(taps);

  const correct = pattern.filter(i => tapsSet.has(i));
  const missed  = pattern.filter(i => !tapsSet.has(i));
  const wrong   = taps.filter(i => !patternSet.has(i));

  return { correct, missed, wrong };
}

/**
 * Calculate points earned for one round.
 * Correct taps earn points, wrong taps deduct.
 * Score never goes below 0.
 * @param {{ correct: number[], wrong: number[] }} evaluation
 * @returns {number}
 */
export function calculateScore(evaluation) {
  const earned   = evaluation.correct.length * POINTS_PER_TILE;
  const deducted = evaluation.wrong.length   * WRONG_TAP_PENALTY;
  return Math.max(0, earned - deducted);
}

/**
 * How many tiles to flip this round.
 * Gets harder as rounds progress.
 * @param {number} round  1-based round number
 * @returns {number}
 */
export function getTileCount(round) {
  if (round <= 5)  return 3;
  if (round <= 12) return 4;
  return 5;
}

/**
 * Returns true when all rounds are done.
 * @param {number} round  current round (1-based)
 * @returns {boolean}
 */
export function isGameOver(round) {
  return round > TOTAL_ROUNDS;
}