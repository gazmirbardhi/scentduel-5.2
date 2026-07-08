import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FragranceRadar } from "@/components/tools/FragranceRadar";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Radar — Visual Comparison Chart",
  description:
    "Overlay two fragrances on a 4-axis radar chart comparing longevity, sillage, value, and compliment factor. Hand-built SVG, normalized scoring, and a raw-numbers comparison table. Free, in-browser, no account.",
  path: "/tools/fragrance-radar",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fragrance Radar",
    url: abs("/tools/fragrance-radar"),
    description:
      "Overlay two fragrances on a 4-axis radar chart comparing longevity, sillage, value, and compliment factor, with a raw-numbers comparison table.",
    applicationCategory: "Utility",
    operatingSystem: "Web Browser",
    browserRequirements: "Requires JavaScript",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    isAccessibleForFree: true,
  };
}

export default function FragranceRadarToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Fragrance Radar", url: "/tools/fragrance-radar" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Fragrance Radar" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Fragrance Radar
      </h1>
      <p className="mt-2 text-muted-foreground">
        Pick two fragrances and overlay their performance profiles on a 4-axis
        radar chart. Longevity is normalized as hours-out-of-12 × 10, while
        sillage, value, and compliment factor are already on a 1–10 scale — so
        the polygons are directly comparable. The raw-numbers table below the
        chart shows you the source data and highlights the winner on each axis.
      </p>
      <div className="mt-8">
        <FragranceRadar />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
