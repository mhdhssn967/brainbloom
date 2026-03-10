import { shuffle } from "@/utils/math";
import { LEVEL_STAGES } from "./constants";

/**
 * Get grid config for a given level number.
 */
export function getStageForLevel(level) {
  let stage = LEVEL_STAGES[0];
  for (const s of LEVEL_STAGES) {
    if (level >= s.minLevel) stage = s;
  }
  return stage;
}

/**
 * Generate a random pattern of tile indices.
 */
export function generatePattern(gridSize, litCount) {
  const total = gridSize * gridSize;
  const all   = Array.from({ length: total }, (_, i) => i);
  return shuffle(all).slice(0, litCount);
}

/**
 * Check if a tapped tile is correct.
 */
export function isTileCorrect(pattern, tileIndex) {
  return pattern.includes(tileIndex);
}

/**
 * Check if all correct tiles have been tapped (level complete).
 */
export function isLevelComplete(pattern, tappedCorrect) {
  return pattern.every(i => tappedCorrect.includes(i));
}

/**
 * Determine winner by level reached.
 * Tiebreak: more correct taps in current level.
 */
export function getWinner(p0State, p1State) {
  if (p0State.level > p1State.level) return 0;
  if (p1State.level > p0State.level) return 1;
  const p0correct = p0State.correctTaps.length;
  const p1correct = p1State.correctTaps.length;
  if (p0correct > p1correct) return 0;
  if (p1correct > p0correct) return 1;
  return null; // draw
}