export const TOTAL_ROUNDS = 30  // max possible levels

// Grid progression — { minLevel, size, lit }
export const LEVEL_STAGES = [
  { minLevel: 1,  gridSize: 2, lit: 2  },  // 2×2, 2 lit
  { minLevel: 4,  gridSize: 3, lit: 3  },  // 3×3, 3 lit
  { minLevel: 7,  gridSize: 3, lit: 4  },  // 3×3, 4 lit
  { minLevel: 10, gridSize: 4, lit: 5  },  // 4×4, 5 lit
  { minLevel: 13, gridSize: 4, lit: 6  },  // 4×4, 6 lit
  { minLevel: 16, gridSize: 5, lit: 7  },  // 5×5, 7 lit
  { minLevel: 19, gridSize: 5, lit: 8  },  // 5×5, 8 lit
  { minLevel: 22, gridSize: 5, lit: 9  },  // 5×5, 9 lit
  { minLevel: 25, gridSize: 6, lit: 10 },  // 6×6, 10 lit
]

export const SHOW_DURATION   = 2000  // ms tiles stay lit
export const RESULT_FLASH_MS = 600   // ms to show advance flash before next pattern
export const WRONG_FLASH_MS  = 500   // ms red tile shows before reset

// Timer options in seconds
export const TIMER_OPTIONS   = [30, 60, 90, 120, 150, 180]
export const DEFAULT_TIMER   = 60