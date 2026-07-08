import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ScentMemory } from "@/components/tools/ScentMemory";

export const metadata: Metadata = buildMetadata({
  title: "Scent Memory — Guess the Fragrance",
  description:
    "A replayable fragrance guessing game. Read the note list, then pick which of four fragrances contains all of those notes. Track your streak and accuracy. Free, in-browser, no account.",
  path: "/tools/scent-memory",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Scent Memory",
    url: abs("/tools/scent-memory"),
    description:
      "A replayable fragrance guessing game. Read the note list, then pick which of four fragrances contains all of those notes. Track your streak and accuracy.",
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

export default function ScentMemoryToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Scent Memory", url: "/tools/scent-memory" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Scent Memory" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Scent Memory — Guess the Fragrance
      </h1>
      <p className="mt-2 text-muted-foreground">
        Test your nose and your fragrance knowledge. We&apos;ll show you a list of
        notes — your job is to pick which of four fragrances contains every one
        of them. Build a streak, track your accuracy, and learn the building
        blocks of each scent as you go. The questions pull randomly from our
        58-fragrance database, so it&apos;s never the same game twice.
      </p>
      <div className="mt-8">
        <ScentMemory />
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
