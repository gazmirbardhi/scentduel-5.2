import type { Metadata } from "next";
import { notFound } from "next/navigation";
import fragrances from "@/data/fragrances.json";
import {
  brandSlugs,
  getBrand,
  type Brand,
} from "@/lib/brandsData";
import { getPostsByBrand } from "@/lib/posts";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FragranceCard } from "@/components/cards/fragrance-card";
import { PostCard } from "@/components/cards/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return brandSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) {
    return buildMetadata({
      title: "Brand not found",
      description: "The requested fragrance brand could not be found.",
      path: `/brands/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${brand.name} — Fragrance Brand Profile`,
    description: `${brand.name} — ${brand.tagline} ${brand.description.slice(0, 140)}`,
    path: `/brands/${slug}`,
  });
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function buildBrandJsonLd(brand: Brand) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    description: brand.description,
    foundingDate: String(brand.founded),
    foundingLocation: brand.country,
    slogan: brand.tagline,
    url: abs(`/brands/${brand.slug}`),
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const fragrancesByBrand = fragrances.filter(
    (f) => f.brandSlug === brand.slug
  );
  const relatedPosts = getPostsByBrand(slug).slice(0, 3);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Brands", url: "/brands" },
    { name: brand.name, url: `/brands/${brand.slug}` },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Brands", href: "/brands" },
          { label: brand.name },
        ]}
      />

      <header className="mt-6 mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {brand.name}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {brand.country} &middot; Founded {brand.founded}
        </p>
        {brand.tagline && (
          <p className="mt-3 font-serif text-lg italic text-foreground/80">
            &ldquo;{brand.tagline}&rdquo;
          </p>
        )}
      </header>

      <section className="space-y-4 text-base leading-relaxed text-foreground/90">
        {splitParagraphs(brand.description).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      {brand.notablePerfumes.length > 0 && (
        <section aria-label="Notable perfumes">
          <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
            Notable Perfumes
          </h2>
          <ul className="flex flex-wrap gap-2">
            {brand.notablePerfumes.map((perfume) => (
              <li key={perfume}>
                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                  {perfume}
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
        {fragrancesByBrand.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fragrancesByBrand.map((fragrance) => (
              <FragranceCard key={fragrance.slug} fragrance={fragrance} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No fragrances from {brand.name} are currently in our review
            database.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBrandJsonLd(brand)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
