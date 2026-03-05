export const MIN_FROGS     = 10
export const MAX_FROGS     = 50
export const DEFAULT_FROGS = 20

// Ground plane size — frogs roam within this area
export const GROUND_SIZE   = 18

// How often each frog picks a new target (ms) — random between these
export const JUMP_INTERVAL_MIN = 1500
export const JUMP_INTERVAL_MAX = 4000

// How long the catch square falls (ms)
export const SQUARE_FALL_MS    = 900

// How long wrong answer button stays disabled (ms)
export const WRONG_LOCK_MS     = 1000

// Camera height for top-down view
export const CAMERA_HEIGHT     = 22

export const TEAM_COLORS = {
  0: { hex: "#EF4444", name: "Red",  light: "#FCA5A5" },
  1: { hex: "#3B82F6", name: "Blue", light: "#93C5FD" },
}

// Difficulty config per age group
export const DIFFICULTY = {
  "1-2": {
    label:       "Class 1–2",
    emoji:       "🌱",
    addMax:      10,
    subMax:      10,
    mulMax:      0,     // no multiplication
    divMax:      0,
    types:       ["addition", "subtraction", "greater", "smaller"],
    description: "Basic addition & subtraction up to 10",
  },
  "3-4": {
    label:       "Class 3–4",
    emoji:       "🌿",
    addMax:      50,
    subMax:      50,
    mulMax:      10,
    divMax:      0,
    types:       ["addition", "subtraction", "multiplication", "greater", "smaller", "missing"],
    description: "Operations up to 50, intro multiplication",
  },
  "5-6": {
    label:       "Class 5–6",
    emoji:       "🌳",
    addMax:      200,
    subMax:      200,
    mulMax:      12,
    divMax:      12,
    types:       ["addition", "subtraction", "multiplication", "division", "greater", "smaller", "missing"],
    description: "All operations, multiplication tables",
  },
  "7-9": {
    label:       "Class 7–9",
    emoji:       "🌲",
    addMax:      1000,
    subMax:      1000,
    mulMax:      25,
    divMax:      25,
    types:       ["addition", "subtraction", "multiplication", "division", "missing", "comparison"],
    description: "Large numbers, mixed operations",
  },
}

export const AGE_GROUP_KEYS = Object.keys(DIFFICULTY)