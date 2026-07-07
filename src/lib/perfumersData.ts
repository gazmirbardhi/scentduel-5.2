/**
 * Perfumer directory data. Slugs here are the CANONICAL IDS referenced by
 * data/fragrances.json `perfumerSlug` and post frontmatter `relatedPerfumers`.
 */
export interface Perfumer {
  slug: string;
  name: string;
  /** Short nationality / background line. */
  nationality: string;
  born: string;
  bio: string;
  signature: string;
  notableCreations: string[];
  /** Slugs of fragrances in data/fragrances.json credited to this perfumer. */
  fragrancesCredited: string[];
  relatedPosts: string[];
}

export const perfumers: Perfumer[] = [
  {
    slug: "jacques-polge",
    name: "Jacques Polge",
    nationality: "French",
    born: "b. 1943",
    bio: "Jacques Polge was the in-house perfumer at Chanel from 1978 to 2015 — the longest tenure in the house's history. He created Égoïste, Allure Homme, Bleu de Chanel, and the majority of the Les Exclusifs line, and he was the first nose outside the Wertheimer family to hold the title of Chanel's master perfumer. His style is characterized by structural clarity and an unusually deft hand with synthetic materials.",
    signature: "Structured, clean, and unusually transparent for Chanel's rich materials.",
    notableCreations: ["Bleu de Chanel", "Allure Homme Sport", "Égoïste", "Cristalle"],
    fragrancesCredited: ["bleu-de-chanel-edp"],
    relatedPosts: ["bleu-de-chanel-edp-review"],
  },
  {
    slug: "olivier-polge",
    name: "Olivier Polge",
    nationality: "French",
    born: "b. 1974",
    bio: "Olivier Polge succeeded his father Jacques as Chanel's in-house perfumer in 2015. Before Chanel he worked at IFF and created Dior Homme (2011 reformulation) and several Hermès compositions. At Chanel he has overseen the Bleu de Chanel Parfum extension and much of the Les Exclusifs expansion. His style is slightly richer and more floral than his father's.",
    signature: "Richer and more floral than his father's work, with a softer dry-down.",
    notableCreations: ["Bleu de Chanel Parfum", "Gabrielle Chanel", "Misia"],
    fragrancesCredited: ["bleu-de-chanel-edp"],
    relatedPosts: ["bleu-de-chanel-edp-review"],
  },
  {
    slug: "francois-demachy",
    name: "François Demachy",
    nationality: "French",
    born: "b. 1949",
    bio: "François Demachy was Dior's in-house perfumer from 2006 to 2021 and the nose behind Sauvage — the best-selling men's fragrance in the world at the time of his retirement. A Grasse native, Demachy oversaw Dior's investment in its own jasmine and rose fields in Grasse and pushed the house toward more natural materials. His style is bold, clean, and projection-forward.",
    signature: "Bold, clean, and built for projection without losing structure.",
    notableCreations: ["Sauvage", "Sauvage Elixir", "Fahrenheit reformulation", "Homme Intense"],
    fragrancesCredited: ["dior-sauvage-edp"],
    relatedPosts: ["dior-sauvage-edp-review"],
  },
  {
    slug: "francis-kurkdjian",
    name: "Francis Kurkdjian",
    nationality: "French-Armenian",
    born: "b. 1969",
    bio: "Francis Kurkdjian is the founder of Maison Francis Kurkdjian and the nose behind Baccarat Rouge 540 — one of the most influential fragrances of the 2010s. Before founding his own house he was a freelance perfumer at Quest International, where he created Jean Paul Gaultier Le Mâle at age 25. He is now the creative director of Christian Dior Parfums (appointed 2021) while his eponymous house continues under LVMH.",
    signature: "Bright, sweet, and structurally simple — compositions that read as a single accord.",
    notableCreations: ["Baccarat Rouge 540", "Le Mâle", "Grand Soir", "Amyris Homme"],
    fragrancesCredited: ["baccarat-rouge-540", "jpg-le-male-le-parfum"],
    relatedPosts: [],
  },
  {
    slug: "jean-claude-ellena",
    name: "Jean-Claude Ellena",
    nationality: "French",
    born: "b. 1947",
    bio: "Jean-Claude Ellena was the in-house perfumer at Hermès from 2004 to 2016 and is widely considered the most influential perfumer of his generation. His philosophy — 'less is more,' a composition should say one thing clearly — produced Terre d'Hermès, Un Jardin sur le Nil, and the entire Hermessence line. He reduced the typical Hermès formula from 60+ materials to under 30 and proved that transparency and longevity are not mutually exclusive.",
    signature: "Minimal, transparent, and built around a single dominant accord.",
    notableCreations: ["Terre d'Hermès", "Un Jardin sur le Nil", "Voyage d'Hermès", "Déclaration"],
    fragrancesCredited: ["terre-dhermes"],
    relatedPosts: [],
  },
  {
    slug: "olivier-crep",
    name: "Olivier Cresp",
    nationality: "French",
    born: "b. 1956",
    bio: "Olivier Cresp is a senior perfumer at Firmenich and the nose behind some of the best-selling fragrances of the last twenty years: Versace Eros, Emporio Armani Stronger With You, and the original Mugler Angel (with Yves de Chiris). His style is sweet, gourmand-forward, and built for mass appeal — the antithesis of Ellena's minimalism.",
    signature: "Sweet, gourmand, and built for mass-market projection.",
    notableCreations: ["Versace Eros", "Stronger With You", "Angel", "Light Blue Forever"],
    fragrancesCredited: ["versace-eros"],
    relatedPosts: [],
  },
  {
    slug: "nathalie-feisthauer",
    name: "Nathalie Feisthauer",
    nationality: "French",
    born: "b. 1960",
    bio: "Nathalie Feisthauer is an independent perfumer who has worked for Symrise and as a freelancer. She is best known for her work on YSL Black Opium and for a long list of niche compositions. She is one of the most senior freelance perfumers in the industry and a frequent collaborator with indie houses.",
    signature: "Dark, sweet, and built around a single dominant floral or gourmand note.",
    notableCreations: ["Black Opium", "Bibliothèque", "Tobacco Mandarin"],
    fragrancesCredited: [],
    relatedPosts: [],
  },
  {
    slug: "alberto-morillas",
    name: "Alberto Morillas",
    nationality: "Spanish (based in Geneva)",
    born: "b. 1950",
    bio: "Alberto Morillas is the most commercially successful freelance perfumer of his generation. He has created over 400 launched fragrances, including Giorgio Armani Acqua di Giò, Carolina Herrera Good Girl, Calvin Klein CK One (with Harry Fremont), and the original Versace Pour Homme. He is a master of the clean, fresh, mass-appeal composition and the perfumer most responsible for the 'blue fragrance' genre that dominated the 2010s.",
    signature: "Clean, fresh, and optimized for mass appeal and broad wearability.",
    notableCreations: ["Acqua di Giò", "Good Girl", "CK One", "Bvlgari Pour Homme"],
    fragrancesCredited: [],
    relatedPosts: [],
  },
  {
    slug: "pierre-negrin",
    name: "Pierre Négrin",
    nationality: "French (raised in Mexico)",
    born: "b. 1957",
    bio: "Pierre Négrin is a senior perfumer at Firmenich and a frequent collaborator with Tom Ford. He co-created Tom Ford Oud Wood, Tobacco Vanille, and Neroli Portofino, and his work on the Private Blend line is largely responsible for bringing oud and Middle Eastern notes into mainstream Western perfumery. His style is rich, unapologetic, and built for the entry-niche price point.",
    signature: "Rich, bold, and built for the entry-niche 'statement' genre.",
    notableCreations: ["Tom Ford Oud Wood", "Tobacco Vanille", "Neroli Portofino"],
    fragrancesCredited: ["tom-ford-oud-wood"],
    relatedPosts: [],
  },
];

export const perfumerSlugs = perfumers.map((p) => p.slug);

export function getPerfumer(slug: string): Perfumer | undefined {
  return perfumers.find((p) => p.slug === slug);
}

export function getPerfumersBySlugs(slugs: string[]): Perfumer[] {
  return slugs.map(getPerfumer).filter((p): p is Perfumer => Boolean(p));
}
