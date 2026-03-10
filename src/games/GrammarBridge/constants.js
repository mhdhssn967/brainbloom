export const GAME_ID = "grammar-bridge";

export const CHAR_ANIMS = {
  IDLE:      "CharacterArmature|Wave",
  WALK:      "CharacterArmature|Walk",
  RUN:       "CharacterArmature|Run",
  CELEBRATE: "CharacterArmature|Wave",
  NO:        "CharacterArmature|No",
};

export const BLOCK_COLORS = {
  FILLED:  "#4ADE80",
  MISSING: "#FF4444",
  NORMAL:  "#94A3B8",
};

export const BRIDGE_START_X  = -6;
export const BRIDGE_END_X    =  6;
export const BLOCK_SPACING   =  1.4;
export const BLOCK_Y         =  0;
export const CHARACTER_Y     =  -2;
export const WALK_SPEED      =  0.03;
export const WRONG_LOCK_MS   =  1000;
export const CONFETTI_MS     =  2500;
export const NEXT_LEVEL_MS   =  3500;

export const ROUND_OPTIONS   = [3,5,7,10,15,20,25,30];
export const DEFAULT_ROUNDS  = 5;

export const DIFFICULTY_TIERS = [
  { label: "Very Easy", emoji: "🌱", color: "#22C55E",
    description: "Simple sentences, 1 gap" },
  { label: "Easy",      emoji: "⭐", color: "#84CC16",
    description: "Subject + verb + object, 1-2 gaps" },
  { label: "Medium",    emoji: "🔥", color: "#F59E0B",
    description: "Adjectives & adverbs, 2-3 gaps" },
  { label: "Hard",      emoji: "💀", color: "#EF4444",
    description: "Compound sentences, 3-4 gaps" },
];

export const DIFFICULTY_KEYS = ["very-easy", "easy", "medium", "hard"];