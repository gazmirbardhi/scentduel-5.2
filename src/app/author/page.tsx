import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = buildMetadata({
  title: "The Author",
  description: `${siteConfig.author.name} — fragrance writer, amateur perfumer, and the nose behind ${siteConfig.name}.`,
  path: "/author",
});

export default function AuthorPage() {
  const a = siteConfig.author;
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: a.name,
            url: `${siteConfig.url}/author`,
            description: a.bio,
            jobTitle: "Fragrance Writer & Editor",
            worksFor: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Author", url: "/author" },
            ])
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Author" }]} />

      <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
        <div
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground"
          aria-hidden="true"
        >
          {a.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <h1 className="font-serif text-3xl font-bold md:text-4xl">{a.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fragrance Writer &amp; Editor, {siteConfig.name}
          </p>
          <p className="mt-4 text-muted-foreground">{a.bio}</p>
        </div>
      </div>

      <div className="prose-scentduel mt-8">
        <h2>Background</h2>
        <p>
          Mara has spent a decade writing about fragrance, starting with a personal blog in
          2014 and contributing to several enthusiast publications before founding{" "}
          {siteConfig.name}. She has trained informally with two working perfumers, keeps a
          personal ingredient library of roughly 400 materials, and tests every fragrance
          she reviews on skin over a minimum of three wearings in multiple weather
          conditions.
        </p>
        <h2>Editorial standards</h2>
        <p>
          Every review on {siteConfig.name} reflects Mara&apos;s personal assessment. She
          does not accept payment for positive coverage, does not allow affiliate
          relationships to influence ratings, and publishes corrections publicly when she
          gets something wrong. Fragrances sent as editorial samples are disclosed in the
          review.
        </p>
      </div>
    </div>
  );
}
