import Link from "next/link";
import { ArrowRight, Flame, Layers, Swords, Sparkles } from "lucide-react";
import { getAllPosts, getRelatedPosts } from "@/lib/posts";
import { categories } from "@/lib/categories";
import { notes, getNote } from "@/lib/notesData";
import { brands } from "@/lib/brandsData";
import { perfumers } from "@/lib/perfumersData";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PostCard } from "@/components/cards/post-card";
import { NoteCard } from "@/components/cards/note-card";
import { SotdWidget as SOTDWidget } from "@/components/blog/sotd-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import fragrances from "@/data/fragrances.json";

export const metadata = buildMetadata({
  title: `${siteConfig.name} — Fragrance Reviews, Comparisons & Tools`,
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPosts = posts.slice(0, 4);
  const recentPost = posts[0];
  const topRated = [...fragrances]
    .sort((a, b) => b.complimentFactor - a.complimentFactor)
    .slice(0, 5);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <div>
              <Badge variant="secondary" className="mb-4 gap-1.5">
                <Sparkles className="h-3 w-3" aria-hidden="true" /> Fragrance intelligence
              </Badge>
              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Find your signature scent.{" "}
                <span className="text-primary">Duel the rest.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-muted-foreground">
                In-depth fragrance reviews, head-to-head comparisons, an ingredient
                glossary, and seven free interactive tools — built to help you stop
                blind-buying and start smelling deliberate.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/blog">
                    Read reviews
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/tools">
                    <Swords className="mr-2 h-4 w-4" aria-hidden="true" />
                    Try the tools
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {posts.length} articles · {notes.length} notes · {brands.length} brands ·{" "}
                {perfumers.length} perfumers · {fragrances.length} fragrances in the database
              </p>
            </div>
            <div className="hidden lg:block">
              <SOTDWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile SOTD */}
      <section className="container mx-auto max-w-6xl px-4 py-8 lg:hidden">
        <SOTDWidget />
      </section>

      {/* Featured reviews */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold md:text-3xl">Latest reviews</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Long-form, structured fragrance reviews — top to dry-down.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/blog">
              All articles
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* Tools teaser */}
      <section className="border-y border-border bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-bold md:text-3xl">
                Seven free fragrance tools
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All client-side, no account, no data leaves your browser.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/tools">
                All tools
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ToolTeaser
              href="/tools/scent-dueler"
              icon={<Swords className="h-5 w-5" />}
              title="Scent Dueler"
              desc="Compare two fragrances head-to-head."
            />
            <ToolTeaser
              href="/tools/scent-matcher"
              icon={<Layers className="h-5 w-5" />}
              title="Scent Matcher"
              desc="Check if two notes layer well."
            />
            <ToolTeaser
              href="/tools/blind-buy-risk"
              icon={<Flame className="h-5 w-5" />}
              title="Blind Buy Risk"
              desc="Should you blind-buy? Find your risk score."
            />
            <ToolTeaser
              href="/tools/fragrance-quiz"
              icon={<Sparkles className="h-5 w-5" />}
              title="Personality Quiz"
              desc="5 questions, 3 recommendations."
            />
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section className="container mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 font-serif text-2xl font-bold md:text-3xl">Browse by category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary hover:bg-accent"
            >
              <div className="text-sm font-semibold group-hover:text-primary">{cat.label}</div>
              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {cat.description}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Notes + top fragrances */}
      <section className="border-t border-border bg-secondary/30">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-serif text-2xl font-bold">Note glossary</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/notes">
                    All notes
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {notes.slice(0, 6).map((note) => (
                  <NoteCard key={note.slug} note={note} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-6 flex items-end justify-between">
                <h2 className="font-serif text-2xl font-bold">Top compliment-getters</h2>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/tools/scent-dueler">
                    Compare
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">By compliment factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {topRated.map((f, i) => (
                      <li key={f.slug} className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{f.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {brands.find((b) => b.slug === f.brandSlug)?.name}
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {f.complimentFactor}/10
                        </Badge>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ToolTeaser({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary hover:bg-accent"
    >
      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </span>
      <span className="font-semibold group-hover:text-primary">{title}</span>
      <span className="mt-1 text-sm text-muted-foreground">{desc}</span>
    </Link>
  );
}
