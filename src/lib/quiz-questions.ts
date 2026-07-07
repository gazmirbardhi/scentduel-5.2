/**
 * Trivia questions for the "Name That Note" tool. The tool picks a question
 * deterministically by UTC date so every visitor sees the same question on a
 * given day — this is deliberate, not a bug, and lets the question be shared
 * and discussed.
 */
export interface QuizQuestion {
  id: string;
  /** The clue shown to the user. */
  clue: string;
  /** Four multiple-choice answers, in display order. */
  options: string[];
  /** Index (0-based) of the correct answer in `options`. */
  correctIndex: number;
  /** Short explanation shown after answering. */
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q-vetiver",
    clue:
      "I am a grass whose roots are steam-distilled for a smoky, earthy oil. I am the base note of Terre d'Hermès and the classic Guerlain Vetiver. I project more, not less, in hot weather. What am I?",
    options: ["Patchouli", "Vetiver", "Sandalwood", "Oakmoss"],
    correctIndex: 1,
    explanation:
      "Vetiver is a grass (not a tree) whose roots yield a smoky, earthy oil. It's the backbone of the classic 'vetiver masculine' genre.",
  },
  {
    id: "q-bergamot",
    clue:
      "I am a citrus fruit grown mainly in Calabria, Italy. I flavor Earl Grey tea and I open roughly half of all men's fragrances ever made. What am I?",
    options: ["Lemon", "Neroli", "Bergamot", "Grapefruit"],
    correctIndex: 2,
    explanation:
      "Bergamot is the most-used top note in perfumery. Its floral, tea-like quality sets it apart from sharper lemons.",
  },
  {
    id: "q-oud",
    clue:
      "I form when a specific tree is infected by a specific mold and defends itself with resin. I am the most expensive note in perfumery and the most polarizing. What am I?",
    options: ["Amber", "Frankincense", "Oud", "Myrrh"],
    correctIndex: 2,
    explanation:
      "Oud (agarwood) forms as a defensive resin in infected Aquilaria trees. Real oud oil costs thousands per kilogram.",
  },
  {
    id: "q-iris",
    clue:
      "I come from a rhizome, not a flower. I must be dried for three years before distillation. I smell of powder and butter and I am one of the most expensive materials in perfumery. What am I?",
    options: ["Orris (Iris)", "Tonka", "Saffron", "Jasmine"],
    correctIndex: 0,
    explanation:
      "Iris/orris comes from the rhizome of Iris pallida, dried for 3+ years before distillation. It's the 'lipstick' note.",
  },
  {
    id: "q-tonka",
    clue:
      "I am a bean, not a vanilla. I smell of almonds and hay and I owe my scent to a compound called coumarin. I round out the dry-down of Bleu de Chanel. What am I?",
    options: ["Tonka Bean", "Vanilla Bean", "Cocoa Bean", "Coffee Bean"],
    correctIndex: 0,
    explanation:
      "Tonka bean's dominant odorant is coumarin, which gives it the almond-hay scent that rounds out masculine fougères.",
  },
  {
    id: "q-saffron",
    clue:
      "I am a spice, not a resin. I come from the dried stigma of a crocus flower. I smell honeyed and leathery and I am the signature note of Baccarat Rouge 540. What am I?",
    options: ["Cardamom", "Saffron", "Cinnamon", "Pink Pepper"],
    correctIndex: 1,
    explanation:
      "Saffron is the dried stigma of Crocus sativus. It takes ~150,000 flowers for 1 kg — the world's most expensive spice.",
  },
  {
    id: "q-patchouli",
    clue:
      "I am a bushy herb whose leaves are fermented before distillation. I smell of damp earth and a touch of mint. I am the base of every chypre. What am I?",
    options: ["Mint", "Patchouli", "Rosemary", "Basil"],
    correctIndex: 1,
    explanation:
      "Patchouli leaves are fermented and steam-distilled for an earthy, mint-tinged oil that anchors the chypre family.",
  },
  {
    id: "q-amber",
    clue:
      "I am an accord, not a single material. I am built from labdanum, benzoin, and vanilla. I am warm, golden, and the base of the entire oriental family. What am I?",
    options: ["Ambergris", "Amber", "Benzoin", "Styrax"],
    correctIndex: 1,
    explanation:
      "Perfumery 'amber' is a composite accord, not ambergris (whale) or fossil resin. It's labdanum + benzoin + vanilla.",
  },
  {
    id: "q-lavender",
    clue:
      "I am the defining top note of every fougère. I am herbal and camphoraceous, not floral. I open Bleu de Chanel and Dior Sauvage. What am I?",
    options: ["Lavender", "Rosemary", "Mint", "Sage"],
    correctIndex: 0,
    explanation:
      "Fine lavender (Lavandula angustifolia) is the top note of the fougère family and the soul of barbershop perfumery.",
  },
  {
    id: "q-neroli",
    clue:
      "I come from the blossom of the bitter orange tree. I share a plant with petitgrain and orange oil. I am the heart of classical colognes. What am I?",
    options: ["Jasmine", "Neroli", "Orange Blossom", "Tuberose"],
    correctIndex: 1,
    explanation:
      "Neroli is the steam-distilled oil of bitter-orange blossom. Orange blossom absolute is a different extraction of the same flower.",
  },
  {
    id: "q-tobacco",
    clue:
      "I am an absolute extracted from cured leaves. I smell of hay, honey, and smoke. I am the namesake of Tom Ford Tobacco Vanille. What am I?",
    options: ["Leather", "Tobacco", "Hay", "Tea"],
    correctIndex: 1,
    explanation:
      "Tobacco absolute is extracted from cured tobacco leaves. It's honeyed and smoky without being ashy.",
  },
  {
    id: "q-musk",
    clue:
      "Originally I came from a gland of the male musk deer. Today I am almost entirely synthetic. I give fragrances 'skin intimacy' and I extend longevity. What am I?",
    options: ["Civet", "Musk", "Ambergris", "Castoreum"],
    correctIndex: 1,
    explanation:
      "Natural musk is banned on ethical grounds. Modern musks are synthetic and fall into clean, warm, and animalic families.",
  },
  {
    id: "q-sandalwood",
    clue:
      "I come from the heartwood of a tree. The Mysore variety is the benchmark but is now heavily regulated. I am creamy, buttery, and the softest wood in perfumery. What am I?",
    options: ["Cedar", "Sandalwood", "Agarwood", "Pine"],
    correctIndex: 1,
    explanation:
      "Mysore sandalwood (from Karnataka, India) is the benchmark — creamy and lactonic. Australian sandalwood is the sustainable alternative.",
  },
  {
    id: "q-cedar",
    clue:
      "I am dry and pencil-shaving clean. The Virginia variety is the one in Bleu de Chanel. I give fragrances 'bone' without adding sweetness. What am I?",
    options: ["Sandalwood", "Cedar", "Vetiver", "Oud"],
    correctIndex: 1,
    explanation:
      "Virginia cedar is dry and pencil-like; Atlas cedar is sweeter and warmer. Cedar is the 'bone' of masculine perfumery.",
  },
];

/**
 * Returns the question for a given UTC date, deterministically.
 * The same date (UTC) always yields the same question.
 */
export function getQuestionForDate(date: Date = new Date()): QuizQuestion {
  // UTC day-of-year as the index seed
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = date.getTime() - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % quizQuestions.length;
  return quizQuestions[index];
}
