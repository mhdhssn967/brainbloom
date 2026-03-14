// ─── TrackRush Question Data ──────────────────────────────────────────────────
// Each question has:
//   question  — string
//   options   — exactly 3 strings (mapped to left/mid/right lane)
//   correct   — index 0, 1, or 2
//   emoji     — decorative

import { shuffle } from "@/utils/math";

const QUESTIONS = {
  "1-2": [
    { question: "Which animal says MOO?",            options: ["Cat","Cow","Dog"],           correct: 1, emoji: "🐄" },
    { question: "How many legs does a spider have?", options: ["6","8","4"],                 correct: 1, emoji: "🕷️" },
    { question: "What colour is the sun?",           options: ["Blue","Green","Yellow"],     correct: 2, emoji: "☀️" },
    { question: "Which fruit is yellow and long?",   options: ["Apple","Banana","Mango"],    correct: 1, emoji: "🍌" },
    { question: "How many days in a week?",          options: ["5","6","7"],                 correct: 2, emoji: "📅" },
    { question: "What do fish live in?",             options: ["Sand","Water","Sky"],        correct: 1, emoji: "🐟" },
    { question: "Which is the biggest animal?",      options: ["Elephant","Ant","Cat"],      correct: 0, emoji: "🐘" },
    { question: "What colour is grass?",             options: ["Red","Blue","Green"],        correct: 2, emoji: "🌿" },
    { question: "How many fingers on one hand?",     options: ["4","5","6"],                 correct: 1, emoji: "✋" },
    { question: "Which animal can fly?",             options: ["Fish","Bird","Dog"],         correct: 1, emoji: "🐦" },
    { question: "What shape is a ball?",             options: ["Square","Round","Triangle"], correct: 1, emoji: "⚽" },
    { question: "What do we drink when thirsty?",    options: ["Sand","Water","Mud"],        correct: 1, emoji: "💧" },
    { question: "Which season has snow?",            options: ["Summer","Monsoon","Winter"], correct: 2, emoji: "❄️" },
    { question: "How many wheels does a bicycle have?", options: ["2","3","4"],             correct: 0, emoji: "🚲" },
    { question: "What colour is the sky?",           options: ["Blue","Pink","Orange"],      correct: 0, emoji: "🌤️" },
  ],

  "3-4": [
    { question: "What is the capital of India?",           options: ["Mumbai","New Delhi","Chennai"],       correct: 1, emoji: "🇮🇳" },
    { question: "How many states in India?",               options: ["25","28","30"],                       correct: 1, emoji: "🗺️" },
    { question: "Which planet is closest to the Sun?",     options: ["Venus","Earth","Mercury"],            correct: 2, emoji: "☀️" },
    { question: "What is H2O?",                            options: ["Milk","Water","Juice"],               correct: 1, emoji: "💧" },
    { question: "How many continents are there?",          options: ["5","6","7"],                          correct: 2, emoji: "🌍" },
    { question: "What is the national animal of India?",   options: ["Lion","Tiger","Elephant"],            correct: 1, emoji: "🐯" },
    { question: "Which is the longest river in the world?",options: ["Amazon","Nile","Ganga"],              correct: 1, emoji: "🌊" },
    { question: "How many months in a year?",              options: ["10","11","12"],                       correct: 2, emoji: "📆" },
    { question: "What is the boiling point of water?",     options: ["80°C","90°C","100°C"],               correct: 2, emoji: "🌡️" },
    { question: "Which gas do plants absorb?",             options: ["Oxygen","CO₂","Nitrogen"],            correct: 1, emoji: "🌿" },
    { question: "How many sides does a hexagon have?",     options: ["5","6","7"],                          correct: 1, emoji: "🔷" },
    { question: "What is the national bird of India?",     options: ["Parrot","Peacock","Sparrow"],         correct: 1, emoji: "🦚" },
    { question: "Which is the largest ocean?",             options: ["Atlantic","Indian","Pacific"],        correct: 2, emoji: "🌊" },
    { question: "How many zeros in one lakh?",             options: ["4","5","6"],                          correct: 1, emoji: "🔢" },
    { question: "What is the nearest star to Earth?",      options: ["Sirius","Polaris","Sun"],             correct: 2, emoji: "⭐" },
  ],

  "5-6": [
    { question: "What is the chemical symbol for gold?",    options: ["Go","Gd","Au"],                      correct: 2, emoji: "🥇" },
    { question: "Which organ pumps blood in the body?",     options: ["Liver","Heart","Lungs"],              correct: 1, emoji: "❤️" },
    { question: "What is the speed of light?",              options: ["3×10⁵ km/s","3×10⁸ m/s","3×10⁶ m/s"],correct: 1, emoji: "💡" },
    { question: "Which planet has rings?",                  options: ["Jupiter","Mars","Saturn"],            correct: 2, emoji: "🪐" },
    { question: "What is the powerhouse of the cell?",      options: ["Nucleus","Ribosome","Mitochondria"],  correct: 2, emoji: "🔬" },
    { question: "Who invented the telephone?",              options: ["Edison","Bell","Tesla"],              correct: 1, emoji: "📞" },
    { question: "What is the largest continent?",           options: ["Africa","Asia","Europe"],             correct: 1, emoji: "🌏" },
    { question: "How many bones in the human body?",        options: ["196","206","216"],                    correct: 1, emoji: "🦴" },
    { question: "What gas makes up most of Earth's air?",   options: ["Oxygen","CO₂","Nitrogen"],            correct: 2, emoji: "🌬️" },
    { question: "Which is the smallest planet?",            options: ["Mars","Mercury","Pluto"],             correct: 1, emoji: "🪐" },
    { question: "What is the square root of 144?",          options: ["11","12","13"],                       correct: 1, emoji: "🔢" },
    { question: "DNA stands for?",                          options: ["Deoxyribose Nucleic Acid","Double Nucleic Acid","Dynamic Nuclear Acid"], correct: 0, emoji: "🧬" },
    { question: "Which country invented paper?",            options: ["India","Egypt","China"],              correct: 2, emoji: "📄" },
    { question: "What is the SI unit of force?",            options: ["Watt","Joule","Newton"],              correct: 2, emoji: "⚡" },
    { question: "Which blood group is universal donor?",    options: ["A+","O-","AB+"],                      correct: 1, emoji: "🩸" },
  ],

  "7-8": [
    { question: "What is the atomic number of Carbon?",     options: ["6","8","12"],                         correct: 0, emoji: "⚗️" },
    { question: "Who wrote Romeo and Juliet?",              options: ["Dickens","Shakespeare","Keats"],      correct: 1, emoji: "📖" },
    { question: "What is the value of π (approx)?",         options: ["3.14","3.41","3.12"],                 correct: 0, emoji: "🔢" },
    { question: "Which organelle has its own DNA?",         options: ["Ribosome","Mitochondria","Vacuole"],  correct: 1, emoji: "🧬" },
    { question: "What is Ohm's Law?",                       options: ["V=IR","P=IV","F=ma"],                 correct: 0, emoji: "⚡" },
    { question: "Who proposed the Theory of Relativity?",   options: ["Newton","Einstein","Bohr"],           correct: 1, emoji: "🧠" },
    { question: "What is the most abundant metal in Earth's crust?", options: ["Iron","Aluminium","Calcium"], correct: 1, emoji: "🪨" },
    { question: "What type of lens is used in a microscope?", options: ["Concave","Convex","Plane"],         correct: 1, emoji: "🔬" },
    { question: "What is the pH of pure water?",            options: ["6","7","8"],                          correct: 1, emoji: "💧" },
    { question: "Which gas is produced during photosynthesis?", options: ["CO₂","N₂","O₂"],                 correct: 2, emoji: "🌿" },
    { question: "What is the Pythagorean theorem?",         options: ["a²+b²=c²","a+b=c","a²-b²=c"],        correct: 0, emoji: "📐" },
    { question: "What is GDP?",                             options: ["Gross Domestic Product","General Development Plan","Global Data Point"], correct: 0, emoji: "📊" },
    { question: "Which vitamin is produced by sunlight?",   options: ["Vitamin A","Vitamin C","Vitamin D"],  correct: 2, emoji: "☀️" },
    { question: "What is the hardest natural substance?",   options: ["Iron","Diamond","Quartz"],            correct: 1, emoji: "💎" },
    { question: "What does CPU stand for?",                 options: ["Central Processing Unit","Computer Power Unit","Central Program Utility"], correct: 0, emoji: "💻" },
  ],
};

export const LEVEL_KEYS  = ["1-2", "3-4", "5-6", "7-8"];
export const LEVEL_NAMES = { "1-2": "Class 1–2", "3-4": "Class 3–4", "5-6": "Class 5–6", "7-8": "Class 7–8" };
export const TIMER_OPTIONS = [60, 90, 120, 150, 180];
export const DEFAULT_TIMER  = 90;

/**
 * Returns a shuffled list of questions for the given level.
 * Options within each question are also shuffled, and correct index updated.
 */
export function buildQuestionList(levelKey) {
  const pool = QUESTIONS[levelKey] ?? QUESTIONS["3-4"];

  return shuffle([...pool]).map(q => {
    // Shuffle options, track where correct answer lands
    const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.correct }));
    const shuffled = shuffle(indexed);
    return {
      question: q.question,
      emoji:    q.emoji,
      options:  shuffled.map(s => s.opt),
      correct:  shuffled.findIndex(s => s.isCorrect),  // 0=left, 1=mid, 2=right
    };
  });
}