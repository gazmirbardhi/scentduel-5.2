import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { NameThatNote } from "@/components/tools/NameThatNote";

export const metadata: Metadata = buildMetadata({
  title: "Name That Note — Daily Fragrance Trivia",
  description:
    "One fragrance-trivia question every day. Identify the note, see the explanation, and come back tomorrow for a fresh question. Deterministic by UTC date — free and in-browser.",
  path: "/tools/name-that-note",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Name That Note",
    url: abs("/tools/name-that-note"),
    description:
      "Daily fragrance-trivia question. Identify the note from a clue and see the explanation. New question every UTC day.",
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

export default function NameThatNoteToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Name That Note", url: "/tools/name-that-note" },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Name That Note" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Name That Note
      </h1>
      <p className="mt-2 text-muted-foreground">
        A quick daily ritual for fragrance enthusiasts: read the clue, pick the
        note you think it describes, and see the explanation. A new question
        appears every UTC day, so bookmark this page and make it part of your
        morning routine.
      </p>
      <div className="mt-8">
        <NameThatNote />
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
