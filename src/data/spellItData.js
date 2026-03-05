// Dynamic — add new categories by adding a new key with a folder name.
// The game auto-discovers categories from this file.
// blanks: how many letters to hide — chosen randomly each round from the word.
// The ENGINE decides WHICH letters to hide dynamically each round.

export const SPELL_IT_DATA = {
  animals: {
    label:  "Animals",
    emoji:  "🐯",
    folder: "animals",   // maps to public/assets/spellit/animals/
    words: [
      { name: "Bear",         file: "Bear.svg"         },
      { name: "Camel",        file: "Camel.svg"        },
      { name: "Crocodile",    file: "Crocodile.svg"    },
      { name: "Deer",         file: "Deer.svg"         },
      { name: "Elephant",     file: "Elephant.svg"     },
      { name: "Fox",          file: "Fox.svg"          },
      { name: "Giraffe",      file: "Giraffe.svg"      },
      { name: "Gorilla",      file: "Gorilla.svg"      },
      { name: "Hippopotamus", file: "Hippopotamus.svg" },
      { name: "Kangaroo",     file: "Kangaroo.svg"     },
      { name: "Koala",        file: "Koala.svg"        },
      { name: "Lion",         file: "Lion.svg"         },
      { name: "Ostrich",      file: "Ostrich.svg"      },
      { name: "Penguin",      file: "Penguin.svg"      },
      { name: "Polar Bear",   file: "Polar Bear.svg"   },
      { name: "Rat",          file: "Rat.svg"          },
      { name: "Tiger",        file: "Tiger.svg"        },
      { name: "Vulture",      file: "Vulture.svg"      },
      { name: "Walrus",       file: "Walrus.svg"       },
      { name: "Whale",        file: "Whale.svg"        },
      { name: "Yak",          file: "Yak.svg"          },
      { name: "Zebra",        file: "Zebra.svg"        },
    ],
  },fruitsandvegetables: {
  label:  "Fruits & Vegetables",
  emoji:  "🍎",
  folder: "fruitsandvegetables",
  words: [
    { name: "Apple",        file: "apple.svg" },
    { name: "Avacado",      file: "avacado.svg" },
    { name: "Banana",       file: "banana.svg" },
    { name: "Beetroot",     file: "beetroot.svg" },
    { name: "Brinjal",      file: "brinjal.svg" },
    { name: "Capsicum",     file: "capsicum.svg" },
    { name: "Carrot",       file: "carrot.svg" },
    { name: "Cherry",       file: "cherry.svg" },
    { name: "Chilli",       file: "chilli.svg" },
    { name: "Corn",         file: "corn.svg" },
    { name: "Garlic",       file: "garlic.svg" },
    { name: "Grapes",       file: "grapes.svg" },
    { name: "Green Apple",  file: "green apple.svg" },
    { name: "Kiwi",         file: "kiwi.svg" },
    { name: "Lemon",        file: "lemon.svg" },
    { name: "Mango",        file: "mango.svg" },
    { name: "Mushroom",     file: "mushroom.svg" },
    { name: "Orange",       file: "orange.svg" },
    { name: "Pineapple",    file: "pineapple.svg" },
    { name: "Pomegranate",  file: "pomegranate.svg" },
    { name: "Potato",       file: "potato.svg" },
    { name: "Pumpkin",      file: "pumpkin.svg" },
    { name: "Strawberry",   file: "strawberry.svg" },
    { name: "Tomato",       file: "tomato.svg" },
    { name: "Watermelon",   file: "watermelon.svg" },
  ],
},

things: {
  label:  "Things",
  emoji:  "🧸",
  folder: "things",
  words: [
    { name: "Bag",         file: "bag.svg" },
    { name: "Basketball",  file: "basketball.svg" },
    { name: "Boat",        file: "boat.svg" },
    { name: "Books",       file: "books.svg" },
    { name: "Burger",      file: "burger.svg" },
    { name: "Cage",        file: "cage.svg" },
    { name: "Calculator",  file: "calculator.svg" },
    { name: "Car",         file: "car.svg" },
    { name: "Clock",       file: "clock.svg" },
    { name: "Compass",     file: "compass.svg" },
    { name: "Computer",    file: "computer.svg" },
    { name: "Cycle",       file: "cycle.svg" },
    { name: "Eraser",      file: "eraser.svg" },
    { name: "Fire",        file: "fire.svg" },
    { name: "Flower Pot",  file: "flower pot.svg" },
    { name: "Glass",       file: "glass.svg" },
    { name: "Globe",       file: "globe.svg" },
    { name: "Guitar",      file: "guitar.svg" },
    { name: "Hammer",      file: "hammer.svg" },
    { name: "Hat",         file: "hat.svg" },
    { name: "House",       file: "house.svg" },
    { name: "Ice Cream",   file: "ice cream.svg" },
    { name: "Igloo",       file: "igloo.svg" },
    { name: "Juice",       file: "juice.svg" },
    { name: "Lamp",        file: "lamp.svg" },
    { name: "Magnet",      file: "magnet.svg" },
    { name: "Mountain",    file: "mountain.svg" },
    { name: "Pencil",      file: "pencil.svg" },
    { name: "Pizza",       file: "pizza.svg" },
    { name: "Plate",       file: "plate.svg" },
    { name: "Pond",        file: "pond.svg" },
    { name: "Rain",        file: "rain.svg" },
    { name: "Scissors",    file: "scissors.svg" },
    { name: "Television",  file: "television.svg" },
    { name: "Tree",        file: "tree.svg" },
    { name: "Volcano",     file: "volcano.svg" },
  ],
},

   

  // Future categories — just add here and drop svgs in the right folder
  // fruits: {
  //   label: "Fruits", emoji: "🍎", folder: "fruits", words: [...]
  // },
};

export const CATEGORY_KEYS = Object.keys(SPELL_IT_DATA);

// How many blanks based on word length — dynamic per round
export function getBlankCount(wordLength) {
  if (wordLength <= 3) return 1;
  if (wordLength <= 5) return 2;
  if (wordLength <= 7) return 3;
  if (wordLength <= 10) return 4;
  return 5;
}