import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fragrances from "@/data/fragrances.json";
import {
  perfumerSlugs,
  getPerfumer,
  type Perfumer,
} from "@/lib/perfumersData";
import { getPostsByPerfumer } from "@/lib/posts";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FragranceCard } from "@/components/cards/fragrance-card";
import { PostCard } from "@/components/cards/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return perfumerSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const perfumer = getPerfumer(slug);
  if (!perfumer) {
    return buildMetadata({
      title: "Perfumer not found",
      description: "The requested perfumer could not be found.",
      path: `/perfumers/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${perfumer.name} — Perfumer Profile`,
    description: `${perfumer.name} — ${perfumer.signature} ${perfumer.bio.slice(0, 140)}`,
    path: `/perfumers/${slug}`,
  });
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function buildPerfumerJsonLd(perfumer: Perfumer) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfumer.name,
    description: perfumer.bio,
    jobTitle: "Perfumer",
    nationality: perfumer.nationality,
    knowsAbout: perfumer.signature,
    url: abs(`/perfumers/${perfumer.slug}`),
  };
}

export default async function PerfumerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const perfumer = getPerfumer(slug);
  if (!perfumer) notFound();

  const fragrancesByPerfumer = fragrances.filter(
    (f) => f.perfumerSlug === perfumer.slug
  );
  const relatedPosts = getPostsByPerfumer(slug).slice(0, 3);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Perfumers", url: "/perfumers" },
    { name: perfumer.name, url: `/perfumers/${perfumer.slug}` },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Perfumers", href: "/perfumers" },
          { label: perfumer.name },
        ]}
      />

      <header className="mt-6 mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {perfumer.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {perfumer.nationality} &middot; {perfumer.born}
        </p>
      </header>

      <section aria-label="Signature style">
        <h2 className="font-serif text-2xl font-bold mt-10 mb-4">Signature</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          {perfumer.signature}
        </p>
      </section>

      <section
        aria-label="Biography"
        className="mt-8 space-y-4 text-base leading-relaxed text-foreground/90"
      >
        {splitParagraphs(perfumer.bio).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      {perfumer.notableCreations.length > 0 && (
        <section aria-label="Notable creations">
          <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
            Notable Creations
          </h2>
          <ul className="flex flex-wrap gap-2">
            {perfumer.notableCreations.map((creation) => (
              <li key={creation}>
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                  {creation}
                </Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-label="Fragrances in our database">
        <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
          Fragrances in Our Database
        </h2>
        {fragrancesByPerfumer.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fragrancesByPerfumer.map((fragrance) => (
              <FragranceCard key={fragrance.slug} fragrance={fragrance} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No fragrances credited to {perfumer.name} are currently in our
            review database.
          </p>
        )}
      </section>

      {relatedPosts.length > 0 && (
        <section aria-label="Related articles">
          <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPerfumerJsonLd(perfumer)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
