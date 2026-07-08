import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { WardrobeBuilder } from "@/components/tools/WardrobeBuilder";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Wardrobe Builder — Collection Gap Analysis",
  description:
    "Add the fragrances you own and instantly see which seasons, occasions, and note families your wardrobe covers — and where the gaps are. Get personalized recommendations to round out your collection. Saved on your device.",
  path: "/tools/wardrobe-builder",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fragrance Wardrobe Builder",
    url: abs("/tools/wardrobe-builder"),
    description:
      "Add the fragrances you own and instantly see which seasons, occasions, and note families your wardrobe covers — and where the gaps are.",
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

export default function WardrobeBuilderToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Wardrobe Builder", url: "/tools/wardrobe-builder" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Wardrobe Builder" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Fragrance Wardrobe Builder
      </h1>
      <p className="mt-2 text-muted-foreground">
        Build your fragrance wardrobe from our database of 58 scents and we&apos;ll
        analyze the gaps in your collection. See at a glance which seasons
        (Spring, Summer, Fall, Winter), occasions (Office, Date night, Night
        out, Special occasion), and note families (Citrus, Woody, Amber,
        Gourmand, and more) are covered — then get personalized recommendations
        for what to sample next. Your wardrobe is saved on this device, no
        account needed.
      </p>
      <div className="mt-8">
        <WardrobeBuilder />
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
