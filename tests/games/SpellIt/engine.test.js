import { describe, it, expect } from "vitest";
import {
  buildWordList,
  generateBlanks,
  buildSlots,
  checkLetter,
  getNextActiveBlank,
  isWordComplete,
} from "@/games/SpellIt/engine";

describe("buildWordList", () => {
  it("returns correct count", () => {
    const list = buildWordList("animals", 5);
    expect(list).toHaveLength(5);
  });

  it("returns different order each time", () => {
    const a = buildWordList("animals", 5).map(w => w.name).join(",");
    const b = buildWordList("animals", 5).map(w => w.name).join(",");
    // Very unlikely to match
    expect(a).not.toBe(b);
  });
});

describe("generateBlanks", () => {
  it("never blanks index 0", () => {
    for (let i = 0; i < 20; i++) {
      const blanks = generateBlanks("ELEPHANT");
      expect(blanks).not.toContain(0);
    }
  });

  it("never blanks spaces", () => {
    for (let i = 0; i < 20; i++) {
      const blanks = generateBlanks("POLAR BEAR");
      // Index 5 is the space — should never be blanked
      expect(blanks).not.toContain(5);
    }
  });

  it("returns different blanks each call", () => {
    const results = new Set();
    for (let i = 0; i < 10; i++) {
      results.add(generateBlanks("ELEPHANT").join(","));
    }
    // Should have more than 1 unique result across 10 calls
    expect(results.size).toBeGreaterThan(1);
  });

  it("blank count scales with word length", () => {
    expect(generateBlanks("FOX")).toHaveLength(1);       // 3 letters → 1 blank
    expect(generateBlanks("TIGER")).toHaveLength(2);     // 5 letters → 2 blanks
    expect(generateBlanks("ELEPHANT")).toHaveLength(4);  // 8 letters → 3 blanks
  });
});

describe("buildSlots", () => {
  it("marks correct indices as blank", () => {
    const slots = buildSlots("TIGER", [2, 4]);
    expect(slots[0].isBlank).toBe(false);
    expect(slots[2].isBlank).toBe(true);
    expect(slots[4].isBlank).toBe(true);
  });

  it("marks spaces correctly", () => {
    const slots = buildSlots("POLAR BEAR", []);
    expect(slots[5].isSpace).toBe(true);
  });

  it("uppercases all chars", () => {
    const slots = buildSlots("tiger", []);
    expect(slots[0].char).toBe("T");
  });
});

describe("checkLetter", () => {
  it("returns true for correct letter", () => {
    expect(checkLetter("TIGER", 2, "G")).toBe(true);
  });

  it("returns false for wrong letter", () => {
    expect(checkLetter("TIGER", 2, "X")).toBe(false);
  });

  it("is case insensitive", () => {
    expect(checkLetter("TIGER", 0, "t")).toBe(true);
  });
});

describe("getNextActiveBlank", () => {
  it("returns first unfilled blank", () => {
    expect(getNextActiveBlank([2, 4, 6], {})).toBe(2);
  });

  it("skips filled blanks", () => {
    expect(getNextActiveBlank([2, 4, 6], { 2: "G" })).toBe(4);
  });

  it("returns null when all filled", () => {
    expect(getNextActiveBlank([2, 4], { 2: "G", 4: "R" })).toBeNull();
  });
});

describe("isWordComplete", () => {
  it("returns false when blanks remain", () => {
    expect(isWordComplete([2, 4], { 2: "G" })).toBe(false);
  });

  it("returns true when all blanks filled", () => {
    expect(isWordComplete([2, 4], { 2: "G", 4: "R" })).toBe(true);
  });
});