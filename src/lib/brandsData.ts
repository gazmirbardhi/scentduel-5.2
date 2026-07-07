/**
 * Brand directory data. Slugs here are the CANONICAL IDS referenced by
 * data/fragrances.json `brandSlug` and post frontmatter `relatedBrands`.
 * Do not rename a slug without updating every consumer.
 */
export interface Brand {
  slug: string;
  name: string;
  country: string;
  founded: number;
  description: string;
  /** Short tagline for cards. */
  tagline: string;
  notablePerfumes: string[];
  relatedPosts: string[];
}

export const brands: Brand[] = [
  {
    slug: "chanel",
    name: "Chanel",
    country: "France",
    founded: 1910,
    description:
      "Chanel is the most influential house in perfumery history. Founded by Gabrielle 'Coco' Chanel, the house launched Chanel No. 5 in 1921 and single-handedly popularized the use of synthetic aldehydes in fine fragrance. Under in-house perfumer Jacques Polge (and now his son Olivier), Chanel has maintained one of the most consistent quality records in designer perfumery — Bleu de Chanel, Allure Homme, and the Les Exclusifs line are all benchmarks in their categories.",
    tagline: "The benchmark of designer perfumery.",
    notablePerfumes: ["Bleu de Chanel", "Bleu de Chanel Eau de Parfum", "Allure Homme Sport", "No. 5"],
    relatedPosts: ["bleu-de-chanel-edp-review"],
  },
  {
    slug: "dior",
    name: "Dior",
    country: "France",
    founded: 1946,
    description:
      "Christian Dior launched his house in 1946 with Miss Dior, named after his sister. Under perfumers Edmond Roudnitska, Jean-Louis Sieuzac, and now François Demachy (and his successor), Dior has produced some of the most commercially successful and critically respected fragrances of the last fifty years — Sauvage, Fahrenheit, Homme, and the Privée line. Dior is one of the few designer houses that maintains an in-house perfumer rather than outsourcing to a fragrance house.",
    tagline: "In-house perfumery at designer scale.",
    notablePerfumes: ["Sauvage", "Sauvage Elixir", "Fahrenheit", "Homme Intense"],
    relatedPosts: ["dior-sauvage-edp-review"],
  },
  {
    slug: "creed",
    name: "Creed",
    country: "France",
    founded: 1760,
    description:
      "Creed claims a founding date of 1760 and a long history of bespoke commissions for European royalty. The historical record is thinner than the marketing suggests, but there's no debating the commercial impact: Aventus (launched 2010) became one of the most-cloned and most-discussed fragrances of the 2010s. Creed is now owned by Kering and positioned at the entry-luxury price point.",
    tagline: "The house behind Aventus.",
    notablePerfumes: ["Aventus", "Green Irish Tweed", "Silver Mountain Water", "Original Vetiver"],
    relatedPosts: [],
  },
  {
    slug: "tom-ford",
    name: "Tom Ford",
    country: "United States",
    founded: 2005,
    description:
      "Tom Ford's fragrance division, now owned by Estée Lauder, sits at the entry-niche price point and is best known for two things: the Private Blend line (Oud Wood, Tobacco Vanille, Neroli Portofino) and bringing Middle Eastern notes (oud, saffron, amber) into mainstream Western perfumery. Ford's compositions tend to be bold, unisex, and unapologetically heavy.",
    tagline: "Niche ambition at designer reach.",
    notablePerfumes: ["Oud Wood", "Tobacco Vanille", "Neroli Portofino", "Black Orchid"],
    relatedPosts: [],
  },
  {
    slug: "maison-francis-kurkdjian",
    name: "Maison Francis Kurkdjian",
    country: "France",
    founded: 2009,
    description:
      "MFK was founded by Francis Kurkdjian, the perfumer behind Le Mâle (Jean Paul Gaultier) and the winner of the Prix François Coty. The house is best known for Baccarat Rouge 540, a saffron-amber-oud composition that defined a genre and became one of the most-recognized niche fragrances of the late 2010s. LVMH acquired a majority stake in 2017.",
    tagline: "The house of Baccarat Rouge 540.",
    notablePerfumes: ["Baccarat Rouge 540", "Grand Soir", "Amyris Homme", "À La Rose"],
    relatedPosts: [],
  },
  {
    slug: "hermes",
    name: "Hermès",
    country: "France",
    founded: 1837,
    description:
      "Hermès is a leather-goods house first and a fragrance house second, but its perfumery division — led by in-house perfumer Jean-Claude Ellena from 2004 to 2016 and Christine Nagel thereafter — has produced some of the most respected compositions in designer perfumery. The Hermessence line and the Terre d'Hermès family are the benchmarks for 'refined' masculine fragrance.",
    tagline: "The quietest luxury in perfumery.",
    notablePerfumes: ["Terre d'Hermès", "Terre d'Hermès Eau Intense Vétiver", "Voyage d'Hermès", "Un Jardin sur le Nil"],
    relatedPosts: [],
  },
  {
    slug: "guerlain",
    name: "Guerlain",
    country: "France",
    founded: 1828,
    description:
      "Guerlain is the oldest continuously operating perfume house in the world, founded in 1828 and still run by the Guerlain family for much of its history. The house invented the 'Guerlinade' accord (vanilla, bergamot, iris, rose, and tonka) and produced Shalimar (1925), Mitsouko (1919), and Vetiver (1959) — three of the most influential fragrances ever made. Guerlain remains a reference point for classical French perfumery.",
    tagline: "Two centuries of French perfumery.",
    notablePerfumes: ["Vetiver", "L'Homme Idéal", "Shalimar", "L'Instant de Pour Homme"],
    relatedPosts: [],
  },
  {
    slug: "ysl",
    name: "Yves Saint Laurent",
    country: "France",
    founded: 1961,
    description:
      "YSL's fragrance division (now under L'Oréal) is best known for two opposing poles: the opulent oriental Opium (1977), which defined a generation of heavy spice, and the fresh-aromatic La Nuit de L'Homme (2009), which defined a generation of date-night masculines. The house sits squarely in designer pricing and targets the 18–35 demographic.",
    tagline: "Opium to La Nuit — two poles of designer perfumery.",
    notablePerfumes: ["La Nuit de L'Homme", "Y Eau de Parfum", "Kouros", "Black Opium"],
    relatedPosts: [],
  },
  {
    slug: "versace",
    name: "Versace",
    country: "Italy",
    founded: 1978,
    description:
      "Versace's fragrance division (licensed to EuroItalia) produces crowd-pleasing, sweet, and projection-heavy designer fragrances at accessible price points. Eros (2012) and Dylan Blue (2016) are the two commercial blockbusters — both sweet, both loud, both aimed at the under-30 market. Versace is the textbook example of 'loud designer' perfumery.",
    tagline: "Loud, sweet, and unapologetically young.",
    notablePerfumes: ["Eros", "Eros Flame", "Dylan Blue", "Pour Homme"],
    relatedPosts: [],
  },
  {
    slug: "armaf",
    name: "Armaf",
    country: "United Arab Emirates",
    founded: 2014,
    description:
      "Armaf is a UAE-based house (under Sterling Parfums) that has built its reputation on 'clone' fragrances — compositions that closely resemble designer or niche scents at a fraction of the price. Club de Nuit Intense Man (an Aventus alternative) is the house's flagship and one of the best-selling men's fragrances in the world by volume. Armaf sits at the budget price point and is the go-to recommendation for value seekers.",
    tagline: "The value king of Middle Eastern perfumery.",
    notablePerfumes: ["Club de Nuit Intense Man", "Tres Nuit", "Hunter Intense", "Aura Fresh"],
    relatedPosts: [],
  },
  {
    slug: "parfums-de-marly",
    name: "Parfums de Marly",
    country: "France",
    founded: 2009,
    description:
      "Parfums de Marly is a French niche house named after the 18th-century royal stud farm of Marly. The house positions itself as 'luxury inspired by the court of Louis XV' but is best known in practice for Layton (2016), a sweet apple-vanilla-woody composition that became a Gen-Z social-media staple. The house sits at the entry-niche price point and is widely available through grey-market discounters.",
    tagline: "Niche positioning, social-media reach.",
    notablePerfumes: ["Layton", "Herod", "Pegasus", "Carlisle"],
    relatedPosts: [],
  },
  {
    slug: "jean-paul-gaultier",
    name: "Jean Paul Gaultier",
    country: "France",
    founded: 1993,
    description:
      "JPG's fragrance division (licensed to Puig) made its name with Le Mâle (1995), a lavender-mint-cinnamon fougère designed by Francis Kurkdjian that became one of the best-selling men's fragrances in Europe for over a decade. The house's signature is the torso-shaped bottle and the bold, sweet, projection-heavy compositions aimed at the nightclub demographic.",
    tagline: "Le Mâle and the nightclub demographic.",
    notablePerfumes: ["Le Mâle", "Le Mâle Le Parfum", "Ultra Male", "Scandal Pour Homme"],
    relatedPosts: [],
  },
];

export const brandSlugs = brands.map((b) => b.slug);

export function getBrand(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}

export function getBrandsBySlugs(slugs: string[]): Brand[] {
  return slugs.map(getBrand).filter((b): b is Brand => Boolean(b));
}
