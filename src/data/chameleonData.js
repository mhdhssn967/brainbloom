// ─── ChameleonCatch Data ──────────────────────────────────────────────────────
//
// Subject modes:
//   "text"   — bugs show a word/number label  (English, Maths, Science)
//   "colour" — bugs show a coloured circle, no text
//   "shape"  — bugs show an SVG shape icon, no text
//
// Each round has:
//   instruction  — string shown in the banner
//   correct[]    — answers to catch
//   wrong[]      — distractors
//   type         — "text" | "colour" | "shape"  (inherits from subject if omitted)
//
// For Maths & Science the rounds pool is shuffled each game so students
// get varied questions every time they play.
// ─────────────────────────────────────────────────────────────────────────────

import { shuffle } from "@/utils/math";

// ─── ENGLISH ─────────────────────────────────────────────────────────────────
// No sub-categories. Questions cover nouns, verbs, adjectives, adverbs,
// collective nouns, antonyms, synonyms — all mixed, graded by class.

const ENGLISH_ROUNDS = {
  "1-2": [
    { instruction: "Catch all the NOUNS 🏷️",       correct: ["cat","ball","tree","sun"],      wrong: ["run","big","fast","jump"] },
    { instruction: "Catch all the NOUNS 🏷️",       correct: ["dog","book","chair","river"],   wrong: ["eat","tall","sing","slow"] },
    { instruction: "Catch all the VERBS ⚡",        correct: ["run","jump","eat","sing"],      wrong: ["cat","big","fast","tree"] },
    { instruction: "Catch all the VERBS ⚡",        correct: ["play","swim","read","write"],   wrong: ["ball","tall","slow","book"] },
    { instruction: "Catch all the ADJECTIVES 🎨",  correct: ["big","fast","cold","happy"],    wrong: ["cat","run","tree","jump"] },
    { instruction: "Catch all the ADJECTIVES 🎨",  correct: ["tall","soft","loud","shiny"],   wrong: ["ball","eat","bird","swim"] },
    { instruction: "Catch all ANIMAL words 🐾",    correct: ["cat","dog","bird","fish"],      wrong: ["run","red","big","jump"] },
    { instruction: 'Synonyms of "big" 🔤',         correct: ["large","huge","giant"],         wrong: ["small","tiny","fast","cold"] },
    { instruction: 'Synonyms of "happy" 🔤',       correct: ["glad","joyful","cheerful"],     wrong: ["sad","angry","tired","slow"] },
    { instruction: "Catch DOING words ⚡",          correct: ["fly","climb","draw","kick"],    wrong: ["mango","soft","shiny","chair"] },
  ],
  "3-4": [
    { instruction: "Catch all the NOUNS 🏷️",          correct: ["ocean","justice","teacher","freedom"],  wrong: ["clever","slowly","argue","bright"] },
    { instruction: "Catch ABSTRACT NOUNS 🏷️",         correct: ["courage","wisdom","freedom","justice"], wrong: ["golden","swiftly","capture","vivid"] },
    { instruction: "Catch all the VERBS ⚡",           correct: ["argue","wonder","explore","achieve"],   wrong: ["clever","ocean","justice","bright"] },
    { instruction: "Catch all ADJECTIVES 🎨",          correct: ["clever","bright","proud","gentle"],     wrong: ["argue","ocean","justice","quickly"] },
    { instruction: "Catch all ADVERBS 💨",             correct: ["slowly","quickly","boldly","softly"],   wrong: ["cat","brave","wonder","mountain"] },
    { instruction: "Catch COLLECTIVE NOUNS 📦",        correct: ["flock","swarm","pack","herd"],          wrong: ["migrate","crowded","scatter","swift"] },
    { instruction: "Catch COLLECTIVE NOUNS 📦",        correct: ["troop","choir","cluster","colony"],     wrong: ["gather","massive","wander","loud"] },
    { instruction: 'Synonyms of "brave" 🔤',           correct: ["bold","fearless","courageous"],         wrong: ["scared","timid","lazy","weak"] },
    { instruction: 'Synonyms of "clever" 🔤',          correct: ["smart","bright","intelligent"],         wrong: ["foolish","dull","rude","noisy"] },
    { instruction: "Catch DOING words ⚡",             correct: ["inspire","conquer","gather","migrate"],  wrong: ["quickly","mountain","courage","silent"] },
    { instruction: 'Antonyms of "happy" 🔄',           correct: ["sad","gloomy","miserable"],             wrong: ["joyful","glad","cheerful","bright"] },
    { instruction: 'Antonyms of "hot" 🔄',             correct: ["cold","chilly","icy","cool"],           wrong: ["warm","blazing","fiery","boiling"] },
  ],
  "5-6": [
    { instruction: "Catch ABSTRACT NOUNS 🏷️",        correct: ["loyalty","patience","ambition","sorrow"],      wrong: ["rapidly","fearless","achieve","bright"] },
    { instruction: "Catch ABSTRACT NOUNS 🏷️",        correct: ["compassion","integrity","humility","pride"],   wrong: ["gradually","vibrant","explore","calm"] },
    { instruction: "Catch ACTION VERBS ⚡",           correct: ["accelerate","fabricate","negotiate","dominate"],wrong: ["golden","courage","swiftly","vivid"] },
    { instruction: "Catch ACTION VERBS ⚡",           correct: ["demonstrate","investigate","manipulate","stimulate"],wrong: ["boldly","harmony","dignity","silent"] },
    { instruction: "Catch DESCRIPTIVE ADJECTIVES 🎨",correct: ["luminous","translucent","colossal","minute"],   wrong: ["accelerate","courage","swiftly","negotiate"] },
    { instruction: "Catch DESCRIPTIVE ADJECTIVES 🎨",correct: ["ferocious","timid","melancholic","jubilant"],   wrong: ["fabricate","loyalty","patience","collaborate"] },
    { instruction: "Catch ADVERBS OF MANNER 💨",     correct: ["swiftly","boldly","vividly","silently"],       wrong: ["courage","justice","freedom","bright"] },
    { instruction: "Catch COLLECTIVE NOUNS 📦",       correct: ["fleet","anthology","brood","covey"],           wrong: ["assemble","collective","pursue","vast"] },
    { instruction: 'Synonyms of "abundant" 🔤',      correct: ["plentiful","ample","copious"],                  wrong: ["scarce","rare","limited","sparse"] },
    { instruction: 'Synonyms of "tranquil" 🔤',      correct: ["serene","calm","peaceful"],                     wrong: ["turbulent","noisy","chaotic","wild"] },
    { instruction: 'Antonyms of "hostile" 🔄',       correct: ["friendly","peaceful","gentle","warm"],          wrong: ["aggressive","antagonistic","belligerent","harsh"] },
    { instruction: "Catch TRANSITIVE VERBS ⚡",      correct: ["build","create","send","write"],                wrong: ["sleep","arrive","exist","vanish"] },
  ],
  "7-8": [
    { instruction: "Catch TRANSITIVE VERBS ⚡",         correct: ["compose","distribute","install","replace"],      wrong: ["surrender","evaporate","hibernate","oscillate"] },
    { instruction: "Catch COMPARATIVE ADJECTIVES 🎨",   correct: ["faster","brighter","stronger","taller"],         wrong: ["build","sleep","arrive","fleet"] },
    { instruction: "Catch COMPARATIVE ADJECTIVES 🎨",   correct: ["broader","deeper","higher","longer"],            wrong: ["write","hesitate","disappear","pack"] },
    { instruction: "Catch SUPERLATIVE ADJECTIVES 🎨",   correct: ["fastest","brightest","strongest","tallest"],     wrong: ["faster","brighter","stronger","taller"] },
    { instruction: "Catch COLLECTIVE NOUNS 📦",         correct: ["battalion","anthology","brood","covey"],         wrong: ["assemble","collective","pursue","vast"] },
    { instruction: "Catch ABSTRACT NOUNS 🏷️",          correct: ["resilience","empathy","serenity","grief"],       wrong: ["precisely","dazzling","conquer","swift"] },
    { instruction: 'Synonyms of "ephemeral" 🔤',        correct: ["transient","fleeting","momentary"],              wrong: ["permanent","eternal","enduring","lasting"] },
    { instruction: 'Synonyms of "pragmatic" 🔤',        correct: ["practical","realistic","sensible"],              wrong: ["idealistic","impractical","naive","unrealistic"] },
    { instruction: 'Antonyms of "benevolent" 🔄',       correct: ["cruel","malicious","selfish","greedy"],          wrong: ["kind","generous","philanthropic","warm"] },
    { instruction: "Catch GERUNDS (verb used as noun) 🔤", correct: ["swimming","reading","running","writing"],     wrong: ["swim","read","run","write"] },
    { instruction: "Catch words with PREFIX 'un-' 🔤",  correct: ["unhappy","unkind","unfair","unknown"],           wrong: ["happy","kind","fair","known"] },
    { instruction: "Catch PASSIVE voice indicators 🔤", correct: ["was built","were sent","is made","had been taken"], wrong: ["builds","sends","makes","takes"] },
  ],
};

// ─── MATHS ───────────────────────────────────────────────────────────────────
// Large pool per class; game picks 8–12 rounds randomly each session.

const MATHS_POOL = {
  "1-2": [
    { instruction: "Catch all EVEN numbers 2️⃣",    correct: [2,4,6,8,10],     wrong: [1,3,5,7,9] },
    { instruction: "Catch all EVEN numbers 2️⃣",    correct: [12,14,16,18,20], wrong: [11,13,15,17,19] },
    { instruction: "Catch all ODD numbers 1️⃣",     correct: [1,3,5,7,9],      wrong: [2,4,6,8,10] },
    { instruction: "Catch all ODD numbers 1️⃣",     correct: [11,13,15,17],    wrong: [10,12,14,16] },
    { instruction: "Catch numbers LESS THAN 10 📉", correct: [2,4,6,8],        wrong: [11,13,15,17,20] },
    { instruction: "Catch numbers MORE THAN 15 📈", correct: [16,18,20,25],    wrong: [5,8,10,14] },
    { instruction: "Catch MULTIPLES of 2 ✖️",      correct: [2,4,6,8,10],     wrong: [1,3,5,7,9] },
    { instruction: "Catch MULTIPLES of 5 ✖️",      correct: [5,10,15,20],     wrong: [3,7,11,13] },
    { instruction: "Catch MULTIPLES of 10 ✖️",     correct: [10,20,30,40],    wrong: [5,15,25,35] },
    { instruction: "Catch SINGLE digit numbers 🔢",correct: [1,3,5,7,9],      wrong: [10,12,14,16] },
    { instruction: "Catch numbers in the TENS 🔢", correct: [10,20,30,40,50], wrong: [1,3,5,7,9] },
    { instruction: "Catch SQUARE numbers ⬛",       correct: [1,4,9,16,25],    wrong: [2,3,5,7,11] },
    { instruction: "Catch numbers that make 10 ➕",correct: [1,2,3,4,5],      wrong: [6,7,8,9,10] },  // pairs to 10
    { instruction: "Catch HALF of 10 = ? ÷",       correct: [5],               wrong: [2,3,4,6,7,8] },
    { instruction: "Catch numbers BETWEEN 5 and 15",correct:[6,7,8,9,10,11,12,13,14], wrong:[1,2,3,4,5,15,16,17] },
  ],
  "3-4": [
    { instruction: "Catch all EVEN numbers 2️⃣",     correct: [34,56,78,92,104],   wrong: [33,57,79,91,103] },
    { instruction: "Catch all ODD numbers 1️⃣",      correct: [33,55,77,91,103],   wrong: [32,54,76,90,102] },
    { instruction: "Catch PRIME numbers 🔑",         correct: [23,29,31,37],       wrong: [24,28,32,36,40] },
    { instruction: "Catch PRIME numbers 🔑",         correct: [41,43,47,53],       wrong: [40,44,48,54,56] },
    { instruction: "Catch MULTIPLES of 3 ✖️",       correct: [3,6,9,12,15,18],    wrong: [4,7,10,13,16] },
    { instruction: "Catch MULTIPLES of 7 ✖️",       correct: [7,14,21,28,35],     wrong: [8,15,22,29,36] },
    { instruction: "Catch MULTIPLES of 8 ✖️",       correct: [8,16,24,32,40],     wrong: [9,17,25,33,41] },
    { instruction: "Catch MULTIPLES of 9 ✖️",       correct: [9,18,27,36,45],     wrong: [10,19,28,37,46] },
    { instruction: "Catch SQUARE numbers ⬛",        correct: [4,9,16,25,36],      wrong: [5,10,17,26,37] },
    { instruction: "Catch CUBE numbers 🎲",          correct: [1,8,27,64,125],     wrong: [2,9,28,65,126] },
    { instruction: "Catch FACTORS of 24 🔢",         correct: [1,2,3,4,6,8,12,24],wrong: [5,7,9,10,11] },
    { instruction: "Catch FACTORS of 36 🔢",         correct: [1,2,3,4,6,9,12,18,36],wrong:[5,7,8,10,11] },
    { instruction: "Catch numbers DIVISIBLE by 4 ÷",correct: [4,8,12,16,20,24],   wrong: [5,9,13,17,21] },
    { instruction: "Catch numbers DIVISIBLE by 6 ÷",correct: [6,12,18,24,30],     wrong: [7,13,19,25,31] },
    { instruction: "Catch FRACTIONS less than ½ 🍕",correct: ["1/3","1/4","1/5","2/7","3/8"], wrong:["1/2","2/3","3/4","4/5","5/6"] },
    { instruction: "Catch IMPROPER fractions 🍕",   correct: ["5/4","7/3","9/5","11/6"], wrong:["1/4","2/3","3/5","4/6"] },
    { instruction: "Catch numbers less than 100 📉", correct: [34,56,78,99],        wrong: [100,150,200,250] },
    { instruction: "Catch ROMAN numerals for 5-10 🏛️",correct:["V","VI","VII","VIII","IX","X"],wrong:["I","II","III","IV","XI","XII"] },
  ],
  "5-6": [
    { instruction: "Catch PRIME numbers 🔑",           correct: [101,103,107,109,113],  wrong: [100,102,104,106,108] },
    { instruction: "Catch COMPOSITE numbers 🔢",       correct: [100,102,104,106,108],  wrong: [101,103,107,109,113] },
    { instruction: "Catch MULTIPLES of 15 ✖️",        correct: [15,30,45,60,75],       wrong: [14,31,46,61,76] },
    { instruction: "Catch MULTIPLES of 25 ✖️",        correct: [25,50,75,100,125],     wrong: [24,51,76,101,126] },
    { instruction: "Catch PERFECT SQUARES ⬛",         correct: [121,144,169,196,225],  wrong: [120,143,168,195,224] },
    { instruction: "Catch PERFECT CUBES 🎲",           correct: [8,27,64,125,216],      wrong: [9,28,65,126,215] },
    { instruction: "Catch FACTORS of 120 🔢",          correct: [1,2,3,4,5,6,8,10,12,15,20,24,30,40,60,120], wrong:[7,9,11,13,17,19] },
    { instruction: "Catch numbers DIVISIBLE by 11 ÷", correct: [11,22,33,44,55,66],    wrong: [12,23,34,45,56,67] },
    { instruction: "Catch NEGATIVE numbers 📉",        correct: [-1,-3,-5,-7,-9],       wrong: [1,3,5,7,9] },
    { instruction: "Catch FRACTIONS greater than 1 🍕",correct: ["5/4","7/3","9/2","11/5"], wrong:["1/4","2/3","3/4","4/5"] },
    { instruction: "Catch EQUIVALENT fractions of ½ 🍕",correct:["2/4","3/6","4/8","5/10"],wrong:["1/3","2/5","3/7","4/9"] },
    { instruction: "Catch DECIMAL numbers 🔢",        correct: [0.5,1.5,2.5,3.5,4.5],  wrong: [1,2,3,4,5] },
    { instruction: "Catch PERCENTAGES > 50% 📊",      correct: ["60%","75%","80%","90%","100%"],wrong:["10%","25%","30%","40%","50%"] },
    { instruction: "Catch MULTIPLES of BOTH 3 and 4 ✖️",correct:[12,24,36,48,60],      wrong: [9,15,20,27,32] },
    { instruction: "Catch numbers with digit sum = 9 🔢",correct:[9,18,27,36,45,54,63,72,81,90],wrong:[10,19,28,37,46] },
    { instruction: "Catch ROMAN numerals 50–100 🏛️",  correct:["L","LX","LXX","LXXX","XC","C"],wrong:["X","XX","XXX","XL","I"] },
  ],
  "7-8": [
    { instruction: "Catch PRIME numbers 🔑",              correct: [211,223,227,229,233],   wrong: [210,222,226,228,232] },
    { instruction: "Catch IRRATIONAL numbers 🔢",         correct: ["√2","√3","π","√5","√7"],wrong:["2","3","4","5","6"] },
    { instruction: "Catch RATIONAL numbers 🔢",           correct: ["1/2","3/4","0.5","5","7"],wrong:["√2","√3","π","√5","√7"] },
    { instruction: "Catch INTEGERS 🔢",                   correct: [-3,-1,0,2,5,8],         wrong: [0.5,1.5,2.5,"1/2","3/4"] },
    { instruction: "Catch PERFECT SQUARES ⬛",            correct: [256,289,324,361,400],   wrong: [255,288,323,360,399] },
    { instruction: "Catch MULTIPLES of 23 ✖️",           correct: [23,46,69,92,115],       wrong: [24,47,70,93,116] },
    { instruction: "Catch numbers DIVISIBLE by 12 ÷",    correct: [12,24,36,48,60,72],     wrong: [13,25,37,49,61] },
    { instruction: "Catch POWERS of 2 🔋",               correct: [2,4,8,16,32,64,128,256],wrong:[3,5,6,10,12,15] },
    { instruction: "Catch POWERS of 3 🔋",               correct: [3,9,27,81,243],         wrong: [4,10,28,82,244] },
    { instruction: "Catch NEGATIVE INTEGERS 📉",         correct: [-5,-4,-3,-2,-1],         wrong: [1,2,3,4,5] },
    { instruction: "Catch numbers with HCF of 6 🔢",     correct: [6,12,18,24,30],         wrong: [7,13,19,25,31] },
    { instruction: "Catch SCIENTIFIC NOTATION 🔬",       correct: ["1×10²","3×10³","5×10⁴","2×10⁵"],wrong:["100","3000","50000","200000"] },
    { instruction: "Catch PRIME FACTORS of 360 🔑",      correct: [2,3,5],                 wrong: [4,6,7,8,9,10] },
    { instruction: "Catch numbers where n² < 100 ⬛",    correct: [1,2,3,4,5,6,7,8,9],     wrong: [10,11,12,13,14] },
    { instruction: "Catch FIBONACCI numbers 🌀",         correct: [1,2,3,5,8,13,21,34,55], wrong: [4,6,7,9,10,11] },
    { instruction: "Catch TRIANGULAR numbers 🔺",        correct: [1,3,6,10,15,21,28,36],  wrong: [2,4,5,7,8,9] },
  ],
};

// ─── SCIENCE ─────────────────────────────────────────────────────────────────
// No sub-categories — varied question pool shuffled each game.

const SCIENCE_POOL = {
  "1-2": [
    { instruction: "Catch all ANIMALS 🐾",            correct: ["cat","dog","fish","bird","cow"],    wrong: ["rock","chair","water","pencil"] },
    { instruction: "Catch LAND ANIMALS 🐘",           correct: ["elephant","dog","cow","lion","hen"], wrong: ["fish","whale","shark","dolphin"] },
    { instruction: "Catch WATER ANIMALS 🐟",          correct: ["fish","whale","shark","dolphin"],   wrong: ["cat","dog","cow","elephant"] },
    { instruction: "Catch BIRDS 🐦",                  correct: ["eagle","parrot","hen","crow","owl"],wrong: ["cat","dog","fish","frog"] },
    { instruction: "Catch things you can EAT 🍎",     correct: ["mango","banana","rice","carrot"],   wrong: ["stone","chair","glass","metal"] },
    { instruction: "Catch LIVING things 🌱",          correct: ["cat","tree","bird","grass","frog"], wrong: ["rock","chair","water","stone"] },
    { instruction: "Catch NON-LIVING things 🪨",      correct: ["rock","chair","pencil","glass"],    wrong: ["cat","tree","bird","fish"] },
    { instruction: "Catch things made of WOOD 🪵",    correct: ["chair","table","pencil","door"],    wrong: ["stone","glass","iron","water"] },
    { instruction: "Catch PLANTS 🌿",                 correct: ["tree","grass","flower","cactus"],   wrong: ["cat","dog","fish","bird"] },
    { instruction: "Catch LIQUIDS 💧",                correct: ["water","juice","milk","oil"],       wrong: ["rock","wood","iron","glass"] },
    { instruction: "Catch things in the SKY ☁️",      correct: ["cloud","sun","moon","star","bird"], wrong: ["fish","rock","tree","chair"] },
    { instruction: "Catch INSECTS 🐛",                correct: ["ant","bee","butterfly","mosquito"], wrong: ["frog","fish","bird","rabbit"] },
    { instruction: "Catch BODY PARTS 🫀",             correct: ["eye","ear","nose","hand","foot"],   wrong: ["chair","rock","tree","water"] },
    { instruction: "Catch things that give LIGHT 💡", correct: ["sun","fire","torch","candle"],      wrong: ["rock","water","chair","stone"] },
    { instruction: "Catch things that are COLD 🧊",   correct: ["ice","snow","water","hail"],        wrong: ["fire","sun","candle","torch"] },
  ],
  "3-4": [
    { instruction: "Catch MAMMALS 🐾",               correct: ["whale","bat","dolphin","elephant","human"],  wrong: ["eagle","frog","fish","snake","parrot"] },
    { instruction: "Catch REPTILES 🦎",              correct: ["snake","lizard","crocodile","turtle","gecko"],wrong: ["frog","salamander","eagle","bat","fish"] },
    { instruction: "Catch AMPHIBIANS 🐸",            correct: ["frog","toad","salamander","newt","axolotl"], wrong: ["snake","lizard","eagle","bat","fish"] },
    { instruction: "Catch SOLIDS 🧱",               correct: ["iron","wood","rock","ice","glass"],           wrong: ["water","oil","milk","air","steam"] },
    { instruction: "Catch LIQUIDS 💧",               correct: ["water","oil","milk","juice","blood"],         wrong: ["iron","wood","rock","glass","sand"] },
    { instruction: "Catch GASES 💨",                 correct: ["air","oxygen","steam","smoke","nitrogen"],    wrong: ["water","oil","iron","rock","glass"] },
    { instruction: "Catch things that CONDUCT electricity ⚡",correct:["iron","copper","gold","silver","water"],wrong:["wood","rubber","plastic","glass","air"] },
    { instruction: "Catch HERBIVORES 🌿",            correct: ["cow","rabbit","deer","horse","elephant"],     wrong: ["lion","tiger","shark","eagle","wolf"] },
    { instruction: "Catch CARNIVORES 🥩",            correct: ["lion","tiger","shark","eagle","wolf"],        wrong: ["cow","rabbit","deer","horse","elephant"] },
    { instruction: "Catch parts of a PLANT 🌱",      correct: ["root","stem","leaf","flower","fruit"],        wrong: ["fin","beak","claw","shell","wing"] },
    { instruction: "Catch things that FLOAT 🛶",     correct: ["wood","cork","leaf","plastic bottle"],        wrong: ["iron","rock","glass","coin"] },
    { instruction: "Catch NATURAL things 🌍",        correct: ["rock","tree","rain","sand","coal"],           wrong: ["plastic","glass","rubber","nylon"] },
    { instruction: "Catch MAN-MADE things 🏭",       correct: ["plastic","glass","rubber","nylon","paper"],   wrong: ["rock","tree","rain","sand","coal"] },
    { instruction: "Catch SOURCES of water 💧",      correct: ["river","lake","ocean","rain","well"],         wrong: ["mountain","forest","sand","glass","rock"] },
    { instruction: "Catch things that need SUNLIGHT ☀️",correct:["plant","solar panel","flower","algae"],     wrong:["mushroom","fish","bat","mole","earthworm"] },
    { instruction: "Catch RENEWABLE energy sources ♻️",correct:["solar","wind","hydro","geothermal"],          wrong:["coal","oil","gas","nuclear","diesel"] },
  ],
  "5-6": [
    { instruction: "Catch ELEMENTS in the Periodic Table ⚗️", correct: ["gold","iron","oxygen","carbon","nitrogen","sodium"],  wrong: ["water","salt","air","sugar","steel"] },
    { instruction: "Catch ELEMENTS in the Periodic Table ⚗️", correct: ["helium","copper","silver","hydrogen","calcium"],     wrong: ["bronze","rust","air","water","sand"] },
    { instruction: "Catch METALS ⚙️",               correct: ["iron","copper","gold","silver","aluminium"],  wrong: ["oxygen","carbon","wood","glass","plastic"] },
    { instruction: "Catch NON-METALS ⚗️",           correct: ["oxygen","carbon","nitrogen","sulfur","chlorine"],wrong:["iron","copper","gold","silver","aluminium"] },
    { instruction: "Catch INVERTEBRATES 🦑",        correct: ["jellyfish","crab","butterfly","earthworm","octopus"],wrong:["salmon","lizard","bat","eagle","frog"] },
    { instruction: "Catch VERTEBRATES 🦴",          correct: ["salmon","lizard","bat","eagle","frog"],        wrong: ["jellyfish","crab","butterfly","earthworm","octopus"] },
    { instruction: "Catch ORGAN SYSTEMS 🫀",        correct: ["nervous","digestive","respiratory","circulatory"],wrong:["photosynthesis","osmosis","diffusion","transpiration"] },
    { instruction: "Catch things in the SOLAR SYSTEM 🪐",correct:["Mercury","Venus","Mars","Jupiter","Saturn","Earth"],wrong:["star","galaxy","nebula","comet","asteroid"] },
    { instruction: "Catch PLANETS 🪐",              correct: ["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"],wrong:["Moon","Sun","Pluto","Titan","Ceres"] },
    { instruction: "Catch ACIDS 🧪",                correct: ["vinegar","lemon juice","hydrochloric acid","sulfuric acid"],wrong:["baking soda","soap","bleach","ammonia"] },
    { instruction: "Catch BASES/ALKALIS 🧪",        correct: ["baking soda","soap","bleach","ammonia","lime water"],wrong:["vinegar","lemon juice","cola","orange juice"] },
    { instruction: "Catch things that undergo PHOTOSYNTHESIS 🌿",correct:["leaf","algae","cactus","moss","fern"],wrong:["mushroom","fish","ant","rock","soil"] },
    { instruction: "Catch FORCE types ⚡",          correct: ["gravity","friction","magnetic","electric","tension"],wrong:["photosynthesis","osmosis","respiration","digestion"] },
    { instruction: "Catch TYPES of rocks 🪨",       correct: ["igneous","sedimentary","metamorphic"],           wrong: ["volcanic","oceanic","granite","marble","basalt"] },
    { instruction: "Catch FOOD CHAIN producers 🌱", correct: ["grass","tree","algae","wheat","rice"],           wrong: ["cow","lion","frog","eagle","fox"] },
    { instruction: "Catch FOOD CHAIN consumers 🦁", correct: ["cow","rabbit","frog","eagle","fox"],             wrong: ["grass","tree","algae","wheat","rice"] },
  ],
  "7-8": [
    { instruction: "Catch NOBLE GASES ⚗️",             correct: ["helium","neon","argon","krypton","xenon","radon"],   wrong: ["hydrogen","oxygen","nitrogen","carbon","fluorine"] },
    { instruction: "Catch HALOGENS ⚗️",               correct: ["fluorine","chlorine","bromine","iodine","astatine"],  wrong: ["helium","neon","argon","krypton","sodium"] },
    { instruction: "Catch ALKALI METALS ⚗️",          correct: ["lithium","sodium","potassium","rubidium","caesium"], wrong: ["iron","copper","gold","silver","aluminium"] },
    { instruction: "Catch REACTANTS in photosynthesis 🌿",correct:["CO₂","water","sunlight"],                          wrong: ["oxygen","glucose","ATP","chlorophyll"] },
    { instruction: "Catch PRODUCTS of photosynthesis 🌿",correct:["oxygen","glucose"],                                  wrong: ["CO₂","water","sunlight","nitrogen"] },
    { instruction: "Catch ORGANELLES in a PLANT cell 🌱",correct:["chloroplast","cell wall","vacuole","nucleus","mitochondria"],wrong:["centriole","lysosome","flagella"] },
    { instruction: "Catch ORGANELLES in an ANIMAL cell 🐾",correct:["nucleus","mitochondria","ribosome","lysosome","centriole"],wrong:["chloroplast","cell wall","vacuole"] },
    { instruction: "Catch ELECTROMAGNETIC spectrum waves 📡",correct:["radio","microwave","infrared","visible","ultraviolet","X-ray","gamma"],wrong:["sound","ultrasound","seismic","water"] },
    { instruction: "Catch NEWTON'S Laws concepts ⚡",  correct: ["inertia","acceleration","action","reaction","force","mass"],wrong:["photosynthesis","osmosis","diffusion","respiration"] },
    { instruction: "Catch TYPES of chemical reactions ⚗️",correct:["combustion","oxidation","neutralisation","precipitation","electrolysis"],wrong:["diffusion","osmosis","transpiration","digestion"] },
    { instruction: "Catch DNA bases 🧬",              correct: ["adenine","thymine","guanine","cytosine"],              wrong: ["uracil","serine","leucine","glycine"] },
    { instruction: "Catch HORMONES 💊",               correct: ["insulin","adrenaline","oestrogen","testosterone","thyroxine"],wrong:["enzyme","antibody","antigen","haemoglobin"] },
    { instruction: "Catch RENEWABLE energy sources ♻️",correct:["solar","wind","hydro","tidal","geothermal","biomass"],  wrong:["coal","oil","natural gas","nuclear","diesel"] },
    { instruction: "Catch types of ROCK 🪨",          correct: ["igneous","sedimentary","metamorphic"],                 wrong: ["volcanic","oceanic","alluvial","fluvial"] },
    { instruction: "Catch BIOMES 🌍",                 correct: ["tundra","rainforest","desert","savanna","taiga","coral reef"],wrong:["continent","ocean","mountain","valley","plateau"] },
    { instruction: "Catch INHERITED diseases 🧬",     correct: ["haemophilia","sickle cell","cystic fibrosis","Down syndrome"],wrong:["malaria","tuberculosis","cholera","influenza"] },
  ],
};

// ─── COLOURS ─────────────────────────────────────────────────────────────────
// type: "colour" — bugs show a filled coloured circle, no text.
// "correct" values are CSS colour strings.
// "instruction" is shown with a colour swatch.
// targetColour is the hex/name to display as the target swatch.

const COLOUR_ROUNDS = {
  "1-2": [
    { instruction: "Tap all RED bugs 🔴",    targetColour:"#EF4444", correct:["#EF4444","#DC2626","#B91C1C"],      wrong:["#3B82F6","#22C55E","#F59E0B","#A855F7","#EC4899"] },
    { instruction: "Tap all BLUE bugs 🔵",   targetColour:"#3B82F6", correct:["#3B82F6","#2563EB","#1D4ED8"],      wrong:["#EF4444","#22C55E","#F59E0B","#A855F7","#EC4899"] },
    { instruction: "Tap all GREEN bugs 🟢",  targetColour:"#22C55E", correct:["#22C55E","#16A34A","#15803D"],      wrong:["#EF4444","#3B82F6","#F59E0B","#A855F7","#EC4899"] },
    { instruction: "Tap all YELLOW bugs 🟡", targetColour:"#FBBF24", correct:["#FBBF24","#F59E0B","#D97706"],      wrong:["#EF4444","#3B82F6","#22C55E","#A855F7","#EC4899"] },
    { instruction: "Tap all PINK bugs 🩷",   targetColour:"#EC4899", correct:["#EC4899","#DB2777","#BE185D"],      wrong:["#EF4444","#3B82F6","#22C55E","#F59E0B","#A855F7"] },
    { instruction: "Tap all ORANGE bugs 🟠", targetColour:"#F97316", correct:["#F97316","#EA580C","#C2410C"],      wrong:["#EF4444","#3B82F6","#22C55E","#A855F7","#FBBF24"] },
    { instruction: "Tap all PURPLE bugs 🟣", targetColour:"#A855F7", correct:["#A855F7","#9333EA","#7C3AED"],      wrong:["#EF4444","#3B82F6","#22C55E","#F59E0B","#EC4899"] },
  ],
  "3-4": [
    { instruction: "Tap all LIGHT BLUE bugs",  targetColour:"#7DD3FC", correct:["#7DD3FC","#BAE6FD","#38BDF8"],   wrong:["#1D4ED8","#0369A1","#EF4444","#22C55E","#F59E0B"] },
    { instruction: "Tap all DARK RED bugs",    targetColour:"#991B1B", correct:["#991B1B","#7F1D1D","#B91C1C"],   wrong:["#EF4444","#FCA5A5","#3B82F6","#22C55E","#F59E0B"] },
    { instruction: "Tap all BROWN bugs 🟤",    targetColour:"#92400E", correct:["#92400E","#78350F","#B45309"],    wrong:["#EF4444","#3B82F6","#22C55E","#F59E0B","#EC4899"] },
    { instruction: "Tap all LIGHT GREEN bugs", targetColour:"#86EFAC", correct:["#86EFAC","#BBF7D0","#4ADE80"],   wrong:["#15803D","#166534","#EF4444","#3B82F6","#F59E0B"] },
    { instruction: "Tap all GREY bugs",        targetColour:"#9CA3AF", correct:["#9CA3AF","#6B7280","#D1D5DB"],   wrong:["#EF4444","#3B82F6","#22C55E","#F59E0B","#A855F7"] },
    { instruction: "Tap all TEAL bugs",        targetColour:"#14B8A6", correct:["#14B8A6","#0D9488","#0F766E"],   wrong:["#22C55E","#3B82F6","#A855F7","#F97316","#EC4899"] },
    { instruction: "Tap WARM colour bugs 🌡️",  targetColour:"#F97316", correct:["#EF4444","#F97316","#FBBF24","#EC4899","#DC2626"], wrong:["#3B82F6","#22C55E","#A855F7","#14B8A6","#6366F1"] },
    { instruction: "Tap COOL colour bugs 🧊",  targetColour:"#3B82F6", correct:["#3B82F6","#22C55E","#A855F7","#14B8A6","#6366F1"],   wrong:["#EF4444","#F97316","#FBBF24","#EC4899","#DC2626"] },
  ],
  "5-6": [
    { instruction: "Tap all MAGENTA bugs",     targetColour:"#EC4899", correct:["#EC4899","#F472B6","#DB2777"],    wrong:["#EF4444","#A855F7","#F97316","#3B82F6","#22C55E"] },
    { instruction: "Tap all INDIGO bugs",      targetColour:"#6366F1", correct:["#6366F1","#4F46E5","#4338CA"],    wrong:["#3B82F6","#A855F7","#22C55E","#EF4444","#F97316"] },
    { instruction: "Tap all CYAN bugs",        targetColour:"#06B6D4", correct:["#06B6D4","#0891B2","#0E7490"],    wrong:["#3B82F6","#22C55E","#14B8A6","#A855F7","#EF4444"] },
    { instruction: "Tap SHADES OF GREEN 🌿",   targetColour:"#22C55E", correct:["#22C55E","#16A34A","#15803D","#166534","#4ADE80","#86EFAC"], wrong:["#3B82F6","#EF4444","#F97316","#A855F7","#FBBF24"] },
    { instruction: "Tap SHADES OF BLUE 💙",    targetColour:"#3B82F6", correct:["#3B82F6","#2563EB","#1D4ED8","#1E40AF","#7DD3FC","#BAE6FD"], wrong:["#22C55E","#EF4444","#F97316","#A855F7","#FBBF24"] },
    { instruction: "Tap SHADES OF RED ❤️",     targetColour:"#EF4444", correct:["#EF4444","#DC2626","#B91C1C","#7F1D1D","#FCA5A5"],           wrong:["#3B82F6","#22C55E","#F97316","#A855F7","#FBBF24"] },
  ],
  "7-8": [
    { instruction: "Tap ANALOGOUS colours (blue family)",    targetColour:"#3B82F6", correct:["#3B82F6","#6366F1","#06B6D4","#0EA5E9","#2563EB"],      wrong:["#EF4444","#22C55E","#F97316","#EC4899","#FBBF24"] },
    { instruction: "Tap COMPLEMENTARY to RED",               targetColour:"#EF4444", correct:["#06B6D4","#0891B2","#22C55E","#14B8A6"],                 wrong:["#EF4444","#DC2626","#B91C1C","#F97316","#EC4899"] },
    { instruction: "Tap EARTH TONES",                        targetColour:"#92400E", correct:["#92400E","#78350F","#B45309","#9CA3AF","#6B7280","#4B5563"],wrong:["#EF4444","#3B82F6","#22C55E","#A855F7","#EC4899"] },
    { instruction: "Tap PASTEL colours",                     targetColour:"#FCA5A5", correct:["#FCA5A5","#BAE6FD","#BBF7D0","#FDE68A","#DDD6FE","#FBCFE8"],wrong:["#B91C1C","#1D4ED8","#15803D","#D97706","#7C3AED"] },
    { instruction: "Tap NEON / VIBRANT colours",             targetColour:"#22D3EE", correct:["#22D3EE","#84CC16","#F59E0B","#EF4444","#EC4899","#A855F7"], wrong:["#9CA3AF","#6B7280","#78350F","#F3F4F6","#1F2937"] },
    { instruction: "Tap MONOCHROMATIC (shades of purple) 💜",targetColour:"#A855F7", correct:["#A855F7","#9333EA","#7C3AED","#6D28D9","#C4B5FD","#DDD6FE"],wrong:["#3B82F6","#EF4444","#22C55E","#F97316","#EC4899"] },
  ],
};

// ─── SHAPES ──────────────────────────────────────────────────────────────────
// type: "shape" — bugs show an SVG shape icon, no text.
// correct / wrong contain shape keys (strings).
// The Bug component maps these to SVG drawings.

const SHAPE_ROUNDS = {
  "1-2": [
    { instruction: "Tap all CIRCLES ⭕",      targetShape:"circle",    correct:["circle","circle","circle"],                          wrong:["square","triangle","rectangle","star"] },
    { instruction: "Tap all SQUARES ⬛",      targetShape:"square",    correct:["square","square","square"],                          wrong:["circle","triangle","rectangle","star"] },
    { instruction: "Tap all TRIANGLES 🔺",    targetShape:"triangle",  correct:["triangle","triangle","triangle"],                    wrong:["circle","square","rectangle","star"] },
    { instruction: "Tap all RECTANGLES ▬",   targetShape:"rectangle", correct:["rectangle","rectangle","rectangle"],                 wrong:["circle","square","triangle","star"] },
    { instruction: "Tap all STARS ⭐",        targetShape:"star",      correct:["star","star","star"],                               wrong:["circle","square","triangle","rectangle"] },
    { instruction: "Tap all HEARTS 🩷",       targetShape:"heart",     correct:["heart","heart","heart"],                            wrong:["circle","square","triangle","star"] },
  ],
  "3-4": [
    { instruction: "Tap all PENTAGONS 🔷",    targetShape:"pentagon",  correct:["pentagon","pentagon","pentagon"],                    wrong:["hexagon","octagon","circle","square","triangle"] },
    { instruction: "Tap all HEXAGONS",        targetShape:"hexagon",   correct:["hexagon","hexagon","hexagon"],                      wrong:["pentagon","octagon","circle","square","triangle"] },
    { instruction: "Tap all OVALS 🥚",        targetShape:"oval",      correct:["oval","oval","oval"],                               wrong:["circle","square","triangle","rectangle","star"] },
    { instruction: "Tap all DIAMONDS 💎",     targetShape:"diamond",   correct:["diamond","diamond","diamond"],                      wrong:["square","triangle","circle","hexagon","pentagon"] },
    { instruction: "Tap all ARROWS ➡️",       targetShape:"arrow",     correct:["arrow","arrow","arrow"],                            wrong:["circle","square","triangle","star","heart"] },
    { instruction: "Tap all 4-SIDED shapes",  targetShape:"square",    correct:["square","rectangle","diamond"],                     wrong:["circle","triangle","pentagon","hexagon","star"] },
    { instruction: "Tap all 3-SIDED shapes",  targetShape:"triangle",  correct:["triangle","triangle","triangle"],                   wrong:["square","rectangle","pentagon","hexagon","circle"] },
  ],
  "5-6": [
    { instruction: "Tap all QUADRILATERALS",  targetShape:"square",    correct:["square","rectangle","diamond","trapezoid"],         wrong:["circle","triangle","pentagon","hexagon","star"] },
    { instruction: "Tap all OCTAGONS",        targetShape:"octagon",   correct:["octagon","octagon","octagon"],                      wrong:["hexagon","pentagon","square","circle","triangle"] },
    { instruction: "Tap PARALLELOGRAMS",      targetShape:"parallelogram",correct:["parallelogram","parallelogram","parallelogram"], wrong:["circle","triangle","star","hexagon","octagon"] },
    { instruction: "Tap all TRAPEZOIDS",      targetShape:"trapezoid", correct:["trapezoid","trapezoid","trapezoid"],                 wrong:["square","rectangle","parallelogram","circle","triangle"] },
    { instruction: "Tap REGULAR polygons",    targetShape:"hexagon",   correct:["hexagon","pentagon","octagon","square"],             wrong:["trapezoid","parallelogram","arrow","star","heart"] },
    { instruction: "Tap CURVED shapes",       targetShape:"circle",    correct:["circle","oval","heart"],                            wrong:["square","triangle","pentagon","hexagon","diamond"] },
  ],
  "7-8": [
    { instruction: "Tap all CONVEX shapes",   targetShape:"hexagon",   correct:["hexagon","pentagon","octagon","square","circle"],   wrong:["star","arrow","heart","crescent","cross"] },
    { instruction: "Tap CONCAVE shapes",      targetShape:"star",      correct:["star","arrow","crescent","cross"],                  wrong:["hexagon","pentagon","octagon","square","circle"] },
    { instruction: "Tap shapes with ROTATIONAL SYMMETRY",targetShape:"circle",correct:["circle","square","hexagon","pentagon","octagon"],wrong:["arrow","trapezoid","parallelogram","heart","crescent"] },
    { instruction: "Tap shapes with LINE SYMMETRY",targetShape:"square",correct:["square","circle","triangle","hexagon","star","heart"],wrong:["arrow","trapezoid","parallelogram"] },
    { instruction: "Tap PRISM cross-sections",targetShape:"rectangle", correct:["rectangle","triangle","hexagon","circle"],          wrong:["star","arrow","heart","crescent","diamond"] },
  ],
};

// ─── SUBJECT DEFINITIONS ─────────────────────────────────────────────────────

export const SUBJECTS = {
  english: {
    id: "english", name: "English", emoji: "📖", color: "#818CF8",
    type: "text",
    description: "Nouns, verbs, adjectives, adverbs, synonyms & more",
  },
  maths: {
    id: "maths", name: "Maths", emoji: "🔢", color: "#F97316",
    type: "text",
    description: "Even, odd, primes, multiples, fractions & more",
  },
  science: {
    id: "science", name: "Science", emoji: "🔬", color: "#22C55E",
    type: "text",
    description: "Animals, elements, plants, forces & more",
  },
  colours: {
    id: "colours", name: "Colours", emoji: "🎨", color: "#EC4899",
    type: "colour",
    description: "Match the colour — tap all bugs of the right colour",
  },
  shapes: {
    id: "shapes", name: "Shapes", emoji: "🔷", color: "#A855F7",
    type: "shape",
    description: "Match the shape — tap all bugs showing the right shape",
  },
};

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

export function getSubjectList() {
  return Object.values(SUBJECTS);
}

/**
 * Build a randomised round list for a game session.
 * Returns an array of round objects, length ≈ 10–15.
 */
export function buildRoundList(subjectId, levelKey) {
  switch (subjectId) {
    case "english": {
      const pool = ENGLISH_ROUNDS[levelKey] ?? ENGLISH_ROUNDS["1-2"];
      return shuffle([...pool]).slice(0, 12);
    }
    case "maths": {
      const pool = MATHS_POOL[levelKey] ?? MATHS_POOL["1-2"];
      return shuffle([...pool]).slice(0, 12);
    }
    case "science": {
      const pool = SCIENCE_POOL[levelKey] ?? SCIENCE_POOL["1-2"];
      return shuffle([...pool]).slice(0, 12);
    }
    case "colours": {
      const pool = COLOUR_ROUNDS[levelKey] ?? COLOUR_ROUNDS["1-2"];
      return shuffle([...pool]).slice(0, 10);
    }
    case "shapes": {
      const pool = SHAPE_ROUNDS[levelKey] ?? SHAPE_ROUNDS["1-2"];
      return shuffle([...pool]).slice(0, 10);
    }
    default:
      return [];
  }
}

/**
 * Get the bug display type for a subject.
 * "text" | "colour" | "shape"
 */
export function getBugType(subjectId) {
  return SUBJECTS[subjectId]?.type ?? "text";
}

export const LEVEL_KEYS = ["1-2", "3-4", "5-6", "7-8"];
export const LEVEL_NAMES = {
  "1-2": "Class 1 – 2",
  "3-4": "Class 3 – 4",
  "5-6": "Class 5 – 6",
  "7-8": "Class 7 – 8",
};

export const BUG_EMOJIS = ["🐝","🦋","🪲","🐛","🪳","🦗","🪰","🐞","🦟","🪱"];