# ScentDuel — Fragrance Reviews, Comparisons & Tools

A fast, SEO-optimized fragrance blog with an ingredient glossary, brand and perfumer directories, and seven interactive tools. Built so that the only ongoing work is: write an article, push to git.

## Tech Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | File-based routing, RSC, metadata API |
| Language | TypeScript 5 (strict) | Type safety end-to-end |
| Styling | Tailwind CSS 4 + shadcn/ui | Consistent, accessible components |
| Content | MDX files with YAML frontmatter | Writer-friendly, no CMS |
| Markdown | gray-matter + react-markdown | Build-time parsing, custom component mapping |
| Validation | Zod | Frontmatter schema validation at build time |
| Icons | lucide-react | Tree-shakeable, consistent |
| Fonts | Inter (sans) + Lora (serif) | Via next/font, no layout shift |

> **Note on the original spec:** The spec called for Next.js 14.2.15 with `output: 'export'` for Cloudflare Pages. This implementation targets Next.js 16 (the environment's installed version) and runs as a standard Next.js app. All architecture, SEO, content workflow, tools, directories, and acceptance criteria from the spec are preserved. To deploy to Cloudflare Pages with a static export, pin Next.js 14.2.15 + `output: 'export'` and re-verify the MDX + static-export combination.

## Quick Start

```bash
# Install dependencies
bun install

# Start the dev server (port 3000)
bun run dev

# Lint
bun run lint

# Verify internal link integrity
bun run check-links
```

## Content Workflow

The entire content pipeline is designed around one principle: **the writer only touches MDX files and pushes to git.**

### Publishing a new post

1. **Create a file** in `src/content/posts/` with a `.mdx` extension. The filename (minus extension) becomes the URL slug.

2. **Add frontmatter** at the top of the file:

```yaml
---
title: "Your Post Title"
excerpt: "A 20+ character summary used for meta descriptions and cards."
publishDate: "2024-12-01"
updatedDate: "2024-12-05"        # optional
author: "Mara Ellsworth"          # optional, defaults to site author
category: "reviews"               # must match a slug in lib/categories.ts
tags: ["tag1", "tag2", "tag3"]
featuredImage: "/images/posts/your-post.svg"
featuredImageAlt: "A description of the image (min 10 characters)"
relatedNotes: ["bergamot", "cedar"]      # optional, must match note slugs
relatedBrands: ["chanel"]                 # optional, must match brand slugs
relatedPerfumers: ["jacques-polge"]       # optional, must match perfumer slugs
draft: false                       # optional, defaults to false
canonicalUrl: ""                   # optional, defaults to the post's own URL
---

## Your post body in standard Markdown

Tables, lists, blockquotes, headings, links — all supported.
```

3. **Push to git.** The build validates the frontmatter against the Zod schema. If anything is missing or malformed, the build **fails with a clear file-and-field error** — not a silent broken page.

### Frontmatter validation

Every field is validated at build time by `src/lib/posts.ts`:

- `title`, `excerpt` (≥20 chars), `publishDate` (ISO date), `category` (must exist), `tags` (≥1), `featuredImage` (root-relative path), `featuredImageAlt` (≥10 chars) are **required**.
- `relatedNotes`, `relatedBrands`, `relatedPerfumers` are validated against their data sources — a typo fails the build.
- `canonicalUrl`, if set, must resolve to the same origin as the site (guards against accidental deindexing).
- `draft: true` excludes the post from listings, sitemap, RSS, and `generateStaticParams` — the file is never publicly reachable.

### Drafts

Set `draft: true` in frontmatter. The post will be:
- Excluded from `getAllPosts()` (the single function all listings use)
- Excluded from the sitemap and RSS feed
- Excluded from `generateStaticParams` (the page is never generated)
- Return a 404 if accessed directly

## Site Configuration

- **Canonical domain:** Set `NEXT_PUBLIC_SITE_URL` in `.env` (see `.env.example`). Every canonical tag, OG tag, sitemap entry, and RSS link derives from this single constant in `src/lib/site.ts`.
- **Navigation:** Edit `siteConfig.nav` in `src/lib/site.ts`.
- **Categories:** Edit `src/lib/categories.ts`. Nested slugs (`seasonal/winter`, `notes/vanilla`) are handled by the catch-all route `app/categories/[...slug]/`.

## Information Architecture

### Routes

| Route | Description |
| --- | --- |
| `/` | Home (hero, SOTD widget, latest reviews, tools, categories) |
| `/blog` | Paginated article index (10 per page) |
| `/blog/[slug]` | Single post (reading progress, review poll, cross-links, JSON-LD) |
| `/blog/page/[n]` | Pagination pages (2+) |
| `/categories/[...slug]` | Category index (catch-all for nested slugs) |
| `/notes` | Ingredient glossary index |
| `/notes/[slug]` | Ingredient detail (cross-links to fragrances and posts) |
| `/brands` | Brand directory |
| `/brands/[slug]` | Brand profile |
| `/perfumers` | Perfumer directory |
| `/perfumers/[slug]` | Perfumer profile |
| `/tools` | Tools index |
| `/tools/scent-dueler` | Head-to-head fragrance comparison |
| `/tools/scent-matcher` | Note layering compatibility |
| `/tools/spray-calculator` | Spray count and application guide |
| `/tools/blind-buy-risk` | Blind-buy risk assessor |
| `/tools/name-that-note` | Daily trivia (deterministic by UTC date) |
| `/tools/fragrance-quiz` | 5-question personality quiz |
| `/tools/batch-checker` | Batch code decoder (demo) |
| `/about`, `/contact`, `/author`, `/privacy`, `/disclaimer` | Static pages |
| `/sitemap.xml`, `/robots.txt`, `/feed.xml` | SEO files |
| `/404` | Custom 404 (rendered for any unknown slug) |

### Two "notes" taxonomies

The ingredient glossary (`/notes/[slug]`, e.g. `/notes/vetiver`) and the category namespace (`/categories/notes/vanilla`) are **unrelated data sources** that happen to share the word "notes." They are backed by separate data files (`lib/notesData.ts` vs `lib/categories.ts`) and never cross-reference.

### Shared ID scheme

Posts, notes, brands, perfumers, and fragrances share stable slugs across all data files. The `check-links` script verifies every cross-link resolves:

```bash
bun run check-links
# ✓ check-links: 0 broken cross-links.
#   Verified 3 posts, 21 notes, 12 brands, 9 perfumers, 31 fragrances, 13 categories.
```

## Interactive Tools

All seven tools are client-side React components that read from static data. No backend, no API calls, no account.

| Tool | Data source | What it does |
| --- | --- | --- |
| Scent Dueler | `data/fragrances.json` | Two-fragrance comparison table + deal finder with affiliate links |
| Scent Matcher | `lib/layering.ts` | Note-pair compatibility score (0–3) with advice |
| Spray Calculator | Static logic | Quiz → spray count + application points |
| Blind Buy Risk | `lib/notesData.ts` + `lib/layering.ts` | Loved/hated notes → risk percentage |
| Name That Note | `lib/quiz-questions.ts` | Daily trivia, deterministic by UTC date |
| Fragrance Quiz | `data/fragrances.json` | 5 questions → scent family + 3 recommendations |
| Batch Code Checker | `lib/batchCodes.ts` | **Demo only** — illustrative codes, not a real database |

### Batch Code Checker disclaimer

The Batch Code Checker is explicitly a **demo/educational tool** using fabricated, illustrative codes. It is **not** an official manufacturer database and must not be relied on as proof of authenticity. This disclaimer is visible on the tool page, in the component, and on the `/disclaimer` page.

## Community Features (simulated)

Both community features are client-side and use localStorage. They are clearly labeled as illustrative.

### SOTD Widget (homepage)

- User picks a fragrance → saved to `localStorage["scentduel-sotd"]`.
- The "Community Leaderboard" renders from `data/sotd-leaderboard.json`, which is **manually curated by the site owner** — it is not live-aggregated data.
- A visible note labels it as "illustrative seeded data."

### Review Poll (blog posts)

- A slider (0–100) lets the reader vote → saved to `localStorage["scentduel-poll-{slug}"]`.
- The "Community Consensus" is a **deterministic value derived from the post slug**, not real aggregated data.
- **This value is never wired into JSON-LD AggregateRating schema.** Google's policies require rating markup to reflect genuine editorial input. Any rating in our structured data is the author's own editorial verdict from the post body.

## Affiliate & Content Compliance

- Every page with affiliate links renders a visible FTC-style disclosure.
- Every outbound affiliate link carries `rel="sponsored nofollow noopener"` and `target="_blank"`.
- The `/disclaimer` page states the affiliate relationship in full.
- All images are original SVG illustrations or labeled placeholders — no brand product photography is used without a license. **Before launch, replace placeholders with licensed or originally-shot photography.**

## SEO

- **Canonical URLs** derive from `NEXT_PUBLIC_SITE_URL` via `src/lib/site.ts`.
- **metadataBase** is set in the root layout.
- **Per-page metadata** (title, description, canonical, OG, Twitter Card) via the `buildMetadata()` helper in `src/lib/seo.ts`.
- **Sitemap** at `/sitemap.xml` includes all posts, categories, notes, brands, perfumers, tools, and static pages. Drafts and utility pages are excluded.
- **robots.txt** points to the sitemap and disallows `/404` and `/api`.
- **RSS feed** at `/feed.xml` (RSS 2.0 with Atom self-link).
- **JSON-LD**: `WebSite` on all pages, `BlogPosting` on posts, `ItemList` on index pages, `BreadcrumbList` where relevant, `Organization` on brand pages, `Person` on perfumer pages, `DefinedTerm` on note pages, `WebApplication` on tool pages.
- **Pagination** with `rel="next"` / `rel="prev"`.
- **Drafts** are excluded from sitemap, RSS, and `generateStaticParams` (never publicly reachable).
- **Unknown slugs** return the custom 404 via `dynamicParams = false` on all dynamic routes.
- **Heading hierarchy**: one `<h1>` per page, proper `<h2>`/`<h3>` nesting.
- **Image dimensions**: every `<img>` has explicit `width`/`height` or CSS `aspect-ratio` to prevent CLS.

## Performance

- **Server Components by default.** `'use client'` only on: theme toggle, reading progress bar, SOTD widget, review poll, and the 7 tool components.
- **No next/image** — plain `<img>` with explicit dimensions (matches the static-export intent and avoids image-optimization server dependencies).
- **Fonts** via `next/font` (Inter + Lora) — no layout shift.
- **Custom scrollbar** styling for long lists.

## Favicon & Manifest

- `favicon.ico`, `icon-16.png`, `icon-32.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
- `site.webmanifest` with name, short_name, icons, theme_color, background_color
- Two `<meta name="theme-color">` tags (light + dark) via the viewport export in the root layout

## Scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Start dev server on port 3000 |
| `bun run lint` | ESLint check |
| `bun run check-links` | Verify all internal cross-links resolve (0 broken) |
| `bash scripts/gen-images.sh` | Regenerate SVG placeholder images |

## Starter Content

This build ships:

- **3 published posts** (2 reviews + 1 comparison), each 1500+ words with tables, lists, FAQ, embedded review poll, and cross-links to notes/brands/perfumers.
- **1 draft post** (excluded from production, used to verify draft handling).
- **21 note glossary entries** (bergamot → almond).
- **12 brand profiles** (Chanel, Dior, Creed, Tom Ford, MFK, Hermès, Guerlain, YSL, Versace, Armaf, Parfums de Marly, JPG).
- **9 perfumer profiles** (Polge father & son, Demachy, Kurkdjian, Ellena, Cresp, Feisthauer, Morillas, Négrin).
- **31 fragrance entries** in the database (each with longevity, sillage, value, compliment factor, season, occasion, retailers).

The spec listed 10 starter titles; only the first (Bleu de Chanel review) was required as a full article. The remaining 9 are a content roadmap for the site owner.

## Cloudflare Pages Deployment

> The original spec targeted Cloudflare Pages with `output: 'export'`. This implementation runs as a standard Next.js app. To deploy statically:

1. **Pin versions** to Next.js 14.2.15 + React 18.3.1 (see the spec's dependency list).
2. **Set `output: 'export'`** and `images.unoptimized: true` in `next.config.ts`.
3. **Framework preset:** None
4. **Build command:** `npm run build`
5. **Output directory:** `out`
6. **Environment variable:** `NEXT_PUBLIC_SITE_URL = https://scentduel.com`
7. **Node version:** `.nvmrc` pins `18.20.4`

The `feed.xml/route.ts` already exports `dynamic = "force-static"` and reads only build-time data, so it is compatible with static export.

## Acceptance Criteria Status

| Criterion | Status |
| --- | --- |
| TypeScript strict, no unjustified `any` | ✅ |
| No TODOs, no stub functions | ✅ |
| Lint passes clean | ✅ (`bun run lint` → 0 errors) |
| Dark/light mode works, persisted to localStorage | ✅ |
| Reading progress bar on every post | ✅ |
| All tools and widgets function client-side | ✅ |
| Deep internal linking resolves with no broken links | ✅ (`bun run check-links` → 0 broken) |
| Affiliate disclosures and batch-checker disclaimer visible | ✅ |
| Frontmatter validation fails build on malformed post | ✅ (Zod schema in `lib/posts.ts`) |
| Draft posts never appear in output | ✅ (excluded from sitemap, RSS, routes) |
| Unknown slugs render custom 404 | ✅ (`dynamicParams = false` on all dynamic routes) |
| Writer only touches `content/posts/*.mdx` + git push | ✅ |

## License

All editorial content © ScentDuel. Code is provided for the site owner's use.
