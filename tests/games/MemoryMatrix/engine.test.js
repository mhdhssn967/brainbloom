import { describe, it, expect } from "vitest";
import {
  generatePattern,
  evaluateTaps,
  calculateScore,
  getTileCount,
  isGameOver,
} from "@/games/MemoryMatrix/engine";

// ── generatePattern ──────────────────────────────────────────────────────
describe("generatePattern", () => {
  it("returns the correct number of tiles", () => {
    expect(generatePattern(3)).toHaveLength(3);
    expect(generatePattern(5)).toHaveLength(5);
  });

  it("never returns duplicate indices", () => {
    const pattern = generatePattern(5);
    const unique  = new Set(pattern);
    expect(unique.size).toBe(5);
  });

  it("all indices are within 0–24", () => {
    const pattern = generatePattern(5);
    pattern.forEach(i => {
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThanOrEqual(24);
    });
  });
});

// ── evaluateTaps ─────────────────────────────────────────────────────────
describe("evaluateTaps", () => {
  it("identifies correct, missed and wrong taps", () => {
    const result = evaluateTaps([3, 11, 19], [3, 11, 7]);
    expect(result.correct).toEqual(expect.arrayContaining([3, 11]));
    expect(result.missed).toEqual([19]);
    expect(result.wrong).toEqual([7]);
  });

  it("all correct — missed and wrong are empty", () => {
    const result = evaluateTaps([3, 11, 19], [3, 11, 19]);
    expect(result.correct).toHaveLength(3);
    expect(result.missed).toHaveLength(0);
    expect(result.wrong).toHaveLength(0);
  });

  it("no taps — everything is missed, nothing is wrong", () => {
    const result = evaluateTaps([3, 11, 19], []);
    expect(result.correct).toHaveLength(0);
    expect(result.missed).toHaveLength(3);
    expect(result.wrong).toHaveLength(0);
  });

  it("all wrong taps — correct and missed handled properly", () => {
    const result = evaluateTaps([3, 11, 19], [0, 1, 2]);
    expect(result.correct).toHaveLength(0);
    expect(result.missed).toHaveLength(3);
    expect(result.wrong).toHaveLength(3);
  });
});

// ── calculateScore ───────────────────────────────────────────────────────
describe("calculateScore", () => {
  it("3 correct 0 wrong = 30 points", () => {
    expect(calculateScore({ correct: [1, 2, 3], wrong: [] })).toBe(30);
  });

  it("2 correct 1 wrong = 15 points", () => {
    expect(calculateScore({ correct: [1, 2], wrong: [5] })).toBe(15);
  });

  it("0 correct 2 wrong = 0 points (never negative)", () => {
    expect(calculateScore({ correct: [], wrong: [1, 2] })).toBe(0);
  });

  it("0 correct 0 wrong = 0 points", () => {
    expect(calculateScore({ correct: [], wrong: [] })).toBe(0);
  });
});

// ── getTileCount ─────────────────────────────────────────────────────────
describe("getTileCount", () => {
  it("rounds 1–5 return 3 tiles", () => {
    [1, 2, 3, 4, 5].forEach(r => expect(getTileCount(r)).toBe(3));
  });

  it("rounds 6–12 return 4 tiles", () => {
    [6, 7, 12].forEach(r => expect(getTileCount(r)).toBe(4));
  });

  it("rounds 13–20 return 5 tiles", () => {
    [13, 15, 20].forEach(r => expect(getTileCount(r)).toBe(5));
  });
});

// ── isGameOver ───────────────────────────────────────────────────────────
describe("isGameOver", () => {
  it("round 20 is not over — still playing", () => {
    expect(isGameOver(20)).toBe(false);
  });

  it("round 21 is game over", () => {
    expect(isGameOver(21)).toBe(true);
  });

  it("round 1 is not over", () => {
    expect(isGameOver(1)).toBe(false);
  });
});