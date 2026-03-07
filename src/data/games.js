// src/data/games.js
// ─────────────────────────────────────────────────────────────────────────
// All game metadata lives here. Import anywhere needed.
// To add a new game: add one object to this array. Nothing else to change.
// Replace `icon` path with your real image when ready.
// ─────────────────────────────────────────────────────────────────────────

export const GAMES = [
 
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
  id:          "zombie-blast",
  name:        "ZombieBlast!",
  tagline:     "Answer fast. Shoot faster.",
  description: "Zombies are coming. Answer math questions to blast them before they reach you. Headshots for speed. Survive as long as you can.",
  subject:     "Maths",
  mockupEmoji: "🧟",
  accentColor: "#EF4444",
  modes:       ["Single Player", "Team Battle"],
  route:       "/play/zombie-blast",
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
  id:          "spot-it",
  name:        "SpotIt!",
  tagline:     "See it. Know it. Tap it first.",
  description: "An image appears on screen — four choices, one correct answer. Race your opponent to tap the right picture. Covers monuments, animals, scientists, flags, foods, freedom fighters and space.",
  subject:     "General",
  icon:        "/assets/images/games/spotit.png",
  mockupEmoji: "🔍",
  accentColor: "#F97316",
  modes:       ["Team Battle"],
  route:       "/play/spot-it",
},
{
  id:          "frog-catch",
  name:        "FrogCatch!",
  tagline:     "Answer fast. Catch them all.",
  description: "50 frogs jump around a pond. Answer maths questions to drop a square and catch a frog. First team to catch the most frogs wins. Difficulty scales from Class 1 to Class 9.",
  subject:     "Maths",
  icon:        "/assets/images/games/frogcatch.png",
  mockupEmoji: "🐸",
  accentColor: "#22C55E",
  modes:       ["Team Battle"],
  route:       "/play/frog-catch",
},
];