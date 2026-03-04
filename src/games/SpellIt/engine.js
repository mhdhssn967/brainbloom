import { shuffle }       from "@/utils/math";
import { SPELL_IT_DATA, getBlankCount } from "@/data/spellItData";

/**
 * Pick N random words from a category, shuffled.
 * @param {string} categoryKey
 * @param {number} count
 * @returns {Array}
 */
export function buildWordList(categoryKey, count) {
  const category = SPELL_IT_DATA[categoryKey];
  if (!category) return [];
  return shuffle([...category.words]).slice(0, count);
}

/**
 * Generate blank positions for a word dynamically.
 * Never blanks the first letter (too hard for kids).
 * Picks random indices from the word.
 *
 * @param {string} word   e.g. "ELEPHANT"
 * @returns {number[]}    e.g. [2, 4, 6]
 */
export function generateBlanks(word) {
  const upper      = word.toUpperCase();
  const length     = upper.length;
  const blankCount = getBlankCount(length);

  // Eligible positions — skip index 0 (first letter always shown)
  // Also skip spaces for multi-word animals like "Polar Bear"
  const eligible = [];
  for (let i = 1; i < length; i++) {
    if (upper[i] !== " ") eligible.push(i);
  }

  return shuffle(eligible).slice(0, blankCount).sort((a, b) => a - b);
}

/**
 * Build the letter slots for displaying the word.
 * Each slot is either shown (letter visible) or blank (needs input).
 *
 * @param {string}   word
 * @param {number[]} blankIndices
 * @returns {Array}  [{ index, char, isBlank, isSpace }]
 */
export function buildSlots(word, blankIndices) {
  const upper      = word.toUpperCase();
  const blankSet   = new Set(blankIndices);

  return upper.split("").map((char, index) => ({
    index,
    char,
    isBlank: blankSet.has(index),
    isSpace: char === " ",
  }));
}

/**
 * Check if a letter guess is correct for the active blank slot.
 *
 * @param {string} word
 * @param {number} slotIndex   index in the word
 * @param {string} guessedLetter
 * @returns {boolean}
 */
export function checkLetter(word, slotIndex, guessedLetter) {
  return word.toUpperCase()[slotIndex] === guessedLetter.toUpperCase();
}

/**
 * Get the index of the next unfilled blank after the current one.
 * Returns null if all blanks are filled.
 *
 * @param {number[]} blankIndices   all blank positions
 * @param {object}   filled         { [index]: letter } — already filled
 * @returns {number|null}
 */
export function getNextActiveBlank(blankIndices, filled) {
  for (const idx of blankIndices) {
    if (!filled[idx]) return idx;
  }
  return null;   // all filled — word complete
}

/**
 * Check if the word is fully completed.
 */
export function isWordComplete(blankIndices, filled) {
  return blankIndices.every(idx => !!filled[idx]);
}

/**
 * Get image path for a word entry.
 * @param {string} categoryKey
 * @param {string} file
 */
export function getImagePath(categoryKey, file) {
  const folder = SPELL_IT_DATA[categoryKey]?.folder ?? categoryKey;
  return `/assets/spellit/${folder}/${file}`;
}