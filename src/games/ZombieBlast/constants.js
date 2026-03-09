// ── Arena ────────────────────────────────────────────────────────────────
export const ARENA_WIDTH       = 20
export const ARENA_DEPTH       = 24
export const CHARACTER_Z       = 9      // character sits near bottom of arena
export const SPAWN_Z           = -11    // zombies spawn at top
export const ATTACK_RADIUS     = 2.2    // how close zombie gets before attacking
export const BULLET_SPEED      = 0.45   // units per frame

// ── Health ───────────────────────────────────────────────────────────────
export const MAX_HEALTH        = 100
export const ATTACK_DAMAGE     = 5      // per zombie attack hit
export const ATTACK_INTERVAL   = 1500   // ms between each attack tick

// ── Scoring ──────────────────────────────────────────────────────────────
export const POINTS_KILL       = 1
export const POINTS_HEADSHOT   = 2
export const HEADSHOT_WINDOW   = 1500   // ms from question appearing

// ── Wrong answer lock ────────────────────────────────────────────────────
export const WRONG_LOCK_MS     = 1000

// ── Zombie waves — progress over time ───────────────────────────────────
export const WAVES = [
  { minTime: 0,  animation: "CharacterArmature|Crawl",    speed: 0.006, spawnInterval: 4500, label: "Crawling" },
  { minTime: 30, animation: "CharacterArmature|Walk",     speed: 0.013, spawnInterval: 3500, label: "Walking"  },
  { minTime: 60, animation: "CharacterArmature|Run_Arms", speed: 0.022, spawnInterval: 2800, label: "Jogging"  },
  { minTime: 90, animation: "CharacterArmature|Run",      speed: 0.032, spawnInterval: 1000, label: "Running"  },
]
export const MAX_ZOMBIES_SCREEN = 14

// ── Win animation ────────────────────────────────────────────────────────
export const DEATH_ANIM_MS     = 1800   // how long death animation plays
export const HIT_LABEL_MS      = 1200   // how long +1/+2 label shows
export const HITREACT_MS       = 600    // zombie flinch duration

// ── Game modes ───────────────────────────────────────────────────────────
export const MODES = {
  single:   { id: "single",   label: "Single Player", emoji: "🧟" },
  dual:     { id: "dual",     label: "Dual Player",   emoji: "⚔️"  },
}

export const GAME_TYPES = {
  timed:    { id: "timed",    label: "Time Attack",   emoji: "⏱️"  },
  survival: { id: "survival", label: "Survival",      emoji: "💀"  },
}

// Time mode options in seconds
export const TIME_OPTIONS = [60, 90, 120, 150, 180, 210, 240, 270, 300]
export const DEFAULT_TIME  = 60

// ── Difficulty — affects questions only ──────────────────────────────────
export const DIFFICULTY = {
  "very-easy": {
    label:       "Very Easy",
    emoji:       "🌱",
    color:       "#22C55E",
    addMax:      10,
    subMax:      10,
    mulMax:      0,
    divMax:      0,
    types:       ["addition", "subtraction"],
    description: "Addition & subtraction up to 10",
  },
  "easy": {
    label:       "Easy",
    emoji:       "🌿",
    color:       "#84CC16",
    addMax:      20,
    subMax:      20,
    mulMax:      5,
    divMax:      0,
    types:       ["addition", "subtraction", "greater", "smaller"],
    description: "Operations up to 20, comparisons",
  },
  "medium": {
    label:       "Medium",
    emoji:       "🌳",
    color:       "#F59E0B",
    addMax:      100,
    subMax:      100,
    mulMax:      12,
    divMax:      10,
    types:       ["addition", "subtraction", "multiplication", "division", "missing"],
    description: "All operations, times tables",
  },
  "hard": {
    label:       "Hard",
    emoji:       "🌋",
    color:       "#EF4444",
    addMax:      500,
    subMax:      500,
    mulMax:      25,
    divMax:      25,
    types:       ["addition", "subtraction", "multiplication", "division", "missing", "comparison"],
    description: "Large numbers, mixed operations",
  },
}

export const DIFFICULTY_KEYS = Object.keys(DIFFICULTY)

// ── Characters ───────────────────────────────────────────────────────────
export const CHARACTERS = {
  single: { file: "character1.glb", scale: 0.9 },
  0:      { file: "character1.glb", scale: 0.9 },  // dual left
  1:      { file: "character2.glb", scale: 0.9 },  // dual right
}

// ── Character animations ─────────────────────────────────────────────────
export const CHAR_ANIMS = {
  IDLE:   "CharacterArmature|Idle",
  SHOOT:  "CharacterArmature|Idle_Shoot",
  HIT:    "CharacterArmature|HitReact",
  DEATH:  "CharacterArmature|Death",
}

// ── Zombie animations ────────────────────────────────────────────────────
export const ZOMBIE_ANIMS = {
  CRAWL:    "CharacterArmature|Crawl",
  WALK:     "CharacterArmature|Walk",
  RUN_ARMS: "CharacterArmature|Run_Arms",
  RUN:      "CharacterArmature|Run",
  ATTACK:   "CharacterArmature|Idle_Attack",
  PUNCH:    "CharacterArmature|Punch",
  HIT:      "CharacterArmature|HitReact",
  DEATH:    "CharacterArmature|Death",
}

// ── Sounds ───────────────────────────────────────────────────────────────
// Register these in src/engine/SoundManager.js
// and add keys to src/utils/constants.js SOUND_KEYS
//
// SOUND_KEYS.SHOOT         → "shoot"         → /assets/sounds/shoot.mp3
// SOUND_KEYS.HEADSHOT      → "headshot"      → /assets/sounds/headshot.mp3
// SOUND_KEYS.ZOMBIE_DEATH  → "zombie_death"  → /assets/sounds/zombie_death.mp3
// SOUND_KEYS.ZOMBIE_ATTACK → "zombie_attack" → /assets/sounds/zombie_attack.mp3
// SOUND_KEYS.ZOMBIE_GROWL  → "zombie_growl"  → /assets/sounds/zombie_growl.mp3
// SOUND_KEYS.GAME_OVER     → "game_over"     → /assets/sounds/game_over.mp3

// ── Arena ground ─────────────────────────────────────────────────────────
export const GROUND_COLOR  = "#1a1a2e"
export const GRID_COLOR    = "#16213e"