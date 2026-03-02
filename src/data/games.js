// src/data/games.js
// ─────────────────────────────────────────────────────────────────────────
// All game metadata lives here. Import anywhere needed.
// To add a new game: add one object to this array. Nothing else to change.
// Replace `icon` path with your real image when ready.
// ─────────────────────────────────────────────────────────────────────────

export const GAMES = [
  {
    id: "tug-arena",
    name: "Tug Arena",
    tagline: "Pull the rope with every correct answer.",
    description:
      "Two teams battle through math questions. Every correct answer yanks the rope your way. First team to pull it over the line wins. Streak bonuses add momentum — go on a run and watch the rope fly.",
    subject: "Math",
    icon: "/assets/images/games/tugarena.png",
    mockupEmoji: "🪢",
    accentColor: "#F97316",
    modes: ["Single Player", "Team Battle"],
    route: "/play/tug-arena",
  },
  {
    id: "balloon-battle",
    name: "Balloon Battle",
    tagline: "Pop their balloons before they pop yours.",
    description:
      "Each team starts with three balloons as lives. Answer correctly to pop an opponent's balloon. Answer wrong and lose one of yours. Last team floating wins. Questions get harder as balloons disappear.",
    subject: "Math",
    icon: "/assets/images/games/balloonbattle.png",
    mockupEmoji: "🎈",
    accentColor: "#EC4899",
    modes: ["Single Player", "Team Battle"],
    route: "/play/balloon-battle",
  },
  {
    id: "spell-it",
    name: "Spell It!",
    tagline: "See the animal. Spell the name.",
    description:
      "An animal image appears on screen with blanked-out letters. Teams race to fill in the missing characters. Difficulty scales from common animals with one blank to rare species with half the letters missing.",
    subject: "English",
    icon: "/assets/images/games/spellit.png",
    mockupEmoji: "🦁",
    accentColor: "#10B981",
    modes: ["Single Player", "Team Battle"],
    route: "/play/spell-it",
  },
  {
    id: "grammar-vision",
    name: "Grammar Vision",
    tagline: "Find the error. Fix the sentence.",
    description:
      "A scene image appears alongside a sentence containing a grammatical error. Teams pick the corrected version from three options. Covers articles, pronouns, verb agreement, punctuation, and sentence construction.",
    subject: "English",
    icon: "/assets/images/games/grammarvision.png",
    mockupEmoji: "📝",
    accentColor: "#3B82F6",
    modes: ["Single Player", "Team Battle"],
    route: "/play/grammar-vision",
  },
  {
    id: "map-master",
    name: "Map Master",
    tagline: "Drag every state to where it belongs.",
    description:
      "An outline map of India appears on the smart board. Teams take turns dragging state labels to their correct positions. Three modes: beginner with borders visible, timed, and district-level for advanced classes.",
    subject: "SST",
    icon: "/assets/images/games/mapmaster.png",
    mockupEmoji: "🗺️",
    accentColor: "#8B5CF6",
    modes: ["Single Player", "Team Battle"],
    route: "/play/map-master",
  },
  {
    id: "memory-matrix",
    name: "Memory Matrix",
    tagline: "Remember the pattern. Recreate it.",
    description:
      "A grid of tiles lights up in a sequence. Teams watch, then recreate the exact pattern from memory. Sequences grow longer with each round. Tile counts scale from 3×3 for beginners to 5×5 for the brave.",
    subject: "Brain",
    icon:"/assets/images/games/memorymatrix.png",
    mockupEmoji: "🧠",
    accentColor: "#06B6D4",
    modes: ["Single Player", "Team Battle"],
    route: "/play/memory-matrix",
  },
];