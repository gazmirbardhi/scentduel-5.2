import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export const metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles data — localStorage community features, affiliate tracking, and analytics.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Home", url: "/" },
              { name: "Privacy", url: "/privacy" },
            ])
          ),
        }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />

      <h1 className="mt-4 font-serif text-3xl font-bold md:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: November 2024</p>

      <div className="prose-scentduel mt-6">
        <h2>Overview</h2>
        <p>
          {siteConfig.name} is a static website. We do not run a server-side database, we do
          not require an account, and we do not collect personal information from you when
          you read our articles. The only data stored on your device is the result of your
          interactions with our client-side tools.
        </p>

        <h2>Local storage</h2>
        <p>
          The following features use your browser&apos;s localStorage to remember your
          choices. This data never leaves your device:
        </p>
        <ul>
          <li>
            <strong>Theme preference</strong> ({`scentduel-theme`}) — whether you prefer
            light or dark mode.
          </li>
          <li>
            <strong>Scent of the Day</strong> ({`scentduel-sotd`}) — the fragrance you
            selected in the homepage SOTD widget.
          </li>
          <li>
            <strong>Review poll votes</strong> ({`scentduel-poll-{slug}`}) — your slider
            votes on individual review posts.
          </li>
        </ul>
        <p>
          You can clear this data at any time by clearing your browser&apos;s site data for{" "}
          {siteConfig.domain}.
        </p>

        <h2>Affiliate links</h2>
        <p>
          Some links on {siteConfig.name} are affiliate links. When you click an affiliate
          link, the destination retailer may set cookies on your browser to track the
          referral. We do not control these cookies — see the retailer&apos;s privacy
          policy for details. All affiliate links on this site carry{" "}
          <code>rel=&quot;sponsored nofollow noopener&quot;</code> and open in a new tab.
        </p>

        <h2>Analytics</h2>
        <p>
          {siteConfig.name} does not currently run third-party analytics. If we add
          privacy-respecting analytics in the future (such as a self-hosted, cookie-free
          solution), we will update this policy.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          {siteConfig.name} is not directed at children under 13, and we do not knowingly
          collect information from children.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          If we change this privacy policy, we will update the &ldquo;last updated&rdquo;
          date at the top of this page and note the change in our commit history.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy can be sent to{" "}
          <a href="mailto:editor@scentduel.com">editor@{siteConfig.domain}</a>.
        </p>
      </div>
    </div>
  );
}
