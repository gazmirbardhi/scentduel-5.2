import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import { notes } from "@/lib/notesData";
import { brands } from "@/lib/brandsData";
import { perfumers } from "@/lib/perfumersData";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts();
  const searchIndex = [
    // Static navigation pages
    { label: "All Reviews", href: "/blog", description: "Browse all fragrance reviews and comparisons", group: "Articles" as const },
    { label: "All Tools", href: "/tools", description: "11 free fragrance tools & games", group: "Articles" as const },
    { label: "About ScentDuel", href: "/about", description: "About this fragrance blog", group: "Articles" as const },
    { label: "The Author", href: "/author", description: "About Mara Ellsworth, fragrance writer", group: "Articles" as const },
    { label: "Contact", href: "/contact", description: "Get in touch", group: "Articles" as const },
    { label: "Affiliate Disclosure", href: "/disclaimer", description: "How affiliate links work", group: "Articles" as const },
    { label: "Privacy Policy", href: "/privacy", description: "Privacy and data handling", group: "Articles" as const },
    // Article pages
    ...posts.map((p) => ({
      label: p.title,
      href: `/blog/${p.slug}`,
      description: p.excerpt.slice(0, 80),
      group: "Articles" as const,
    })),
    // Notes
    ...notes.map((n) => ({
      label: n.name,
      href: `/notes/${n.slug}`,
      description: `${n.family} · ${n.summary.slice(0, 60)}`,
      group: "Notes" as const,
    })),
    // Brands
    ...brands.map((b) => ({
      label: b.name,
      href: `/brands/${b.slug}`,
      description: `${b.country} · Est. ${b.founded}`,
      group: "Brands" as const,
    })),
    // Perfumers
    ...perfumers.map((p) => ({
      label: p.name,
      href: `/perfumers/${p.slug}`,
      description: p.nationality,
      group: "Perfumers" as const,
    })),
  ];

  return NextResponse.json(searchIndex);
}