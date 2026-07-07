/**
 * Ingredient glossary data. This is the /notes/[slug] taxonomy — distinct
 * from the /categories/notes/* category namespace. Slugs here are ingredient
 * names (e.g. "vetiver"), not category slugs (e.g. "vanilla").
 *
 * SLUGS HERE ARE THE CANONICAL IDS used in data/fragrances.json `noteSlugs[]`
 * and in post frontmatter `relatedNotes`. Do not rename a slug without
 * updating every consumer.
 */
export interface Note {
  slug: string;
  name: string;
  /** One-line summary for cards and index lists. */
  summary: string;
  /** Full description for the note detail page. */
  description: string;
  scentProfile: string;
  family:
    | "Citrus"
    | "Floral"
    | "Woody"
    | "Amber"
    | "Gourmand"
    | "Aromatic"
    | "Musky"
    | "Spicy"
    | "Resinous";
  longevity: "Short" | "Moderate" | "Long" | "Very Long";
  typicalUse: string;
  relatedNotes: string[];
}

export const notes: Note[] = [
  {
    slug: "bergamot",
    name: "Bergamot",
    summary:
      "The most versatile citrus — fresh, slightly floral, and the backbone of every cologne and Eau de Parfum opening.",
    description:
      "Bergamot is a citrus fruit grown primarily in Calabria, Italy. Its essential oil is pressed from the rind and is the single most-used top note in perfumery. Unlike lemon or grapefruit, bergamot has a floral, tea-like quality (it's the flavor in Earl Grey) that softens its sharpness and lets it bridge cleanly into floral or woody hearts. It's the opening note in roughly half of all men's fragrances and the vast majority of colognes.",
    scentProfile: "Fresh, citrus, slightly floral, bitter-sweet",
    family: "Citrus",
    longevity: "Short",
    typicalUse:
      "Top note in almost every fresh fragrance; the opening of colognes, fougères, and chypres.",
    relatedNotes: ["neroli", "cedar", "vetiver", "lavender"],
  },
  {
    slug: "neroli",
    name: "Neroli",
    summary:
      "Bitter-orange blossom — floral, green, and slightly indolic. The bridge between citrus and white florals.",
    description:
      "Neroli is the steam-distilled essential oil of the bitter-orange blossom. It shares a plant with petitgrain (the leaf oil) and orange oil (the rind), but neroli is the most prized: floral, slightly green, with a honeyed warmth that pure citrus lacks. It's the defining note of classical colognes and a staple in fresh-floral compositions.",
    scentProfile: "Floral, green, citrus-adjacent, slightly honeyed",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in fresh florals, colognes, and bridal fragrances; pairs with bergamot and musk.",
    relatedNotes: ["bergamot", "lavender", "musk", "amber"],
  },
  {
    slug: "vetiver",
    name: "Vetiver",
    summary:
      "Smoky, earthy, grassy root from Haiti and Java. The backbone of masculine perfumery and the ultimate hot-weather base.",
    description:
      "Vetiver is a tall grass whose roots are steam-distilled for an oil that smells of damp earth, smoke, and dried grass. Haitian vetiver is greener and cleaner; Javanese vetiver is smokier and heavier. It's the most important base note in classic masculine perfumery — the dry-down of Terre d'Hermès, Vetiver Guerlain, and Sycomore all rest on it. Vetiver shines in heat: it projects more, not less, as the temperature rises.",
    scentProfile: "Earthy, smoky, grassy, rooty, slightly bitter",
    family: "Woody",
    longevity: "Very Long",
    typicalUse:
      "Base note in masculine fragrances, summer compositions, and fougères; fixes citrus and lavender.",
    relatedNotes: ["cedar", "bergamot", "tonka", "lavender"],
  },
  {
    slug: "cedar",
    name: "Cedar",
    summary:
      "Dry, woody, and pencil-shaving clean. The most versatile wood in perfumery and the base of countless masculine scents.",
    description:
      "Cedar in perfumery usually means Virginia cedar (dry, pencil-like) or Atlas cedar (sweeter, warmer, slightly animalic). Both are used as base notes to give a fragrance 'bone' — a dry, woody foundation that holds up citrus and spice without adding sweetness. Cedar is the wood in Bleu de Chanel, Aventus, and Terre d'Hermès, and it's the reason those fragrances read as 'masculine' to most noses.",
    scentProfile: "Dry, woody, clean, slightly resinous",
    family: "Woody",
    longevity: "Long",
    typicalUse:
      "Base note in masculine, woody, and fresh fragrances; grounds citrus and aromatic compositions.",
    relatedNotes: ["vetiver", "bergamot", "patchouli", "sandalwood"],
  },
  {
    slug: "sandalwood",
    name: "Sandalwood",
    summary:
      "Creamy, rich, and buttery wood from Mysore and Australia. The warmest, softest wood in perfumery.",
    description:
      "Sandalwood oil is steam-distilled from the heartwood of the sandalwood tree. Mysore sandalwood (from Karnataka, India) is the benchmark — creamy, rich, and slightly lactonic — but it's now heavily regulated and expensive. Australian sandalwood is the sustainable alternative: slightly sharper, less buttery, but structurally similar. Sandalwood is the base of countless 'soft' fragrances and the reason many scents feel 'smooth' rather than 'sharp' in the dry-down.",
    scentProfile: "Creamy, buttery, woody, slightly sweet and milky",
    family: "Woody",
    longevity: "Long",
    typicalUse:
      "Base note in orientals, florals, and gourmands; softens sharp compositions and extends longevity.",
    relatedNotes: ["rose", "musk", "amber", "patchouli"],
  },
  {
    slug: "oud",
    name: "Oud (Agarwood)",
    summary:
      "Animalic, smoky, medicinal resin from infected agarwood trees. The most polarizing and expensive note in perfumery.",
    description:
      "Oud (or agarwood) forms when the Aquilaria tree is infected by a specific mold and produces a dark, resinous heartwood as a defense. Steam-distilled, the oil is animalic, smoky, and medicinal — an acquired taste that Western perfumery has softened into a sweeter, more approachable 'oud accord' over the last fifteen years. Real oud oil costs thousands of dollars per kilogram; most 'oud' fragrances use a synthetic or blended accord.",
    scentProfile: "Animalic, smoky, medicinal, balsamic, slightly sweet",
    family: "Resinous",
    longevity: "Very Long",
    typicalUse:
      "Base note in luxury and Middle Eastern fragrances; pairs with rose, saffron, and amber.",
    relatedNotes: ["rose", "saffron", "amber", "sandalwood"],
  },
  {
    slug: "rose",
    name: "Rose",
    summary:
      "The queen of florals — dewy, honeyed, and slightly spicy. May rose and Damask rose dominate perfumery.",
    description:
      "Two rose varieties dominate perfumery: Damask rose (Rosa damascena, grown in Bulgaria and Turkey) and May rose (Rosa centifolia, grown in Grasse and Morocco). Damask is spicier and richer; May is softer and more honeyed. Both are extraordinarily expensive (it takes roughly 4,000 kg of petals to produce 1 kg of oil) and appear in nearly every floral composition. Rose is also the most common pairing for oud in Middle Eastern perfumery.",
    scentProfile: "Floral, dewy, honeyed, slightly spicy and green",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in florals, orientals, and oud compositions; the classic pair with oud and patchouli.",
    relatedNotes: ["oud", "patchouli", "sandalwood", "bergamot"],
  },
  {
    slug: "amber",
    name: "Amber",
    summary:
      "A warm, resinous accord (not a single material) built on labdanum, benzoin, and vanilla. The backbone of oriental perfumery.",
    description:
      "'Amber' in perfumery is not ambergris (whale secretion) and not fossilized tree resin — it's a composite accord built from labdanum (a sticky cistus resin), benzoin (a vanilla-like balsam), and vanilla, often with styrax and opoponax. The result is warm, golden, slightly sweet, and deeply sensual. Amber is the base of the entire 'oriental' fragrance family and the reason so many evening fragrances feel 'cozy.'",
    scentProfile: "Warm, resinous, balsamic, sweet, slightly powdery",
    family: "Amber",
    longevity: "Very Long",
    typicalUse:
      "Base note in orientals, gourmands, and evening fragrances; fixes and sweetens heavier compositions.",
    relatedNotes: ["vanilla", "benzoin", "patchouli", "sandalwood"],
  },
  {
    slug: "vanilla",
    name: "Vanilla",
    summary:
      "Warm, sweet, and edible — the most crowd-pleasing note in perfumery and the heart of the gourmand family.",
    description:
      "Vanilla in perfumery comes from two sources: natural vanilla planifolia extract (expensive, complex, slightly smoky) and synthetic vanillin (cheap, sweet, and the dominant note in most 'vanilla' fragrances). Vanilla is the note that made the gourmand family possible — without it, Thierry Mugler Angel doesn't exist. It's also the most universally liked note in consumer testing, which is why it appears in roughly a third of all feminine fragrances launched since 2000.",
    scentProfile: "Sweet, warm, balsamic, slightly smoky and creamy",
    family: "Gourmand",
    longevity: "Long",
    typicalUse:
      "Base note in gourmands, orientals, and sweet florals; sweetens and extends almost any composition.",
    relatedNotes: ["amber", "tonka", "sandalwood", "patchouli"],
  },
  {
    slug: "tonka",
    name: "Tonka Bean",
    summary:
      "Almondy, hay-like, and sweet — the bridge between vanilla and tobacco and the secret to 'warm' masculine dry-downs.",
    description:
      "Tonka bean is the seed of the Dipteryx odorata tree, native to South America. Its dominant odorant is coumarin, which smells of sweet almonds, cut hay, and warm tobacco. Tonka is the note that gives masculine 'barbershop' fragrances their warm, rounded dry-down — it's in Bleu de Chanel, Dior Sauvage, and La Nuit de L'Homme, and it's the reason those fragrances don't turn sharp as they fade.",
    scentProfile: "Sweet, almondy, hay-like, slightly tobacco-like",
    family: "Gourmand",
    longevity: "Long",
    typicalUse:
      "Base note in masculine fougères, orientals, and tobacco compositions; rounds out sharp dry-downs.",
    relatedNotes: ["vanilla", "lavender", "tobacco", "bergamot"],
  },
  {
    slug: "patchouli",
    name: "Patchouli",
    summary:
      "Earth, damp soil, and a touch of mint. The base of orientals, the soul of chypres, and the most divisive note in perfumery.",
    description:
      "Patchouli is a bushy herb whose leaves are fermented and steam-distilled for an oil that smells of damp earth, dark woods, and a faint camphoraceous mint. It's the base note of the entire chypre family and a fixture of orientals. Modern perfumery often uses 'clear' or 'heart' patchouli (a distilled fraction) to keep the earth without the mustiness. Raw patchouli is polarizing: lovers smell depth, haters smell a damp basement.",
    scentProfile: "Earthy, woody, damp, slightly minty and camphoraceous",
    family: "Woody",
    longevity: "Very Long",
    typicalUse:
      "Base note in chypres, orientals, and dark florals; grounds sweet compositions and extends longevity.",
    relatedNotes: ["rose", "bergamot", "amber", "vetiver"],
  },
  {
    slug: "lavender",
    name: "Lavender",
    summary:
      "Herbal, clean, and slightly camphoraceous — the top of every fougère and the soul of men's barbershop perfumery.",
    description:
      "Lavender (specifically Lavandula angustifolia, or 'fine lavender') is the defining top note of the fougère family and the most important aromatic in masculine perfumery. It's herbal and clean rather than floral, with a camphoraceous edge that pairs perfectly with bergamot, coumarin, and oakmoss. Lavender from Provence (high-altitude) is the benchmark; lavandin (a hybrid) is sharper and cheaper and used in functional perfumery.",
    scentProfile: "Herbal, clean, camphoraceous, slightly floral",
    family: "Aromatic",
    longevity: "Moderate",
    typicalUse:
      "Top note in fougères, aromatic masculines, and colognes; the classic barbershop opening.",
    relatedNotes: ["bergamot", "tonka", "cedar", "musk"],
  },
  {
    slug: "musk",
    name: "Musk",
    summary:
      "Clean, skin-close, and subtly animalic — the fixative base that makes fragrances feel 'yours' rather than 'on you.'",
    description:
      "Natural musk comes from the musk deer (now banned and ethically untenable). Modern musks are synthetic and fall into three families: white/clean (the 'laundry' musk in Galaxolide), warm/sensual (the skin musk in Ethylene Brassylate), and animalic (the nitro musks, mostly discontinued). Musk is the most-used base note in perfumery because it extends longevity, smooths the dry-down, and gives a fragrance 'skin intimacy' — the sense that it belongs to the wearer.",
    scentProfile: "Clean, powdery, skin-like, subtly animalic",
    family: "Musky",
    longevity: "Very Long",
    typicalUse:
      "Base note in almost everything; fixes and extends top notes; gives 'skin' intimacy.",
    relatedNotes: ["sandalwood", "rose", "amber", "bergamot"],
  },
  {
    slug: "saffron",
    name: "Saffron",
    summary:
      "Honeyed, leathery, and slightly metallic — the most expensive spice in the world and the signature of Middle Eastern perfumery.",
    description:
      "Saffron is the dried stigma of the Crocus sativus flower, and it takes roughly 150,000 flowers to produce a single kilogram. In perfumery it's used for its honeyed, leathery, slightly metallic sweetness — the note that defines the 'spicy amber' family popularized by MFK Baccarat Rouge 540. Saffron pairs almost exclusively with oud, rose, and amber; used alone it's too sharp to carry a composition.",
    scentProfile: "Honeyed, leathery, slightly metallic and bittersweet",
    family: "Spicy",
    longevity: "Long",
    typicalUse:
      "Top-to-heart note in Middle Eastern and luxury compositions; the signature of saffron-amber ouds.",
    relatedNotes: ["oud", "rose", "amber", "sandalwood"],
  },
  {
    slug: "iris",
    name: "Iris (Orris)",
    summary:
      "Powdery, buttery, and rooty — the most aristocratic note in perfumery and the soul of 'lipstick' fragrances.",
    description:
      "Iris in perfumery means orris root — the rhizome of the iris pallida flower, dried for three years and then steam-distilled. The resulting 'orris butter' is one of the most expensive materials in perfumery (upward of $100,000/kg) and smells of powder, butter, and cold cream. It's the note behind 'lipstick' fragrances (Prada Infusion d'Iris, Dior Homme) and the reason those compositions feel 'expensive' and 'cultured' to most noses.",
    scentProfile: "Powdery, buttery, rooty, slightly violet-like",
    family: "Floral",
    longevity: "Very Long",
    typicalUse:
      "Heart-to-base note in powdery florals, masculines, and luxury compositions; the 'expensive' accord.",
    relatedNotes: ["sandalwood", "musk", "violet", "amber"],
  },
  {
    slug: "tobacco",
    name: "Tobacco",
    summary:
      "Smoky, honeyed, and dried-leaf sweet — the base of the 'tobacco gourmand' family and a masculine staple.",
    description:
      "Tobacco in perfumery is usually tobacco absolute, extracted from cured tobacco leaves. It smells of dried hay, honey, and wood smoke — sweet without being gourmand, smoky without being ashy. It's the backbone of the 'tobacco gourmand' family (Tom Ford Tobacco Vanille, Maison Margiela Jazz Club) and a fixture of cold-weather masculine compositions.",
    scentProfile: "Smoky, honeyed, dried-leaf, slightly woody",
    family: "Aromatic",
    longevity: "Long",
    typicalUse:
      "Base note in tobacco gourmands, orientals, and cold-weather masculines; pairs with vanilla and tonka.",
    relatedNotes: ["tonka", "vanilla", "cedar", "amber"],
  },
  {
    slug: "benzoin",
    name: "Benzoin",
    summary:
      "A balsamic, vanilla-adjacent resin from the styrax tree. The sweet fixative behind amber and oriental compositions.",
    description:
      "Benzoin is a resin extracted from the styrax tree, primarily grown in Sumatra and Laos. It smells of sweet balsam, vanilla, and a faint caramel — and it's one of the three pillars (with labdanum and vanilla) of the amber accord. Benzoin is also the most common fixative in oriental perfumery: it extends top notes, sweetens dry-downs, and 'glues' compositions together. Siamese benzoin (from Laos) is the perfumery benchmark.",
    scentProfile: "Balsamic, sweet, vanilla-adjacent, slightly smoky",
    family: "Resinous",
    longevity: "Very Long",
    typicalUse:
      "Base note and fixative in orientals, ambers, and gourmands; sweetens and extends almost any composition.",
    relatedNotes: ["amber", "vanilla", "tonka", "sandalwood"],
  },
  {
    slug: "cinnamon",
    name: "Cinnamon",
    summary:
      "Warm, sweet, and baking-spice hot. The most gourmand of the spices and a cold-weather staple.",
    description:
      "Cinnamon in perfumery comes from the bark of the Cinnamomum tree, steam-distilled as an essential oil or extracted as an absolute. It's warm, sweet, and baking-spice hot — the most edible of the spices and a fixture of cold-weather gourmands. Cinnamon is a dose-sensitive note: at low levels it's cozy, at high levels it's suffocating. It pairs almost exclusively with vanilla, amber, and apple.",
    scentProfile: "Warm, sweet, baking-spice, slightly woody",
    family: "Spicy",
    longevity: "Moderate",
    typicalUse:
      "Heart note in gourmands, orientals, and cold-weather compositions; pairs with vanilla and amber.",
    relatedNotes: ["vanilla", "amber", "tonka", "tobacco"],
  },
  {
    slug: "leather",
    name: "Leather",
    summary:
      "Smoky, tarry, and birch-tar animalic. The soul of the leather family and the most 'adult' note in perfumery.",
    description:
      "Leather in perfumery is an accord, not a single material. Historically built from birch tar (a smoky, tarry distillation of birch bark), modern leather notes combine isobutyl quinoline (smoky, phenolic) with castoreum-like musks and woods. The result is smoky, tarry, and animalic — the 'saddle leather' note behind Knize Ten, Cuir de Russie, and Tom Ford Ombre Leather. Leather is a love-it-or-hate-it note that reads as mature and unisex.",
    scentProfile: "Smoky, tarry, animalic, slightly sweet and woody",
    family: "Resinous",
    longevity: "Long",
    typicalUse:
      "Heart-to-base note in leather compositions, chypres, and bold unisex fragrances; pairs with amber and patchouli.",
    relatedNotes: ["amber", "patchouli", "cedar", "tobacco"],
  },
  {
    slug: "violet",
    name: "Violet",
    summary:
      "Powdery, candied, and slightly metallic — the note behind 'lipstick florals' and the ionone family.",
    description:
      "Violet in perfumery is built around ionones — a family of synthetic materials (alpha-ionone, beta-ionone, methyl ionone) that smell of powdery, candied violet with a slightly metallic, dewy edge. Natural violet leaf absolute (green, slightly peppery) is a different material entirely. The ionone 'violet' is the note behind Dior Fahrenheit's floral heart, the 'makeup' accord in Lipstick Rose, and the powdery aspect of many older masculines. It's notorious for causing temporary anosmia — you stop smelling it after a few minutes even though everyone else still can.",
    scentProfile: "Powdery, candied, slightly metallic and dewy",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in powdery florals, masculines, and 'makeup' compositions; pairs with iris and cedar.",
    relatedNotes: ["iris", "cedar", "rose", "musk"],
  },
  {
    slug: "almond",
    name: "Almond",
    summary:
      "Sweet, marzipan, and slightly cherry-like. The gourmand heart of Guerlain L'Homme Idéal and the cherry-amber genre.",
    description:
      "Almond in perfumery is built around benzaldehyde — the same molecule that gives cherry its scent and cyanide its almond-pit smell (in trace, safe quantities). It's sweet, marzipan-like, and slightly cherry, and it's the heart of Guerlain L'Homme Idéal, Hypnotic Poison, and the modern cherry-amber genre (Lost Cherry, Cherry Smoke). Almond is dose-sensitive: at low levels it's gourmand, at high levels it's medicinal.",
    scentProfile: "Sweet, marzipan, slightly cherry and medicinal",
    family: "Gourmand",
    longevity: "Moderate",
    typicalUse:
      "Heart note in gourmands, cherry-amber compositions, and 'marzipan' florals; pairs with vanilla and tonka.",
    relatedNotes: ["tonka", "vanilla", "amber", "cinnamon"],
  },
];

export const noteSlugs = notes.map((n) => n.slug);

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function getNotesBySlugs(slugs: string[]): Note[] {
  return slugs.map(getNote).filter((n): n is Note => Boolean(n));
}
