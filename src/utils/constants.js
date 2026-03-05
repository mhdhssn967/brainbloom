export const TEAM_COLORS = ['#FF5733', '#2196F3', '#4CAF50', '#9C27B0']

export const TEAM_NAMES_DEFAULT = ['Team Red', 'Team Blue', 'Team Green', 'Team Purple']

export const DIFFICULTY = {
  EASY:   'easy',
  MEDIUM: 'medium',
  HARD:   'hard',
}

export const GAME_STATUS = {
  IDLE:     'idle',
  LOBBY:    'lobby',
  PLAYING:  'playing',
  PAUSED:   'paused',
  FINISHED: 'finished',
}

export const GAME_IDS = {
  TUG_ARENA:      'tug-arena',
  BALLOON_BATTLE: 'balloon-battle',
  SPELL_IT:       'spell-it',
  GRAMMAR_VISION: 'grammar-vision',
  MAP_MASTER:     'map-master',
  MEMORY_MATRIX:  'memory-matrix',
}

export const ROUTES = {
  HOME:           '/',
  RESULTS:        '/results',
  DASHBOARD:      '/dashboard',
  PLAY:           '/play',
}

export const SOUND_KEYS = {
  CORRECT:   'correct',
  WRONG:     'wrong',
  STREAK:    'streak',
  TICK:      'tick',
  GAME_OVER: 'gameover',
  WIN:       'win',
  CLICK:     'click',
  BALLOON_POP: 'balloon-pop',
  FROG: "frog",
}

export const DEFAULT_TIMER = 30       // seconds per question
export const DEFAULT_LIVES = 3
export const DEFAULT_ROUNDS = 5
export const STREAK_THRESHOLD = 3    // correct answers needed to trigger streak bonus
export const STREAK_MULTIPLIER = 2