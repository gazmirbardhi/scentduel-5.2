import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const metadata = buildMetadata({
  title: "Affiliate Disclosure & Disclaimer",
  description: `ScentDuel's affiliate disclosure, editorial standards, and disclaimers — including the Batch Code Checker demo notice.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Disclaimer", url: "/disclaimer" },
            ])
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />

      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">
        Affiliate Disclosure &amp; Disclaimer
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 2024</p>

      <div className="prose-scentduel mt-6">
        <h2>Affiliate disclosure</h2>
        <p>
          {siteConfig.name} is a reader-supported publication. Some links on this site are
          affiliate links, which means we may earn a commission if you click them and make
          a purchase, at no additional cost to you. Affiliate commissions help cover the
          cost of hosting, fragrance samples, and the time required to produce our reviews.
        </p>
        <p>
          All affiliate links on {siteConfig.name} carry the{" "}
          <code>rel=&quot;sponsored nofollow noopener&quot;</code> attribute and open in a
          new browser tab. This complies with Google&apos;s link-scheme guidelines and the
          U.S. Federal Trade Commission&apos;s endorsement guides.
        </p>
        <p>
          <strong>Affiliate relationships do not influence our editorial content.</strong>{" "}
          A fragrance we dislike receives a negative review regardless of whether we earn a
          commission on it. We do not accept payment for positive coverage.
        </p>

        <h2>Editorial samples</h2>
        <p>
          From time to time, brands or retailers send us editorial samples (free
          fragrances) for review consideration. Receipt of a sample does not guarantee
          coverage or a positive review. When a review is based on an editorial sample
          rather than a retail purchase, we disclose that fact in the review.
        </p>

        <h2>Pricing</h2>
        <p>
          Prices listed in our Deal Finder tables and reviews were accurate at the time of
          writing but may have changed. Always verify the current price on the
          retailer&apos;s site before purchasing.
        </p>

        <h2>Image use</h2>
        <p>
          All images on {siteConfig.name} are original illustrations, labeled placeholders,
          or licensed assets. We do not use brand product photography without a license.
          Bottle silhouettes are generic and do not represent any specific product design.
        </p>
      </div>

      <Alert variant="destructive" className="mt-8 not-prose">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Batch Code Checker — demo notice</AlertTitle>
        <AlertDescription>
          The Batch Code Checker tool at{" "}
          <a href="/tools/batch-checker" className="underline">
            /tools/batch-checker
          </a>{" "}
          is a demo and educational tool. It uses <strong>illustrative, fabricated batch
          codes</strong> to demonstrate how batch-code decoding works in principle. It is{" "}
          <strong>not</strong> an official manufacturer database, it does not verify
          authenticity, and it must not be relied on as proof that a fragrance is genuine
          or counterfeit. Only the brand itself can verify authenticity.
        </AlertDescription>
      </Alert>

      <div className="prose-scentduel mt-8">
        <h2>Community features</h2>
        <p>
          The Scent of the Day leaderboard and the Review Poll &ldquo;Community
          Consensus&rdquo; values are <strong>illustrative seeded data</strong>, not
          live-aggregated user data. The leaderboard is manually curated by the site owner;
          the Review Poll consensus is a deterministic value derived from the post slug.
          Your individual votes and SOTD picks are stored only in your browser&apos;s
          localStorage and are never transmitted to us.
        </p>
        <p>
          We do not wire these simulated values into any JSON-LD structured data. Google&apos;s
          policies require rating and review markup to reflect genuine editorial or user
          input; any rating shown in our structured data is the author&apos;s own editorial
          verdict.
        </p>

        <h2>Fragrance opinions</h2>
        <p>
          Fragrance is subjective. Our reviews reflect one writer&apos;s assessment over a
          limited number of wearings. A fragrance we rate 7/10 might be a 10/10 for you,
          and vice versa. We recommend sampling fragrances on your own skin before buying a
          full bottle, especially at luxury price points.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this disclosure can be sent to{" "}
          <a href="mailto:editor@scentduel.com">editor@{siteConfig.domain}</a>.
        </p>
      </div>
    </div>
  );
}
