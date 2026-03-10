import { getQuestionsForRound, getOptionsForBlank } from "@/data/grammarBridgeData";
import { BRIDGE_START_X, BRIDGE_END_X, BLOCK_SPACING } from "./constants";

/**
 * Build the full block array for a sentence.
 * Each block: { index, word, isMissing, isFilled, x }
 */
export function buildBlocks(question) {
  const words  = question.sentence;
  const blanks = new Set(question.blanks);
  const total  = words.length;

  // Center the bridge
  const totalWidth = (total - 1) * BLOCK_SPACING;
  const startX     = -totalWidth / 2;

  return words.map((word, i) => ({
    index:     i,
    word,
    isMissing: blanks.has(i),
    isFilled:  false,
    x:         startX + i * BLOCK_SPACING,
    y:         0,
    z:         0,
  }));
}

/**
 * Fill the next unfilled blank in blocks.
 * Returns new blocks array.
 */
export function fillNextBlank(blocks, word) {
  let filled = false;
  return blocks.map(b => {
    if (!filled && b.isMissing && !b.isFilled) {
      filled = true;
      return { ...b, isFilled: true, isFresh: true };  // ← isFresh flag
    }
    // Clear fresh flag on all others
    return { ...b, isFresh: false };
  });
}

/**
 * Check if all blanks are filled.
 */
export function isBridgeComplete(blocks) {
  return blocks
    .filter(b => b.isMissing)
    .every(b => b.isFilled);
}

/**
 * Get next blank index (0-based among blanks array).
 * Returns null if all filled.
 */
export function getNextBlankIndex(blocks) {
  const missing = blocks.filter(b => b.isMissing);
  const next    = missing.find(b => !b.isFilled);
  if (!next) return null;
  const blankPos = blocks.filter(b => b.isMissing).indexOf(next);
  return blankPos;
}

/**
 * Check if picked answer is correct for the current blank.
 */
export function checkAnswer(question, blocks, picked) {
  const nextBlank = blocks.find(b => b.isMissing && !b.isFilled);
  if (!nextBlank) return false;
  return picked === nextBlank.word;
}

/**
 * Build initial player state.
 */
export function buildPlayerState(playerId, question) {
  const blocks   = buildBlocks(question);
  const startX   = blocks[0]?.x ?? -4;
  const options  = getOptionsForBlank(question, 0);

  return {
    id:          playerId,
    question,
    blocks,
    options,
    blankIndex:  0,
    phase:       "playing",
    characterX:  startX - 1.6,  // ← on start island
    finished:    false,
  };
}
/**
 * Get the X position of the first block (character start).
 */
export function getStartX(blocks) {
  return blocks[0]?.x ?? BRIDGE_START_X;
}

/**
 * Get the X position of the last block (character end).
 */
export function getEndX(blocks) {
  return blocks[blocks.length - 1]?.x ?? BRIDGE_END_X;
}