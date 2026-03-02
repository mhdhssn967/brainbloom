/**
 * Content loader — imports question banks by subject and class.
 * Add new JSON files and register them in the map below.
 */

const contentMap = {
  'math-class6':    () => import('./math/class6.json'),
  'math-class7':    () => import('./math/class7.json'),
  'math-class8':    () => import('./math/class8.json'),
  'english-spelling': () => import('./english/spelling.json'),
  'english-grammar':  () => import('./english/grammar.json'),
  'sst-india':        () => import('./sst/india-states.json'),
}

/**
 * Load a question bank dynamically
 * @param {string} key  e.g. 'math-class6'
 * @returns {Promise<Array>} array of question objects
 */
export async function loadQuestions(key) {
  const loader = contentMap[key]
  if (!loader) throw new Error(`No content found for key: "${key}"`)
  const module = await loader()
  return module.default
}

export const CONTENT_KEYS = Object.keys(contentMap)