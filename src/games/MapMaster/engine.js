import { shuffle, pickRandom } from "@/utils/math";
import { PLAYABLE_STATES }     from "@/data/indiaStates";
import {
  SNAP_THRESHOLD,
  SVG_VIEWBOX_SIZE,
  INITIAL_SHOW_COUNT,
  STATES_TO_PLACE,
} from "./constants";

/**
 * Split states into two groups:
 * - preShown:  INITIAL_SHOW_COUNT states displayed on map from the start
 * - toPlace:   STATES_TO_PLACE states the players must drag into position
 * Total = INITIAL_SHOW_COUNT + STATES_TO_PLACE (must not exceed PLAYABLE_STATES.length)
 */
export function initGameStates() {
  const shuffled = shuffle([...PLAYABLE_STATES]);
  const preShown = shuffled.slice(0, INITIAL_SHOW_COUNT);
  const toPlace  = shuffled.slice(INITIAL_SHOW_COUNT, INITIAL_SHOW_COUNT + STATES_TO_PLACE);
  return { preShown, toPlace };
}

/**
 * Convert SVG coordinate to screen pixel coordinate.
 * The SVG is rendered at svgRenderedSize px on screen,
 * but its internal viewBox is SVG_VIEWBOX_SIZE units.
 *
 * @param {number} svgX        coordinate in SVG units
 * @param {number} svgY        coordinate in SVG units
 * @param {number} svgRenderedSize   actual rendered px size of the SVG on screen
 * @param {{ x: number, y: number }} svgOffset   top-left of SVG on screen
 * @returns {{ x: number, y: number }}  screen pixel coordinates
 */
export function svgToScreen(svgX, svgY, svgRenderedSize, svgOffset = { x: 0, y: 0 }) {
  const scale = svgRenderedSize / SVG_VIEWBOX_SIZE;
  return {
    x: svgX * scale + svgOffset.x,
    y: svgY * scale + svgOffset.y,
  };
}

/**
 * Convert screen pixel coordinate back to SVG units.
 */
export function screenToSvg(screenX, screenY, svgRenderedSize, svgOffset = { x: 0, y: 0 }) {
  const scale = svgRenderedSize / SVG_VIEWBOX_SIZE;
  return {
    x: (screenX - svgOffset.x) / scale,
    y: (screenY - svgOffset.y) / scale,
  };
}

/**
 * Check if a dropped position is close enough to the correct centroid.
 * Both coordinates are in SVG units.
 *
 * @param {{ x: number, y: number }} dropped   where player dropped (SVG units)
 * @param {{ x: number, y: number }} target    correct centroid (SVG units)
 * @returns {boolean}
 */
export function isNearEnough(dropped, target) {
  const dist = Math.sqrt(
    (dropped.x - target.x) ** 2 +
    (dropped.y - target.y) ** 2
  );
  return dist <= SNAP_THRESHOLD;
}

/**
 * Get the next state to place.
 * Returns null if all states have been attempted.
 *
 * @param {Array}  toPlace       full list of states to place
 * @param {number} currentIndex  current round index (0-based)
 * @returns {object|null}
 */
export function getNextState(toPlace, currentIndex) {
  if (currentIndex >= toPlace.length) return null;
  return toPlace[currentIndex];
}

/**
 * Determine winner from scores.
 * Returns team id (0 or 1), or null for draw.
 */
export function getWinner(scores) {
  if (scores[0] > scores[1]) return 0;
  if (scores[1] > scores[0]) return 1;
  return null;
}