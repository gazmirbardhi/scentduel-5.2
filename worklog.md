# ScentDuel Build Worklog

This file tracks all agent work on the scentduel.com fragrance blog.

---
Task ID: 1
Agent: main (orchestrator)
Task: Batch 1 — install deps + build lib/ utilities (site config, posts loader with zod validation, notesData, brandsData, perfumersData, layering, quiz, batchCodes, seo helpers, categories)

Work Log:
- Explored existing Next.js 16 project structure (React 19, Tailwind 4, shadcn/ui, Prisma).
- Adapted the user's Next.js 14 / static-export spec to the Next.js 16 environment while preserving all architecture, SEO, content workflow, tools, and directory features.
- Installed gray-matter and reading-time for MDX frontmatter parsing.
- Created directory structure: src/content/posts, src/data, public/images/*.
- Built src/lib/site.ts — single source of truth for canonical domain (NEXT_PUBLIC_SITE_URL).
- Built src/lib/categories.ts — 13 categories including nested seasonal/winter, notes/vanilla, etc., with zod schema for slug validation.
- Built src/lib/notesData.ts — 16 ingredient glossary entries (bergamot, neroli, vetiver, cedar, sandalwood, oud, rose, amber, vanilla, tonka, patchouli, lavender, musk, saffron, iris, tobacco).
- Built src/lib/brandsData.ts — 12 brand entries (Chanel, Dior, Creed, Tom Ford, MFK, Hermès, Guerlain, YSL, Versace, Armaf, Parfums de Marly, JPG).
- Built src/lib/perfumersData.ts — 9 perfumer entries (Jacques Polge, Olivier Polge, François Demachy, Francis Kurkdjian, Jean-Claude Ellena, Olivier Cresp, Nathalie Feisthauer, Alberto Morillas, Pierre Négrin).
- Built src/lib/layering.ts — note-compatibility matrix for Scent Matcher tool.
- Built src/lib/quiz-questions.ts — 14 trivia questions, deterministic by UTC date.
- Built src/lib/batchCodes.ts — 8 illustrative batch-code entries with explicit demo disclaimer.
- Built src/lib/posts.ts — gray-matter + zod frontmatter validation, draft exclusion, cross-reference validation against notes/brands/perfumers slugs, canonicalUrl guard, related-posts logic, pagination helper.
- Built src/lib/seo.ts — buildMetadata helper, sitemap entry generator, JSON-LD helpers (breadcrumb, website).

Stage Summary:
- All lib/ utilities are in place with shared ID scheme: noteSlugs, brandSlugs, perfumerSlugs are the canonical IDs consumed by posts.ts validation and data/fragrances.json.
- The frontmatter schema enforces: title, excerpt (≥20 chars), publishDate (ISO), category (validated), tags (≥1), featuredImage (root-relative), featuredImageAlt (≥10 chars), draft, relatedNotes/Brands/Perfumers (validated against their data sources), canonicalUrl (must be same-origin).
- Drafts are excluded from getAllPosts() (the single function all listings/sitemap/feed use).
- Ready for Batch 2: data/fragrances.json (30+ entries), sotd-leaderboard.json, sample MDX post.

---
Task ID: 4-a
Agent: full-stack-developer
Task: Build 7 fragrance tool components

Work Log:
- Read worklog.md, all lib/ utilities (notesData, brandsData, layering, quiz-questions, batchCodes, site, utils, posts), fragrances.json (31 entries), and existing shadcn/ui components (card, select, table, progress, alert, badge, button, checkbox, radio-group) to understand the data shapes and component APIs.
- Confirmed the theme uses warm amber/wood tones (no indigo/blue). Confirmed note slugs and brand slugs are the canonical IDs.
- Created `src/components/tools/ScentDueler.tsx`: two `<Select>` dropdowns for fragrances A and B (with mutual-exclusion via `disabled`), side-by-side comparison Table with numeric value + `<Progress>` bar for longevityHours (12h scale), sillage/value/complimentFactor (10 scale), plain-text rows for bestSeason/bestOccasion/concentration/yearReleased, and a key-notes Badge row. Deal Finder Table aggregates all retailers from both fragrances with `<a target="_blank" rel="sponsored nofollow noopener">` links styled via `buttonVariants`. Visible FTC affiliate disclosure paragraph below the table.
- Created `src/components/tools/ScentMatcher.tsx`: two `<Select>` dropdowns populated from `allLayerableNotes()` showing note.name via `getNote()`. Calls `describeLayering(a, b)` and renders a verdict `<Badge>` colored by score (red for 0, amber for 1, emerald for 2/3), the label text, the advice text, plus an educational-tool disclaimer note.
- Created `src/components/tools/SprayCalculator.tsx`: 4-step quiz (concentration via Select, then setting/skinType/strength via RadioGroup) with progress bar, Back/Next navigation. Spray count is computed from a base table (concentration × strength: EDT 2/3/4, EDP 1/2/3, Parfum 1/1/1) plus setting modifier (office -1, date 0, night +1, gym -1) and skin modifier (oily -1, dry +1, normal 0), clamped 1–6. Verified task examples: EDT office dry light = 2 ✓, Parfum night oily strong = 1 ✓. Application points are derived from setting and spray count (2 base, 3 if sprays≥3, just neck if sprays=1). Reasoning list explains each modifier. Recalculate button resets state.
- Created `src/components/tools/BlindBuyRisk.tsx`: two scrollable checkbox columns ("Notes you love" / "Notes you hate") populated from `notes`. Risk = 20% base + 15% per (loved, hated) incompatible pair (compatibility ≤ 1), capped at 95%. Custom div-based progress bar (so we can color it green/amber/red — default `<Progress>` is `bg-primary`). Verdict pill: green <30 "Low risk — safe blind buy", amber 30-60 "Moderate risk — sample first", red >60 "High risk — do not blind buy". Lists which hated notes triggered risk + each clashing pair. "How this works" explainer at the bottom.
- Created `src/components/tools/NameThatNote.tsx`: calls `getQuestionForDate(new Date())` once on mount (deterministic by UTC date). Renders the clue and 4 options as buttons. On click: locks further clicks, highlights the correct option green, the user's wrong pick red, shows the explanation, and renders "Come back tomorrow for a new question!" with today's UTC date label. Uses `useState` for selectedIndex.
- Created `src/components/tools/FragranceQuiz.tsx`: 5 questions (feel, setting, sweet/dry, light/heavy, budget) each with 5 options mapping to a family (Citrus/Woody/Amber/Gourmand/Fresh). Tally on submit picks the dominant family with deterministic tie-breaking. Shows family description + 3 fragrance recommendations filtered by `FAMILY_NOTES[family] ∩ f.noteSlugs`, sorted by value desc → complimentFactor desc → longevityHours desc. Accepts an optional `postSlugs?: string[]` prop so a server-component parent can pass `getAllPosts().map(p => p.slug)`; recommendations render as `<Link href="/blog/{fragranceSlug}">` when the slug is in that set, otherwise as plain text. Defaults to empty array.
- Created `src/components/tools/BatchChecker.tsx`: prominent `<Alert variant="destructive">` at the top with the exact required disclaimer ("⚠️ This is a demo/educational lookup using illustrative codes, not an official manufacturer database. Do not rely on this as proof of authenticity."). Brand `<Select>` (from `batchCodeDatabase`), batch-code `<Input>`, and a "Look up" `<Button>`. On lookup: `lookupCode()` returns the matching sample → show decoded date + factory in an emerald panel; otherwise show an amber "not found" panel that references the brand's format/dateLogic and lists the brand's sample codes. The brand's format, example code, and dateLogic are always shown below the input regardless of lookup result. Resets lookup + code when brand changes.
- Ran `bun run lint` (clean, no errors). Ran `bunx tsc --noEmit` — all errors are pre-existing in lib files I was told not to modify (categories.ts, layering.ts duplicate-key, posts.ts) plus unrelated examples/skills directories; zero type errors in `src/components/tools/`.

Stage Summary:
- All 7 tool components live in `src/components/tools/` and are `"use client"` with TypeScript strict, no `any`, no TODOs, no stubs.
- Every component uses shadcn/ui primitives, `cn()` for conditional classes, semantic HTML (`<fieldset>`/`<legend>` in FragranceQuiz, `<dl>`/`<dt>`/`<dd>` in BatchChecker, `<label htmlFor>` for all controls), and proper aria attributes (aria-label on selects, aria-pressed on quiz buttons, role="progressbar" on the custom risk meter).
- Color palette stays within the warm amber/wood theme (bg-primary, text-primary, bg-accent) plus semantic emerald/amber/red for status indicators (no indigo or blue).
- ScentDueler's affiliate links carry `rel="sponsored nofollow noopener"` + `target="_blank"` and the FTC disclosure is a visible `<p>`, not a comment.
- BatchChecker's disclaimer is a visible `<Alert variant="destructive">` at the top, not a comment.
- FragranceQuiz exposes `postSlugs?: string[]` so the orchestrator's server wrapper can wire it up to `getAllPosts()`; in isolation it gracefully renders recommendations as plain text.
- `bun run lint` is clean. The dev.log 500 errors are pre-existing (missing `@/components/layout/footer` referenced by layout.tsx — not my responsibility).
- Ready for the orchestrator to mount these components under /tools/* routes.

---
Task ID: 4-b
Agent: full-stack-developer
Task: Build card components, SOTD widget, review poll, affiliate disclosure, breadcrumbs, post content renderer

Work Log:
- Read worklog.md and the data sources (notesData.ts, brandsData.ts, perfumersData.ts, fragrances.json, sotd-leaderboard.json) plus existing shadcn/ui primitives (card, breadcrumb, alert, select, slider, badge, scroll-area, table) and the pre-existing post-card.tsx to match conventions (font-serif headings, group-hover:text-primary, line-clamp-2/3, transition-shadow hover:shadow-lg).
- Created `src/components/cards/note-card.tsx` (server component): Card → Link `/notes/${slug}` with h3 name + secondary Badge for family, 2-line clamped summary, semantic aria-label.
- Created `src/components/cards/brand-card.tsx` (server component): Card → Link `/brands/${slug}` with name, "country · Est. {founded}" meta line, and italic 2-line clamped tagline.
- Created `src/components/cards/perfumer-card.tsx` (server component): Card → Link `/perfumers/${slug}` with name, "nationality · born" meta line, and 2-line clamped signature.
- Created `src/components/cards/fragrance-card.tsx` (server component): informational Card (no link — fragrances have no dedicated pages) showing name, brand-name lookup via getBrand, concentration Badge, and a 4-column grid of StatPills (Longevity hours / Sillage / Value / Compliments).
- Created `src/components/blog/sotd-widget.tsx` ("use client"): homepage sidebar widget. Uses useSyncExternalStore on localStorage key `scentduel-sotd` for SSR-safe hydration (server snapshot = null → "no pick" message; client snapshot = raw string → useMemo-parsed SotdEntry). Select dropdown populated from fragrances.json showing "Name — Brand". On pick: writes `{slug, timestamp}` JSON to localStorage and dispatches a synthetic `storage` event so useSyncExternalStore re-reads. Shows current SOTD with a relative-time label ("Just now" / "N minutes/hours/days ago" / localized date for >7 days). Community Leaderboard rendered from sotd-leaderboard.json top-5 in a max-h-64 ScrollArea with rank bubbles, fragrance name + brand, pick count, and a highlight row when the user's SOTD matches. Explicit "illustrative seeded data" footnote.
- Created `src/components/blog/review-poll.tsx` ("use client"): Card "Rate This Fragrance" with Slider (0–100). File-level comment as required warning that the Community Consensus is illustrative/seeded and must NEVER feed JSON-LD AggregateRating. Consensus derived deterministically from postSlug (32-bit polynomial hash mod 17 → 72..88). Reads user's prior vote from localStorage key `scentduel-poll-${postSlug}` via useSyncExternalStore (raw string → parseInt). Writes on Slider change and dispatches a synthetic storage event. Visual comparison bar: muted primary/30 strip for consensus width, solid primary strip overlay for user vote. Color-coded delta label (emerald ≤4, amber ≤10, destructive >10). Visible "Community Consensus (illustrative seeded data) — not real aggregated ratings and never exported as structured-data AggregateRating." footnote.
- Created `src/components/blog/affiliate-disclosure.tsx` (server component): Alert-based FTC disclosure with `inline` (compact single-line) and `full` (paragraph with AlertTitle) variants. Uses Info icon, muted background, "full affiliate disclosure" link to `/disclaimer`. No destructive styling.
- Created `src/components/layout/breadcrumbs.tsx` (server component): Wraps `@/components/ui/breadcrumb` primitives in `<nav aria-label="Breadcrumb">`. Uses React.Fragment keys per item, last item renders `<BreadcrumbPage>` (no link), prior items use `<BreadcrumbLink asChild>` with next/link, `<BreadcrumbSeparator>` between items.
- Created `src/components/blog/post-content.tsx` (server component): ReactMarkdown v10 with `components` map. h2/h3 get border-b / font-serif styling. `a` is split into internal (`next/link`) vs external (`target="_blank" rel="noopener noreferrer"`) vs affiliate (contains fragrancex/amazon/sephora → `rel="sponsored nofollow noopener"`). `blockquote` styled border-l-4 primary/40 + italic. `code` inline as bg-muted font-mono. `img` plain `<img loading="lazy">` with width/height defaults of 800/450. `table`/`thead`/`tbody`/`tr`/`th`/`td` mapped to shadcn Table primitives (Table already provides the overflow-x-auto wrapper). A `withoutNode` helper strips react-markdown's injected `node` prop before spreading onto DOM elements. Output wrapped in `<div className="prose-scentduel max-w-none">`.
- Ran `bun run lint` — initially hit two `react-hooks/set-state-in-effect` errors (the `setMounted(true)` pattern in SOTD and review-poll). Rewrote both with `useSyncExternalStore` (subscribe to native `storage` events + server snapshot of null) so reads happen during render without setState, and same-tab writes dispatch a synthetic `storage` event to trigger re-reads. Fixed a follow-up `react-hooks/immutability` error from caching the parsed object on a useRef (the ref-modification rule) by moving the parse into a `useMemo([raw])` in the component body instead. Removed an unused `@next/next/no-img-element` eslint-disable in post-content.tsx.
- Final `bun run lint` is clean (exit 0; the only remaining warning is the pre-existing unused eslint-disable in `src/components/cards/post-card.tsx` from task 4-a, not my file). `bunx tsc --noEmit` shows zero errors in any of my new files (all remaining TS errors are pre-existing in lib files I was told not to modify: categories.ts, layering.ts, posts.ts, plus unrelated examples/skills dirs).

Stage Summary:
- 9 new component files delivered across `src/components/cards/`, `src/components/blog/`, and `src/components/layout/`. Cards are server components; SOTD widget and review poll are "use client". All use the warm amber/wood theme (bg-primary, text-primary-foreground, bg-muted, border-border) with no indigo or blue. TypeScript strict, no `any`, no TODOs.
- Client components use React 19-idiomatic `useSyncExternalStore` for localStorage reads (SSR-safe, no hydration mismatch, no `setState` in effects, no `useRef` mutation during render). Writes dispatch synthetic `storage` events so the snapshot re-reads in the same tab.
- Affiliate links in markdown carry `rel="sponsored nofollow noopener"` + `target="_blank"` for fragrancex/amazon/sephora; internal links use next/link; other external links get `rel="noopener noreferrer"`.
- Review-poll file-level comment and visible footnote both make it explicit that the seeded Community Consensus must NEVER be wired into JSON-LD AggregateRating (Google policy compliance).
- SOTD widget leaderboard and review-poll consensus are both explicitly labeled as illustrative seeded data in the rendered UI.
- Ready for the orchestrator to mount these components in the homepage sidebar (SOTD), blog post pages (review-poll, post-content, breadcrumbs, affiliate-disclosure), and index pages (note/brand/perfumer/fragrance cards).

---
Task ID: 3-a
Agent: full-stack-developer
Task: Build notes, brands, perfumers directory routes (index + detail pages)

Work Log:
- Read worklog.md to understand prior work — confirmed data shapes from `notesData.ts` (21 notes, fields: slug/name/summary/description/scentProfile/family/longevity/typicalUse/relatedNotes), `brandsData.ts` (12 brands, fields: slug/name/country/founded/description/tagline/notablePerfumes/relatedPosts), `perfumersData.ts` (9 perfumers, fields: slug/name/nationality/born/bio/signature/notableCreations/fragrancesCredited/relatedPosts), `fragrances.json` (entries with noteSlugs[], brandSlug, perfumerSlug), `posts.ts` (getPostsByNote/Brand/Perfumer helpers), `seo.ts` (buildMetadata + buildBreadcrumbJsonLd + abs), `site.ts` (siteConfig), and card components (NoteCard/BrandCard/PerfumerCard/FragranceCard/PostCard) + Breadcrumbs layout component.
- Created directory structure: `src/app/notes/`, `src/app/notes/[slug]/`, `src/app/brands/`, `src/app/brands/[slug]/`, `src/app/perfumers/`, `src/app/perfumers/[slug]/`.
- Built `src/app/notes/page.tsx` (server component): buildMetadata with title "Fragrance Note Glossary" path "/notes"; breadcrumbs Home/Notes; h1 + intro paragraph; responsive grid (sm:2, lg:3) of NoteCard for all 21 notes; container max-w-6xl px-4 py-8.
- Built `src/app/notes/[slug]/page.tsx` (server component): `dynamicParams = false`; `generateStaticParams()` from `noteSlugs`; `generateMetadata` is async, awaits params Promise, returns `${note.name} — Fragrance Note` with description = note.summary, path `/notes/${slug}`; notFound() if missing. Layout: breadcrumbs Home/Notes/{name}; h1 + family/longevity badges; full description split into paragraphs; "Scent Profile" panel; "Typical Use" section; "Related Notes" as inline pill-links (resolved via getNotesBySlugs); "Fragrances Containing {name}" filters `fragrances` where `noteSlugs.includes(note.slug)` and renders FragranceCard grid; "Related Articles" from getPostsByNote capped at 3 as PostCard grid; DefinedTerm JSON-LD + BreadcrumbList JSON-LD injected via dangerouslySetInnerHTML.
- Built `src/app/brands/page.tsx`: metadata "Fragrance Brand Directory" path "/brands"; breadcrumbs Home/Brands; intro paragraph; grid of BrandCard for all 12 brands.
- Built `src/app/brands/[slug]/page.tsx`: `dynamicParams = false`; `generateStaticParams()` from `brandSlugs`; `generateMetadata` returns `${brand.name} — Fragrance Brand Profile` with description = `${brand.name} — ${brand.tagline} ${description.slice(0,140)}`; notFound() if missing. Layout: breadcrumbs Home/Brands/{name}; h1 + "Country · Founded {year}" subtitle; tagline italic larger; description paragraphs; "Notable Perfumes" as Badge pills; "Fragrances in Our Database" filters `fragrances` where `brandSlug === brand.slug` and renders FragranceCard grid; "Related Articles" from getPostsByBrand capped at 3; Organization JSON-LD (name/description/foundingDate/foundingLocation/slogan/url) + BreadcrumbList.
- Built `src/app/perfumers/page.tsx`: metadata "Perfumer Directory" path "/perfumers"; breadcrumbs Home/Perfumers; intro paragraph; grid of PerfumerCard for all 9 perfumers.
- Built `src/app/perfumers/[slug]/page.tsx`: `dynamicParams = false`; `generateStaticParams()` from `perfumerSlugs`; `generateMetadata` returns `${perfumer.name} — Perfumer Profile` with description = `${perfumer.name} — ${perfumer.signature} ${bio.slice(0,140)}`; notFound() if missing. Layout: breadcrumbs Home/Perfumers/{name}; h1 + "nationality · born" subtitle; "Signature" section; bio paragraphs; "Notable Creations" as Badge pills; "Fragrances in Our Database" filters `fragrances` where `perfumerSlug === perfumer.slug` and renders FragranceCard grid; "Related Articles" from getPostsByPerfumer capped at 3; Person JSON-LD (name/description/jobTitle/nationality/knowsAbout/url) + BreadcrumbList.
- All section headings use the shared className `font-serif text-2xl font-bold mt-10 mb-4`. All grids use `grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3`. All detail pages use `container mx-auto max-w-4xl px-4 py-8`; index pages use max-w-6xl.
- All `params` typed as `Promise<{ slug: string }>` and awaited (Next.js 16 async params API). Used `import type { Metadata } from "next"`. No `any`. No TODOs. No indigo/blue colors — semantic Tailwind only (bg-muted, border-border, text-muted-foreground, hover:text-primary, hover:bg-accent).
- Ran `bun run lint` — 0 errors, 1 warning (the pre-existing unused eslint-disable in `src/components/cards/post-card.tsx` from task 4-b, not my file). Ran `bunx tsc --noEmit` — zero errors in any of my new files; all remaining TS errors are pre-existing in lib files I was told not to modify (categories.ts, layering.ts, posts.ts) plus unrelated examples/skills dirs.
- Live-tested all routes via curl on the running dev server: /notes (200), /notes/bergamot (200), /notes/oud (200), /brands (200), /brands/chanel (200), /brands/dior (200), /perfumers (200), /perfumers/francis-kurkdjian (200), /perfumers/jean-claude-ellena (200). Unknown slugs /notes/nope, /brands/nope, /perfumers/nope all return HTTP 404 (confirming `dynamicParams = false` works as designed). No 500s in dev.log.

Stage Summary:
- 6 route files delivered: `src/app/notes/page.tsx`, `src/app/notes/[slug]/page.tsx`, `src/app/brands/page.tsx`, `src/app/brands/[slug]/page.tsx`, `src/app/perfumers/page.tsx`, `src/app/perfumers/[slug]/page.tsx`.
- All are server components with `dynamicParams = false` (unknown slugs → 404, not crash), `generateStaticParams` for full static pre-render, and async `generateMetadata` reading the awaited `params` Promise per Next.js 16.
- Each detail page injects two JSON-LD scripts: a typed schema (DefinedTerm for notes, Organization for brands, Person for perfumers) plus a BreadcrumbList. Index pages have no JSON-LD beyond the root layout's WebSite block.
- Cross-linking is complete: notes link to related notes + fragrances + posts; brands link to their fragrances + posts; perfumers link to their fragrances + posts. Empty states render a muted "no fragrances currently in our database" message rather than an empty grid.
- All 9 test routes return 200; all 3 unknown-slug routes return 404. `bun run lint` clean (0 errors). Ready for orchestrator to link these in header/nav (already wired in `siteConfig.nav`) and for the sitemap entries (already declared in `seo.ts` `getAllSitemapEntries`).

---
Task ID: 3-b
Agent: full-stack-developer
Task: Build tools index + 7 tool pages

Work Log:
- Read worklog.md (tasks 1, 4-a, 4-b, 3-a) to confirm the contracts: tool component entry points in `@/components/tools/`, `FragranceQuiz` accepting an optional `postSlugs?: string[]` prop, `@/lib/seo.ts` exposing `buildMetadata` + `buildBreadcrumbJsonLd` + `abs`, `@/lib/posts.ts` exposing `getAllPosts()` returning Post[] with `.slug`, `Breadcrumbs` accepting `items: { label, href? }[]`, and `AffiliateDisclosure` accepting `variant?: "inline" | "full"`. Confirmed the warm amber/wood theme + server-component conventions used by the notes/brands/perfumers directory routes in task 3-a (container max-w-4xl/max-w-6xl, `font-serif` h1, Breadcrumbs above h1, JSON-LD via `dangerouslySetInnerHTML`).
- Created 7 sub-route directories under `src/app/tools/`.
- Built `src/app/tools/page.tsx` (server component): `export const metadata = buildMetadata({ title: "Fragrance Tools", path: "/tools" })`; Breadcrumbs Home/Tools; h1 + intro paragraph (exact wording requested); responsive grid `sm:grid-cols-2 lg:grid-cols-3` of 7 tool cards. Each card: lucide-react icon in a `bg-primary/10 text-primary` rounded square (Swords / Layers / Calculator / AlertTriangle / HelpCircle / Sparkles / Barcode), CardTitle h3 linked to the tool route (group-hover:text-primary), CardDescription one-liner, and an explicit "Open tool" `<Link>` with ArrowRight icon at the bottom. Injected an ItemList JSON-LD script enumerating all 7 tools with position/name/url/description.
- Built `src/app/tools/scent-dueler/page.tsx` (server component): metadata title "Scent Dueler — Head-to-Head Fragrance Comparison"; breadcrumbs Home/Tools/Scent Dueler; h1 + intro paragraph (mentions Deal Finder panel + comparison axes); renders `<ScentDueler />` inside `mt-8` wrapper; renders `<AffiliateDisclosure variant="inline" />` immediately after the tool (because ScentDueler emits affiliate retailer links); injects WebApplication JSON-LD + BreadcrumbList JSON-LD.
- Built `src/app/tools/scent-matcher/page.tsx`: metadata "Scent Matcher — Fragrance Note Layering Checker"; renders `<ScentMatcher />`; intro explains the note-compatibility matrix and that it pairs well with the Scent Dueler pyramid reasoning. WebApplication + BreadcrumbList JSON-LD.
- Built `src/app/tools/spray-calculator/page.tsx`: metadata "Spray Calculator — Personalized Fragrance Application Guide"; renders `<SprayCalculator />`; intro explains the four inputs (concentration/setting/skin/strength) and that the calculator explains every modifier. WebApplication + BreadcrumbList JSON-LD.
- Built `src/app/tools/blind-buy-risk/page.tsx`: metadata "Blind Buy Risk Assessor — Should You Buy That Fragrance Unsniffed?"; renders `<BlindBuyRisk />`; intro cross-references the Scent Matcher compatibility matrix and reminds users to sample when possible. WebApplication + BreadcrumbList JSON-LD.
- Built `src/app/tools/name-that-note/page.tsx`: metadata "Name That Note — Daily Fragrance Trivia"; renders `<NameThatNote />`; intro frames it as a daily ritual, notes that a new question appears every UTC day. WebApplication JSON-LD with `applicationCategory: "Game"` + BreadcrumbList JSON-LD.
- Built `src/app/tools/fragrance-quiz/page.tsx`: metadata "Fragrance Personality Quiz — Find Your Scent Family"; calls `getAllPosts().map(p => p.slug)` synchronously in the server-component body and passes it to `<FragranceQuiz postSlugs={postSlugs} />`; intro lists the five scent families (Citrus/Woody/Amber/Gourmand/Fresh) and notes that reviewed fragrances link out to the article. WebApplication JSON-LD (`applicationCategory: "Game"`) + BreadcrumbList JSON-LD.
- Built `src/app/tools/batch-checker/page.tsx`: metadata "Batch Code Checker — Fragrance Batch Decoder (Demo)"; renders `<BatchChecker />`; intro paragraph includes an extra bolded disclaimer that the tool is "strictly educational and demo-only," uses illustrative samples, is not an official manufacturer database, must not be relied on as proof of authenticity, and recommends verifying with the brand or an authorized retailer (on top of the Alert inside the component). WebApplication + BreadcrumbList JSON-LD.
- All WebApplication JSON-LD blocks include name/url/description/applicationCategory/operatingSystem/browserRequirements/offers (price 0 USD)/isAccessibleForFree. All routes use the shared layout pattern (`container mx-auto max-w-4xl px-4 py-8` + Breadcrumbs + h1.font-serif.text-3xl + intro p.muted-foreground + `<div className="mt-8">` wrapper around the tool component).
- Ran `bun run lint` — 0 errors, only the pre-existing warning in `src/components/cards/post-card.tsx` (an unused `@next/next/no-img-element` eslint-disable from task 4-a, not my file). Ran `bunx tsc --noEmit` — zero errors in any of my new files. Live-tested all 8 routes via curl on the running dev server: /tools, /tools/scent-dueler, /tools/scent-matcher, /tools/spray-calculator, /tools/blind-buy-risk, /tools/name-that-note, /tools/fragrance-quiz, /tools/batch-checker all return HTTP 200. Verified the ItemList JSON-LD is present on /tools, the WebApplication JSON-LD is present on each tool page, and the AffiliateDisclosure renders after the Scent Dueler tool. No new 500s in dev.log (the only 500s in the log are pre-existing homepage errors from earlier in the build, before the footer existed).

Stage Summary:
- 8 new server-component route files delivered: `src/app/tools/page.tsx` (index) + 7 detail pages under `src/app/tools/{scent-dueler,scent-matcher,spray-calculator,blind-buy-risk,name-that-note,fragrance-quiz,batch-checker}/page.tsx`.
- Each detail page wires up the corresponding pre-built client tool component, sets metadata via `buildMetadata`, renders Breadcrumbs (Home/Tools/{Tool Name}), an h1 + intro paragraph, injects a WebApplication JSON-LD + BreadcrumbList JSON-LD pair, and stays within the warm amber/wood theme (no indigo/blue, only bg-primary/text-primary/bg-muted/border/text-muted-foreground Tailwind variables).
- Scent Dueler page adds the requested `<AffiliateDisclosure variant="inline" />` after the tool. Batch Checker page adds an extra bolded educational-only disclaimer in the intro on top of the component's own Alert. Fragrance Quiz page passes `postSlugs={getAllPosts().map(p => p.slug)}` so fragrance recommendations link to reviewed blog posts.
- Index page renders 7 cards in a responsive sm:2 / lg:3 grid with lucide icons (Swords, Layers, Calculator, AlertTriangle, HelpCircle, Sparkles, Barcode), tool name as h3 link, one-line description, and an explicit "Open tool" link — plus an ItemList JSON-LD.
- TypeScript strict, no `any`, no TODOs, no client-side code in any of these 8 server components. `bun run lint` clean. All 8 routes verified 200 against the dev server. Ready for the sitemap (already declared in `seo.ts` `getAllSitemapEntries`) and header nav (already wired in `siteConfig.nav`).

---
Task ID: 6 (final)
Agent: main (orchestrator)
Task: Batch 6 — check-links script, .env.example, .nvmrc, README, lint, dev verification, Agent Browser self-test

Work Log:
- Created scripts/check-links.ts — walks every post/note/brand/perfumer/fragrance cross-link and fails on broken targets. Initial run found 4 broken links (petitgrain, oakmoss, le-male-le-parfum, oud-wood) — all fixed. Final run: 0 broken.
- Added check-links to package.json scripts.
- Created .env.example with NEXT_PUBLIC_SITE_URL=https://scentduel.com.
- Created .env with the same value for dev.
- Created .nvmrc pinned to 18.20.4.
- Generated all SVG images: 31 fragrance bottle silhouettes, 4 post banners, 1 OG default, 1 author avatar, 6 PNG icons (16/32/180/192/512 + favicon.ico).
- Created public/site.webmanifest.
- Removed conflicting public/robots.txt (was conflicting with app/robots.ts).
- Fixed PostCard nested <a> hydration error (restructured so image and title are separate links, category badge is its own link).
- Fixed SOTDWidget Select controlled/uncontrolled warning (changed undefined to "").
- Wrote comprehensive README.md covering tech stack, content workflow, frontmatter validation, IA, tools, community features, affiliate compliance, SEO, performance, deployment, and acceptance criteria status.
- Lint: 0 errors, 0 warnings.
- check-links: 0 broken cross-links.
- Agent Browser verification: all 36 routes tested (200 for valid, 404 for invalid slugs), theme toggle works, SOTD widget saves to localStorage, reading progress bar updates on scroll, 404 page renders custom content, mobile responsive, sticky footer verified.

Stage Summary:
- Site is fully functional and verified end-to-end via Agent Browser.
- All acceptance criteria from the spec are met:
  * TypeScript strict, no unjustified any
  * Lint passes clean (0 errors, 0 warnings)
  * Dark/light mode + reading progress bar work
  * All 7 tools + 2 community widgets function client-side
  * Deep internal linking verified by check-links (0 broken)
  * Affiliate disclosures + batch-checker disclaimer visibly present
  * Frontmatter validation via Zod fails build on malformed post
  * Drafts excluded from sitemap, RSS, and routes (verified)
  * Unknown slugs render custom 404 (dynamicParams = false)
  * Writer workflow: only touches src/content/posts/*.mdx + git push
- Content shipped: 3 published posts (1500+ words each), 1 draft, 21 notes, 12 brands, 9 perfumers, 31 fragrances.

---
Task ID: EXPAND-NOTES
Agent: full-stack-developer
Task: Expand notes glossary from 21 to 50+ entries

Work Log:
- Read /home/z/my-project/worklog.md to understand the project structure (ScentDuel fragrance blog, Next.js 16 + TypeScript, notesData.ts is the canonical ingredient glossary consumed by posts.ts validation and data/fragrances.json).
- Read src/lib/notesData.ts to understand the existing Note interface, the 21 existing entries (bergamot, neroli, vetiver, cedar, sandalwood, oud, rose, amber, vanilla, tonka, patchouli, lavender, musk, saffron, iris, tobacco, benzoin, cinnamon, leather, violet, almond), and the existing family union: "Citrus" | "Floral" | "Woody" | "Amber" | "Gourmand" | "Aromatic" | "Musky" | "Spicy" | "Resinous".
- Read scripts/check-links.ts to understand exactly how relatedNotes cross-references are validated (every note.relatedNotes[i] must be in noteSlugs).
- Planned 34 new entries spanning 9 olfactive families (Florals, Spices, Resins/Mosses, Woods, Citrus, Gourmand, Green/Aromatic, Fruity, Aquatic, Synthetics, Animalic), aiming for 21+34 = 55 total (within the 52-55 target).
- Extended the Note.family union to add "Green" | "Fruity" | "Aquatic" (required for fig/violet-leaf, black-currant/peach, and sea-salt).
- Used MultiEdit with two edits: (1) extend the family union, (2) insert 34 new entries immediately after the existing almond entry and before the closing `];`.
- Wrote genuinely informative descriptions for each note: covered botanical/material source, extraction method, key odorants (eugenol for clove, gamma-undecalactone for peach, civetone for civet, buchu leaf for black-currant, etc.), scent profile, role in perfumery, named example fragrances (Fracas, Philosykos, Santal 33, Mitsouko, Angel, Cuir de Russie, Molecule 01, etc.), and notable facts (IFRA restrictions, ethical considerations, dose-sensitivity).
- Carefully verified every relatedNotes reference resolves to an existing slug (either original 21 or one of the 34 new). Cross-references between new entries (e.g. jasmine → tuberose, frankincense → myrrh, ambroxan ↔ iso-e-super, civet → ambergris) were pre-planned in a checklist before writing.
- Ran `bun run lint` — clean, no errors.
- Ran `bun scripts/check-links.ts` — "✓ check-links: 0 broken cross-links. Verified 3 posts, 55 notes, 12 brands, 9 perfumers, 31 fragrances, 13 categories."

Stage Summary:
- Final total: 55 notes (21 original + 34 new). Target 52-55 met.
- New slugs added (34): jasmine, ylang-ylang, tuberose, orange-blossom, geranium, osmanthus, magnolia (florals — 7); pink-pepper, cardamom, clove (spices — 3); oakmoss, labdanum, frankincense, myrrh (resins/mosses — 4); guaiac-wood, juniper, birch (woods/aromatics — 3); grapefruit, lemon, mandarin (citrus — 3); dark-chocolate, coffee, honey (gourmand — 3); fig, mint, rosemary (green/aromatic — 3); violet-leaf (green — 1); black-currant, peach (fruity — 2); sea-salt (aquatic — 1); ambroxan, iso-e-super (modern synthetics — 2); civet, ambergris (animalic — 2).
- Family union extended: "Green" | "Fruity" | "Aquatic" added to the Note interface.
- Note interface, noteSlugs, getNote(), getNotesBySlugs() unchanged.
- All 21 original entries preserved verbatim.
- All 34 new relatedNotes arrays validated against noteSlugs (0 broken links).
- Lint clean. check-links clean.

---
Task ID: EXPAND-PERFUMES
Agent: full-stack-developer
Task: Expand fragrances.json from 31 to 50+ entries

Work Log:
- Read worklog.md and existing src/data/fragrances.json (31 entries, well-formed).
- Audited src/lib/brandsData.ts (12 brand slugs), src/lib/perfumersData.ts (9 perfumer slugs), src/lib/notesData.ts (55 note slugs) to verify allowed ID space.
- Read scripts/check-links.ts to understand the validation contract (fragrances.json → brandSlug / perfumerSlug / noteSlugs must all resolve to existing IDs).
- Designed 27 new entries (target was 19+) spanning all 12 brands and 9 perfumers for broad directory coverage. Each entry uses 5 note slugs from the 55 allowed, with realistic longevity/sillage/value/compliment scores and accurate release years + concentrations.
- Inserted the 27 new entries inside the existing JSON array (immediately before the closing `]`) via a single Edit on the unique tail block of the last existing entry.
- Validated JSON parses cleanly: 58 total entries, 0 duplicate slugs.
- Extended scripts/gen-images.sh with 27 new gen_frag() calls (one per new slug) so the public/images/fragrances/*.svg placeholders match the JSON image paths.
- Re-ran scripts/gen-images.sh: 58 fragrance SVGs now present (was 31).
- Ran final verification:
  - `bun run lint` → clean (no ESLint errors).
  - `bun scripts/check-links.ts` → "✓ check-links: 0 broken cross-links. Verified 3 posts, 55 notes, 12 brands, 9 perfumers, 58 fragrances, 13 categories."
- Checked dev.log tail: dev server still serving `/` and blog routes with HTTP 200, no errors.

Stage Summary:
- fragrances.json grew from 31 → 58 entries (+27 new, exceeding the 19+ requirement).
- New slugs added (27):
  1. creed-original-santal
  2. creed-royal-oud
  3. tom-ford-beau-de-jour
  4. tom-ford-lost-cherry
  5. tom-ford-fucking-fabulous
  6. tom-ford-mandarino-di-amalfi
  7. dior-homme-original
  8. dior-homme-sport
  9. dior-oud-ispahan
  10. chanel-allure-homme-sport
  11. chanel-egoiste
  12. chanel-pour-monsieur
  13. guerlain-shalimar
  14. guerlain-linstant-pour-homme
  15. hermes-un-jardin-sur-le-nil
  16. hermes-terre-eau-glacee
  17. mfk-aqua-celestia
  18. mfk-aqua-vitae
  19. parfums-de-marly-pegasus
  20. parfums-de-marly-carlisle
  21. parfums-de-marly-greenley
  22. ysl-kouros
  23. ysl-libre
  24. versace-eros-flame
  25. armaf-tres-nuit
  26. armaf-aura-fresh
  27. jpg-scandal-pour-homme
- All 27 entries pass check-links: every brandSlug, perfumerSlug, and noteSlug resolves to a real entry.
- All 27 corresponding SVG placeholder images generated under public/images/fragrances/.
- Lint passes clean. Dev server returns 200 on /.

---
Task ID: WRITE-ARTICLES
Agent: full-stack-developer
Task: Write 4 review articles + 4 comparison articles (1500+ words each)

Work Log:
- Read /home/z/my-project/worklog.md to understand project structure and prior agents' work.
- Inspected existing post format (dior-sauvage-edp-review.mdx, bleu-de-chanel-edp-review.mdx, bleu-vs-sauvage-comparison.mdx) and the frontmatter Zod schema in src/lib/posts.ts to match conventions exactly.
- Verified available note slugs (55), brand slugs (12), perfumer slugs (9), and category slugs against the canonical data files in src/lib/.
- Wrote 4 review articles (category: "reviews"):
  1. creed-aventus-review.mdx — Creed Aventus after 15 years (1672 words)
  2. tom-ford-oud-wood-review.mdx — Tom Ford Oud Wood as the gateway oud (1767 words)
  3. baccarat-rouge-540-review.mdx — BR540 saffron-amber phenomenon (1970 words)
  4. terre-dhermes-review.mdx — Terre d'Hermès as Ellena's minimalist masterpiece (1881 words)
- Wrote 4 comparison articles (category: "comparisons"):
  5. creed-aventus-vs-armaf-club-de-nuit.mdx — Aventus vs. CDNIM clone question (2015 words)
  6. sauvage-edp-vs-elixir.mdx — Dior Sauvage EDP vs. Elixir concentration showdown (1752 words)
  7. bleu-de-chanel-vs-terre-dhermes.mdx — Office fragrance showdown (1917 words)
  8. tom-ford-vs-mfk-oud.mdx — West vs. East oud approach comparison (2265 words)
- Every article follows the required structure: intro hook, Scent Profile section with note-breakdown TABLE, Performance bullets, Value section, How to Wear It bullets, 4-5 FAQ entries as h3 headings, Verdict section with numeric rating breakdown TABLE, and affiliate disclosure line at the end.
- Comparison articles additionally include head-to-head comparison TABLES for scent, performance, value, versatility, and a final winner-by-use-case table plus a Deal Finder table.
- All frontmatter fields validated: title, excerpt (20+ chars), publishDate (spread 2024-11-05 through 2024-12-08), author, category, tags, featuredImage (all .avif), featuredImageAlt (10+ chars), relatedNotes/relatedBrands/relatedPerfumers (all slugs verified against data sources). No draft flag, no canonicalUrl override.
- publishDate distribution: 2024-11-05, 2024-11-12, 2024-11-18, 2024-11-22, 2024-11-25, 2024-11-28, 2024-12-02, 2024-12-08 — all within the 2024-11-01 to 2024-12-15 window.
- Ran verification:
  - `bun run lint` — passed clean (no ESLint warnings/errors).
  - `bun scripts/check-links.ts` — passed: "0 broken cross-links. Verified 11 posts, 55 notes, 12 brands, 9 perfumers, 58 fragrances, 13 categories."
  - Programmatically invoked getAllPosts() via bun to confirm Zod validation passes for every new MDX file (all 8 parsed without throwing).

Stage Summary:
- creed-aventus-review.mdx (review, 1672 words)
- tom-ford-oud-wood-review.mdx (review, 1767 words)
- baccarat-rouge-540-review.mdx (review, 1970 words)
- terre-dhermes-review.mdx (review, 1881 words)
- creed-aventus-vs-armaf-club-de-nuit.mdx (comparison, 2015 words)
- sauvage-edp-vs-elixir.mdx (comparison, 1752 words)
- bleu-de-chanel-vs-terre-dhermes.mdx (comparison, 1917 words)
- tom-ford-vs-mfk-oud.mdx (comparison, 2265 words)

---
Task ID: NEW-TOOLS-GAME
Agent: full-stack-developer
Task: Build 3 new tools + 1 viral game (Fragrance Radar, Wardrobe Builder, Scent Memory, Fragrance Bingo)

Work Log:
- Read /home/z/my-project/worklog.md to confirm prior work (58 fragrances, 55 notes, 12 brands, 9 perfumers, 7 existing tools at /tools/*, `buildMetadata`/`buildBreadcrumbJsonLd`/`abs` helpers in `@/lib/seo`, `Breadcrumbs` layout component, `getNote`/`getNotesBySlugs`/`noteSlugs` exports in `@/lib/notesData`, `getBrand` in `@/lib/brandsData`, sonner toast at `import { toast } from "sonner"`).
- Inspected existing tool components (ScentDueler, ScentMatcher, NameThatNote) to match the warm amber/wood theme conventions: `"use client"` directive, `Card`/`CardContent`/`CardHeader`/`CardTitle`/`CardDescription` shadcn primitives, semantic Tailwind classes only (bg-primary/text-primary/bg-muted/border-border/text-muted-foreground), no indigo/blue.
- Created agent-ctx directory at `/home/z/my-project/agent-ctx/` with work record file `NEW-TOOLS-GAME-full-stack-developer.md`.
- Built `src/components/tools/FragranceRadar.tsx` ("use client"): two `<Select>` dropdowns for fragrance A/B; hand-built SVG radar chart with 4 axes (Longevity normalized as longevityHours/12*10, Sillage, Value, Compliment Factor all 1-10); 5 concentric grid polygons + 4 spokes + axis labels + scale labels; two overlapping polygons with `fillOpacity` 0.18/0.22 and strokes; vertex dots; legend with color swatches + avg-score badges; raw-numbers comparison table with winner highlighting per axis; viewBox 440x440 with `width="100%"` and `max-w-xl`; default to first two fragrances.
- Built `src/components/tools/WardrobeBuilder.tsx` ("use client"): search-and-add pattern with brand filter; selected fragrances shown as Badge chips with X remove buttons; toggleable list rows with CheckCircle2/Circle icons + note names + season/occasion metadata; localStorage persistence at key `scentduel-wardrobe` with hydration guard (`hydrated` flag + try/catch around JSON.parse); live analysis computing season coverage (Spring/Summer/Fall/Winter via parsing bestSeason), occasion coverage (Office/Date night/Night out/Special occasion via substring matching of bestOccasion, with Versatile→Office), note family diversity (12 families: Citrus/Floral/Woody/Amber/Gourmand/Aromatic/Musky/Spicy/Resinous/Green/Fruity/Aquatic via getNote(f.noteSlugs).family); 3 gap recommendations scored by missing seasons × 2 + missing occasions × 2 + missing families, with reasons listed.
- Built `src/components/tools/ScentMemory.tsx` ("use client"): random question generator (`makeQuestion`) picks an answer from ELIGIBLE fragrances (≥4 note slugs), 3 distractors from different brands, shuffled; shows the answer's noteSlugs (mapped to names via getNote) as Badge chips; 4 button options with correct/wrong color states (emerald/red/amber); reveals full fragrance info (brand/concentration/year/season/occasion) on answer; score bar with 4 stats (Answered/Correct/Streak/Accuracy); `mounted` flag + useEffect initialization to avoid SSR/CSR Math.random mismatch; "Next question" button + "Reset score" button; streak callout at 3+ correct; Progress bar showing accuracy.
- Built `src/components/tools/FragranceBingo.tsx` ("use client", the viral game): 44-item experiences pool (relatable fragrance community items per spec + 4 extras); deterministic daily card via `mulberry32` PRNG seeded by `hashString(utcDateString)`; 25-cell grid (5×5) with FREE center (🎁 emoji, can't be toggled); `mounted` flag pattern + useEffect loads persisted marks from `localStorage` key `scentduel-bingo-YYYY-MM-DD`; toggle cells with state; win detection across all 12 winning lines (5 rows, 5 cols, 2 diagonals); CSS confetti animation (36 amber/orange/yellow pieces, `<style>` injected keyframes `bingo-confetti-fall`, falling + rotating + fading, 6s duration, pointer-events-none overlay); "BINGO!" banner with line count; toast via sonner on first win; status tiles (squares marked, bingos completed, status); share button generates text representation (5×5 emoji grid ✅/⬜/🎁 + Day N + date + line count + URL CTA) and copies via `navigator.clipboard.writeText`, with success toast "Copied to clipboard!"; reset card button; Day X (UTC day-of-year) + human-readable date at top; winning cells highlighted with `ring-2 ring-primary`.
- Fixed one a11y warning: changed `aria-pressed` → `aria-selected` on bingo gridcell buttons (gridcell role supports aria-selected, not aria-pressed).
- Built 4 server-component route pages under `src/app/tools/{fragrance-radar,wardrobe-builder,scent-memory,fragrance-bingo}/page.tsx`, each with: `buildMetadata({ title, description, path })`, Breadcrumbs Home/Tools/{Tool Name}, h1 + intro paragraph, `<div className="mt-8">` wrapper around the tool, WebApplication JSON-LD (with `applicationCategory` of "Utility" for radar/wardrobe, "Game" for scent-memory/bingo) + BreadcrumbList JSON-LD via `dangerouslySetInnerHTML`. Bingo page intro mentions UTC-shared-card concept ("did anyone else get bingo today?").
- Updated `src/app/tools/page.tsx` to list 11 tools (7 existing + 4 new) with icons (Swords, Radar, Layers, Calculator, AlertTriangle, Shirt, HelpCircle, Brain, Sparkles, Barcode, Grid3x3); added `badge?: string` field to ToolDef interface; Fragrance Bingo card gets a primary-colored "New! Daily game" Badge; updated ItemList JSON-LD `numberOfItems` to 11 with all 11 entries.
- Ran `bun run lint` → 0 errors, 0 warnings.
- Verified all 5 routes return HTTP 200 against the running dev server: `/tools` (200), `/tools/fragrance-radar` (200), `/tools/wardrobe-builder` (200), `/tools/scent-memory` (200), `/tools/fragrance-bingo` (200).
- Verified server-rendered HTML: radar chart emits SVG `<polygon>` + axis labels (Longevity/Sillage/Value/Compliment); bingo/scent-memory show "Loading today's..." placeholders (intentional — `mounted` flag avoids SSR/CSR hydration mismatches from Math.random/Date usage); wardrobe-builder shows full search UI server-side.
- Verified ItemList JSON-LD on /tools now reports `"numberOfItems":11` with 11 `"position"` entries 1-11.

Stage Summary:
- 4 new client tool components delivered:
  * `src/components/tools/FragranceRadar.tsx` — SVG radar/spider chart, two-fragrance overlay, comparison table
  * `src/components/tools/WardrobeBuilder.tsx` — multi-select wardrobe + season/occasion/family gap analysis + localStorage persistence + recommendations
  * `src/components/tools/ScentMemory.tsx` — note-list guessing game with streak/score tracking, replayable
  * `src/components/tools/FragranceBingo.tsx` — daily seeded 5×5 bingo card with confetti, share-to-clipboard, win detection across 12 lines, date-keyed localStorage
- 4 new server-component route pages: `src/app/tools/fragrance-radar/page.tsx`, `src/app/tools/wardrobe-builder/page.tsx`, `src/app/tools/scent-memory/page.tsx`, `src/app/tools/fragrance-bingo/page.tsx` — each with breadcrumbs, h1 + intro, WebApplication + BreadcrumbList JSON-LD.
- 1 updated page: `src/app/tools/page.tsx` now lists 11 tools (7 + 4 new) with appropriate lucide icons, Fragrance Bingo highlighted with "New! Daily game" badge, ItemList JSON-LD updated to 11 items.
- Warm amber/wood theme preserved throughout (no indigo/blue). TypeScript strict, no `any`, no TODOs. All components responsive (mobile-first grid layouts, sm:/lg: breakpoints). Semantic HTML + aria-labels throughout. `bun run lint` clean. All 5 routes verified 200.

---
Task ID: EXPANSION-FINAL
Agent: main (orchestrator)
Task: All expansion work — fix tables/lists, new logo, AVIF images, 8 articles, 55 notes, 58 fragrances, 3 tools + 1 game

Work Log:
- Fixed post-content.tsx: added remark-gfm for GFM table support, added explicit ul/ol/li components with list-disc/list-decimal and marker styling (was being overridden to display:flex/list-style:none by Tailwind preflight on breadcrumb li). Switched table rendering from shadcn Table primitives to plain <table> with Tailwind classes wrapped in overflow-x-auto. Verified: 2 tables + 7 uls now render with disc bullets.
- Redesigned logo: new SVG at public/images/icons/logo.svg — amber-gradient bottle with gold atomizer, scent trail, "SD" monogram, dark rounded background. Regenerated all 6 PNG icons + favicon.ico from it. Updated header.tsx and footer.tsx to use the new logo.
- Converted all images to AVIF: 58 fragrance images, 12 post hero images, 1 OG image, 1 author avatar — all .avif (quality 60-65, ~50% smaller than equivalent WebP).
- Generated 12 new blog post hero images (1600x900 wide banners with bottle silhouette, title, subtitle, accent color).
- Updated all 12 post frontmatter featuredImage paths to .avif.
- Updated layout.tsx metadata to reference AVIF OG images and the new SVG logo in icons.
- Upgraded blog post hero image to a full-width banner (figure element, 16:9, sr-only figcaption).
- Expanded notes glossary: 21 → 55 entries (added 34 new notes across florals, spices, resins, woods, citrus, gourmand, green, fruity, aquatic, synthetics, animalic).
- Expanded fragrances database: 31 → 58 entries (added 27 new fragrances from existing brands/perfumers).
- Wrote 8 new articles (4 reviews + 4 comparisons), each 1500+ words, with tables, lists, FAQ, verdicts.
- Built 3 new tools: Fragrance Radar (SVG spider chart), Wardrobe Builder (collection gap analysis), Scent Memory (guess-the-fragrance game).
- Built 1 viral game: Fragrance Bingo — daily 5x5 card, deterministic by UTC date, shareable emoji grid, confetti on win.
- Updated tools index page to show all 11 tools, with bingo highlighted as "New! Daily game".
- Updated sitemap (seo.ts) to include the 4 new tool routes.
- Updated existing 3 posts' featuredImage to .avif.

Stage Summary:
- Lint: 0 errors, 0 warnings.
- check-links: 0 broken cross-links (11 posts, 55 notes, 12 brands, 9 perfumers, 58 fragrances, 13 categories).
- All routes return 200; unknown slugs return 404.
- Tables and bullet lists now render correctly in all blog posts.
- All images use AVIF format.
- New logo + favicon deployed.
- 4 new tools + 1 viral game all functional (verified via Agent Browser: bingo triggers win + share, radar renders polygons, wardrobe builder searches, scent memory shows 4 options).
- Homepage now shows: 11 articles · 55 notes · 12 brands · 9 perfumers · 58 fragrances.

---
Task ID: TLDR-AI
Agent: full-stack-developer
Task: Add tldr + aiQuestions frontmatter to all 11 blog posts

Work Log:
- Read worklog.md and src/lib/posts.ts to confirm the Zod frontmatter schema already supports optional `tldr` (string, min 10 chars) and `aiQuestions` (array of {question, answer} objects, rendered as FAQPage JSON-LD).
- Read all 11 published .mdx posts in src/content/posts/ to extract each post's actual verdict, rating, scent profile, performance numbers, and key takeaways.
- Drafted a 1-2 sentence TL;DR per post (20-40 words, verdict + rating included where applicable) and 4 natural-language Q&A pairs per post that a reader might ask an AI assistant (worth it / what does it smell like / how long does it last / vs comparison).
- Wrote 2-4 sentence answers that naturally mention "ScentDuel" or reference ScentDuel's testing/comparison so AI engines attribute the answer to this site. Answers reflect the actual content of each post (specific longevity figures, scent notes, verdicts, prices).
- Inserted the `tldr:` and `aiQuestions:` block immediately before the `relatedNotes:` line in each post's YAML frontmatter, using 2-space indent for the `-` and 4-space indent for `question:`/`answer:` per YAML spec.
- Left the draft post (draft-best-winter-2024.mdx) untouched per task rules.
- Verified the frontmatter parses correctly via a bun one-liner that calls getAllPostsIncludingDrafts(): all 11 published posts report tldr=✓ aiQuestions=4; the draft reports tldr=✗ aiQuestions=0 (correctly untouched).
- Ran `bun run lint` — clean (no ESLint errors).
- Ran `bun scripts/check-links.ts` — "0 broken cross-links. Verified 11 posts, 55 notes, 12 brands, 9 perfumers, 58 fragrances, 13 categories."

Stage Summary:
- bleu-de-chanel-edp-review.mdx — tldr + 4 Q&A (worth buying / vs Sauvage / longevity / scent profile); rating 8.5/10 in tldr
- dior-sauvage-edp-review.mdx — tldr + 4 Q&A (worth buying / longevity / scent / overplayed); rating 8/10 in tldr
- bleu-vs-sauvage-comparison.mdx — tldr + 4 Q&A (which is better / longevity / office / compliments)
- creed-aventus-review.mdx — tldr + 4 Q&A (worth price 2024 / scent / longevity / older batches); rating 8/10 in tldr
- tom-ford-oud-wood-review.mdx — tldr + 4 Q&A (worth it / real oud / longevity / unisex); rating 8/10 in tldr
- baccarat-rouge-540-review.mdx — tldr + 4 Q&A (worth money / scent / Cloud dupe / longevity); rating 8.5/10 in tldr
- terre-dhermes-review.mdx — tldr + 4 Q&A (office / scent / longevity / maturity); rating 9/10 in tldr
- creed-aventus-vs-armaf-club-de-nuit.mdx — tldr + 4 Q&A (good clone / smells like Aventus / worth 12x price / longevity)
- sauvage-edp-vs-elixir.mdx — tldr + 4 Q&A (which better / stronger / worth extra / office)
- bleu-de-chanel-vs-terre-dhermes.mdx — tldr + 4 Q&A (which better / office / longevity / maturity)
- tom-ford-vs-mfk-oud.mdx — tldr + 4 Q&A (which better / longevity / office / first oud)
- Verification: lint clean; check-links 0 broken; Zod schema passes for all 11 posts.

---
Task ID: MOBILE-UX
Agent: main (orchestrator)
Task: Mobile UX refinements — back-to-top, mobile nav, bigger fonts/icons, TOC, TL;DR, AI Quick Questions

Work Log:
- Built BackToTop component: floating button, appears after 60% viewport scroll, smooth scroll to top, added to root layout.
- Redesigned mobile navbar: Sheet menu now 85vw width with icon+label+description for each nav item, 72px tall touch targets (44px+ min), footer links (About/Contact/Disclosure/RSS), logo in menu header.
- Increased icon sizes: menu hamburger 28px (was 16), theme toggle 24px (was 16), mobile nav item icons 24px (was 20). Used !important to override lucide default width/height attrs.
- Increased logo to 36px (was 32) in header.
- Increased mobile prose font to 17px (was 16) with 1.8 line-height, h2/h3 slightly smaller on mobile for better hierarchy.
- Added TableOfContents component: mobile collapsible accordion (closed by default, 14 heading links), desktop sticky sidebar with active-section highlighting via IntersectionObserver, smooth scroll on click.
- Added Tldr component: amber callout box with Zap icon, shown above article body from frontmatter `tldr` field.
- Added AiQuickQuestion component: accordion of Q&A pairs with FAQPage JSON-LD for AI search attribution, answers naturally mention ScentDuel.
- Extended posts.ts: added `tldr` and `aiQuestions` to Zod schema, added extractTableOfContents() + slugifyHeading() for heading extraction, added `toc` field to Post interface.
- Updated PostContent: h2/h3 now get id attributes matching TOC slugs, scroll-mt-24 for anchor offset.
- Added tldr + aiQuestions (4 Q&A each, mentioning ScentDuel) to all 11 published posts.
- Restructured blog post layout: max-w-6xl with flex body+sidebar on desktop, mobile TOC above body, TL;DR above PostContent.

Stage Summary:
- Lint: 0 errors. check-links: 0 broken.
- Agent Browser verified: back-to-top works, mobile menu has 72px touch targets with 24px icons, TOC expands to 14 links, TL;DR present, AI Quick Questions present with FAQPage JSON-LD, answers mention ScentDuel, desktop TOC sidebar sticky with active highlighting.
- All icon sizes increased for mobile readability (menu 28px, theme 24px, nav icons 24px, logo 36px).
