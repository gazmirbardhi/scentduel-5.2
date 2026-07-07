import { z } from "zod";

/**
 * Canonical list of categories. The `slug` is what appears in the URL
 * (including nested slugs like `seasonal/winter`). `notes` is a category
 * namespace for note-based lists (e.g. /categories/notes/vanilla) and is
 * distinct from the ingredient glossary at /notes/[slug].
 */
export interface Category {
  slug: string;
  /** Human-readable label, may contain a trailing segment for nested cats. */
  label: string;
  title: string;
  description: string;
  /** Short intro copy rendered on the category index page. */
  intro: string;
}

export const categories: Category[] = [
  {
    slug: "reviews",
    label: "Reviews",
    title: "Fragrance Reviews",
    description:
      "In-depth, long-form reviews of designer and niche fragrances — top to dry-down, longevity, sillage, value, and verdict.",
    intro:
      "Every review on ScentDuel follows the same structure: opening, heart, base, performance, value, and a clear verdict. No fragrance lore without a recommendation. Use the embedded poll to register your own experience, and cross-link into our ingredient glossary to learn why a note behaves the way it does.",
  },
  {
    slug: "comparisons",
    label: "Comparisons",
    title: "Head-to-Head Comparisons",
    description:
      "Side-by-side fragrance comparisons — which scent wins on longevity, value, compliments, and versatility.",
    intro:
      "Comparisons are the heart of ScentDuel. We pit two (or more) fragrances against each other across the metrics that actually matter: longevity, sillage, compliment factor, versatility, and value. Each comparison post includes a deal-finder table with current retailer pricing.",
  },
  {
    slug: "best",
    label: "Best Of",
    title: "Best Fragrance Lists",
    description:
      "Curated best-of lists — best oud, best budget fragrances, best office scents, and more.",
    intro:
      "Our best-of lists are opinionated and specific. We name the category, we name the budget, and we name the winner. No vague 'top 20' listicles — every recommendation links to a full review or a brand directory entry so you can verify the call.",
  },
  {
    slug: "seasonal/winter",
    label: "Seasonal · Winter",
    title: "Winter Fragrances",
    description:
      "Cold-weather fragrances — heavy ambers, ouds, tobacco, and spice that perform in low temperatures.",
    intro:
      "Winter rewards boldness. Heavy ambers, smoky ouds, tobacco, and warm spice project in cold air the way citruses cannot. These are the fragrances we reach for from November through February, ranked by performance and versatility.",
  },
  {
    slug: "seasonal/summer",
    label: "Seasonal · Summer",
    title: "Summer Fragrances",
    description:
      "Heat-friendly fragrances — citruses, aquatics, and fresh aromatics that don't turn cloying in warm weather.",
    intro:
      "Summer is unforgiving: heavy sweetness turns sour in the heat, and big projection becomes a liability on a crowded beach. These fresh citruses, aquatics, and light aromatics are built for 30°C and above.",
  },
  {
    slug: "occasions",
    label: "Occasions",
    title: "Fragrances by Occasion",
    description:
      "Fragrance recommendations by setting — office, date night, wedding, gym, and more.",
    intro:
      "The right fragrance for the office is the wrong fragrance for a nightclub. Our occasion guides match scent profiles to settings, with specific recommendations at three price points: budget, mid-tier, and luxury.",
  },
  {
    slug: "notes/vanilla",
    label: "Notes · Vanilla",
    title: "Vanilla Fragrances",
    description:
      "The best vanilla-forward fragrances — gourmand, warm, and sweet, from budget to niche.",
    intro:
      "Vanilla is the most crowd-pleasing note in perfumery: warm, edible, and universally liked. These are the fragrances that put vanilla front and center rather than using it as a background sweetener.",
  },
  {
    slug: "notes/amber",
    label: "Notes · Amber",
    title: "Amber Fragrances",
    description:
      "Amber compositions — warm, resinous, and sensual, ideal for evening and cold weather.",
    intro:
      "Amber is a perfumery accord (not a single material) built around labdanum, benzoin, and vanilla. These fragrances showcase the amber accord as the main event.",
  },
  {
    slug: "notes/oud",
    label: "Notes · Oud",
    title: "Oud Fragrances",
    description:
      "Oud-forward fragrances — from Westernized sweet ouds to authentic agarwood compositions.",
    intro:
      "Oud (agarwood) is the most polarizing note in perfumery: animalic, medicinal, and dense. These fragrances range from approachable Western ouds to the real thing for seasoned noses.",
  },
  {
    slug: "notes/citrus",
    label: "Notes · Citrus",
    title: "Citrus Fragrances",
    description:
      "Citrus-forward fragrances — bergamot, lemon, grapefruit, and neroli for summer and office wear.",
    intro:
      "Citrus is the most versatile top note: refreshing, clean, and inoffensive. These fragrances keep citrus central rather than letting it vanish in the first ten minutes.",
  },
  {
    slug: "notes/musk",
    label: "Notes · Musk",
    title: "Musk Fragrances",
    description:
      "Musk-centric fragrances — clean, skin-close, and subtly sensual scents for everyday wear.",
    intro:
      "Musk is the backbone of 'your skin but better' fragrances. These compositions lean on white, clean, or animalic musks as the dominant note rather than a fixative.",
  },
  {
    slug: "notes/woody",
    label: "Notes · Woody",
    title: "Woody Fragrances",
    description:
      "Woody fragrances — vetiver, cedar, sandalwood, and patchouli for grounded, mature scents.",
    intro:
      "Woody notes give a fragrance gravity. These are compositions built around vetiver, cedar, sandalwood, or patchouli rather than using woods as a dry-down base.",
  },
  {
    slug: "notes/spicy",
    label: "Notes · Spicy",
    title: "Spicy Fragrances",
    description:
      "Spicy fragrances — cardamom, pepper, cinnamon, and clove for warm, bold, and distinctive scents.",
    intro:
      "Spicy notes add bite. Cardamom, pink pepper, cinnamon, and clove turn a ordinary composition into something memorable. These fragrances lead with spice.",
  },
];

export const categorySlugs = categories.map((c) => c.slug);

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/**
 * Zod schema for validating that a category slug declared in frontmatter
 * actually exists in our canonical list. This is what fails the build with a
 * clear error if a writer typos a category.
 */
export const categorySlugSchema = z
  .string()
  .refine(
    (s) => categorySlugs.includes(s),
    (s) => ({ message: `Unknown category slug: "${s}". Valid slugs: ${categorySlugs.join(", ")}` })
  );
