import { shuffle }    from "@/utils/math";
import { BUG_EMOJIS } from "@/data/chameleonData";

/**
 * Build bugs for a round.
 *
 * Spawn zone logic:
 *   Player 0 (left, chameleon on left wall): bugs in right portion
 *   Player 1 (right, chameleon on right wall): bugs in left portion
 */
export function buildBugs(
  round,
  bugType,
  roundIndex,
  containerW,
  containerH,
  playerId = 0
) {
  if (!round) return [];

  const correct = (round.correct ?? []).map(String);
  const wrong   = (round.wrong   ?? []).map(String);

  // Always show ALL correct answers.
  // Wrong bugs: minimum 3, scales up with round progress to max 8.
  // This ensures even round 0 has plenty of distractors mixed in.
  const wrongCount = Math.min(3 + Math.floor(roundIndex / 3), 8, wrong.length);
  const wrongPick  = shuffle([...wrong]).slice(0, wrongCount);

  const all = shuffle([
    ...correct.map(v  => ({ value: v, isCorrect: true  })),
    ...wrongPick.map(v => ({ value: v, isCorrect: false })),
  ]);

  // Spawn zone
  const yMin = containerH * 0.28;
  const yMax = containerH * 1.0;

  const xMin = playerId === 0
    ? containerW * 1     // left player: bugs in right portion
    : containerW * 0.04;
  const xMax = playerId === 0
    ? containerW * 2
    : containerW * 1;    // right player: bugs in left portion

  return all.map((item, i) => {
    const x    = xMin + Math.random() * (xMax - xMin);
    const y    = yMin + Math.random() * (yMax - yMin);
    const size = 58 + Math.random() * 20;

    return {
      id:        `bug-${roundIndex}-${i}-${item.value}`,
      value:     item.value,   // text label, hex colour, or shape key
      label:     item.value,   // alias for any code still reading .label
      isCorrect: item.isCorrect,
      bugType,
      emoji:     BUG_EMOJIS[i % BUG_EMOJIS.length],
      caught:    false,
      flashing:  false,
      x, y,
      vx: (Math.random() - 0.5) * 1.1 + (playerId === 0 ? -0.1 : 0.1),
      vy: (Math.random() - 0.5) * 0.7,
      phase: Math.random() * Math.PI * 2,
      size,
      xMin, xMax, yMin, yMax,
    };
  });
}

export function moveBugs(bugs, containerW, containerH, dt) {
  return bugs.map(bug => {
    if (bug.caught || bug.flashing) return bug;

    let { x, y, vx, vy, phase, xMin, xMax, yMin, yMax } = bug;
    phase += 0.035;

    x += vx + Math.sin(phase) * 0.32;
    y += vy + Math.cos(phase * 0.65) * 0.25;

    const pad = bug.size / 2 + 6;
    const bx0 = (xMin ?? 0)          + pad;
    const bx1 = (xMax ?? containerW) - pad;
    const by0 = (yMin ?? 0)          + pad;
    const by1 = (yMax ?? containerH) - pad;

    if (x < bx0) { vx =  Math.abs(vx); x = bx0; }
    if (x > bx1) { vx = -Math.abs(vx); x = bx1; }
    if (y < by0) { vy =  Math.abs(vy); y = by0; }
    if (y > by1) { vy = -Math.abs(vy); y = by1; }

    return { ...bug, x, y, vx, vy, phase };
  });
}

export function isRoundComplete(bugs) {
  return bugs.filter(b => b.isCorrect).every(b => b.caught);
}

export function getWinner(p0, p1) {
  if (p0.score > p1.score) return 0;
  if (p1.score > p0.score) return 1;
  return null;
}