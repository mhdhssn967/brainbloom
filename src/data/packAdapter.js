import { shuffle } from "@/utils/math";

/**
 * Convert a Type 1 portal question set into TrackRush format.
 * TrackRush needs exactly 3 options with one correct (index 0-2).
 *
 * @param {object[]} questions  — Type 1 questions from IndexedDB
 * @returns {object[]}          — TrackRush-compatible question array
 */
export function adaptType1ToTrackRush(questions) {
  return questions.map((q, i) => {
    const correct = q.options[q.correctIndex];

    // Pick 2 wrong options from the remaining 3
    const wrongs = q.options
      .filter((_, idx) => idx !== q.correctIndex)
      .slice(0, 2);

    // Build pool of 3 and shuffle
    const pool = shuffle([correct, ...wrongs]);

    return {
      id:       `pack-${i}`,
      question: q.question,
      emoji:    difficultyEmoji(q.difficulty),
      options:  pool,                    // exactly 3 strings
      correct:  pool.indexOf(correct),   // index 0-2
      difficulty: q.difficulty,
    };
  });
}

function difficultyEmoji(d) {
  if (d === "easy")   return "⭐";
  if (d === "hard")   return "🔥";
  return "💡";
}