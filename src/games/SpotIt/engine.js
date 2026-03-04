import { shuffle, pickRandom } from "@/utils/math";
import { CATEGORIES, CATEGORY_KEYS } from "@/data/spotItData";
import { POINTS_CORRECT, POINTS_WRONG } from "./constants";

/**
 * Pick 10 rounds from a category (or random across all).
 * Each round has one correct answer + 3 distractors, all shuffled.
 *
 * @param {string|"random"} categoryKey
 * @returns {Array} array of round objects
 */
export function buildRounds(categoryKey = "random", count = 10) {
  let rounds = [];

  if (categoryKey === "random") {
    // Pick a random category per round — all 4 options from SAME category
    const keys = CATEGORY_KEYS;

    for (let i = 0; i < count; i++) {
      const randomKey  = keys[Math.floor(Math.random() * keys.length)];
      const pool       = shuffle([...CATEGORIES[randomKey].entries]);
      if (pool.length < 4) continue;

      const correct     = pool[0];
      const distractors = pool.slice(1, 4);
      const options     = shuffle([correct, ...distractors]);

      rounds.push({
        id:           `round-${i}`,
        correctWiki:  correct.wiki,
        correctName:  correct.name,
        category:     randomKey,
        options,
      });
    }
  } else {
    const pool = shuffle([...CATEGORIES[categoryKey].entries]);

    for (let i = 0; i < count && i < pool.length; i++) {
      const correct     = pool[i];
      const distractors = shuffle(
        pool.filter(e => e.wiki !== correct.wiki)
      ).slice(0, 3);
      const options     = shuffle([correct, ...distractors]);

      rounds.push({
        id:           `round-${i}`,
        correctWiki:  correct.wiki,
        correctName:  correct.name,
        category:     categoryKey,
        options,
      });
    }
  }

  return rounds;
}

/**
 * Fetch image URL from Wikipedia for a given wiki page title.
 * Returns null if no image found.
 */
export async function fetchWikiImage(wikiTitle) {
  try {
    const url      = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const res      = await fetch(url);
    if (!res.ok) return null;
    const data     = await res.json();
    return data.thumbnail?.source ?? data.originalimage?.source ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch images for all 4 options in a round.
 * Returns map of wiki → imageUrl
 */
export async function fetchRoundImages(round) {
  const results = await Promise.all(
    round.options.map(async opt => ({
      wiki:  opt.wiki,
      image: await fetchWikiImage(opt.wiki),
    }))
  );

  const map = {};
  results.forEach(r => { map[r.wiki] = r.image; });
  return map;
}

/**
 * Score result for one answer.
 */
export function scoreAnswer(isCorrect) {
  return isCorrect ? POINTS_CORRECT : -POINTS_WRONG;
}

/**
 * Winner from final scores.
 */
export function getWinner(scores) {
  if (scores[0] > scores[1]) return 0;
  if (scores[1] > scores[0]) return 1;
  return null;
}