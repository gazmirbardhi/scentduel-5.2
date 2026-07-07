import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Swords, BookOpen, Layers, ShieldCheck } from "lucide-react";

export const metadata = buildMetadata({
  title: "About ScentDuel",
  description:
    "ScentDuel is a fragrance blog and reference directory — reviews, comparisons, an ingredient glossary, and interactive tools to help you find your signature scent.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "About", url: "/about" },
            ])
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">About {siteConfig.name}</h1>

      <div className="prose-scentduel mt-6">
        <p>
          {siteConfig.name} is a fragrance blog and reference directory built for people
          who want to make better scent decisions without becoming perfumery nerds. We
          publish structured reviews, head-to-head comparisons, and curated best-of lists,
          and we back them with a reference directory of fragrance notes, brands, and
          perfumers — plus seven free interactive tools that run entirely in your browser.
        </p>
        <p>
          The site was founded in 2024 on a simple premise: most fragrance content on the
          internet is either too shallow ("top 10 colognes for men!!!") or too deep
          (300-word forum posts about a single synthetic musk). {siteConfig.name} sits in
          the middle — long-form enough to be useful, structured enough to be scannable,
          and opinionated enough to actually help you choose.
        </p>

        <h2>What we publish</h2>
        <div className="not-prose mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" /> Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Long-form, structured reviews covering opening, heart, base, performance,
                value, and a clear verdict.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Swords className="h-4 w-4 text-primary" /> Comparisons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Head-to-head matchups across longevity, sillage, compliments, versatility,
                and value — with a deal-finder table.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Layers className="h-4 w-4 text-primary" /> Reference directory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                An ingredient glossary, brand directory, and perfumer directory — all
                cross-linked from every review.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="h-4 w-4 text-primary" /> Tools
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Seven free, client-side tools: a scent dueler, a note matcher, a spray
                calculator, and more.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2>How we review</h2>
        <p>
          Every review follows the same structure: a scent profile breakdown (top, heart,
          base), a performance assessment (longevity, sillage, versatility), a value
          analysis, a head-to-head against the closest alternative, a FAQ, and a verdict
          with a numeric rating. We test fragrances on skin, in multiple weather
          conditions, over multiple wearings — not from blotter strips in a single sitting.
        </p>

        <h2>Editorial independence</h2>
        <p>
          {siteConfig.name} is reader-supported through affiliate links. Affiliate
          relationships do not influence our ratings or recommendations — a fragrance we
          dislike gets a bad review regardless of whether we earn a commission on it. See
          our <a href="/disclaimer">full affiliate disclosure</a> for details.
        </p>

        <h2>What we don&apos;t do</h2>
        <ul>
          <li>
            We don&apos;t publish &ldquo;top 20&rdquo; listicles padded with fragrances we
            haven&apos;t tested.
          </li>
          <li>
            We don&apos;t use real brand product photography without a license — every image
            on the site is an illustration or a labeled placeholder.
          </li>
          <li>
            We don&apos;t sell fragrances, accept paid placements, or write sponsored
            reviews.
          </li>
        </ul>
      </div>
    </div>
  );
}
