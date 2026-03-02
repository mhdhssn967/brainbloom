import { describe, it, expect } from "vitest";
import {
  initBalloons,
  applyCorrectAnswer,
  applyWrongAnswer,
  isGameOver,
  getWinner,
} from "@/games/BalloonBattle/engine";

describe("initBalloons", () => {
  it("creates correct balloon count per team", () => {
    const b = initBalloons(2);
    expect(b[0]).toBe(20);
    expect(b[1]).toBe(20);
  });
});

describe("applyCorrectAnswer", () => {
  it("reduces opponent balloons by 1", () => {
    const b = initBalloons(2);
    const updated = applyCorrectAnswer(b, 0);  // team 0 answered correctly
    expect(updated[0]).toBe(20);               // team 0 unchanged
    expect(updated[1]).toBe(19);               // team 1 loses one
  });

  it("never goes below 0", () => {
    const b = { 0: 20, 1: 0 };
    const updated = applyCorrectAnswer(b, 0);
    expect(updated[1]).toBe(0);
  });

  it("does not mutate the original", () => {
    const b = initBalloons(2);
    applyCorrectAnswer(b, 0);
    expect(b[1]).toBe(20);   // original untouched
  });
});

describe("applyWrongAnswer", () => {
  it("reduces own team balloons by 1", () => {
    const b = initBalloons(2);
    const updated = applyWrongAnswer(b, 0);  // team 0 answered wrong
    expect(updated[0]).toBe(19);
    expect(updated[1]).toBe(20);
  });

  it("never goes below 0", () => {
    const b = { 0: 0, 1: 20 };
    const updated = applyWrongAnswer(b, 0);
    expect(updated[0]).toBe(0);
  });
});

describe("isGameOver", () => {
  it("returns false when both teams have balloons", () => {
    expect(isGameOver({ 0: 20, 1: 15 })).toBe(false);
  });

  it("returns true when a team hits 0", () => {
    expect(isGameOver({ 0: 5, 1: 0 })).toBe(true);
  });
});

describe("getWinner", () => {
  it("returns the team with more balloons", () => {
    expect(getWinner({ 0: 15, 1: 0 })).toBe(0);
  });

  it("returns null on a draw", () => {
    expect(getWinner({ 0: 10, 1: 10 })).toBe(null);
  });
});