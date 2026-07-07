import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BlindBuyRisk } from "@/components/tools/BlindBuyRisk";

export const metadata: Metadata = buildMetadata({
  title: "Blind Buy Risk Assessor — Should You Buy That Fragrance Unsniffed?",
  description:
    "Check the notes you love and the notes you hate, and the Blind Buy Risk Assessor scores the chance that an unsmelled fragrance will work for you. Free, in-browser, no account required.",
  path: "/tools/blind-buy-risk",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Blind Buy Risk Assessor",
    url: abs("/tools/blind-buy-risk"),
    description:
      "Score the risk that an unsmelled fragrance will work for you by checking the notes you love and the notes you hate.",
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

export default function BlindBuyRiskToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Blind Buy Risk Assessor", url: "/tools/blind-buy-risk" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Blind Buy Risk Assessor" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Blind Buy Risk Assessor
      </h1>
      <p className="mt-2 text-muted-foreground">
        Blind-buying a fragrance is a gamble. Check the notes you already love
        and the notes you already hate, and this tool will score the risk that
        an unsmelled fragrance built around those notes will work for you —
        using the same note-compatibility matrix that powers our Scent Matcher.
        Always sample when you can.
      </p>
      <div className="mt-8">
        <BlindBuyRisk />
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
