import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { getNote, getNotesBySlugs } from "@/lib/notesData";
import { getBrandsBySlugs } from "@/lib/brandsData";
import { getPerfumersBySlugs } from "@/lib/perfumersData";
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { ReadingProgress } from "@/components/blog/reading-progress";
import { PostContent } from "@/components/blog/post-content";
import { ReviewPoll } from "@/components/blog/review-poll";
import { AffiliateDisclosure } from "@/components/blog/affiliate-disclosure";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Tldr } from "@/components/blog/tldr";
import { AiQuickQuestion } from "@/components/blog/ai-quick-question";
import { PostCard } from "@/components/cards/post-card";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, User, Tag } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return buildMetadata({ title: "Not found", description: "", path: "/" });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.featuredImage,
    type: "article",
    publishedTime: post.publishDateISO,
    modifiedTime: post.updatedDate,
    canonical: post.canonical,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const category = getCategory(post.category);
  const relatedNotes = getNotesBySlugs(post.relatedNotes);
  const relatedBrands = getBrandsBySlugs(post.relatedBrands);
  const relatedPerfumers = getPerfumersBySlugs(post.relatedPerfumers);
  const relatedPosts = getRelatedPosts(slug, 3);

  const publishDate = new Date(post.publishDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // JSON-LD: BlogPosting schema. Rating is sourced from the editorial verdict
  // in the post body, NEVER from the localStorage ReviewPoll. See ReviewPoll
  // component for the seeded-data caveat.
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: `${siteConfig.url}${post.featuredImage}`,
    datePublished: post.publishDateISO,
    dateModified: post.updatedDate ?? post.publishDateISO,
    author: {
      "@type": "Person",
      name: post.author,
      url: `${siteConfig.url}/author`,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.canonical,
    },
    articleSection: category?.label,
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
  };

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Articles", url: "/blog" },
    ...(category ? [{ name: category.label, url: `/categories/${category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <ReadingProgress />
      <article data-reading-target className="container mx-auto max-w-6xl px-4 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Articles", href: "/blog" },
            ...(category ? [{ label: category.label, href: `/categories/${category.slug}` }] : []),
            { label: post.title },
          ]}
        />

        <header className="mt-6 mb-8">
          {category && (
            <Link href={`/categories/${category.slug}`}>
              <Badge variant="secondary" className="mb-3 hover:bg-accent">
                {category.label}
              </Badge>
            </Link>
          )}
          <h1 className="font-serif text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" aria-hidden="true" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <time dateTime={post.publishDateISO}>{publishDate}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              {post.readingMinutes} min read
            </span>
          </div>
        </header>

        {/* Hero image — full-width banner */}
        <figure className="mb-8 -mx-4 md:mx-0 md:rounded-xl overflow-hidden bg-muted">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <img
              src={post.featuredImage}
              alt={post.featuredImageAlt}
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
          <figcaption className="sr-only">{post.featuredImageAlt}</figcaption>
        </figure>

        {/* Mobile TOC — collapsible, shown above the body */}
        <TableOfContents items={post.toc} />

        {/* Desktop layout: body + sticky TOC sidebar */}
        <div className="flex gap-10">
          <div className="min-w-0 flex-1 max-w-3xl">
            {/* TL;DR */}
            {post.tldr && <Tldr text={post.tldr} />}

            <PostContent content={post.content} />
          </div>
          {/* Desktop TOC sidebar */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <TableOfContents items={post.toc} />
          </aside>
        </div>

        {/* Affiliate disclosure */}
        <div className="mt-8">
          <AffiliateDisclosure variant="inline" />
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="font-normal">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="my-8 border-t border-border" />

        {/* Review Poll — embedded in comparison/review posts */}
        <ReviewPoll postSlug={post.slug} postTitle={post.title} />

        {/* Cross-links to notes, brands, perfumers */}
        {(relatedNotes.length > 0 || relatedBrands.length > 0 || relatedPerfumers.length > 0) && (
          <section className="my-8">
            <h2 className="mb-4 font-serif text-2xl font-bold">Explore related</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {relatedNotes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes in this fragrance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {relatedNotes.map((note) => (
                        <li key={note.slug}>
                          <Link
                            href={`/notes/${note.slug}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {note.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{note.family}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {relatedBrands.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Brand</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {relatedBrands.map((brand) => (
                        <li key={brand.slug}>
                          <Link
                            href={`/brands/${brand.slug}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {brand.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {brand.country} · Est. {brand.founded}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {relatedPerfumers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Perfumer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {relatedPerfumers.map((perfumer) => (
                        <li key={perfumer.slug}>
                          <Link
                            href={`/perfumers/${perfumer.slug}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {perfumer.name}
                          </Link>
                          <p className="text-xs text-muted-foreground">{perfumer.nationality}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 font-serif text-2xl font-bold">Related articles</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <PostCard key={rp.slug} post={rp} compact />
              ))}
            </div>
          </section>
        )}

        {/* AI Quick Questions — FAQPage JSON-LD for AI search attribution */}
        {post.aiQuestions.length > 0 && (
          <AiQuickQuestion
            questions={post.aiQuestions}
            postTitle={post.title}
            postUrl={`${siteConfig.url}/blog/${post.slug}`}
          />
        )}
      </article>
    </>
  );
}
