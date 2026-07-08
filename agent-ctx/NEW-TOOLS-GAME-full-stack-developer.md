# Task: NEW-TOOLS-GAME

Agent: full-stack-developer
Task: Build 3 new tools + 1 viral game (Fragrance Radar, Wardrobe Builder, Scent Memory, Fragrance Bingo)

## Plan
1. Read worklog.md, existing tool components (ScentDueler, ScentMatcher, NameThatNote), data sources (fragrances.json, notesData.ts), and SEO helpers (buildMetadata, buildBreadcrumbJsonLd, abs) to confirm contracts.
2. Build 4 client components in `src/components/tools/`:
   - FragranceRadar.tsx — SVG radar/spider chart, two fragrances overlaid
   - WardrobeBuilder.tsx — multi-select wardrobe + season/occasion/family coverage analysis
   - ScentMemory.tsx — note-guessing quiz game with score tracking
   - FragranceBingo.tsx — daily seeded 5x5 bingo card with share + win detection
3. Build 4 server-component route pages under `src/app/tools/`.
4. Update `src/app/tools/page.tsx` to list all 11 tools (7 existing + 4 new) + update ItemList JSON-LD.
5. Run `bun run lint`, fix errors, append worklog.

## Data contracts (confirmed)
- `import fragrances from "@/data/fragrances.json"` — array of 58, each has slug/name/brandSlug/perfumerSlug/noteSlugs[]/longevityHours/sillage(1-10)/value(1-10)/complimentFactor(1-10)/bestSeason/bestOccasion/image/concentration/yearReleased/retailers[]
- `import { getNote } from "@/lib/notesData"` returns Note | undefined
- `import { getBrand } from "@/lib/brandsData"` returns Brand | undefined
- `buildMetadata({ title, description, path })` from `@/lib/seo`
- `buildBreadcrumbJsonLd([{name,url}])` from `@/lib/seo`
- `abs(path)` from `@/lib/seo`
- Breadcrumbs component takes `items: { label, href? }[]`
- shadcn/ui components available: card, button, select, input, badge, table, tabs, separator, progress, alert, tooltip, scroll-area, dialog, etc.
- `cn()` from `@/lib/utils`
- `sonner` toast: `import { toast } from "sonner"`

## Styling rules
- No indigo/blue. Warm amber/wood theme (primary = amber-brown). Use semantic Tailwind classes (bg-primary, text-primary, bg-muted, border-border, text-muted-foreground).
- All responsive mobile-first.
- TypeScript strict, no `any`.
- Semantic HTML + aria labels.

## Status: COMPLETE

- 4 client tool components built in `src/components/tools/`:
  * FragranceRadar.tsx — SVG radar chart, two-fragrance overlay
  * WardrobeBuilder.tsx — collection gap analysis w/ localStorage
  * ScentMemory.tsx — note-guessing quiz game with streak tracking
  * FragranceBingo.tsx — daily seeded 5×5 bingo card (viral game)
- 4 server-component route pages built under `src/app/tools/{fragrance-radar,wardrobe-builder,scent-memory,fragrance-bingo}/page.tsx`
- `src/app/tools/page.tsx` updated to list 11 tools + ItemList JSON-LD
- `bun run lint` clean (0 errors, 0 warnings)
- All 5 routes return HTTP 200 against running dev server
- Worklog appended to `/home/z/my-project/worklog.md`
