import { describe, it, expect } from "vitest";
import {
  getQuestion,
  spawnZombie,
  getCurrentWave,
  checkAnswer,
  findNearestZombie,
  getWinner,
} from "@/games/ZombieBlast/engine";

describe("getQuestion — math source", () => {
  it("returns valid question for each difficulty", () => {
    ["very-easy", "easy", "medium", "hard"].forEach(diff => {
      const q = getQuestion({ type: "math" }, diff);
      expect(q).toHaveProperty("text");
      expect(q).toHaveProperty("answer");
      expect(q.options).toHaveLength(4);
    });
  });

  it("answer is always in options", () => {
    for (let i = 0; i < 50; i++) {
      const q = getQuestion({ type: "math" }, "medium");
      expect(q.options).toContain(q.answer);
    }
  });

  it("options are always 4 unique values", () => {
    for (let i = 0; i < 50; i++) {
      const q    = getQuestion({ type: "math" }, "hard");
      const uniq = new Set(q.options);
      expect(uniq.size).toBe(4);
    }
  });

  it("very-easy never generates multiplication or division", () => {
    for (let i = 0; i < 50; i++) {
      const q = getQuestion({ type: "math" }, "very-easy");
      expect(q.text).not.toMatch(/×|÷/);
    }
  });
});

describe("getQuestion — custom source", () => {
  it("serves from custom question pool", () => {
    const source = {
      type: "custom",
      questions: [
        { text: "What is 2+2?", options: ["3","4","5","6"], answer: "4" },
      ],
    };
    const q = getQuestion(source, "easy");
    expect(q.text).toBe("What is 2+2?");
    expect(q.answer).toBe("4");
  });
});

describe("spawnZombie", () => {
  it("spawns within arena width", () => {
    for (let i = 0; i < 20; i++) {
      const z = spawnZombie(20, -11);
      expect(Math.abs(z.x)).toBeLessThan(10);
      expect(z.z).toBe(-11);
    }
  });

  it("starts in walking state", () => {
    expect(spawnZombie(20, -11).state).toBe("walking");
  });

  it("uses one of two zombie models", () => {
    const models = new Set();
    for (let i = 0; i < 20; i++) {
      models.add(spawnZombie(20, -11).modelFile);
    }
    expect(models.size).toBe(2);
  });
});

describe("getCurrentWave", () => {
  it("starts with crawl wave", () => {
    expect(getCurrentWave(0).animation).toBe("Crawl");
  });
  it("returns walk wave at 30s", () => {
    expect(getCurrentWave(30).animation).toBe("Walk");
  });
  it("returns run wave at 90s", () => {
    expect(getCurrentWave(90).animation).toBe("Run");
  });
});

describe("checkAnswer", () => {
  it("returns true for correct answer", () => {
    expect(checkAnswer({ answer: "42" }, "42")).toBe(true);
  });
  it("returns false for wrong answer", () => {
    expect(checkAnswer({ answer: "42" }, "41")).toBe(false);
  });
  it("is string safe", () => {
    expect(checkAnswer({ answer: "7" }, 7)).toBe(true);
  });
});

describe("findNearestZombie", () => {
  const zombies = [
    { id: 1, x: 0,  z: 5,  state: "walking" },
    { id: 2, x: 0,  z: 2,  state: "walking" },
    { id: 3, x: 0,  z: 8,  state: "dying"   },
  ];

  it("finds closest alive zombie", () => {
    const nearest = findNearestZombie(zombies, 0, 9);
    expect(nearest.id).toBe(1);
  });

  it("ignores dying zombies", () => {
    const near = findNearestZombie(
      [{ id: 3, x: 0, z: 8, state: "dying" }], 0, 9
    );
    expect(near).toBeNull();
  });
});

describe("getWinner", () => {
  it("returns survivor in survival mode", () => {
    const players = [
      { id: 0, score: 5, health: 0  },
      { id: 1, score: 3, health: 60 },
    ];
    expect(getWinner(players)).toBe(1);
  });

  it("returns highest scorer in time mode", () => {
    const players = [
      { id: 0, score: 12, health: 80 },
      { id: 1, score: 8,  health: 60 },
    ];
    expect(getWinner(players)).toBe(0);
  });

  it("returns null on draw", () => {
    const players = [
      { id: 0, score: 10, health: 50 },
      { id: 1, score: 10, health: 50 },
    ];
    expect(getWinner(players)).toBeNull();
  });
});