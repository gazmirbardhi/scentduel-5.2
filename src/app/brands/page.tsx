import type { Metadata } from "next";
import { brands } from "@/lib/brandsData";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BrandCard } from "@/components/cards/brand-card";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Brand Directory",
  description:
    "A directory of the fragrance houses we cover on ScentDuel — from heritage French houses like Chanel and Guerlain to niche names like Maison Francis Kurkdjian and Parfums de Marly.",
  path: "/brands",
});

export default function BrandsIndexPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Brands" },
        ]}
      />

      <header className="mt-6 mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Fragrance Brand Directory
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          A directory of the fragrance houses covered on ScentDuel. Each
          profile covers the house&rsquo;s history, in-house perfumer lineage,
          signature style, and the fragrances in our review database. We
          organize houses by their position in the market — heritage French,
          designer, niche, and Middle Eastern value.
        </p>
      </header>

      <section
        aria-label={`${brands.length} fragrance brands`}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {brands.map((brand) => (
          <BrandCard key={brand.slug} brand={brand} />
        ))}
      </section>
    </div>
  );
}
