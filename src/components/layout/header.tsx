"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Sun,
  Moon,
  BookOpen,
  Swords,
  Layers,
  Building2,
  UserRound,
  Sparkles,
  X,
} from "lucide-react";
import { siteConfig } from "@/lib/site";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
}

const mobileNavItems: MobileNavItem[] = [
  { label: "Reviews", href: "/categories/reviews", icon: <BookOpen className="h-6 w-6" />, description: "In-depth fragrance reviews" },
  { label: "Comparisons", href: "/categories/comparisons", icon: <Swords className="h-6 w-6" />, description: "Head-to-head matchups" },
  { label: "Note Glossary", href: "/notes", icon: <Layers className="h-6 w-6" />, description: "55 ingredient profiles" },
  { label: "Brands", href: "/brands", icon: <Building2 className="h-6 w-6" />, description: "12 house profiles" },
  { label: "Perfumers", href: "/perfumers", icon: <UserRound className="h-6 w-6" />, description: "9 master noses" },
  { label: "Tools", href: "/tools", icon: <Sparkles className="h-6 w-6" />, description: "11 free tools & games" },
];

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
      role="banner"
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:h-18">
        {/* Logo + site name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-xl font-bold tracking-tight"
          aria-label={`${siteConfig.name} home`}
        >
          <img
            src="/images/icons/logo.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg"
            aria-hidden="true"
          />
          <span className="hidden sm:inline">{siteConfig.name}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                isActive(item.href) && "bg-accent text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            className="h-11 w-11"
          >
            {theme === "light" ? <Moon className="!h-6 !w-6" /> : <Sun className="!h-6 !w-6" />}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 md:hidden"
                aria-label="Open navigation menu"
              >
                <Menu className="!h-7 !w-7" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-sm p-0">
              {/* Mobile menu header */}
              <SheetHeader className="border-b border-border px-5 py-5">
                <div className="flex items-center justify-between">
                  <SheetTitle asChild>
                    <Link href="/" className="flex items-center gap-2.5 font-serif text-lg font-bold">
                      <img
                        src="/images/icons/logo.svg"
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-lg"
                        aria-hidden="true"
                      />
                      {siteConfig.name}
                    </Link>
                  </SheetTitle>
                </div>
              </SheetHeader>

              {/* Mobile nav links — large touch targets with icons */}
              <nav className="flex flex-col gap-1.5 p-4" aria-label="Mobile navigation">
                {mobileNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3.5 rounded-xl px-4 py-3.5 transition-colors hover:bg-accent",
                      isActive(item.href) && "bg-accent"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
                        isActive(item.href) && "bg-primary text-primary-foreground"
                      )}
                      aria-hidden="true"
                    >
                      {item.icon}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-base font-semibold leading-tight">{item.label}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Mobile footer links */}
              <div className="mt-2 border-t border-border px-4 py-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <Link href="/about" className="hover:text-foreground">About</Link>
                  <Link href="/contact" className="hover:text-foreground">Contact</Link>
                  <Link href="/disclaimer" className="hover:text-foreground">Disclosure</Link>
                  <Link href="/feed.xml" className="hover:text-foreground">RSS</Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
