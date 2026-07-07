import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team — pitches, corrections, partnership inquiries, and reader mail.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Contact", url: "/contact" },
            ])
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Contact</h1>
      <p className="mt-3 text-muted-foreground">
        Pitch us a fragrance to review, flag a correction, or just tell us what you think.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Editorial</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Fragrance review requests, corrections, and editorial feedback:
            </p>
            <p className="mt-2 font-medium text-foreground">editor@{siteConfig.domain}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Partnerships</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>
              Brand partnerships, affiliate inquiries, and advertising (no paid reviews):
            </p>
            <p className="mt-2 font-medium text-foreground">partners@{siteConfig.domain}</p>
          </CardContent>
        </Card>
      </div>

      <div className="prose-scentduel mt-8">
        <h2>Before you email</h2>
        <ul>
          <li>
            We do not accept paid reviews or sponsored content. Please don&apos;t ask.
          </li>
          <li>
            We&apos;re happy to review fragrances sent as editorial samples, but a sample
            does not guarantee coverage or a positive review.
          </li>
          <li>
            For corrections, please include the URL of the article and the specific error.
            We fix factual mistakes within 48 hours.
          </li>
        </ul>
      </div>
    </div>
  );
}
