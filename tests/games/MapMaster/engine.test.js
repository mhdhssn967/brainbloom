import { describe, it, expect } from "vitest";
import {
  initGameStates,
  svgToScreen,
  screenToSvg,
  isNearEnough,
  getNextState,
  getWinner,
} from "@/games/MapMaster/engine";

describe("initGameStates", () => {
  it("returns correct counts", () => {
    const { preShown, toPlace } = initGameStates();
    expect(preShown).toHaveLength(10);
    expect(toPlace).toHaveLength(10);
  });

  it("no overlap between preShown and toPlace", () => {
    const { preShown, toPlace } = initGameStates();
    const preIds   = new Set(preShown.map(s => s.id));
    const placeIds = toPlace.map(s => s.id);
    placeIds.forEach(id => expect(preIds.has(id)).toBe(false));
  });

  it("returns different order on each call", () => {
    const a = initGameStates();
    const b = initGameStates();
    // Very unlikely to be identical if shuffle works
    const aIds = a.toPlace.map(s => s.id).join(",");
    const bIds = b.toPlace.map(s => s.id).join(",");
    // Not strictly guaranteed but shuffle should make this pass 99.9% of the time
    expect(aIds).not.toBe(bIds);
  });
});

describe("svgToScreen", () => {
  it("scales correctly at 500px render size", () => {
    // SVG viewBox is 1000x1000, rendered at 500px = 0.5 scale
    const result = svgToScreen(200, 400, 500);
    expect(result.x).toBe(100);
    expect(result.y).toBe(200);
  });

  it("accounts for SVG offset on screen", () => {
    const result = svgToScreen(200, 400, 500, { x: 50, y: 30 });
    expect(result.x).toBe(150);
    expect(result.y).toBe(230);
  });
});

describe("screenToSvg", () => {
  it("reverses svgToScreen correctly", () => {
    const screen = svgToScreen(325, 848, 500, { x: 20, y: 10 });
    const back   = screenToSvg(screen.x, screen.y, 500, { x: 20, y: 10 });
    expect(Math.round(back.x)).toBe(325);
    expect(Math.round(back.y)).toBe(848);
  });
});

describe("isNearEnough", () => {
  it("returns true when exactly on target", () => {
    expect(isNearEnough({ x: 100, y: 100 }, { x: 100, y: 100 })).toBe(true);
  });

  it("returns true when within threshold", () => {
    expect(isNearEnough({ x: 100, y: 100 }, { x: 140, y: 100 })).toBe(true);
  });

  it("returns false when outside threshold", () => {
    expect(isNearEnough({ x: 100, y: 100 }, { x: 200, y: 100 })).toBe(false);
  });

  it("returns false just outside threshold", () => {
    // threshold is 60 — distance of 61 should fail
    expect(isNearEnough({ x: 100, y: 100 }, { x: 161, y: 100 })).toBe(false);
  });
});

describe("getNextState", () => {
  const states = [
    { id: "INKL", name: "Kerala" },
    { id: "INMH", name: "Maharashtra" },
  ];

  it("returns first state at index 0", () => {
    expect(getNextState(states, 0).id).toBe("INKL");
  });

  it("returns second state at index 1", () => {
    expect(getNextState(states, 1).id).toBe("INMH");
  });

  it("returns null when index exceeds array", () => {
    expect(getNextState(states, 5)).toBe(null);
  });
});

describe("getWinner", () => {
  it("returns 0 when team 0 has more", () => {
    expect(getWinner({ 0: 30, 1: 20 })).toBe(0);
  });

  it("returns 1 when team 1 has more", () => {
    expect(getWinner({ 0: 10, 1: 40 })).toBe(1);
  });

  it("returns null on draw", () => {
    expect(getWinner({ 0: 20, 1: 20 })).toBe(null);
  });
});