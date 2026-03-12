export const BIOMES = {
  forest: {
    id:      "forest",
    name:    "Forest",
    emoji:   "🌿",
    skyFrom: "#0a2e1a",
    skyTo:   "#1a472a",
    ground:  "#2d6a4f",
    accent:  "#52b788",
    ambient: ["🦋", "🐦", "🍃", "🌿"],
    chains: [
      // 3-link chains (1 blank early rounds)
      { chain: ["🌱 Grass", "🐛 Caterpillar", "🐦 Robin"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌿 Leaves", "🐰 Rabbit", "🦊 Fox"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌾 Wheat", "🐭 Mouse", "🦉 Owl"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌳 Oak", "🐛 Caterpillar", "🐦 Sparrow"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🍄 Mushroom", "🐌 Snail", "🦔 Hedgehog"], roles: ["Decomposer","Herbivore","Omnivore"] },

      // 4-link chains (1-2 blanks mid rounds)
      { chain: ["🌱 Grass", "🐛 Caterpillar", "🐸 Frog", "🐍 Snake"], roles: ["Producer","Herbivore","Carnivore","Carnivore"] },
      { chain: ["🌿 Leaves", "🐰 Rabbit", "🦊 Fox", "🦅 Eagle"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["🌾 Wheat", "🐭 Mouse", "🐍 Snake", "🦅 Hawk"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["🌳 Oak", "🐿️ Squirrel", "🦊 Fox", "🐺 Wolf"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["🍓 Berry", "🐦 Bird", "🐱 Cat", "🦅 Eagle"], roles: ["Producer","Herbivore","Carnivore","Apex"] },

      // 5-link chains (2-3 blanks hard rounds)
      { chain: ["☀️ Sun", "🌱 Grass", "🐛 Caterpillar", "🐸 Frog", "🐍 Snake"], roles: ["Energy","Producer","Herbivore","Carnivore","Carnivore"] },
      { chain: ["☀️ Sun", "🌿 Leaves", "🐰 Rabbit", "🦊 Fox", "🦅 Eagle"], roles: ["Energy","Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["☀️ Sun", "🌾 Wheat", "🐭 Mouse", "🦉 Owl", "🐺 Wolf"], roles: ["Energy","Producer","Herbivore","Carnivore","Apex"] },
    ],
  },

  ocean: {
    id:      "ocean",
    name:    "Ocean",
    emoji:   "🌊",
    skyFrom: "#023e8a",
    skyTo:   "#0077b6",
    ground:  "#00b4d8",
    accent:  "#90e0ef",
    ambient: ["🐠", "🫧", "🌊", "💧"],
    chains: [
      { chain: ["🌿 Algae", "🦐 Shrimp", "🐟 Fish"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌿 Seaweed", "🐚 Snail", "🦀 Crab"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🦠 Plankton", "🐟 Small Fish", "🦭 Seal"], roles: ["Producer","Carnivore","Carnivore"] },
      { chain: ["🌿 Algae", "🐠 Clownfish", "🦈 Shark"], roles: ["Producer","Herbivore","Apex"] },
      { chain: ["🦠 Plankton", "🦐 Shrimp", "🐟 Fish", "🦭 Seal"], roles: ["Producer","Herbivore","Carnivore","Carnivore"] },
      { chain: ["🌿 Seaweed", "🐢 Turtle", "🦈 Tiger Shark", "🐋 Orca"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["☀️ Sun", "🦠 Plankton", "🦐 Shrimp", "🐟 Fish", "🦈 Shark"], roles: ["Energy","Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["☀️ Sun", "🌿 Algae", "🐚 Snail", "🦀 Crab", "🦭 Seal"], roles: ["Energy","Producer","Herbivore","Carnivore","Carnivore"] },
    ],
  },

  desert: {
    id:      "desert",
    name:    "Desert",
    emoji:   "🏜️",
    skyFrom: "#7c2d12",
    skyTo:   "#c2410c",
    ground:  "#d97706",
    accent:  "#fcd34d",
    ambient: ["🌵", "☀️", "🏜️", "💨"],
    chains: [
      { chain: ["🌵 Cactus", "🦎 Lizard", "🦅 Hawk"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌾 Scrub", "🐭 Rat", "🐍 Rattlesnake"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌵 Cactus", "🐛 Beetle", "🦎 Gecko"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌾 Grass", "🐰 Jackrabbit", "🦊 Coyote", "🦅 Eagle"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["🌵 Cactus", "🐭 Rat", "🐍 Snake", "🦅 Hawk"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["☀️ Sun", "🌵 Cactus", "🐛 Beetle", "🦎 Lizard", "🦅 Hawk"], roles: ["Energy","Producer","Herbivore","Carnivore","Apex"] },
    ],
  },

  grassland: {
    id:      "grassland",
    name:    "Grassland",
    emoji:   "🌾",
    skyFrom: "#1a1a2e",
    skyTo:   "#16213e",
    ground:  "#606c38",
    accent:  "#dda15e",
    ambient: ["🌾", "🌻", "🍃", "💨"],
    chains: [
      { chain: ["🌾 Grass", "🦗 Cricket", "🐸 Frog"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌻 Flower", "🐝 Bee", "🐦 Sparrow"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌾 Grass", "🐄 Cow", "🐆 Cheetah"], roles: ["Producer","Herbivore","Carnivore"] },
      { chain: ["🌿 Shrub", "🦌 Deer", "🦁 Lion", "🦅 Vulture"], roles: ["Producer","Herbivore","Carnivore","Scavenger"] },
      { chain: ["🌾 Grass", "🦓 Zebra", "🐆 Cheetah", "🦁 Lion"], roles: ["Producer","Herbivore","Carnivore","Apex"] },
      { chain: ["☀️ Sun", "🌾 Grass", "🦗 Cricket", "🐸 Frog", "🐍 Snake"], roles: ["Energy","Producer","Herbivore","Carnivore","Carnivore"] },
      { chain: ["☀️ Sun", "🌿 Shrub", "🦌 Deer", "🦁 Lion", "🦅 Vulture"], roles: ["Energy","Producer","Herbivore","Carnivore","Scavenger"] },
    ],
  },
};

export function getChainsForRound(biomeId, round) {
  const chains = BIOMES[biomeId].chains;
  const idx    = (round - 1) % chains.length;
  return chains[idx];
}

export function getBlanksForRound(round) {
  if (round <= 3)  return 1;
  if (round <= 7)  return 2;
  return 3;
}

export function getBlankIndices(chain, blankCount) {
  // Never blank the first item (producer/sun) — always blank middle/end
  const blankable = chain.map((_, i) => i).slice(1);
  const shuffled  = [...blankable].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, blankCount).sort((a, b) => a - b);
}

export function getDistractors(biomeId, correctItems, count = 2) {
  const allItems = BIOMES[biomeId].chains
    .flatMap(c => c.chain)
    .filter(item => !correctItems.includes(item));
  const unique   = [...new Set(allItems)];
  const shuffled = unique.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}