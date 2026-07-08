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
    | "Resinous"
    | "Green"
    | "Fruity"
    | "Aquatic";
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
  {
    slug: "jasmine",
    name: "Jasmine",
    summary:
      "The king of florals — sweet, indolic, and animalic. Picked at night and a pillar of every white-floral composition.",
    description:
      "Jasmine is the most-used floral in perfumery after rose, and the defining heart of the white-floral family. Two varieties dominate: Jasminum grandiflorum (grown in Grasse and Egypt, softer and sweeter) and Jasminum sambac (grown in India, greener and more indolic). The flowers must be picked before sunrise and processed immediately — it takes roughly 7 million blossoms to produce 1 kg of absolute. Jasmine's signature is its indole: an animalic, slightly fecal molecule that gives the flower its sensual, fleshy depth.",
    scentProfile: "Floral, sweet, indolic, animalic, slightly green",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in white florals, orientals, and almost every feminine composition; pairs with rose, tuberose, and neroli.",
    relatedNotes: ["rose", "tuberose", "neroli", "ylang-ylang"],
  },
  {
    slug: "ylang-ylang",
    name: "Ylang-Ylang",
    summary:
      "Tropical, banana-like, and intensely sweet — the sensual heart of oriental florals and the complement to jasmine.",
    description:
      "Ylang-ylang (Cananga odorata) is a tropical flower native to Southeast Asia, steam-distilled in fractions — 'extra', grades I, II, and III — with the first fraction (ylang-ylang extra) the most prized. It smells of ripe banana, jasmine, and creamy custard, with a slightly medicinal camphoraceous edge. Ylang-ylang is the bridge between white florals and orientals: it adds tropical sweetness without fruitiness, and it's the defining note in Chanel No. 5 and Jean Paul Gaultier Classique.",
    scentProfile: "Floral, sweet, creamy, banana-like, slightly medicinal",
    family: "Floral",
    longevity: "Long",
    typicalUse:
      "Heart note in orientals, white florals, and tropical compositions; pairs with jasmine, tuberose, and vanilla.",
    relatedNotes: ["jasmine", "tuberose", "vanilla", "bergamot"],
  },
  {
    slug: "tuberose",
    name: "Tuberose",
    summary:
      "Creamy, narcotic, and almost dangerously sweet — the most powerful white floral and the soul of Fracas.",
    description:
      "Tuberose (Polianthes tuberosa) is a Mexican flower now grown primarily in India. Its absolute is one of the most expensive in perfumery and smells of creamy gardenia, butter, and a distinctly indolic, almost rotting-sweet richness. Tuberose is the defining note of the white-floral genre at its most opulent — Robert Piguet Fracas, Frederic Malle Carnal Flower, and Le Labo Tubereuse 40 all rest on it. It's a dose-sensitive note: at low levels it's bridal, at high levels it's operatic.",
    scentProfile: "Creamy, sweet, indolic, buttery, narcotic",
    family: "Floral",
    longevity: "Long",
    typicalUse:
      "Heart note in white florals, orientals, and bold feminine compositions; pairs with jasmine and ylang-ylang.",
    relatedNotes: ["jasmine", "ylang-ylang", "orange-blossom", "neroli"],
  },
  {
    slug: "orange-blossom",
    name: "Orange Blossom",
    summary:
      "Neroli's sweeter, more indolic cousin — bright, honeyed, and the soul of bridal and Middle Eastern fragrances.",
    description:
      "Orange blossom absolute is solvent-extracted from the same bitter-orange flowers that produce neroli (steam-distilled) and petitgrain (leaf-distilled). The absolute is greener, sweeter, and more indolic than neroli, with a hay-like, almost tuberose-adjacent richness. It's the defining note of Middle Eastern bridal perfumery and the heart of Jean Paul Gaultier Scandal, Perris Mondiale, and many Lush and Jo Malone compositions. Orange blossom is also the natural source of methyl anthranilate, which gives many florals their 'orange flower' character.",
    scentProfile: "Floral, sweet, honeyed, slightly green and indolic",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in white florals, bridal fragrances, and Middle Eastern compositions; pairs with neroli, jasmine, and citrus.",
    relatedNotes: ["neroli", "jasmine", "bergamot", "tuberose"],
  },
  {
    slug: "geranium",
    name: "Geranium",
    summary:
      "Rosy, minty, and slightly green — the perfumer's bridge between floral heart and aromatic top.",
    description:
      "Geranium in perfumery is almost always Pelargonium graveolens, a leafy plant whose essential oil smells of rose, mint, and lemon — like rose distilled through fresh leaves. It's the perfumer's secret weapon in masculine fougères (where it softens lavender and oakmoss), in chypres (where it bridges bergamot and patchouli), and in 'masculine rose' compositions where it gives rosy depth without sweetness. Bourbon geranium (from Réunion) is the perfumery benchmark; Egyptian and Chinese are the workhorses.",
    scentProfile: "Rosy, minty, green, slightly lemony",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in fougères, chypres, and masculine rose compositions; pairs with lavender, patchouli, and bergamot.",
    relatedNotes: ["lavender", "bergamot", "patchouli", "rose"],
  },
  {
    slug: "osmanthus",
    name: "Osmanthus",
    summary:
      "Apricot, leather, and tea — the rare floral that reads as both fruity and animalic, and a perfumery favorite since 2000.",
    description:
      "Osmanthus is a Chinese flower whose absolute smells of ripe apricot, peach skin, and a leathery, suede-like undertone — a uniquely 'fruity-leathery' floral. It's become a perfumery darling since Jean-Claude Ellena championed it at Hermès (the Osmanthe Yunnan series), and it appears in Ormonde Jayne Osmanthus, Armani Privé Osmanthe, and many niche compositions. Osmanthus is also the source of beta-damascenone, a key odorant in rose and many fruits.",
    scentProfile: "Apricot, peach-skin, leathery, tea-like, floral",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in fruity florals, tea compositions, and niche florals; pairs with peach, jasmine, and bergamot.",
    relatedNotes: ["jasmine", "peach", "bergamot", "rose"],
  },
  {
    slug: "magnolia",
    name: "Magnolia",
    summary:
      "Lemony, creamy, and slightly spicy — the bridge between white florals and citrus, with a velvet-petal richness.",
    description:
      "Magnolia is a large-petaled flower whose scent sits between lemon, neroli, and tuberose — bright on top, creamy underneath, with a faintly spicy clove-like edge. It's rarely used as a natural absolute (expensive and unstable) and more often reconstructed as an accord of neroli, ylang-ylang, and ionones. Magnolia is the heart of Jo Malone Magnolia & Lily, Hermès Hermessence Muguet Porcelaine (adjacent), and several niche bridal compositions.",
    scentProfile: "Lemony, creamy, floral, slightly spicy",
    family: "Floral",
    longevity: "Moderate",
    typicalUse:
      "Heart note in soft florals, bridal compositions, and spring scents; pairs with neroli, ylang-ylang, and bergamot.",
    relatedNotes: ["neroli", "ylang-ylang", "bergamot", "jasmine"],
  },
  {
    slug: "pink-pepper",
    name: "Pink Pepper",
    summary:
      "Bright, rosy, and slightly resinous — the modern spice that opens half of all niche fragrances launched since 2010.",
    description:
      "Pink pepper (or Schinus molle) is not true pepper but the dried berry of the Peruvian peppertree. Its essential oil smells of bright, rosy, slightly resinous spice — closer to a floral-spicy note than a kitchen spice. Pink pepper has become the default 'modern' opening in niche perfumery: it's in Le Labo Santal 33, Byredo Gypsy Water, and dozens of perfumers' top notes since 2010. It pairs cleanly with citrus, woods, and rose without the heat of black pepper.",
    scentProfile: "Bright, rosy, resinous, slightly spicy",
    family: "Spicy",
    longevity: "Moderate",
    typicalUse:
      "Top note in niche compositions, modern florals, and woody blends; pairs with bergamot, cedar, and rose.",
    relatedNotes: ["bergamot", "cedar", "rose", "cardamom"],
  },
  {
    slug: "cardamom",
    name: "Cardamom",
    summary:
      "Sweet, aromatic, and slightly camphoraceous — the most 'perfumery' of the baking spices and the heart of oriental openings.",
    description:
      "Cardamom is the seed pod of Elettaria cardamomum, steam-distilled into an oil that smells of warm, sweet spice with a camphoraceous, almost eucalyptus edge. It's the most common 'spicy top' in oriental perfumery — the opening of Tom Ford Noir, Parfums de Marly Layton, and Penhaligon's Sartorial all rest on it. Cardamom is dose-sensitive: at low levels it's aromatic and clean, at high levels it's medicinal and curry-like.",
    scentProfile: "Sweet, aromatic, warm, slightly camphoraceous",
    family: "Spicy",
    longevity: "Moderate",
    typicalUse:
      "Top-to-heart note in orientals, fougères, and gourmands; pairs with vanilla, amber, and sandalwood.",
    relatedNotes: ["vanilla", "amber", "sandalwood", "bergamot"],
  },
  {
    slug: "clove",
    name: "Clove",
    summary:
      "Hot, sweet, and dental-medicated — the most phenolic of the baking spices and the soul of carnation accords.",
    description:
      "Clove (steam-distilled from Syzygium aromaticum buds) is dominated by eugenol — the same molecule that defines carnation, cinnamon leaf, and many 'dental' aromas. It's hot, sweet, and almost burning in concentration, and it's the structural backbone of every carnation accord (carnation is essentially clove + rose + ionone). Clove is also a fixative: it extends florals and gives them 'clove-carnation' depth. It's the heart of Paco Rabanne Calandre, many classic chypres, and the spicy opening of Opium.",
    scentProfile: "Hot, sweet, phenolic, slightly woody",
    family: "Spicy",
    longevity: "Long",
    typicalUse:
      "Heart note in carnation accords, spicy orientals, and chypres; pairs with rose, patchouli, and cinnamon.",
    relatedNotes: ["rose", "patchouli", "cinnamon", "geranium"],
  },
  {
    slug: "oakmoss",
    name: "Oakmoss",
    summary:
      "Damp forest, leather, and seaweed — the base of every classical chypre and the most regulated material in modern perfumery.",
    description:
      "Oakmoss is a lichen (Evernia prunastri) that grows on oak bark, extracted into a resin that smells of damp forest, leather, and a briny, iodine-like richness. It's the defining base note of the chypre family — Mitsouko, Yvresse, and Aromatics Elixir all rest on it. Oakmoss has been heavily restricted by IFRA due to allergenic atranorin and chloroatranorin, and modern 'oakmoss' is often treemoss, evernyl, or synthetic reconstructions. The regulation is why modern chypres smell softer and less 'wet-leather' than the classics.",
    scentProfile: "Damp, leathery, forest-floor, slightly briny",
    family: "Resinous",
    longevity: "Very Long",
    typicalUse:
      "Base note in chypres, fougères, and leather compositions; pairs with patchouli, bergamot, and labdanum.",
    relatedNotes: ["patchouli", "bergamot", "labdanum", "leather"],
  },
  {
    slug: "labdanum",
    name: "Labdanum",
    summary:
      "Amber, leather, and incense — the sticky cistus resin that's the real backbone of every 'amber' accord.",
    description:
      "Labdanum is the resin of the Cistus (rockrose) shrub, native to the Mediterranean. Historically harvested by combing the beards of goats that grazed on the shrubs, today it's solvent-extracted. Labdanum smells of warm amber, leather, and a smoky incense — and it's the structural backbone of every 'amber' accord (alongside benzoin and vanilla). It's also the source of ambrein, a key precursor to ambergris-like notes. Labdanum is the reason 'amber' fragrances have depth rather than just sweetness.",
    scentProfile: "Amber, leathery, smoky, balsamic",
    family: "Resinous",
    longevity: "Very Long",
    typicalUse:
      "Base note in ambers, chypres, and orientals; the structural backbone of the amber accord.",
    relatedNotes: ["amber", "benzoin", "oakmoss", "patchouli"],
  },
  {
    slug: "frankincense",
    name: "Frankincense (Olibanum)",
    summary:
      "Resinous, lemony, and church-smoky — the original incense and the soul of the oriental-resinous family.",
    description:
      "Frankincense (or olibanum) is the resin of Boswellia trees, primarily grown in Oman, Somalia, and Yemen. Steam-distilled, it smells of lemon-peel, pine, and church incense — the same material burned in religious ceremonies for millennia. In perfumery it's the defining note of the 'incense oriental' subfamily: Amouage Jubilation XXV, Comme des Garçons Avignon, and Chanel Coromandel all rest on it. The best frankincense (Boswellia sacra from Oman's Dhofar region) is resinous and slightly fruity; Somali is sharper and more lemony.",
    scentProfile: "Resinous, lemony, smoky, slightly piney",
    family: "Resinous",
    longevity: "Long",
    typicalUse:
      "Heart-to-base note in incense compositions, orientals, and liturgical-style fragrances; pairs with myrrh and amber.",
    relatedNotes: ["amber", "myrrh", "cedar", "saffron"],
  },
  {
    slug: "myrrh",
    name: "Myrrh",
    summary:
      "Bitter, medicinal, and warm-balsamic — frankincense's darker, more somber partner and a fixative for ambers.",
    description:
      "Myrrh is the resin of Commiphora trees, native to Arabia and East Africa, and like frankincense it has been used in religious and medicinal contexts for thousands of years. In perfumery it smells of warm balsam, bitter medicine, and a faint licorice-like sweetness — darker and more 'somber' than frankincense. Myrrh is used as a base note and fixative in ambers, incense compositions, and orientals, where it adds depth without sweetness. It's the heart of Amouage Interlude and a fixture in many Middle Eastern attars.",
    scentProfile: "Bitter, balsamic, medicinal, warm, slightly licorice",
    family: "Resinous",
    longevity: "Very Long",
    typicalUse:
      "Base note in ambers, incense compositions, and orientals; pairs with frankincense, amber, and labdanum.",
    relatedNotes: ["frankincense", "amber", "labdanum", "benzoin"],
  },
  {
    slug: "guaiac-wood",
    name: "Guaiac Wood",
    summary:
      "Smoky, rose-like, and slightly tea-leaf — the softest of the woods and the soul of 'smoky rose' compositions.",
    description:
      "Guaiac wood (Bulnesia sarmientoi, also spelled guaiacwood or guayacan) is steam-distilled from the heartwood of a South American tree. The oil smells of soft smoke, rose, and a faint tea-leaf sweetness — it's the 'rosy smoke' note behind many leather and rose compositions. Guaiac wood is also a mild natural source of guaiol, which gives it a 'soft' woody character distinct from cedar's dryness or sandalwood's creaminess. It's in Le Labo Rose 31, Tom Ford Oud Wood, and many masculine 'smoky woods.'",
    scentProfile: "Smoky, rose-like, soft woody, slightly tea-leaf",
    family: "Woody",
    longevity: "Long",
    typicalUse:
      "Heart-to-base note in smoky woods, rose compositions, and leathers; pairs with cedar, rose, and vetiver.",
    relatedNotes: ["cedar", "rose", "vetiver", "birch"],
  },
  {
    slug: "juniper",
    name: "Juniper (Berry)",
    summary:
      "Crisp, gin-like, and resinous — the soul of gin and the defining aromatic of masculine colognes.",
    description:
      "Juniper in perfumery usually means juniper berry essential oil, steam-distilled from the blue-black berries of Juniperus communis. It smells of crisp gin, pine, and a peppery resinous edge — unsurprising, since juniper is the defining botanical of gin itself. Juniper is the opening note of most classic 'gin and tonic' fragrances (Penhaligon's Juniper Sling, Commodity Gin) and a fixture of aromatic masculines. It's brighter and more 'alcoholic' than pine or cypress.",
    scentProfile: "Crisp, gin-like, resinous, slightly peppery",
    family: "Aromatic",
    longevity: "Moderate",
    typicalUse:
      "Top note in aromatic masculines, gin-tonic compositions, and colognes; pairs with bergamot, vetiver, and cedar.",
    relatedNotes: ["bergamot", "vetiver", "cedar", "lavender"],
  },
  {
    slug: "birch",
    name: "Birch (Tar)",
    summary:
      "Smoky, tarry, and leathery — the original Russian-leather material and the soul of the leather family.",
    description:
      "Birch tar is the dry distillation of birch bark, producing a thick, smoky, tarry oil that smells of campfire, leather, and a faint medicinal sweetness. It's the original 'Russian leather' base note — the material behind Cuir de Russie, Knize Ten, and the leather family's smokiest specimens. Birch tar is now heavily restricted by IFRA (it's a strong sensitizer), and modern leather compositions use it sparingly or substitute with synthetic isobutyl quinoline. Even at trace levels, it's instantly recognizable as 'leather.'",
    scentProfile: "Smoky, tarry, leathery, slightly medicinal",
    family: "Woody",
    longevity: "Very Long",
    typicalUse:
      "Base note in leather compositions, smoky woods, and bold orientals; pairs with leather, cedar, and patchouli.",
    relatedNotes: ["leather", "cedar", "patchouli", "guaiac-wood"],
  },
  {
    slug: "grapefruit",
    name: "Grapefruit",
    summary:
      "Bitter, juicy, and slightly sulfurous — the most 'adult' citrus and the soul of fresh masculines since 2000.",
    description:
      "Grapefruit oil is cold-pressed from the rind of Citrus paradisi, and it smells of bitter, juicy citrus with a characteristic faint sulfurous edge (from the mercaptan that gives grapefruit juice its slight 'catty' undertone). It's brighter and more bitter than orange or mandarin, which is why it reads as 'masculine' and 'sporty' — it's the opening of Terre d'Hermès (grapefruit + orange), Dolce & Gabbana Light Blue, and many fresh masculines. Pink grapefruit is softer and less sulfurous than white.",
    scentProfile: "Bitter, juicy, citrus, slightly sulfurous",
    family: "Citrus",
    longevity: "Short",
    typicalUse:
      "Top note in fresh masculines, sport fragrances, and colognes; pairs with bergamot, vetiver, and cedar.",
    relatedNotes: ["bergamot", "vetiver", "cedar", "lemon"],
  },
  {
    slug: "lemon",
    name: "Lemon",
    summary:
      "Sharp, bright, and clean — the most 'functional' citrus and the soul of every household-cleaner association.",
    description:
      "Lemon oil is cold-pressed from the rind of Citrus limon, primarily grown in Sicily and California. It smells of sharp, bright, slightly zesty citrus — sharper than bergamot, less complex than yuzu. Lemon is the most-used citrus in functional perfumery (cleaners, candles, soaps) because it reads as 'clean' to almost every culture, which gives it a slight 'dish soap' association in fine perfumery. In fine fragrance it's the opening of 4711, Acqua di Parma Colonia, and almost every classical cologne.",
    scentProfile: "Sharp, bright, zesty, clean citrus",
    family: "Citrus",
    longevity: "Short",
    typicalUse:
      "Top note in colognes, fresh compositions, and functional fragrances; pairs with bergamot, neroli, and cedar.",
    relatedNotes: ["bergamot", "neroli", "cedar", "mandarin"],
  },
  {
    slug: "mandarin",
    name: "Mandarin",
    summary:
      "Sweet, soft, and almost candy-like — the gentlest citrus and the most crowd-pleasing top note in feminine perfumery.",
    description:
      "Mandarin oil is cold-pressed from the rind of Citrus reticulata, primarily grown in Italy and Brazil. It's the sweetest and softest of the citrus oils — less sharp than lemon, less bitter than grapefruit, with a candy-like, almost floral sweetness. Mandarin is the opening of Thierry Mugler Angel (mandarin + bergamot + chocolate), Atelier Cologne Orange Sanguine, and many modern feminine compositions. Tangerine and clementine are similar; satsuma and 'green mandarin' are sharper and greener.",
    scentProfile: "Sweet, soft, candy-like citrus, slightly floral",
    family: "Citrus",
    longevity: "Short",
    typicalUse:
      "Top note in feminine florals, gourmands, and fruity compositions; pairs with bergamot, vanilla, and orange-blossom.",
    relatedNotes: ["bergamot", "orange-blossom", "vanilla", "neroli"],
  },
  {
    slug: "dark-chocolate",
    name: "Dark Chocolate",
    summary:
      "Cocoa-dry, bitter, and slightly smoky — the gourmand base that built Thierry Mugler Angel and the entire 'praline' genre.",
    description:
      "Dark chocolate in perfumery is built from cocoa absolute (extracted from roasted cacao beans) plus vanilla, patchouli, and synthetic furaneol. It smells of dry cocoa powder, roasted nuts, and a bitter, slightly smoky richness — distinctly 'dark' rather than milk chocolate. Cocoa absolute is the structural backbone of Thierry Mugler Angel (with patchouli and ethyl maltol), the entire 'praline-gourmand' genre, and modern chocolate-amber compositions like Paco Rabanne Black XS.",
    scentProfile: "Cocoa-dry, bitter, roasted, slightly smoky",
    family: "Gourmand",
    longevity: "Long",
    typicalUse:
      "Heart-to-base note in gourmands, ambers, and orientals; pairs with vanilla, patchouli, and tonka.",
    relatedNotes: ["vanilla", "patchouli", "tonka", "amber"],
  },
  {
    slug: "coffee",
    name: "Coffee",
    summary:
      "Roasted, bitter, and slightly smoky — the gourmand that pairs most naturally with leather, tobacco, and vanilla.",
    description:
      "Coffee in perfumery is usually coffee absolute (solvent-extracted from roasted beans) or a synthetic accord of furfuryl thiol, pyrazines, and guaiacol. It smells of roasted coffee, smoke, and a slight caramel sweetness — drier and more bitter than chocolate. Coffee pairs more naturally with 'adult' notes than other gourmands: it's the heart of Maison Margiela Coffee Break, Akkè Kappà Yodhè, and Jo Malone Oat & Cornflower (adjacent), and it's a common pairing with tobacco, leather, and whisky accords.",
    scentProfile: "Roasted, bitter, smoky, slightly caramel",
    family: "Gourmand",
    longevity: "Long",
    typicalUse:
      "Heart note in gourmands, orientals, and tobacco compositions; pairs with tobacco, vanilla, and tonka.",
    relatedNotes: ["tobacco", "vanilla", "tonka", "leather"],
  },
  {
    slug: "honey",
    name: "Honey",
    summary:
      "Sweet, beeswaxy, and slightly animalic — the gourmand-floral that's most natural in indolic white-floral compositions.",
    description:
      "Honey in perfumery is usually beeswax absolute (solvent-extracted from honeycomb) or a synthetic accord of phenylacetic acid, methyl anthranilate, and coumarin. It smells of sweet beeswax, pollen, and a faint animalic, almost urinous edge — the source of honey's slightly 'dirty' character. Honey pairs naturally with indolic florals (jasmine, orange blossom, tuberose), and it's the heart of Hermès Hermessence Ambre Narguillé (honey + amber), Jo Malone Nectarine Blossom & Honey, and Paco Rabanne Ultraviolet.",
    scentProfile: "Sweet, beeswaxy, animalic, slightly floral",
    family: "Gourmand",
    longevity: "Long",
    typicalUse:
      "Heart note in white florals, orientals, and gourmands; pairs with jasmine, orange-blossom, and amber.",
    relatedNotes: ["jasmine", "orange-blossom", "amber", "vanilla"],
  },
  {
    slug: "fig",
    name: "Fig",
    summary:
      "Milky, green, and coconut-sweet — the heart of the entire 'fig-leaf' family and the soul of Mediterranean summer scents.",
    description:
      "Fig in perfumery usually means fig leaf absolute (green, milky, slightly coconut) rather than fig fruit (sweeter, jam-like). The 'fig' note is built around the lactonic, milky character of the leaf and stem, with a green, slightly coconut-sweet profile. It's the defining note of the entire fig-leaf genre — Diptyque Philosykos, L'Artisan Parfumeur Premier Figuier, and Hermès Un Jardin en Méditerranée all rest on it. Fig is also one of the most 'photorealistic' notes in perfumery: it instantly reads as 'fig tree.'",
    scentProfile: "Milky, green, coconut-sweet, slightly woody",
    family: "Green",
    longevity: "Moderate",
    typicalUse:
      "Heart note in fig compositions, Mediterranean scents, and fresh unisex fragrances; pairs with cedar, bergamot, and violet-leaf.",
    relatedNotes: ["cedar", "bergamot", "violet-leaf", "musk"],
  },
  {
    slug: "mint",
    name: "Mint",
    summary:
      "Cool, camphoraceous, and almost menthol — the brightest aromatic top note and the soul of fresh sport compositions.",
    description:
      "Mint in perfumery is usually spearmint (Mentha spicata, sweet and herbal) or peppermint (Mentha piperita, sharper and more menthol). The oil smells of fresh, cool, slightly camphoraceous mint — the most 'cooling' aromatic in perfumery. Mint is the defining top note of fresh sport fragrances (Hermès Terre d'Hermès Eau Intense Vétiver, Paco Rabanne 1 Million Cologne) and a fixture of modern 'mint-julep' compositions. It's volatile and short-lived, but it gives an instant 'lift' to any composition.",
    scentProfile: "Cool, fresh, camphoraceous, slightly menthol",
    family: "Aromatic",
    longevity: "Short",
    typicalUse:
      "Top note in sport fragrances, fresh masculines, and aromatic compositions; pairs with bergamot, lavender, and vetiver.",
    relatedNotes: ["bergamot", "lavender", "vetiver", "juniper"],
  },
  {
    slug: "rosemary",
    name: "Rosemary",
    summary:
      "Herbal, camphoraceous, and slightly medicinal — the original cologne aromatic and the soul of Mediterranean herbs.",
    description:
      "Rosemary (Rosmarinus officinalis) is steam-distilled into an oil that smells of fresh, camphoraceous herbs with a faintly medicinal, woody edge. It's one of the four original cologne aromatics (with bergamot, lemon, and neroli) — the defining top of 4711, Acqua di Parma Colonia, and the entire Eau de Cologne tradition. Rosemary is also the soul of many Mediterranean masculine compositions, where it pairs naturally with lavender, cedar, and bergamot.",
    scentProfile: "Herbal, camphoraceous, medicinal, slightly woody",
    family: "Aromatic",
    longevity: "Moderate",
    typicalUse:
      "Top note in colognes, aromatic masculines, and Mediterranean compositions; pairs with bergamot, lavender, and cedar.",
    relatedNotes: ["bergamot", "lavender", "cedar", "juniper"],
  },
  {
    slug: "violet-leaf",
    name: "Violet Leaf",
    summary:
      "Green, peppery, and slightly cucumber — the natural counterpart to powdery violet flower and a niche-favorite green.",
    description:
      "Violet leaf absolute is solvent-extracted from the leaves of the violet plant (not the flower) and smells of fresh, green, slightly cucumber-like vegetation with a faint pepperiness. It's entirely different from the powdery ionone 'violet flower' note — green rather than floral. Violet leaf is the heart of Tom Ford Purple Violet, Creed Green Valley, and many niche green compositions. It's also the source of the 'green' top in many masculine fougères.",
    scentProfile: "Green, fresh, cucumber-like, slightly peppery",
    family: "Green",
    longevity: "Moderate",
    typicalUse:
      "Top-to-heart note in green compositions, modern fougères, and cucumber-melon accords; pairs with fig, bergamot, and iris.",
    relatedNotes: ["fig", "bergamot", "iris", "violet"],
  },
  {
    slug: "black-currant",
    name: "Black Currant",
    summary:
      "Tart, fruity, and slightly cat-like — the most 'perfumery' fruit and the soul of modern fruity-floral openings.",
    description:
      "Black currant in perfumery is usually a synthetic accord built around buchu leaf oil (which smells of black currant and cat urine) and various sulfuric fruity molecules. It smells of tart, juicy berry with a characteristic slightly 'catty' sulfurous edge — the same molecule that gives Sauvignon Blanc its signature. Black currant is the most-used fruit in modern perfumery: it's in Lancôme La Vie Est Belle, Mugler Aura, and dozens of fruity-florals since 2010. The 'catty' edge is dose-dependent — at high levels it's unmistakably cat pee.",
    scentProfile: "Tart, juicy, fruity, slightly sulfurous",
    family: "Fruity",
    longevity: "Moderate",
    typicalUse:
      "Top note in fruity florals, fresh compositions, and cocktail-style fragrances; pairs with bergamot, rose, and peach.",
    relatedNotes: ["bergamot", "rose", "peach", "mandarin"],
  },
  {
    slug: "peach",
    name: "Peach",
    summary:
      "Soft, fuzzy, and lactonic — the most 'lactonic' fruit and the soul of vintage aldehydic florals.",
    description:
      "Peach in perfumery is built around gamma-undecalactone (the so-called 'aldehyde C-14'), a synthetic lactone that smells of soft, creamy, slightly coconut-like peach skin. It's the defining lactonic fruit — softer and less tart than apricot, with a fuzzy, skin-like richness. Peach is the heart of vintage aldehydic florals (Chanel No. 5, Rochas Femme) and a fixture of the entire 'lactonic floral' family. Modern peach compositions include Tom Ford Peach Noise and a number of niche fruity florals.",
    scentProfile: "Soft, fuzzy, lactonic, slightly creamy",
    family: "Fruity",
    longevity: "Moderate",
    typicalUse:
      "Heart note in lactonic florals, fruity compositions, and vintage aldehydics; pairs with osmanthus, jasmine, and rose.",
    relatedNotes: ["osmanthus", "jasmine", "rose", "bergamot"],
  },
  {
    slug: "sea-salt",
    name: "Sea Salt",
    summary:
      "Briny, mineral, and slightly ozone — the soul of modern 'beach' fragrances and a niche favorite since 2010.",
    description:
      "Sea salt in perfumery is a synthetic accord built around salicylates, marine notes (like Calone), and slight mineral-iodine top notes. It smells of briny ocean, sun-warmed skin, and a faintly ozone, almost laundry-like freshness. Sea salt is the defining note of the modern 'beach' genre — Jo Malone Wood Sage & Sea Salt, Maison Margiela Beach Walk, and dozens of niche compositions since 2010. It pairs naturally with citrus, sage, and ambroxan for a 'salty skin' effect.",
    scentProfile: "Briny, mineral, ozone, slightly fresh",
    family: "Aquatic",
    longevity: "Moderate",
    typicalUse:
      "Top-to-heart note in beach compositions, aquatic fresh fragrances, and 'salty skin' accords; pairs with bergamot, rosemary, and ambroxan.",
    relatedNotes: ["bergamot", "ambroxan", "rosemary", "musk"],
  },
  {
    slug: "ambroxan",
    name: "Ambroxan",
    summary:
      "Ambery, musky, and almost weightless — the modern synthetic that defined the 'skin scent' genre since 2010.",
    description:
      "Ambroxan (ambroxide) is a synthetic molecule derived from sclareol (clary sage) or, historically, from ambergris. It smells of warm amber, soft musk, and a slightly salty, almost mineral cleanliness — weightless and 'transparent' compared to labdanum or natural ambergris. Ambroxan is the defining base of the modern 'skin scent' genre: Le Labo Another 13, Juliette Has A Gun Not A Perfume, and Escentric Molecules Molecule 02 all rest on it. It's also the dominant base note in Dior Sauvage (heavily dosed), which is why Sauvage projects without ever feeling 'heavy.'",
    scentProfile: "Ambery, musky, salty-mineral, transparent",
    family: "Amber",
    longevity: "Very Long",
    typicalUse:
      "Base note in modern skin scents, fresh masculines, and 'transparent' compositions; pairs with bergamot, sea-salt, and iso-e-super.",
    relatedNotes: ["bergamot", "sea-salt", "iso-e-super", "amber"],
  },
  {
    slug: "iso-e-super",
    name: "Iso E Super",
    summary:
      "Velvety, cedar-like, and subtly warm — the 'transparent wood' that defined the niche-minimalist genre.",
    description:
      "Iso E Super is a synthetic woody molecule (a vetiveryl acetate relative) that smells of soft, velvety cedar with a slightly warm, almost pepper-dusty edge. It's notable for being 'transparent' — most people can't smell it strongly, but it gives compositions a 'warm fuzzy' aura that's instantly recognizable. Iso E Super is the defining note of the entire niche-minimalist genre: Escentric Molecules Molecule 01 is pure Iso E Super, and it's the base of Terre d'Hermès, Aventus, and Le Labo Santal 33.",
    scentProfile: "Velvety, cedar-like, warm, subtly pepper-dusty",
    family: "Woody",
    longevity: "Very Long",
    typicalUse:
      "Base note in modern woods, niche-minimalist compositions, and transparent masculines; pairs with cedar, ambroxan, and vetiver.",
    relatedNotes: ["cedar", "ambroxan", "vetiver", "bergamot"],
  },
  {
    slug: "civet",
    name: "Civet",
    summary:
      "Fecal, animalic, and deeply warm — the most powerful fixative in classical perfumery, now universally synthetic.",
    description:
      "Natural civet comes from the perineal gland of the African civet cat, and historically it was scraped from caged animals — a practice now banned in most of the world. Modern 'civet' is synthetic (civetone and related macrocyclic musks). It smells of fecal, animalic, leathery warmth — stronger and more 'fecal' than castoreum. Civet was the secret fixative in almost every classical floral (Joy, N°5 vintage, Shalimar), where it gave compositions 'depth' and 'skin intimacy.' Used at trace levels it's indolic-warm; at high levels it's unmistakably fecal.",
    scentProfile: "Fecal, animalic, warm, leathery",
    family: "Musky",
    longevity: "Very Long",
    typicalUse:
      "Base note and fixative in classical florals, orientals, and leather compositions; pairs with rose, jasmine, and musk.",
    relatedNotes: ["rose", "jasmine", "musk", "ambergris"],
  },
  {
    slug: "ambergris",
    name: "Ambergris",
    summary:
      "Marine, tobacco-like, and warmly animalic — the legendary whale secretion that's the most prized fixative in perfumery.",
    description:
      "Ambergris is a waxy secretion produced in the digestive tract of sperm whales, ejected into the ocean and aged by sun and salt for years. Natural ambergris is rare, expensive, and ethically fraught (it's only collected after beaching, but whale populations are protected). It smells of marine, tobacco-like, slightly fecal warmth with a 'sweet ocean' character that's unlike anything else. Synthetic ambergris (ambroxan, ambroxide, cetalox) is now the universal substitute. Natural ambergris tincture appears in a handful of ultra-luxury compositions; everything else uses the synthetics.",
    scentProfile: "Marine, tobacco-like, warm, slightly animalic",
    family: "Amber",
    longevity: "Very Long",
    typicalUse:
      "Base note and fixative in luxury compositions, ambers, and marine florals; pairs with ambroxan, musk, and rose.",
    relatedNotes: ["ambroxan", "musk", "rose", "amber"],
  },
];

export const noteSlugs = notes.map((n) => n.slug);

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function getNotesBySlugs(slugs: string[]): Note[] {
  return slugs.map(getNote).filter((n): n is Note => Boolean(n));
}
