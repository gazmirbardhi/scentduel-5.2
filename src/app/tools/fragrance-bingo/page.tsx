import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FragranceBingo } from "@/components/tools/FragranceBingo";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Bingo — Daily Challenge",
  description:
    "A new 5×5 bingo card every day. Mark the squares you've done, get a bingo, and share your card with the fragrance community. Come back tomorrow for a new card. Free, in-browser, no account.",
  path: "/tools/fragrance-bingo",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fragrance Bingo",
    url: abs("/tools/fragrance-bingo"),
    description:
      "A new 5×5 bingo card every day. Mark the squares you've done, get a bingo, and share your card with the fragrance community.",
    applicationCategory: "Game",
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

export default function FragranceBingoToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Fragrance Bingo", url: "/tools/fragrance-bingo" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Fragrance Bingo" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Fragrance Bingo — Daily Challenge
      </h1>
      <p className="mt-2 text-muted-foreground">
        A new 5×5 bingo card every day. Mark the squares you&apos;ve done, get a
        bingo, and share your card with the fragrance community. Come back
        tomorrow for a new card. Everyone gets the same card each UTC day, so
        you can compare with friends — did anyone else get bingo today?
      </p>
      <div className="mt-8">
        <FragranceBingo />
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
