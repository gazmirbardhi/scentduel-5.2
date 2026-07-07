import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { AffiliateDisclosure } from "@/components/blog/affiliate-disclosure";
import { ScentDueler } from "@/components/tools/ScentDueler";

export const metadata: Metadata = buildMetadata({
  title: "Scent Dueler — Head-to-Head Fragrance Comparison",
  description:
    "Pick any two fragrances from our database and compare them side by side on longevity, sillage, value, compliment factor, key notes, and the best retailer price. Free, in-browser, no account required.",
  path: "/tools/scent-dueler",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scent Dueler",
    url: abs("/tools/scent-dueler"),
    description:
      "Pick any two fragrances from our database and compare them side by side on longevity, sillage, value, compliment factor, key notes, and the best retailer price.",
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

export default function ScentDuelerToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Scent Dueler", url: "/tools/scent-dueler" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Scent Dueler" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Scent Dueler
      </h1>
      <p className="mt-2 text-muted-foreground">
        Pick any two fragrances from our database and compare them side by side
        on longevity, sillage, value, compliment factor, key notes, season, and
        occasion. The Deal Finder panel at the bottom aggregates live retailer
        listings across both picks so you can spot the best price.
      </p>
      <div className="mt-8">
        <ScentDueler />
      </div>
      <div className="mt-6">
        <AffiliateDisclosure variant="inline" />
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
