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