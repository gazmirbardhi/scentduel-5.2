import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ScentMatcher } from "@/components/tools/ScentMatcher";

export const metadata: Metadata = buildMetadata({
  title: "Scent Matcher — Fragrance Note Layering Checker",
  description:
    "Select two notes and instantly see whether they layer well together. The Scent Matcher uses our note-compatibility matrix to grade the pairing and explain the verdict. Free and in-browser.",
  path: "/tools/scent-matcher",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scent Matcher",
    url: abs("/tools/scent-matcher"),
    description:
      "Select two notes and instantly see whether they layer well together, using our note-compatibility matrix.",
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

export default function ScentMatcherToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Scent Matcher", url: "/tools/scent-matcher" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Scent Matcher" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Scent Matcher
      </h1>
      <p className="mt-2 text-muted-foreground">
        Pick two notes and instantly see whether they layer well together. The
        matcher draws on our note-compatibility matrix to grade the pairing
        (poor / cautious / great) and explain the reasoning — handy for
        building your own layering combos or sanity-checking a fragrance
        pyramid.
      </p>
      <div className="mt-8">
        <ScentMatcher />
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
