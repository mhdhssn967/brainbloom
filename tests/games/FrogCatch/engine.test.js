import { describe, it, expect } from "vitest";
import {
  generateQuestion,
  initFrogs,
  checkAnswer,
  getWinner,
} from "@/games/FrogCatch/engine";

describe("generateQuestion", () => {
  it("returns a valid question object for each age group", () => {
    ["1-2", "3-4", "5-6", "7-9"].forEach(group => {
      const q = generateQuestion(group);
      expect(q).toHaveProperty("text");
      expect(q).toHaveProperty("answer");
      expect(q.options).toHaveLength(4);
    });
  });

  it("correct answer is always in options", () => {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion("3-4");
      expect(q.options).toContain(q.answer);
    }
  });

  it("options are always 4 unique values", () => {
    for (let i = 0; i < 50; i++) {
      const q    = generateQuestion("5-6");
      const uniq = new Set(q.options);
      expect(uniq.size).toBe(4);
    }
  });

  it("class 1-2 never generates multiplication", () => {
    for (let i = 0; i < 50; i++) {
      const q = generateQuestion("1-2");
      expect(q.type).not.toBe("multiplication");
      expect(q.type).not.toBe("division");
    }
  });
});

describe("checkAnswer", () => {
  it("returns true for correct answer", () => {
    const q = { answer: "7" };
    expect(checkAnswer(q, "7")).toBe(true);
  });

  it("returns false for wrong answer", () => {
    const q = { answer: "7" };
    expect(checkAnswer(q, "5")).toBe(false);
  });

  it("is string safe", () => {
    const q = { answer: "12" };
    expect(checkAnswer(q, 12)).toBe(true);
  });
});

describe("initFrogs", () => {
  it("creates correct number of frogs", () => {
    expect(initFrogs(20, 18)).toHaveLength(20);
  });

  it("all frogs start uncaptured", () => {
    initFrogs(10, 18).forEach(f => {
      expect(f.captured).toBe(false);
      expect(f.capturedBy).toBeNull();
    });
  });

  it("all frogs within ground bounds", () => {
    initFrogs(50, 18).forEach(f => {
      expect(Math.abs(f.x)).toBeLessThan(9);
      expect(Math.abs(f.z)).toBeLessThan(9);
    });
  });
});

describe("getWinner", () => {
  it("returns 0 when red leads", () => {
    expect(getWinner({ 0: 12, 1: 8 })).toBe(0);
  });
  it("returns 1 when blue leads", () => {
    expect(getWinner({ 0: 5, 1: 15 })).toBe(1);
  });
  it("returns null on draw", () => {
    expect(getWinner({ 0: 10, 1: 10 })).toBeNull();
  });
});