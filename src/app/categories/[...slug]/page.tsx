import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getPostsByCategory } from "@/lib/posts";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { PostCard } from "@/components/cards/post-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * dynamicParams = false: a category slug not in generateStaticParams renders
 * the custom 404 rather than a server error. With static export there is no
 * server to fall back to.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  // Each category slug may be single-segment ("reviews") or multi-segment
  // ("seasonal/winter", "notes/vanilla"). Split on "/" to produce the param
  // array the catch-all route expects.
  return categories.map((c) => ({
    slug: c.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug: segs } = await params;
  const slugPath = segs.join("/");
  const category = getCategory(slugPath);
  if (!category) return buildMetadata({ title: "Category not found", description: "", path: "/" });
  return buildMetadata({
    title: category.title,
    description: category.description,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug: segs } = await params;
  const slugPath = segs.join("/");
  const category = getCategory(slugPath);
  if (!category) notFound();

  const posts = getPostsByCategory(category.slug);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/blog" },
    { name: category.label, url: `/categories/${category.slug}` },
  ]);

  // ItemList JSON-LD for the category index.
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.title,
    description: category.description,
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/blog/${p.slug}`,
      name: p.title,
    })),
  };

  // Build breadcrumb segments for nested categories (e.g. seasonal/winter).
  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: "Home", href: "/" },
    { label: "Articles", href: "/blog" },
  ];
  if (segs.length > 1) {
    // For nested categories, show the parent segment as a breadcrumb.
    breadcrumbItems.push({ label: segs[0] });
  }
  breadcrumbItems.push({ label: category.label });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <Breadcrumbs items={breadcrumbItems} />

      <header className="mt-4 mb-8">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">{category.title}</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{category.intro}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "article" : "articles"} in this category.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">
            No articles in this category yet. Check back soon — new reviews are
            published weekly.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            ← Browse all articles
          </Link>
        </div>
      )}

      {/* Other categories */}
      <section className="mt-16">
        <h2 className="mb-4 font-serif text-2xl font-bold">Other categories</h2>
        <div className="flex flex-wrap gap-2">
          {categories
            .filter((c) => c.slug !== category.slug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:border-primary hover:bg-accent"
              >
                {c.label}
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
