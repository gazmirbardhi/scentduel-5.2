"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { Sparkles } from "lucide-react";
import fragrances from "@/data/fragrances.json";
import sotdData from "@/data/sotd-leaderboard.json";
import { getBrand } from "@/lib/brandsData";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

type Fragrance = (typeof fragrances)[number];

const STORAGE_KEY = "scentduel-sotd";

interface SotdEntry {
  slug: string;
  timestamp: number;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Returns the raw localStorage string for the SOTD entry (or null on the
 * server / when unset). Strings are referentially stable so this satisfies
 * useSyncExternalStore's snapshot contract.
 */
function useRawSotd(): string | null {
  const getSnapshot = useCallback((): string | null => {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }, []);

  const getServerSnapshot = useCallback((): string | null => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function parseSotd(raw: string | null): SotdEntry | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      value &&
      typeof value === "object" &&
      "slug" in value &&
      "timestamp" in value &&
      typeof (value as SotdEntry).slug === "string" &&
      typeof (value as SotdEntry).timestamp === "number"
    ) {
      return value as SotdEntry;
    }
  } catch {
    // Malformed storage; treat as no pick.
  }
  return null;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return new Date(timestamp).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fragranceLabel(f: Fragrance): string {
  const brand = getBrand(f.brandSlug);
  return brand ? `${f.name} — ${brand.name}` : f.name;
}

function notifyStorageChange() {
  // Same-tab writes don't fire the native `storage` event; dispatch one so
  // useSyncExternalStore re-reads the snapshot.
  try {
    window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
  } catch {
    // StorageEvent constructor may be unavailable in older browsers; the
    // next render will still pick up the new value via React's state update.
  }
}

export function SotdWidget() {
  const raw = useRawSotd();
  const entry = useMemo(() => parseSotd(raw), [raw]);

  const selectedFragrance = useMemo(() => {
    if (!entry) return undefined;
    return fragrances.find((f) => f.slug === entry.slug);
  }, [entry]);

  const topFive = useMemo(() => sotdData.leaderboard.slice(0, 5), []);

  function handlePick(slug: string) {
    const newEntry: SotdEntry = { slug, timestamp: Date.now() };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntry));
      notifyStorageChange();
    } catch {
      // Storage may be unavailable (private mode); the Select's controlled
      // value won't persist but the dropdown remains interactive.
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          Scent of the Day
        </CardTitle>
        <CardDescription className="text-xs">
          Pick what you&apos;re wearing today. Saved to this browser only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={entry?.slug ?? ""} onValueChange={handlePick}>
          <SelectTrigger
            className="w-full"
            aria-label="Pick your Scent of the Day"
          >
            <SelectValue placeholder="Choose a fragrance…" />
          </SelectTrigger>
          <SelectContent>
            <ScrollArea className="h-72">
              {fragrances.map((f) => (
                <SelectItem key={f.slug} value={f.slug}>
                  {fragranceLabel(f)}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        {selectedFragrance && entry ? (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Your SOTD
            </p>
            <p className="font-serif font-semibold text-foreground">
              {selectedFragrance.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Selected {formatRelativeTime(entry.timestamp)}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven&apos;t picked a Scent of the Day yet.
          </p>
        )}

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Community Leaderboard
          </h4>
          <ScrollArea className="max-h-64 rounded-md border border-border">
            <ol className="divide-y divide-border">
              {topFive.map((row) => {
                const fragrance = fragrances.find(
                  (f) => f.slug === row.fragranceSlug,
                );
                const brand = fragrance
                  ? getBrand(fragrance.brandSlug)
                  : undefined;
                const isSelected = entry?.slug === row.fragranceSlug;
                return (
                  <li
                    key={row.fragranceSlug}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2",
                      isSelected && "bg-accent/40",
                    )}
                  >
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground"
                      aria-hidden="true"
                    >
                      {row.rank}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {fragrance?.name ?? row.fragranceSlug}
                      </p>
                      {brand && (
                        <p className="truncate text-xs text-muted-foreground">
                          {brand.name}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                      {row.picks.toLocaleString()} picks
                    </span>
                  </li>
                );
              })}
            </ol>
          </ScrollArea>
          <p className="text-[11px] italic text-muted-foreground">
            Leaderboard is illustrative seeded data, updated periodically by the
            site owner.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
