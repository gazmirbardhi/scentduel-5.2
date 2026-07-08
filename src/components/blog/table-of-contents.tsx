"use client";

import * as React from "react";
import { ListOrdered, ChevronDown } from "lucide-react";
import type { TableOfContentsItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
  /**
   * "both" (default): renders mobile bar + desktop sidebar (toggled by CSS).
   * "mobile": renders only the mobile sticky bar (for placement in a tall
   *   container so sticky works through the whole article scroll).
   * "desktop": renders only the desktop sidebar.
   */
  variant?: "both" | "mobile" | "desktop";
}

/**
 * Table of contents that adapts to viewport:
 *
 * - **Mobile**: sticky bar below the header. Collapsed by default showing
 *   "On this page" + chevron. Taps expand a scrollable list. Sticks to the
 *   top of the viewport while reading so it's always accessible.
 * - **Desktop (lg+)**: sticky sidebar card with active-section highlighting.
 *
 * For the mobile sticky bar to work, it must be rendered inside a container
 * that spans the full article height. Use variant="mobile" and place it
 * directly in the body column (without a wrapper div that would limit the
 * sticky range).
 */
export function TableOfContents({ items, variant = "both" }: TableOfContentsProps) {
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
      history.replaceState(null, "", `#${id}`);
      setMobileOpen(false);
    }
  };

  const list = (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={cn(
              "block rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              item.level === 3 && "pl-5 text-xs",
              activeId === item.id && "bg-accent/60 font-medium text-foreground"
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  const showMobile = variant === "both" || variant === "mobile";
  const showDesktop = variant === "both" || variant === "desktop";

  // When variant="mobile", we render the sticky bar WITHOUT a <nav> wrapper
  // so the bar's containing block is the tall body column (not a short nav).
  // This is what makes sticky work through the whole article scroll.
  if (variant === "mobile") {
    return (
      <nav
        aria-label="Table of contents"
        className="lg:hidden sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      >
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          aria-expanded={mobileOpen}
          aria-controls="toc-mobile-content"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        {mobileOpen && (
          <div
            id="toc-mobile-content"
            className="max-h-72 overflow-y-auto border-t border-border px-4 py-3 scroll-area-thin"
          >
            {list}
          </div>
        )}
      </nav>
    );
  }

  if (variant === "desktop") {
    return (
      <nav aria-label="Table of contents" className="text-sm hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scroll-area-thin">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </p>
          <div className="border-l border-border pl-2">
            {list}
          </div>
        </div>
      </nav>
    );
  }

  // variant === "both" — render both (used when a single instance handles
  // both breakpoints via CSS show/hide).
  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="lg:hidden sticky top-16 z-30 -mx-4 mb-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
          aria-expanded={mobileOpen}
          aria-controls="toc-mobile-content"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </span>
          <ChevronDown
            className={cn("h-4 w-4 text-muted-foreground transition-transform", mobileOpen && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        {mobileOpen && (
          <div
            id="toc-mobile-content"
            className="max-h-72 overflow-y-auto border-t border-border px-4 py-3 scroll-area-thin"
          >
            {list}
          </div>
        )}
      </div>
      <div className="hidden lg:block">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scroll-area-thin">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ListOrdered className="h-4 w-4 text-primary" aria-hidden="true" />
            On this page
          </p>
          <div className="border-l border-border pl-2">
            {list}
          </div>
        </div>
      </div>
    </nav>
  );
}
