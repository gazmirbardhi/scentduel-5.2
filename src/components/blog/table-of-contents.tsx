"use client";

import * as React from "react";
import { ListOrdered, ChevronDown } from "lucide-react";
import type { TableOfContentsItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

/**
 * Table of contents for blog posts.
 *
 * - On desktop (lg+): rendered as a sticky sidebar card with active-section
 *   highlighting via scroll tracking.
 * - On mobile: rendered as a collapsible accordion below the title, defaulting
 *   to closed so it doesn't push the article body down.
 */
export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Track which heading is currently in view to highlight it in the TOC.
  React.useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top that's intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 }
    );
    for (const h of headings) observer.observe(h);
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Update hash without jumping
      history.replaceState(null, "", `#${id}`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile: collapsible accordion */}
      <div className="mb-6 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-left"
          aria-expanded={mobileOpen}
          aria-controls="toc-mobile"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            Table of contents
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        {mobileOpen && (
          <nav
            id="toc-mobile"
            className="mt-2 max-h-80 overflow-y-auto rounded-lg border border-border bg-card p-3 scroll-area-thin"
            aria-label="Table of contents"
          >
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => handleClick(e, item.id)}
                    className={cn(
                      "block rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                      item.level === 3 && "pl-6 text-xs",
                      activeId === item.id && "bg-accent font-medium text-foreground"
                    )}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Desktop: sticky sidebar */}
      <nav
        className="hidden lg:block"
        aria-label="Table of contents"
      >
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scroll-area-thin">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </p>
          <ul className="space-y-0.5 border-l border-border">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "block border-l-2 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground -ml-px",
                    item.level === 3 && "pl-6 text-xs",
                    activeId === item.id
                      ? "border-primary font-medium text-foreground"
                      : "border-transparent"
                  )}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
