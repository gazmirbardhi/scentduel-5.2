/**
 * Single source of truth for the canonical domain and site-wide constants.
 * Every canonical tag, OG tag, sitemap entry, and RSS link must derive from
 * this constant — never hardcode the domain string elsewhere.
 */
export const siteConfig = {
  name: "ScentDuel",
  domain: "scentduel.com",
  /** Canonical origin. Falls back to the env var, then to the default domain. */
  get url() {
    const env = process.env.NEXT_PUBLIC_SITE_URL;
    if (env && env.length > 0) return env.replace(/\/$/, "");
    return `https://${this.domain}`;
  },
  description:
    "ScentDuel is a fragrance blog and reference directory — in-depth reviews, head-to-head comparisons, an ingredient glossary, and interactive tools to help you find your signature scent.",
  locale: "en_US",
  twitterHandle: "@scentduel",
  author: {
    name: "Mara Ellsworth",
    bio: "Fragrance writer, amateur perfumer, and lifelong nose. Mara has spent a decade reviewing designer and niche fragrances and building community resources for scent enthusiasts.",
    avatar: "/images/author/mara-ellsworth.svg",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com/scentduel" },
    { label: "YouTube", href: "https://youtube.com/@scentduel" },
    { label: "RSS", href: "/feed.xml" },
  ],
  /** Navigation used in the header. */
  nav: [
    { label: "Reviews", href: "/categories/reviews" },
    { label: "Comparisons", href: "/categories/comparisons" },
    { label: "Notes", href: "/notes" },
    { label: "Brands", href: "/brands" },
    { label: "Perfumers", href: "/perfumers" },
    { label: "Tools", href: "/tools" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
