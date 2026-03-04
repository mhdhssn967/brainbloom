import { describe, it, expect } from "vitest";
import { buildRounds, scoreAnswer, getWinner } from "@/games/SpotIt/engine";

describe("buildRounds", () => {
  it("returns correct number of rounds", () => {
    const rounds = buildRounds("monuments", 10);
    expect(rounds).toHaveLength(10);
  });

  it("each round has exactly 4 options", () => {
    const rounds = buildRounds("animals", 10);
    rounds.forEach(r => expect(r.options).toHaveLength(4));
  });

  it("correct answer is always in options", () => {
    const rounds = buildRounds("monuments", 10);
    rounds.forEach(r => {
      const wikis = r.options.map(o => o.wiki);
      expect(wikis).toContain(r.correctWiki);
    });
  });

  it("no duplicate options in a round", () => {
    const rounds = buildRounds("animals", 10);
    rounds.forEach(r => {
      const wikis  = r.options.map(o => o.wiki);
      const unique = new Set(wikis);
      expect(unique.size).toBe(4);
    });
  });

  it("random mode picks from all categories", () => {
    const rounds = buildRounds("random", 10);
    expect(rounds).toHaveLength(10);
  });
});

describe("scoreAnswer", () => {
  it("correct answer gives positive points", () => {
    expect(scoreAnswer(true)).toBe(10);
  });

  it("wrong answer gives negative points", () => {
    expect(scoreAnswer(false)).toBe(-5);
  });
});

describe("getWinner", () => {
  it("returns 0 when team 0 leads", () => {
    expect(getWinner({ 0: 50, 1: 30 })).toBe(0);
  });

  it("returns 1 when team 1 leads", () => {
    expect(getWinner({ 0: 20, 1: 60 })).toBe(1);
  });

  it("returns null on draw", () => {
    expect(getWinner({ 0: 40, 1: 40 })).toBe(null);
  });
});