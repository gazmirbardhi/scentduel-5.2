import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { categories } from "@/lib/categories";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="mt-auto border-t border-border bg-secondary/40"
      role="contentinfo"
    >
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-serif text-lg font-bold"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FlaskConical className="h-4 w-4" />
              </span>
              {siteConfig.name}
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Explore
            </h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-muted-foreground hover:text-foreground" href="/blog">All Articles</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/tools">Fragrance Tools</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/notes">Note Glossary</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/brands">Brand Directory</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/perfumers">Perfumer Directory</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              Categories
            </h2>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    className="text-muted-foreground hover:text-foreground"
                    href={`/categories/${c.slug}`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground">
              About
            </h2>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-muted-foreground hover:text-foreground" href="/about">About ScentDuel</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/author">The Author</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/contact">Contact</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/disclaimer">Affiliate Disclosure</Link></li>
              <li><Link className="text-muted-foreground hover:text-foreground" href="/privacy">Privacy Policy</Link></li>
              <li><a className="text-muted-foreground hover:text-foreground" href="/feed.xml">RSS Feed</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {year} {siteConfig.name}. All rights reserved. {siteConfig.name} is a
            reader-supported site. Some links are affiliate links — see our{" "}
            <Link href="/disclaimer" className="underline hover:text-foreground">disclaimer</Link> for details.
          </p>
        </div>
      </div>
    </footer>
  );
}
