import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SprayCalculator } from "@/components/tools/SprayCalculator";

export const metadata: Metadata = buildMetadata({
  title: "Spray Calculator — Personalized Fragrance Application Guide",
  description:
    "Answer four quick questions about your fragrance, setting, skin type, and strength preference to get a personalized spray count and an application-point guide. Free, in-browser, no data collected.",
  path: "/tools/spray-calculator",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Spray Calculator",
    url: abs("/tools/spray-calculator"),
    description:
      "Answer four quick questions to get a personalized spray count and application-point guide based on concentration, setting, skin type, and strength preference.",
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

export default function SprayCalculatorToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Spray Calculator", url: "/tools/spray-calculator" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Spray Calculator" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Spray Calculator
      </h1>
      <p className="mt-2 text-muted-foreground">
        Answer four quick questions about your fragrance concentration, setting,
        skin type, and strength preference to get a personalized spray count
        and an application-point guide. The calculator also explains every
        modifier it applied so you can tweak your routine with intent.
      </p>
      <div className="mt-8">
        <SprayCalculator />
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
