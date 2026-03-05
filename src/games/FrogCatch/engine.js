import { DIFFICULTY } from "./constants";

// ── Random helpers ────────────────────────────────────────────────────────

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

// ── Question generators ───────────────────────────────────────────────────

function makeAddition(cfg) {
  const a      = rInt(1, cfg.addMax);
  const b      = rInt(1, cfg.addMax);
  const answer = a + b;
  return {
    text:    `${a} + ${b} = ?`,
    answer,
    options: makeOptions(answer, 1, cfg.addMax * 2),
  };
}

function makeSubtraction(cfg) {
  const a      = rInt(1, cfg.subMax);
  const b      = rInt(1, a);           // b <= a so answer never negative
  const answer = a - b;
  return {
    text:    `${a} − ${b} = ?`,
    answer,
    options: makeOptions(answer, 0, cfg.subMax),
  };
}

function makeMultiplication(cfg) {
  const a      = rInt(2, cfg.mulMax);
  const b      = rInt(2, cfg.mulMax);
  const answer = a * b;
  return {
    text:    `${a} × ${b} = ?`,
    answer,
    options: makeOptions(answer, 1, cfg.mulMax * cfg.mulMax),
  };
}

function makeDivision(cfg) {
  const b      = rInt(2, cfg.divMax);
  const answer = rInt(2, cfg.divMax);
  const a      = b * answer;
  return {
    text:    `${a} ÷ ${b} = ?`,
    answer,
    options: makeOptions(answer, 1, cfg.divMax),
  };
}

function makeGreater(cfg) {
  const a      = rInt(1, cfg.addMax);
  let   b      = rInt(1, cfg.addMax);
  while (b === a) b = rInt(1, cfg.addMax);
  const answer = Math.max(a, b);
  return {
    text:    `Which is greater?`,
    subtext: `${a}  or  ${b}`,
    answer,
    options: shuffle([a, b, a + rInt(1,5), b + rInt(1,5)]).slice(0, 4)
      .map(String),
    answerStr: String(answer),
  };
}

function makeSmaller(cfg) {
  const a      = rInt(1, cfg.addMax);
  let   b      = rInt(1, cfg.addMax);
  while (b === a) b = rInt(1, cfg.addMax);
  const answer = Math.min(a, b);
  return {
    text:    `Which is smaller?`,
    subtext: `${a}  or  ${b}`,
    answer,
    options: shuffle([a, b, Math.max(0, a - rInt(1,4)), b - rInt(1,4)]).slice(0, 4)
      .map(String),
    answerStr: String(answer),
  };
}

function makeMissing(cfg) {
  const a      = rInt(1, cfg.addMax);
  const b      = rInt(1, cfg.addMax);
  const answer = b;
  const sum    = a + b;
  return {
    text:    `${a} + __ = ${sum}`,
    answer,
    options: makeOptions(answer, 1, cfg.addMax),
  };
}

function makeComparison(cfg) {
  const a      = rInt(1, cfg.addMax);
  let   b      = rInt(1, cfg.addMax);
  while (b === a) b = rInt(1, cfg.addMax);
  const answer = a > b ? ">" : a < b ? "<" : "=";
  return {
    text:    `${a}  __  ${b}`,
    subtext: "Fill in >, < or =",
    answer,
    options: [">", "<", "=", "≠"],
    answerStr: answer,
    isSymbol: true,
  };
}

// ── Option generator ─────────────────────────────────────────────────────
// Makes 3 wrong options + 1 correct, all unique, shuffled

function makeOptions(answer, min, max) {
  const opts   = new Set([answer]);
  let   tries  = 0;

  while (opts.size < 4 && tries < 100) {
    const delta  = rInt(1, Math.max(3, Math.floor(max * 0.15)));
    const wrong  = Math.random() > 0.5
      ? answer + delta
      : Math.max(min, answer - delta);
    if (wrong !== answer && wrong >= min) opts.add(wrong);
    tries++;
  }

  // Fallback if we couldn't get 4 unique options
  let fallback = answer + 1;
  while (opts.size < 4) {
    opts.add(fallback++);
  }

  return shuffle([...opts]).map(String);
}

// ── Main question builder ─────────────────────────────────────────────────

export function generateQuestion(ageGroup) {
  const cfg   = DIFFICULTY[ageGroup];
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
    id:        `q-${Date.now()}-${Math.random()}`,
    type,
    text:      q.text,
    subtext:   q.subtext ?? null,
    options:   q.options,
    answer:    String(q.answerStr ?? q.answer),
    isSymbol:  q.isSymbol ?? false,
  };
}

// ── Frog initialiser ─────────────────────────────────────────────────────

export function initFrogs(count, groundSize) {
  return Array.from({ length: count }, (_, i) => ({
    id:         i,
    x:          (Math.random() - 0.5) * (groundSize - 2),
    z:          (Math.random() - 0.5) * (groundSize - 2),
    targetX:    (Math.random() - 0.5) * (groundSize - 2),
    targetZ:    (Math.random() - 0.5) * (groundSize - 2),
    rotation:   Math.random() * Math.PI * 2,
    animation:  "FrogArmature|Frog_Idle",
    captured:   false,
    capturedBy: null,
  }));
}

// ── Winner ───────────────────────────────────────────────────────────────

export function getWinner(scores) {
  if (scores[0] > scores[1]) return 0;
  if (scores[1] > scores[0]) return 1;
  return null;
}

// ── Check answer ─────────────────────────────────────────────────────────

export function checkAnswer(question, picked) {
  return String(picked).trim() === String(question.answer).trim();
}