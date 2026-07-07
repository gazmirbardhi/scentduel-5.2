#!/usr/bin/env bash
# Generates all SVG placeholder images for ScentDuel.
set -euo pipefail

cd /home/z/my-project/public/images

# OG default image
cat > og/default.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3d2b1f"/>
      <stop offset="100%" stop-color="#7a5c3e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="600" y="280" font-family="Georgia, serif" font-size="72" font-weight="bold" fill="#f5ede0" text-anchor="middle">ScentDuel</text>
  <text x="600" y="350" font-family="Helvetica, sans-serif" font-size="28" fill="#d4c4a8" text-anchor="middle">Fragrance Reviews, Comparisons &amp; Tools</text>
  <rect x="500" y="400" width="200" height="4" fill="#c9a86a"/>
</svg>
EOF

gen_frag() {
  local slug="$1" name="$2" color1="$3" color2="$4"
  cat > "fragrances/${slug}.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <linearGradient id="btl" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0.05)"/>
    </linearGradient>
  </defs>
  <rect width="640" height="640" fill="url(#bg)"/>
  <g transform="translate(220,140)">
    <rect x="60" y="0" width="80" height="40" rx="4" fill="rgba(0,0,0,0.3)"/>
    <rect x="70" y="40" width="60" height="30" fill="rgba(0,0,0,0.35)"/>
    <path d="M 40 70 Q 40 90 60 100 L 60 320 Q 60 350 100 350 L 140 350 Q 180 350 180 320 L 180 100 Q 200 90 200 70 Z" fill="url(#btl)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
  </g>
  <text x="320" y="540" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="rgba(255,255,255,0.95)" text-anchor="middle">${name}</text>
</svg>
EOF
}

gen_frag "bleu-de-chanel-edp" "Bleu de Chanel EDP" "#1a3a5c" "#0d1f33"
gen_frag "dior-sauvage-edp" "Dior Sauvage EDP" "#2a2a2a" "#0a0a0a"
gen_frag "dior-sauvage-elixir" "Sauvage Elixir" "#1a0d1a" "#3d1f2e"
gen_frag "creed-aventus" "Creed Aventus" "#3d3528" "#1a1610"
gen_frag "tom-ford-oud-wood" "Oud Wood" "#2e1f14" "#5c3d1f"
gen_frag "tom-ford-tobacco-vanille" "Tobacco Vanille" "#3d1f14" "#5c2818"
gen_frag "baccarat-rouge-540" "Baccarat Rouge 540" "#6b1f2e" "#3d0f1a"
gen_frag "terre-dhermes" "Terre d'Hermes" "#a64a1f" "#5c2814"
gen_frag "guerlain-vetiver" "Guerlain Vetiver" "#2e4a1f" "#1a2e10"
gen_frag "ysl-la-nuit-de-lhomme" "La Nuit de L'Homme" "#1a1a2e" "#0d0d1a"
gen_frag "versace-eros" "Versace Eros" "#1f3d5c" "#0d1f33"
gen_frag "armaf-club-de-nuit" "Club de Nuit Intense" "#1f3d1f" "#0d2e0d"
gen_frag "parfums-de-marly-layton" "Layton" "#3d2e1f" "#1a1410"
gen_frag "jpg-le-male-le-parfum" "Le Male Le Parfum" "#1f2e5c" "#0d1a33"
gen_frag "creed-green-irish-tweed" "Green Irish Tweed" "#2e5c1f" "#1a3d0d"
gen_frag "dior-homme-intense" "Dior Homme Intense" "#2a1f3d" "#1a0d2e"
gen_frag "tom-ford-neroli-portofino" "Neroli Portofino" "#1f5c6b" "#0d3d4a"
gen_frag "chanel-bleu-parfum" "Bleu de Chanel Parfum" "#0d1f33" "#050d1a"
gen_frag "tom-ford-black-orchid" "Black Orchid" "#1a0d1a" "#2e1f3d"
gen_frag "mfk-grand-soir" "Grand Soir" "#5c3d1f" "#2e1f0d"
gen_frag "hermes-voyage" "Voyage d'Hermes" "#3d5c6b" "#1f3d4a"
gen_frag "ysl-y-edp" "Y EDP" "#2a2a2a" "#1a1a1a"
gen_frag "versace-dylan-blue" "Dylan Blue" "#1f3d5c" "#0d2e4a"
gen_frag "armaf-hunter-intense" "Hunter Intense" "#3d1f1f" "#1f0d0d"
gen_frag "parfums-de-marly-herod" "Herod" "#3d1f14" "#1f0d0d"
gen_frag "creed-silver-mountain-water" "Silver Mountain Water" "#5c6b7a" "#3d4a5c"
gen_frag "dior-fahrenheit" "Fahrenheit" "#5c2e0d" "#3d1f05"
gen_frag "guerlain-lhomme-ideal" "L'Homme Ideal" "#3d2e1f" "#5c4a2e"
gen_frag "tom-ford-ombre-leather" "Ombre Leather" "#2e1f14" "#1a0d05"
gen_frag "jpg-ultra-male" "Ultra Male" "#1f1f3d" "#0d0d2e"
gen_frag "hermes-terre-intense-vetiver" "Terre Intense Vetiver" "#3d5c1f" "#1f3d0d"

gen_post() {
  local slug="$1" title="$2" color1="$3" color2="$4"
  cat > "posts/${slug}.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <g transform="translate(480,120)">
    <rect x="60" y="0" width="80" height="40" rx="4" fill="rgba(0,0,0,0.3)"/>
    <rect x="70" y="40" width="60" height="30" fill="rgba(0,0,0,0.35)"/>
    <path d="M 40 70 Q 40 90 60 100 L 60 380 Q 60 410 100 410 L 140 410 Q 180 410 180 380 L 180 100 Q 200 90 200 70 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
  </g>
  <text x="600" y="600" font-family="Georgia, serif" font-size="36" font-weight="bold" fill="rgba(255,255,255,0.95)" text-anchor="middle">${title}</text>
</svg>
EOF
}

gen_post "bleu-de-chanel-edp-review" "Bleu de Chanel EDP Review" "#1a3a5c" "#0d1f33"
gen_post "dior-sauvage-edp-review" "Dior Sauvage EDP Review" "#2a2a2a" "#0a0a0a"
gen_post "bleu-vs-sauvage-comparison" "Bleu vs Sauvage" "#3d2b1f" "#1a3a5c"
gen_post "draft-best-winter" "Best Winter 2024" "#1a2e4a" "#0d1a2e"

cat > author/mara-ellsworth.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#7a5c3e"/>
  <text x="100" y="115" font-family="Georgia, serif" font-size="64" font-weight="bold" fill="#f5ede0" text-anchor="middle">ME</text>
</svg>
EOF

echo "Generated $(ls fragrances/*.svg | wc -l) fragrance images, $(ls posts/*.svg | wc -l) post images."
