/**
 * Each entry:
 *   sentence : string[]  — full sentence as word array
 *   blanks   : number[]  — indices that are missing (must answer)
 *   image    : string    — filename without extension, in /assets/grammarbridge/
 *   options  : string[]  — exactly 4 choices (correct answer must be included)
 *   tier     : 1-4       — difficulty tier
 */

export const GRAMMAR_DATA = [

  // ── TIER 1 — Simple noun + verb, 1 gap ───────────────────────────────

  {
    tier: 1,
    sentence: ["A", "cat", "is", "sleeping"],
    blanks:   [2],
    image:    "cat_sleeping",
    options:  ["is", "are", "was", "were"],
  },
  {
    tier: 1,
    sentence: ["The", "dog", "runs", "fast"],
    blanks:   [2],
    image:    "dog_running",
    options:  ["run", "runs", "ran", "running"],
  },
  {
    tier: 1,
    sentence: ["A", "bird", "is", "flying"],
    blanks:   [3],
    image:    "bird_flying",
    options:  ["flying", "flown", "flew", "fly"],
  },
  {
    tier: 1,
    sentence: ["The", "fish", "swims", "in", "water"],
    blanks:   [2],
    image:    "fish_swimming",
    options:  ["swim", "swims", "swam", "swimming"],
  },
  {
    tier: 1,
    sentence: ["A", "frog", "jumps", "high"],
    blanks:   [2],
    image:    "frog_jumping",
    options:  ["jump", "jumps", "jumped", "jumping"],
  },
  {
    tier: 1,
    sentence: ["The", "sun", "is", "bright"],
    blanks:   [2],
    image:    "sun_bright",
    options:  ["is", "are", "was", "be"],
  },
  {
    tier: 1,
    sentence: ["A", "baby", "is", "crying"],
    blanks:   [2],
    image:    "baby_crying",
    options:  ["is", "are", "am", "was"],
  },
  {
    tier: 1,
    sentence: ["The", "cow", "eats", "grass"],
    blanks:   [3],
    image:    "cow_eating",
    options:  ["grass", "water", "milk", "hay"],
  },
  {
    tier: 1,
    sentence: ["A", "rabbit", "hops", "slowly"],
    blanks:   [2],
    image:    "rabbit_hopping",
    options:  ["hop", "hops", "hopped", "hopping"],
  },
  {
    tier: 1,
    sentence: ["The", "moon", "shines", "at", "night"],
    blanks:   [2],
    image:    "moon_shining",
    options:  ["shine", "shines", "shone", "shining"],
  },

  // ── TIER 2 — Subject + verb + object, 1-2 gaps ───────────────────────

  {
    tier: 2,
    sentence: ["The", "boy", "kicked", "the", "ball"],
    blanks:   [2],
    image:    "boy_kicking_ball",
    options:  ["kick", "kicks", "kicked", "kicking"],
  },
  {
    tier: 2,
    sentence: ["She", "is", "eating", "an", "apple"],
    blanks:   [2, 3],
    image:    "girl_eating_apple",
    options:  ["eating", "an", "eat", "a"],
  },
  {
    tier: 2,
    sentence: ["The", "girl", "reads", "a", "book"],
    blanks:   [2],
    image:    "girl_reading",
    options:  ["read", "reads", "reading", "readed"],
  },
  {
    tier: 2,
    sentence: ["He", "is", "riding", "a", "bicycle"],
    blanks:   [2],
    image:    "boy_cycling",
    options:  ["riding", "ride", "rides", "rided"],
  },
  {
    tier: 2,
    sentence: ["The", "monkey", "climbs", "the", "tree"],
    blanks:   [2, 4],
    image:    "monkey_climbing",
    options:  ["climbs", "tree", "climb", "branch"],
  },
  {
    tier: 2,
    sentence: ["They", "are", "playing", "football"],
    blanks:   [1],
    image:    "children_football",
    options:  ["are", "is", "am", "was"],
  },
  {
    tier: 2,
    sentence: ["The", "lion", "chases", "the", "deer"],
    blanks:   [2],
    image:    "lion_chasing",
    options:  ["chase", "chases", "chased", "chasing"],
  },
  {
    tier: 2,
    sentence: ["We", "go", "to", "school", "everyday"],
    blanks:   [1],
    image:    "children_school",
    options:  ["go", "goes", "went", "going"],
  },
  {
    tier: 2,
    sentence: ["The", "chef", "cooks", "delicious", "food"],
    blanks:   [2],
    image:    "chef_cooking",
    options:  ["cook", "cooks", "cooked", "cooking"],
  },
  {
    tier: 2,
    sentence: ["A", "farmer", "waters", "his", "plants"],
    blanks:   [2, 3],
    image:    "farmer_watering",
    options:  ["waters", "his", "water", "their"],
  },

  // ── TIER 3 — Adjectives & adverbs, 2-3 gaps ──────────────────────────

  {
    tier: 3,
    sentence: ["The", "big", "elephant", "walks", "slowly"],
    blanks:   [1, 4],
    image:    "elephant_walking",
    options:  ["big", "slowly", "small", "quickly"],
  },
  {
    tier: 3,
    sentence: ["She", "wore", "a", "beautiful", "dress"],
    blanks:   [3],
    image:    "girl_dress",
    options:  ["beautiful", "ugly", "big", "small"],
  },
  {
    tier: 3,
    sentence: ["The", "lazy", "cat", "sleeps", "all", "day"],
    blanks:   [1, 3],
    image:    "lazy_cat",
    options:  ["lazy", "sleeps", "active", "runs"],
  },
  {
    tier: 3,
    sentence: ["He", "quickly", "ran", "across", "the", "field"],
    blanks:   [1, 3],
    image:    "boy_running_field",
    options:  ["quickly", "across", "slowly", "under"],
  },
  {
    tier: 3,
    sentence: ["The", "colorful", "butterfly", "flies", "gracefully"],
    blanks:   [1, 4],
    image:    "butterfly_flying",
    options:  ["colorful", "gracefully", "dull", "clumsily"],
  },
  {
    tier: 3,
    sentence: ["A", "tiny", "ant", "carries", "a", "heavy", "leaf"],
    blanks:   [1, 5],
    image:    "ant_leaf",
    options:  ["tiny", "heavy", "huge", "light"],
  },
  {
    tier: 3,
    sentence: ["The", "old", "man", "walks", "with", "a", "stick"],
    blanks:   [1, 3],
    image:    "old_man_walking",
    options:  ["old", "walks", "young", "runs"],
  },
  {
    tier: 3,
    sentence: ["She", "carefully", "placed", "the", "fragile", "vase"],
    blanks:   [1, 4],
    image:    "girl_vase",
    options:  ["carefully", "fragile", "roughly", "strong"],
  },
  {
    tier: 3,
    sentence: ["The", "naughty", "boy", "loudly", "laughed"],
    blanks:   [1, 3],
    image:    "boy_laughing",
    options:  ["naughty", "loudly", "good", "quietly"],
  },
  {
    tier: 3,
    sentence: ["A", "friendly", "dog", "happily", "wagged", "its", "tail"],
    blanks:   [1, 3],
    image:    "dog_wagging",
    options:  ["friendly", "happily", "angry", "sadly"],
  },

  // ── TIER 4 — Compound sentences, prepositions, conjunctions ──────────

  {
    tier: 4,
    sentence: ["The", "cat", "sat", "on", "the", "mat", "and", "purred"],
    blanks:   [3, 6],
    image:    "cat_mat",
    options:  ["on", "and", "under", "but"],
  },
  {
    tier: 4,
    sentence: ["She", "was", "tired", "but", "she", "kept", "working"],
    blanks:   [3, 5],
    image:    "girl_working",
    options:  ["but", "kept", "and", "stopped"],
  },
  {
    tier: 4,
    sentence: ["He", "will", "come", "if", "you", "call", "him"],
    blanks:   [3, 5],
    image:    "boy_phone",
    options:  ["if", "call", "unless", "ignore"],
  },
  {
    tier: 4,
    sentence: ["The", "bird", "flew", "over", "the", "river", "and", "landed"],
    blanks:   [3, 6],
    image:    "bird_river",
    options:  ["over", "and", "under", "but"],
  },
  {
    tier: 4,
    sentence: ["Although", "it", "rained", "they", "played", "outside"],
    blanks:   [0, 4],
    image:    "children_rain",
    options:  ["Although", "played", "Because", "stopped"],
  },
  {
    tier: 4,
    sentence: ["She", "not", "only", "sings", "but", "also", "dances"],
    blanks:   [3, 6],
    image:    "girl_singing_dancing",
    options:  ["sings", "dances", "cries", "sleeps"],
  },
  {
    tier: 4,
    sentence: ["The", "dog", "barked", "because", "it", "saw", "a", "stranger"],
    blanks:   [3, 7],
    image:    "dog_stranger",
    options:  ["because", "stranger", "although", "friend"],
  },
  {
    tier: 4,
    sentence: ["Neither", "the", "boy", "nor", "the", "girl", "spoke"],
    blanks:   [0, 3],
    image:    "children_silent",
    options:  ["Neither", "nor", "Either", "or"],
  },
  {
    tier: 4,
    sentence: ["He", "finished", "his", "homework", "before", "he", "played"],
    blanks:   [4, 6],
    image:    "boy_homework",
    options:  ["before", "played", "after", "studied"],
  },
  {
    tier: 4,
    sentence: ["The", "train", "stopped", "suddenly", "and", "everyone", "fell"],
    blanks:   [3, 4],
    image:    "train_stopped",
    options:  ["suddenly", "and", "slowly", "but"],
  },
];

/**
 * Get questions for a specific round number out of totalRounds.
 * Maps round → tier based on progress through game.
 * Returns two different questions (one per player).
 */
export function getQuestionsForRound(roundNumber, totalRounds) {
  const progress = (roundNumber - 1) / Math.max(totalRounds - 1, 1);
  const tier     = progress < 0.25 ? 1
                 : progress < 0.50 ? 2
                 : progress < 0.75 ? 3
                 : 4;

  const pool = GRAMMAR_DATA.filter(q => q.tier === tier);
  if (pool.length === 0) return [GRAMMAR_DATA[0], GRAMMAR_DATA[1]];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const q1 = shuffled[0];
  const q2 = shuffled[1] ?? shuffled[0];
  return [q1, q2];
}

/**
 * For a question, build the list of answer options correctly.
 * When multiple blanks, each click fills one blank at a time
 * in order. So options at any point = choices for the NEXT blank.
 */
export function getOptionsForBlank(question, blankIndex) {
  const wordIndex = question.blanks[blankIndex];
  if (wordIndex === undefined) return [];

  const correct     = question.sentence[wordIndex];
  const distractors = question.options
    .filter(o => o.trim() !== correct.trim())
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Guarantee exactly 4 options with correct always present
  const four = [...distractors, correct].sort(() => Math.random() - 0.5);
  return four;
}
// ```

// ---

// **Image list** — here are all 40 images you need to create, one per sentence, saved as JPG in `public/assets/grammarbridge/`:
// ```
// cat_sleeping.jpg         dog_running.jpg          bird_flying.jpg
// fish_swimming.jpg        frog_jumping.jpg          sun_bright.jpg
// baby_crying.jpg          cow_eating.jpg            rabbit_hopping.jpg
// moon_shining.jpg         boy_kicking_ball.jpg      girl_eating_apple.jpg
// girl_reading.jpg         boy_cycling.jpg           monkey_climbing.jpg
// children_football.jpg    lion_chasing.jpg          children_school.jpg
// chef_cooking.jpg         farmer_watering.jpg       elephant_walking.jpg
// girl_dress.jpg           lazy_cat.jpg              boy_running_field.jpg
// butterfly_flying.jpg     ant_leaf.jpg              old_man_walking.jpg
// girl_vase.jpg            boy_laughing.jpg          dog_wagging.jpg
// cat_mat.jpg              girl_working.jpg          boy_phone.jpg
// bird_river.jpg           children_rain.jpg         girl_singing_dancing.jpg
// dog_stranger.jpg         children_silent.jpg       boy_homework.jpg
// train_stopped.jpg