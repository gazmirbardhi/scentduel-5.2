#!/usr/bin/env node
/**
 * Converts all SVG images to AVIF and generates new hero images for blog posts.
 * AVIF provides ~50% smaller files than WebP at equivalent quality.
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const ROOT = "/home/z/my-project/public/images";

// Convert all SVGs in a directory to AVIF
async function convertDir(dir, width = null) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".svg"));
  let count = 0;
  for (const file of files) {
    const svgPath = path.join(dir, file);
    const avifName = file.replace(/\.svg$/, ".avif");
    const avifPath = path.join(dir, avifName);
    let pipeline = sharp(svgPath);
    if (width) pipeline = pipeline.resize(width);
    await pipeline.avif({ quality: 65, effort: 4 }).toFile(avifPath);
    count++;
  }
  return count;
}

// Generate a hero image for a blog post — a wide banner with bottle silhouette
function genPostHero(filename, title, subtitle, color1, color2, accent) {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const safeSub = subtitle.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <linearGradient id="btl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.04)"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <!-- Ambient glow -->
  <ellipse cx="1100" cy="450" rx="500" ry="400" fill="url(#glow)"/>
  <!-- Large bottle silhouette on the right -->
  <g transform="translate(1180,200) scale(1.6)">
    <rect x="60" y="0" width="80" height="40" rx="4" fill="rgba(0,0,0,0.35)"/>
    <rect x="72" y="40" width="56" height="28" fill="rgba(0,0,0,0.4)"/>
    <path d="M 30 68 Q 30 90 55 102 L 55 360 Q 55 392 100 392 L 140 392 Q 185 392 185 360 L 185 102 Q 210 90 210 68 Z" fill="url(#btl)" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <rect x="65" y="200" width="110" height="2" fill="rgba(255,255,255,0.2)"/>
    <rect x="65" y="280" width="110" height="2" fill="rgba(255,255,255,0.2)"/>
  </g>
  <!-- Scent trail dots -->
  <g fill="rgba(255,255,255,0.15)">
    <circle cx="1050" cy="200" r="3"/>
    <circle cx="1000" cy="160" r="2.5"/>
    <circle cx="970" cy="120" r="2"/>
    <circle cx="920" cy="90" r="1.5"/>
  </g>
  <!-- Title text on the left -->
  <text x="100" y="430" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="bold" fill="rgba(255,255,255,0.97)">${safeTitle}</text>
  <text x="100" y="490" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="rgba(255,255,255,0.7)">${safeSub}</text>
  <rect x="100" y="520" width="120" height="4" fill="${accent}"/>
  <text x="100" y="580" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.5)">ScentDuel · Fragrance Review</text>
</svg>`;
  fs.writeFileSync(`${ROOT}/posts/${filename}.svg`, svg);
  return `${ROOT}/posts/${filename}.svg`;
}

async function main() {
  console.log("Converting existing SVGs to AVIF...");

  // Convert fragrance SVGs (keep at native 640x640)
  const fragCount = await convertDir(`${ROOT}/fragrances`, 640);
  console.log(`  ${fragCount} fragrance images`);

  // Convert OG default
  const ogCount = await convertDir(`${ROOT}/og`, 1200);
  console.log(`  ${ogCount} OG images`);

  // Convert author avatar
  const authorCount = await convertDir(`${ROOT}/author`, 200);
  console.log(`  ${authorCount} author images`);

  // Generate new post hero images (all posts, old + new)
  console.log("\nGenerating blog post hero images...");
  const heroes = [
    // Original 3 posts
    { file: "bleu-de-chanel-edp-review", title: "Bleu de Chanel EDP", sub: "The Benchmark Blue Fragrance", c1: "#1a3a5c", c2: "#0a1f33", ac: "#5b9bd5" },
    { file: "dior-sauvage-edp-review", title: "Dior Sauvage EDP", sub: "The Compliment Machine", c1: "#2a2a2a", c2: "#0a0a0a", ac: "#8a8a8a" },
    { file: "bleu-vs-sauvage-comparison", title: "Bleu vs. Sauvage", sub: "The Head-to-Head", c1: "#1a3a5c", c2: "#2a2a2a", ac: "#c9a86a" },
    // 4 new reviews
    { file: "creed-aventus-review", title: "Creed Aventus", sub: "The Pineapple King After 15 Years", c1: "#3d3528", c2: "#1a1610", ac: "#d4a574" },
    { file: "tom-ford-oud-wood-review", title: "Tom Ford Oud Wood", sub: "The Gateway Oud", c1: "#2e1f14", c2: "#1a0d05", ac: "#8b6332" },
    { file: "baccarat-rouge-540-review", title: "Baccarat Rouge 540", sub: "The Saffron-Amber Phenomenon", c1: "#6b1f2e", c2: "#3d0f1a", ac: "#e8b4a0" },
    { file: "terre-dhermes-review", title: "Terre d'Hermès", sub: "The Orange-Vetiver Masterpiece", c1: "#a64a1f", c2: "#5c2814", ac: "#e8a04a" },
    // 4 new comparisons
    { file: "aventus-vs-cdnim", title: "Aventus vs. CDNIM", sub: "The Clone Question", c1: "#3d3528", c2: "#1f3d1f", ac: "#c9a86a" },
    { file: "sauvage-edp-vs-elixir", title: "Sauvage EDP vs. Elixir", sub: "Which Concentration Wins?", c1: "#2a2a2a", c2: "#1a0d1a", ac: "#9a6a8a" },
    { file: "bleu-vs-terre", title: "Bleu vs. Terre d'Hermès", sub: "The Office Fragrance Showdown", c1: "#1a3a5c", c2: "#a64a1f", ac: "#c9a86a" },
    { file: "tf-vs-mfk-oud", title: "TF Oud Wood vs. MFK Oud", sub: "West vs. East Oud", c1: "#2e1f14", c2: "#6b1f2e", ac: "#c9a86a" },
  ];

  for (const h of heroes) {
    genPostHero(h.file, h.title, h.sub, h.c1, h.c2, h.ac);
    // Convert to AVIF
    await sharp(`${ROOT}/posts/${h.file}.svg`)
      .resize(1600, 900)
      .avif({ quality: 60, effort: 4 })
      .toFile(`${ROOT}/posts/${h.file}.avif`);
  }
  console.log(`  ${heroes.length} post hero images generated`);

  // Also convert the draft post image
  genPostHero("draft-best-winter", "Best Winter 2024", "The Complete Guide (Draft)", "#1a2e4a", "#0d1a2e", "#5b9bd5");
  await sharp(`${ROOT}/posts/draft-best-winter.svg`)
    .resize(1600, 900)
    .avif({ quality: 60, effort: 4 })
    .toFile(`${ROOT}/posts/draft-best-winter.avif`);

  console.log("\n✓ All images converted to AVIF.");
  console.log(`  Fragrances: ${fragCount} AVIF files`);
  console.log(`  Posts: ${heroes.length + 1} AVIF files`);
  console.log(`  OG: ${ogCount} AVIF file`);
}

main().catch((e) => { console.error(e); process.exit(1); });
