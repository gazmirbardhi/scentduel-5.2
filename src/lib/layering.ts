/**
 * Note-compatibility matrix used by the Scent Matcher tool.
 * A compatibility of 0 means "do not layer," 1 means "marginal," 2 means "good,"
 * 3 means "excellent." The matrix is symmetric and hand-curated based on
 * perfumery conventions: citrus + woody, amber + vanilla, rose + oud, etc.
 *
 * Note: this is illustrative data for an educational tool, not an oracle.
 */
import { noteSlugs } from "@/lib/notesData";

type Compatibility = 0 | 1 | 2 | 3;

/** Pairs known to layer well together. Key format: "slugA|slugB" (sorted). */
const goodPairs: Record<string, Compatibility> = {
  "bergamot|cedar": 3,
  "bergamot|lavender": 3,
  "bergamot|neroli": 3,
  "bergamot|vetiver": 3,
  "bergamot|musk": 2,
  "bergamot|patchouli": 2,
  "cedar|vetiver": 3,
  "cedar|bergamot": 3,
  "cedar|sandalwood": 3,
  "cedar|patchouli": 2,
  "cedar|tonka": 2,
  "cedar|musk": 2,
  "cedar|lavender": 3,
  "vetiver|bergamot": 3,
  "vetiver|tonka": 3,
  "vetiver|lavender": 2,
  "vetiver|patchouli": 2,
  "vetiver|musk": 2,
  "sandalwood|rose": 3,
  "sandalwood|musk": 3,
  "sandalwood|amber": 3,
  "sandalwood|vanilla": 3,
  "sandalwood|patchouli": 2,
  "sandalwood|iris": 3,
  "amber|vanilla": 3,
  "amber|tonka": 3,
  "amber|patchouli": 3,
  "amber|sandalwood": 3,
  "amber|rose": 3,
  "amber|benzoin": 3,
  "amber|saffron": 2,
  "amber|musk": 3,
  "vanilla|tonka": 3,
  "vanilla|tobacco": 3,
  "vanilla|amber": 3,
  "vanilla|sandalwood": 3,
  "vanilla|patchouli": 2,
  "vanilla|musk": 2,
  "vanilla|rose": 2,
  "tonka|lavender": 3,
  "tonka|tobacco": 3,
  "tonka|vanilla": 3,
  "tonka|cedar": 2,
  "tonka|bergamot": 2,
  "patchouli|rose": 3,
  "patchouli|bergamot": 3,
  "patchouli|amber": 3,
  "patchouli|vetiver": 2,
  "patchouli|vanilla": 2,
  "lavender|bergamot": 3,
  "lavender|tonka": 3,
  "lavender|cedar": 3,
  "lavender|musk": 2,
  "lavender|tobacco": 2,
  "musk|sandalwood": 3,
  "musk|amber": 3,
  "musk|rose": 3,
  "musk|bergamot": 2,
  "musk|iris": 3,
  "rose|oud": 3,
  "rose|patchouli": 3,
  "rose|sandalwood": 3,
  "rose|saffron": 2,
  "rose|musk": 3,
  "oud|saffron": 3,
  "oud|rose": 3,
  "oud|amber": 3,
  "oud|sandalwood": 2,
  "oud|saffron": 3,
  "saffron|oud": 3,
  "saffron|amber": 2,
  "saffron|rose": 2,
  "iris|sandalwood": 3,
  "iris|musk": 3,
  "iris|amber": 2,
  "tobacco|tonka": 3,
  "tobacco|vanilla": 3,
  "tobacco|cedar": 2,
  "tobacco|amber": 2,
  "neroli|bergamot": 3,
  "neroli|musk": 2,
  "neroli|amber": 2,
  // Known bad pairs (explicit zeros for clarity)
  "oud|vanilla": 1,
  "oud|bergamot": 1,
  "saffron|vanilla": 1,
  "tobacco|neroli": 0,
  "iris|tobacco": 1,
  "iris|bergamot": 1,
  "patchouli|neroli": 1,
  "patchouli|lavender": 1,
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

export function layeringCompatibility(a: string, b: string): Compatibility {
  if (a === b) return 2; // same note, layering is redundant but not harmful
  const key = pairKey(a, b);
  return goodPairs[key] ?? 1; // unknown pairs default to "marginal"
}

export interface LayeringResult {
  noteA: string;
  noteB: string;
  score: Compatibility;
  label: string;
  advice: string;
}

export function describeLayering(a: string, b: string): LayeringResult {
  const score = layeringCompatibility(a, b);
  const labels: Record<Compatibility, string> = {
    0: "Do not layer",
    1: "Marginal",
    2: "Good pairing",
    3: "Excellent pairing",
  };
  const advice: Record<Compatibility, string> = {
    0: "These notes clash — one will flatten or distort the other. Wear them on different days.",
    1: "This pairing can work but depends heavily on dosage and the surrounding composition. Test on skin before committing.",
    2: "A solid, conventional pairing. The notes complement each other without either dominating.",
    3: "A classic perfumery pairing — these notes reinforce each other and rarely go wrong together.",
  };
  return { noteA: a, noteB: b, score, label: labels[score], advice: advice[score] };
}

/** Returns every valid note slug, used to populate the matcher dropdowns. */
export function allLayerableNotes(): string[] {
  return noteSlugs;
}
