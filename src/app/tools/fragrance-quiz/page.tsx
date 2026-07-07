import type { Metadata } from "next";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FragranceQuiz } from "@/components/tools/FragranceQuiz";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Personality Quiz — Find Your Scent Family",
  description:
    "Answer five quick questions about your tastes and get matched to a scent family (Citrus, Woody, Amber, Gourmand, or Fresh) plus three fragrance recommendations from our database. Free, in-browser.",
  path: "/tools/fragrance-quiz",
});

function buildWebAppJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Fragrance Personality Quiz",
    url: abs("/tools/fragrance-quiz"),
    description:
      "Answer five quick questions about your tastes and get matched to a scent family plus three fragrance recommendations.",
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

export default function FragranceQuizToolPage() {
  const webAppJsonLd = buildWebAppJsonLd();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Fragrance Personality Quiz", url: "/tools/fragrance-quiz" },
  ]);

  const postSlugs = getAllPosts().map((p) => p.slug);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools", href: "/tools" },
          { label: "Fragrance Personality Quiz" },
        ]}
      />
      <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight sm:text-4xl">
        Fragrance Personality Quiz
      </h1>
      <p className="mt-2 text-muted-foreground">
        Answer five quick questions about the moods, settings, and textures you
        gravitate toward, and we&apos;ll match you to one of five scent
        families — Citrus, Woody, Amber, Gourmand, or Fresh — with three
        fragrance recommendations from our database. Recommendations that we
        have a full review for will link out to the article.
      </p>
      <div className="mt-8">
        <FragranceQuiz postSlugs={postSlugs} />
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
