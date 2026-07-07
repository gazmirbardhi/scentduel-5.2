import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BatchChecker } from "@/components/tools/BatchChecker";

export const metadata: Metadata = buildMetadata({
  title: "Batch Code Checker — Fragrance Batch Decoder (Demo)",
  description:
    "Decode fragrance batch codes with this educational, demo-only lookup tool. Illustrative samples and brand-format explanations — not an official manufacturer database and not proof of authenticity.",
  path: "/tools/batch-checker",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Batch Code Checker",
    url: abs("/tools/batch-checker"),
    description:
      "Decode fragrance batch codes with this educational, demo-only lookup tool. Illustrative samples and brand-format explanations — not an official manufacturer database.",
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

export default function BatchCheckerToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Batch Code Checker", url: "/tools/batch-checker" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Batch Code Checker" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Batch Code Checker
      </h1>
      <p className="mt-2 text-muted-foreground">
        Decode the format of common fragrance batch codes and see how a
        production date is typically derived from them.{" "}
        <strong className="font-semibold text-foreground">
          This tool is strictly educational and demo-only
        </strong>{" "}
        — it uses illustrative sample codes, not an official manufacturer
        database, and it must not be relied on as proof of authenticity or as
        a counterfeiting detector. Always verify with the brand or an
        authorized retailer before any purchase decision.
      </p>
      <div className="mt-8">
        <BatchChecker />
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
