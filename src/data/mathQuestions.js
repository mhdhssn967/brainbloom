import { randomInt, shuffle } from "@/utils/math";

const OPERATORS = ["+", "-", "×", "÷"];

// Ranges per difficulty
const RANGES = {
  easy:   { min: 1,  max: 10  },
  medium: { min: 5,  max: 20  },
  hard:   { min: 5, max: 50 },
};

/**
 * Compute the answer for a given expression
 */
function compute(a, operator, b) {
  switch (operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "×": return a * b;
    case "÷": return a / b;
  }
}

/**
 * Generate 3 wrong options that are close to the correct answer.
 * Never duplicates the correct answer. Never goes below 0.
 */
function generateWrongOptions(answer) {
  const wrongs = new Set();
  const offsets = [1, 2, 3, 4, 5, 7, 8, 10, 12, 15];
  const shuffledOffsets = shuffle(offsets);

  for (const offset of shuffledOffsets) {
    if (wrongs.size === 3) break;
    const candidate1 = answer + offset;
    const candidate2 = answer - offset;
    if (candidate1 !== answer) wrongs.add(candidate1);
    if (wrongs.size < 3 && candidate2 !== answer && candidate2 > 0)
      wrongs.add(candidate2);
  }

  return [...wrongs].slice(0, 3);
}

/**
 * Generate a single valid math question.
 * For division: ensures b divides a cleanly (no decimals).
 * @param {"easy"|"medium"|"hard"} difficulty
 * @returns question object
 */
export function generateQuestion(difficulty = "medium") {
  const { min, max } = RANGES[difficulty];
  const operator = OPERATORS[randomInt(0, OPERATORS.length - 1)];

  let a, b, answer;

  if (operator === "÷") {
    // Pick b first, then pick a as a multiple of b
    b = randomInt(1, Math.min(10, max));
    const multiplier = randomInt(1, Math.floor(max / b));
    a = b * multiplier;
    answer = a / b;
  } else if (operator === "-") {
    // Ensure a >= b so answer is never negative
    a = randomInt(min, max);
    b = randomInt(min, a);
    answer = a - b;
  } else {
    a = randomInt(min, max);
    b = randomInt(min, max);
    answer = compute(a, operator, b);
  }

  const wrongOptions = generateWrongOptions(answer);
  const options = shuffle([answer, ...wrongOptions]);

  return {
    id:         `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    expression: `${a} ${operator} ${b}`,
    a,
    operator,
    b,
    answer,
    options,    // always 4 numbers, shuffled, answer always in here
    difficulty,
  };
}