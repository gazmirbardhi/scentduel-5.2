/**
 * Internal-link integrity checker.
 *
 * Walks every post, note, brand, and perfumer's declared cross-links and
 * fails (exits non-zero) if any target slug doesn't exist in the
 * corresponding data source. Run via `npm run check-links` (or `bun run check-links`).
 *
 * This is what makes "no broken links" verifiable rather than just asserted.
 */
import { getAllPosts } from "@/lib/posts";
import { notes, noteSlugs } from "@/lib/notesData";
import { brands, brandSlugs } from "@/lib/brandsData";
import { perfumers, perfumerSlugs } from "@/lib/perfumersData";
import { categories, categorySlugs } from "@/lib/categories";
import fragrances from "@/data/fragrances.json";

interface BrokenLink {
  source: string;
  field: string;
  target: string;
  reason: string;
}

const errors: BrokenLink[] = [];

function check(
  source: string,
  field: string,
  target: string | undefined,
  validSet: string[]
) {
  if (!target) return;
  if (!validSet.includes(target)) {
    errors.push({ source, field, target, reason: `slug "${target}" not found` });
  }
}

// 1. Posts → notes, brands, perfumers, category
const posts = getAllPosts();
for (const post of posts) {
  check(post.slug, "category", post.category, categorySlugs);
  for (const n of post.relatedNotes) {
    check(post.slug, "relatedNotes", n, noteSlugs);
  }
  for (const b of post.relatedBrands) {
    check(post.slug, "relatedBrands", b, brandSlugs);
  }
  for (const p of post.relatedPerfumers) {
    check(post.slug, "relatedPerfumers", p, perfumerSlugs);
  }
}

// 2. Notes → relatedNotes
for (const note of notes) {
  for (const r of note.relatedNotes) {
    check(note.slug, "relatedNotes", r, noteSlugs);
  }
}

// 3. Brands → relatedPosts
const postSlugs = posts.map((p) => p.slug);
for (const brand of brands) {
  for (const r of brand.relatedPosts) {
    check(brand.slug, "relatedPosts", r, postSlugs);
  }
}

// 4. Perfumers → fragrancesCredited, relatedPosts
const fragranceSlugs = fragrances.map((f) => f.slug);
for (const perfumer of perfumers) {
  for (const f of perfumer.fragrancesCredited) {
    check(perfumer.slug, "fragrancesCredited", f, fragranceSlugs);
  }
  for (const r of perfumer.relatedPosts) {
    check(perfumer.slug, "relatedPosts", r, postSlugs);
  }
}

// 5. Fragrances → brandSlug, perfumerSlug, noteSlugs
for (const frag of fragrances) {
  const slug = frag.slug as string;
  check(slug, "brandSlug", frag.brandSlug as string, brandSlugs);
  check(slug, "perfumerSlug", frag.perfumerSlug as string, perfumerSlugs);
  for (const n of frag.noteSlugs) {
    check(slug, "noteSlugs", n as string, noteSlugs);
  }
}

// Report
if (errors.length === 0) {
  console.log("✓ check-links: 0 broken cross-links.");
  console.log(
    `  Verified ${posts.length} posts, ${notes.length} notes, ${brands.length} brands, ${perfumers.length} perfumers, ${fragrances.length} fragrances, ${categories.length} categories.`
  );
  process.exit(0);
} else {
  console.error(`✗ check-links: ${errors.length} broken cross-link(s) found:\n`);
  for (const e of errors) {
    console.error(`  ${e.source} → ${e.field}: ${e.reason}`);
  }
  process.exit(1);
}
