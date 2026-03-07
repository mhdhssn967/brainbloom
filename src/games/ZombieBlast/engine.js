import { DIFFICULTY, WAVES, MAX_ZOMBIES_SCREEN } from "./constants";

function rInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(answer, min, max) {
  const opts  = new Set([answer]);
  let tries   = 0;
  while (opts.size < 4 && tries < 100) {
    const delta = rInt(1, Math.max(3, Math.floor(max * 0.15)));
    const wrong = Math.random() > 0.5
      ? answer + delta
      : Math.max(min, answer - delta);
    if (wrong !== answer && wrong >= min) opts.add(wrong);
    tries++;
  }
  let fallback = answer + 1;
  while (opts.size < 4) opts.add(fallback++);
  return shuffle([...opts]).map(String);
}

function makeAddition(cfg) {
  const a = rInt(1, cfg.addMax);
  const b = rInt(1, cfg.addMax);
  return { text: `${a} + ${b} = ?`, answer: a + b,
    options: makeOptions(a + b, 1, cfg.addMax * 2) };
}

function makeSubtraction(cfg) {
  const a = rInt(1, cfg.subMax);
  const b = rInt(1, a);
  return { text: `${a} − ${b} = ?`, answer: a - b,
    options: makeOptions(a - b, 0, cfg.subMax) };
}

function makeMultiplication(cfg) {
  const a = rInt(2, cfg.mulMax);
  const b = rInt(2, cfg.mulMax);
  return { text: `${a} × ${b} = ?`, answer: a * b,
    options: makeOptions(a * b, 1, cfg.mulMax * cfg.mulMax) };
}

function makeDivision(cfg) {
  const b      = rInt(2, cfg.divMax);
  const answer = rInt(2, cfg.divMax);
  const a      = b * answer;
  return { text: `${a} ÷ ${b} = ?`, answer,
    options: makeOptions(answer, 1, cfg.divMax) };
}

function makeGreater(cfg) {
  const a = rInt(1, cfg.addMax);
  let   b = rInt(1, cfg.addMax);
  while (b === a) b = rInt(1, cfg.addMax);
  const answer = Math.max(a, b);
  return {
    text: `Which is greater?`, subtext: `${a}  or  ${b}`,
    answer, options: shuffle([a, b, a + rInt(1,4), b + rInt(1,4)])
      .slice(0, 4).map(String), answerStr: String(answer),
  };
}

function makeSmaller(cfg) {
  const a = rInt(1, cfg.addMax);
  let   b = rInt(1, cfg.addMax);
  while (b === a) b = rInt(1, cfg.addMax);
  const answer = Math.min(a, b);
  return {
    text: `Which is smaller?`, subtext: `${a}  or  ${b}`,
    answer, options: shuffle([a, b, Math.max(0, a - rInt(1,4)), b - rInt(1,4)])
      .slice(0, 4).map(String), answerStr: String(answer),
  };
}

function makeMissing(cfg) {
  const a   = rInt(1, cfg.addMax);
  const b   = rInt(1, cfg.addMax);
  const sum = a + b;
  return { text: `${a} + __ = ${sum}`, answer: b,
    options: makeOptions(b, 1, cfg.addMax) };
}

function makeComparison(cfg) {
  const a = rInt(1, cfg.addMax);
  let   b = rInt(1, cfg.addMax);
  while (b === a) b = rInt(1, cfg.addMax);
  const answer = a > b ? ">" : "<";
  return {
    text: `${a}  __  ${b}`, subtext: "Pick > or <",
    answer, options: [">", "<", "=", "≠"],
    answerStr: answer, isSymbol: true,
  };
}

export function getQuestion(source, difficulty) {
  if (source?.type === "custom" && source.questions?.length > 0) {
    const pool = source.questions;
    const q    = pool[Math.floor(Math.random() * pool.length)];
    return {
      id:      `custom-${Date.now()}`,
      text:    q.text,
      subtext: q.subtext ?? null,
      options: q.options,
      answer:  String(q.answer),
    };
  }

  const cfg   = DIFFICULTY[difficulty];
  const types = cfg.types;
  const type  = types[Math.floor(Math.random() * types.length)];

  let q;
  switch (type) {
    case "addition":       q = makeAddition(cfg);       break;
    case "subtraction":    q = makeSubtraction(cfg);    break;
    case "multiplication": q = makeMultiplication(cfg); break;
    case "division":       q = makeDivision(cfg);       break;
    case "greater":        q = makeGreater(cfg);        break;
    case "smaller":        q = makeSmaller(cfg);        break;
    case "missing":        q = makeMissing(cfg);        break;
    case "comparison":     q = makeComparison(cfg);     break;
    default:               q = makeAddition(cfg);
  }

  return {
    id:       `q-${Date.now()}-${Math.random()}`,
    text:     q.text,
    subtext:  q.subtext ?? null,
    options:  q.options,
    answer:   String(q.answerStr ?? q.answer),
    isSymbol: q.isSymbol ?? false,
  };
}

let zombieIdCounter = 0;

export function spawnZombie(arenaWidth, spawnZ) {
  const id        = zombieIdCounter++;
  const modelFile = Math.random() > 0.5 ? "zombie1.glb" : "zombie2.glb";
  const halfWidth = (arenaWidth / 2) - 0.5;
  const x         = (Math.random() * 2 - 1) * halfWidth;

  return {
    id,
    spawnOrder:  id,        // lower = spawned earlier = higher priority target
    x,
    z:           spawnZ,
    modelFile,
    state:       "walking",
    health:      1,
    attackAnim:  "Idle_Attack",
  };
}

export function getCurrentWave(elapsedSeconds) {
  let wave = WAVES[0];
  for (const w of WAVES) {
    if (elapsedSeconds >= w.minTime) wave = w;
  }
  return wave;
}

export function checkAnswer(question, picked) {
  return String(picked).trim() === String(question.answer).trim();
}

/**
 * PRIMARY TARGET LOGIC
 * Always returns the zombie that spawned first (lowest spawnOrder)
 * that is still alive (not dying or dead).
 * This zombie is the one the character always aims at.
 * Only after it dies does the next one become primary target.
 */
export function getPrimaryTarget(zombies) {
  const alive = zombies.filter(
    z => z.state !== "dying" && z.state !== "dead"
  );
  if (alive.length === 0) return null;

  // Sort by spawn order — oldest spawn = primary target
  return alive.sort((a, b) => a.spawnOrder - b.spawnOrder)[0];
}

export function getWinner(players) {
  const alive = players.filter(p => p.health > 0);
  if (alive.length === 1) return alive[0].id;
  if (alive.length === 0) return null;
  const sorted = [...players].sort((a, b) => b.score - a.score);
  if (sorted[0].score === sorted[1].score) return null;
  return sorted[0].id;
}