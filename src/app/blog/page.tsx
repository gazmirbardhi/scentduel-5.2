import Link from "next/link";
import { getAllPosts, getPaginatedPosts, POSTS_PER_PAGE } from "@/lib/posts";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PostCard } from "@/components/cards/post-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";

export const metadata = buildMetadata({
  title: "All Articles — Fragrance Reviews & Comparisons",
  description:
    "Every fragrance review, comparison, and guide on ScentDuel — sorted newest first. Filter by category, note, or brand.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const { posts, totalPages } = getPaginatedPosts(1);
  const allPosts = getAllPosts();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Articles", url: "/blog" },
            ])
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Articles" }]} />

      <header className="mt-4 mb-8">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">All Articles</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {allPosts.length} fragrance reviews, comparisons, and guides — sorted newest
          first. Every article follows the same structure: opening, heart, base,
          performance, value, and a clear verdict.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <span className="text-sm text-muted-foreground">Page 1 of {totalPages}</span>
          {totalPages > 1 && (
            <Button asChild variant="outline" size="sm">
              <Link href="/blog/page/2" rel="next">
                Next page →
              </Link>
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
