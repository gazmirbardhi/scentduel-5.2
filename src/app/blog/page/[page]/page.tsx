import Link from "next/link";
import { notFound } from "next/navigation";
import { getPaginatedPosts } from "@/lib/posts";
import { buildMetadata } from "@/lib/seo";
import { PostCard } from "@/components/cards/post-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ page: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const { totalPages } = getPaginatedPosts(1);
  // Pages 2..totalPages. Page 1 is served at /blog.
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    page: String(i + 2),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr, 10);
  if (isNaN(page) || page < 2) return buildMetadata({ title: "Articles", description: "", path: "/blog" });
  const { totalPages } = getPaginatedPosts(page);
  if (page > totalPages) return buildMetadata({ title: "Articles", description: "", path: "/blog" });
  return buildMetadata({
    title: `Articles — Page ${page}`,
    description: `Fragrance reviews and comparisons, page ${page} of ${totalPages}.`,
    path: `/blog/page/${page}`,
  });
}

export default async function BlogPaginationPage({ params }: PageProps) {
  const { page: pageStr } = await params;
  const page = parseInt(pageStr, 10);
  const { posts, totalPages } = getPaginatedPosts(page);
  if (posts.length === 0) notFound();

  const prevPage = page > 1 ? (page === 2 ? "/blog" : `/blog/page/${page - 1}`) : null;
  const nextPage = page < totalPages ? `/blog/page/${page + 1}` : null;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Articles", href: "/blog" },
          { label: `Page ${page}` },
        ]}
      />

      <header className="mt-4 mb-8">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Articles — Page {page}</h1>
        <p className="mt-2 text-muted-foreground">
          Page {page} of {totalPages}.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      <nav className="mt-10 flex items-center justify-between" aria-label="Pagination">
        <div>
          {prevPage && (
            <Button asChild variant="outline" size="sm">
              <Link href={prevPage} rel="prev">
                ← Previous
              </Link>
            </Button>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <div>
          {nextPage && (
            <Button asChild variant="outline" size="sm">
              <Link href={nextPage} rel="next">
                Next →
              </Link>
            </Button>
          )}
        </div>
      </nav>
    </div>
  );
}
