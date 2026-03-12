import {
  getChainsForRound,
  getBlanksForRound,
  getBlankIndices,
  getDistractors,
} from "@/data/foodChainData";
import { shuffle } from "@/utils/math";

/**
 * Build the full question for a round.
 * Returns chain display (with nulls for blanks), blank indices, and shuffled options.
 */
export function buildRound(biomeId, round) {
  const { chain, roles } = getChainsForRound(biomeId, round);
  const blankCount       = getBlanksForRound(round);
  const blankIndices     = getBlankIndices(chain, Math.min(blankCount, chain.length - 1));

  // Build display chain — null where blank
  const display = chain.map((item, i) =>
    blankIndices.includes(i) ? null : item
  );

  // Correct answers in order
  const answers = blankIndices.map(i => chain[i]);

  // Distractors — wrong options
  const distractors = getDistractors(biomeId, chain, 4 - answers.length);

  // All options shuffled
  const options = shuffle([...answers, ...distractors]);

  return {
    chain,
    roles,
    display,       // e.g. ["🌱 Grass", null, "🦊 Fox"]
    blankIndices,  // e.g. [1]
    answers,       // e.g. ["🐰 Rabbit"]
    options,       // shuffled cards shown to player
    currentBlank:  0,  // which blank we're filling now
  };
}

/**
 * Check if tapped option is correct for the current blank.
 */
export function checkAnswer(roundState, tapped) {
  return roundState.answers[roundState.currentBlank] === tapped;
}

/**
 * Advance to next blank after correct answer.
 */
export function fillBlank(roundState, tapped) {
  const newDisplay     = [...roundState.display];
  const blankIdx       = roundState.blankIndices[roundState.currentBlank];
  newDisplay[blankIdx] = tapped;
  return {
    ...roundState,
    display:      newDisplay,
    currentBlank: roundState.currentBlank + 1,
  };
}

/**
 * Is the round complete (all blanks filled)?
 */
export function isRoundComplete(roundState) {
  return roundState.currentBlank >= roundState.answers.length;
}

export function getWinner(p0, p1) {
  if (p0.score > p1.score) return 0;
  if (p1.score > p0.score) return 1;
  return null;
}