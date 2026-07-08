"use client";

import * as React from "react";
import fragrances from "@/data/fragrances.json";
import { getNote } from "@/lib/notesData";
import { getBrand } from "@/lib/brandsData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  Plus,
  CheckCircle2,
  Circle,
  Sparkles,
  Shirt,
} from "lucide-react";

type Fragrance = (typeof fragrances)[number];

const STORAGE_KEY = "scentduel-wardrobe";

/** Canonical seasons we track coverage for. */
const SEASONS = ["Spring", "Summer", "Fall", "Winter"] as const;
type Season = (typeof SEASONS)[number];

/** Canonical occasions we track coverage for. */
const OCCASIONS = [
  "Office",
  "Date night",
  "Night out",
  "Special occasion",
] as const;
type Occasion = (typeof OCCASIONS)[number];

/** All note families present in notesData.ts (12). */
const ALL_FAMILIES = [
  "Citrus",
  "Floral",
  "Woody",
  "Amber",
  "Gourmand",
  "Aromatic",
  "Musky",
  "Spicy",
  "Resinous",
  "Green",
  "Fruity",
  "Aquatic",
] as const;
type Family = (typeof ALL_FAMILIES)[number];

/** Parse a fragrance.bestSeason string into a set of canonical Seasons. */
function seasonsFor(f: Fragrance): Season[] {
  const s = f.bestSeason.toLowerCase();
  if (s.includes("all seasons")) return [...SEASONS];
  const out: Season[] = [];
  for (const season of SEASONS) {
    if (s.includes(season.toLowerCase())) out.push(season);
  }
  return out;
}

/** Parse a fragrance.bestOccasion string into a set of canonical Occasions. */
function occasionsFor(f: Fragrance): Occasion[] {
  const s = f.bestOccasion.toLowerCase();
  const out: Occasion[] = [];
  if (s.includes("office")) out.push("Office");
  // "Versatile" without another occasion typically implies office-safe.
  if (s.includes("versatile") && !out.includes("Office")) out.push("Office");
  if (s.includes("date night")) out.push("Date night");
  if (s.includes("night out") || s.includes("clubbing") || s.includes("evening"))
    out.push("Night out");
  if (s.includes("special occasion")) out.push("Special occasion");
  return out;
}

/** All note families present in a fragrance's noteSlugs. */
function familiesFor(f: Fragrance): Family[] {
  const families = new Set<Family>();
  for (const slug of f.noteSlugs) {
    const note = getNote(slug);
    if (note) families.add(note.family as Family);
  }
  return [...families];
}

function brandName(f: Fragrance): string {
  return getBrand(f.brandSlug)?.name ?? f.brandSlug;
}

interface CoverageResult {
  seasonsCovered: Set<Season>;
  occasionsCovered: Set<Occasion>;
  familiesCovered: Set<Family>;
  missingSeasons: Season[];
  missingOccasions: Occasion[];
  missingFamilies: Family[];
  recommendations: { fragrance: Fragrance; reasons: string[] }[];
}

/** Compute coverage + gap recommendations for a set of selected fragrances. */
function analyzeWardrobe(
  selectedSlugs: string[]
): CoverageResult {
  const selected = selectedSlugs
    .map((slug) => fragrances.find((f) => f.slug === slug))
    .filter((f): f is Fragrance => Boolean(f));

  const seasonsCovered = new Set<Season>();
  const occasionsCovered = new Set<Occasion>();
  const familiesCovered = new Set<Family>();

  for (const f of selected) {
    for (const s of seasonsFor(f)) seasonsCovered.add(s);
    for (const o of occasionsFor(f)) occasionsCovered.add(o);
    for (const fam of familiesFor(f)) familiesCovered.add(fam);
  }

  const missingSeasons = SEASONS.filter((s) => !seasonsCovered.has(s));
  const missingOccasions = OCCASIONS.filter((o) => !occasionsCovered.has(o));
  const missingFamilies = ALL_FAMILIES.filter((fam) => !familiesCovered.has(fam));

  // Score every unselected fragrance by how many gaps it would fill.
  const candidates = fragrances
    .filter((f) => !selectedSlugs.includes(f.slug))
    .map((f) => {
      const fSeasons = seasonsFor(f);
      const fOccasions = occasionsFor(f);
      const fFamilies = familiesFor(f);
      const fillsSeasons = fSeasons.filter((s) => missingSeasons.includes(s));
      const fillsOccasions = fOccasions.filter((o) => missingOccasions.includes(o));
      const fillsFamilies = fFamilies.filter((fam) => missingFamilies.includes(fam));
      const reasons: string[] = [];
      if (fillsSeasons.length > 0)
        reasons.push(`Covers ${fillsSeasons.join(", ")}`);
      if (fillsOccasions.length > 0)
        reasons.push(`Good for ${fillsOccasions.join(", ")}`);
      if (fillsFamilies.length > 0)
        reasons.push(`Adds ${fillsFamilies.join(", ")} note family`);
      const score =
        fillsSeasons.length * 2 + fillsOccasions.length * 2 + fillsFamilies.length;
      return { fragrance: f, reasons, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    seasonsCovered,
    occasionsCovered,
    familiesCovered,
    missingSeasons,
    missingOccasions,
    missingFamilies,
    recommendations: candidates.slice(0, 3),
  };
}

export function WardrobeBuilder() {
  const [selectedSlugs, setSelectedSlugs] = React.useState<string[]>([]);
  const [query, setQuery] = React.useState("");
  const [brandFilter, setBrandFilter] = React.useState<string>("all");
  const [hydrated, setHydrated] = React.useState(false);

  // Load from localStorage on mount.
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (s): s is string =>
              typeof s === "string" &&
              fragrances.some((f) => f.slug === s)
          );
          setSelectedSlugs(valid);
        }
      }
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration).
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedSlugs));
    } catch {
      // ignore quota errors
    }
  }, [selectedSlugs, hydrated]);

  const allBrands = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const f of fragrances) {
      if (!map.has(f.brandSlug)) {
        map.set(f.brandSlug, getBrand(f.brandSlug)?.name ?? f.brandSlug);
      }
    }
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, []);

  const filteredFragrances = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return fragrances
      .filter((f) => brandFilter === "all" || f.brandSlug === brandFilter)
      .filter((f) => {
        if (!q) return true;
        return (
          f.name.toLowerCase().includes(q) ||
          brandName(f).toLowerCase().includes(q) ||
          f.noteSlugs.some((slug) =>
            (getNote(slug)?.name ?? slug).toLowerCase().includes(q)
          )
        );
      })
      .sort((a, b) => brandName(a).localeCompare(brandName(b)));
  }, [query, brandFilter]);

  const analysis = React.useMemo(
    () => analyzeWardrobe(selectedSlugs),
    [selectedSlugs]
  );

  const selectedFragrances = React.useMemo(
    () =>
      selectedSlugs
        .map((slug) => fragrances.find((f) => f.slug === slug))
        .filter((f): f is Fragrance => Boolean(f)),
    [selectedSlugs]
  );

  const toggleFragrance = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : [...prev, slug]
    );
  };

  const removeFragrance = (slug: string) => {
    setSelectedSlugs((prev) => prev.filter((s) => s !== slug));
  };

  const clearAll = () => setSelectedSlugs([]);

  return (
    <div className="flex flex-col gap-6">
      {/* Selected wardrobe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shirt className="h-5 w-5 text-primary" aria-hidden="true" />
            Your Fragrance Wardrobe
          </CardTitle>
          <CardDescription>
            Add fragrances you own. Your wardrobe is saved to this browser so you
            can come back later. We&apos;ll analyze the gaps in your collection
            and suggest what to sample next.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {selectedFragrances.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Your wardrobe is empty. Search below and tap a fragrance to add it.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedFragrances.map((f) => (
                <Badge
                  key={f.slug}
                  variant="secondary"
                  className="gap-1.5 py-1.5 pl-3 pr-1.5 text-sm"
                >
                  <span className="font-medium">{f.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {brandName(f)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name} from wardrobe`}
                    onClick={() => removeFragrance(f.slug)}
                    className="ml-1 rounded-full p-0.5 hover:bg-background"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {selectedFragrances.length > 0 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedFragrances.length} fragrance
                {selectedFragrances.length === 1 ? "" : "s"} in your wardrobe.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search & add */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add fragrances</CardTitle>
          <CardDescription>
            Search by name, brand, or note. Tap a row to toggle it in your
            wardrobe.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search fragrances, brands, or notes…"
                aria-label="Search fragrances"
                className="pl-9"
              />
            </div>
            <Select value={brandFilter} onValueChange={setBrandFilter}>
              <SelectTrigger aria-label="Filter by brand">
                <SelectValue placeholder="All brands" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                <SelectItem value="all">All brands</SelectItem>
                {allBrands.map(([slug, name]) => (
                  <SelectItem key={slug} value={slug}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="max-h-80 overflow-y-auto rounded-md border">
            <ul role="listbox" aria-label="Fragrance search results" className="divide-y">
              {filteredFragrances.length === 0 ? (
                <li className="p-4 text-center text-sm text-muted-foreground">
                  No fragrances match your search.
                </li>
              ) : (
                filteredFragrances.map((f) => {
                  const selected = selectedSlugs.includes(f.slug);
                  const noteNames = f.noteSlugs
                    .map((slug) => getNote(slug)?.name ?? slug)
                    .join(", ");
                  return (
                    <li key={f.slug}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => toggleFragrance(f.slug)}
                        className={cn(
                          "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                          selected
                            ? "bg-primary/10 hover:bg-primary/15"
                            : "hover:bg-accent/50"
                        )}
                      >
                        <span className="mt-0.5 shrink-0 text-primary">
                          {selected ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </span>
                        <span className="flex flex-1 flex-col">
                          <span className="flex flex-wrap items-baseline gap-2">
                            <span className="font-medium text-foreground">
                              {f.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {brandName(f)} · {f.concentration}
                            </span>
                          </span>
                          <span className="mt-0.5 text-xs text-muted-foreground">
                            {noteNames}
                          </span>
                          <span className="mt-1 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                            <span>{f.bestSeason}</span>
                            <span aria-hidden="true">·</span>
                            <span>{f.bestOccasion}</span>
                          </span>
                        </span>
                        <span className="shrink-0">
                          {selected ? (
                            <X className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Plus className="h-4 w-4 text-primary" />
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Analysis */}
      {selectedFragrances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              Wardrobe Analysis
            </CardTitle>
            <CardDescription>
              How well does your collection cover the seasons, occasions, and
              note families — and what&apos;s missing?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {/* Season coverage */}
            <section aria-labelledby="wardrobe-seasons-heading">
              <h3
                id="wardrobe-seasons-heading"
                className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Season Coverage
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SEASONS.map((season) => {
                  const covered = analysis.seasonsCovered.has(season);
                  return (
                    <div
                      key={season}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-md border p-3 text-center",
                        covered
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-dashed border-border bg-muted/30 text-muted-foreground"
                      )}
                    >
                      <span className="text-xs font-medium uppercase tracking-wide">
                        {season}
                      </span>
                      {covered ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                      ) : (
                        <Circle className="h-5 w-5 opacity-50" aria-hidden="true" />
                      )}
                      <span className="text-[11px]">
                        {covered ? "Covered" : "Missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
              {analysis.missingSeasons.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Missing seasons: {analysis.missingSeasons.join(", ")}.
                </p>
              )}
            </section>

            {/* Occasion coverage */}
            <section aria-labelledby="wardrobe-occasions-heading">
              <h3
                id="wardrobe-occasions-heading"
                className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Occasion Coverage
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {OCCASIONS.map((occ) => {
                  const covered = analysis.occasionsCovered.has(occ);
                  return (
                    <div
                      key={occ}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-md border p-3 text-center",
                        covered
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-dashed border-border bg-muted/30 text-muted-foreground"
                      )}
                    >
                      <span className="text-xs font-medium uppercase tracking-wide">
                        {occ}
                      </span>
                      {covered ? (
                        <CheckCircle2 className="h-5 w-5 text-primary" aria-hidden="true" />
                      ) : (
                        <Circle className="h-5 w-5 opacity-50" aria-hidden="true" />
                      )}
                      <span className="text-[11px]">
                        {covered ? "Covered" : "Missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
              {analysis.missingOccasions.length > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Missing occasions: {analysis.missingOccasions.join(", ")}.
                </p>
              )}
            </section>

            {/* Note family diversity */}
            <section aria-labelledby="wardrobe-families-heading">
              <h3
                id="wardrobe-families-heading"
                className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Note Family Diversity
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {ALL_FAMILIES.map((fam) => {
                  const covered = analysis.familiesCovered.has(fam);
                  return (
                    <div
                      key={fam}
                      className={cn(
                        "flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm",
                        covered
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-dashed border-border bg-muted/30 text-muted-foreground"
                      )}
                    >
                      <span className="font-medium">{fam}</span>
                      {covered ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {analysis.familiesCovered.size} of {ALL_FAMILIES.length} note
                families represented.
              </p>
            </section>

            {/* Gap recommendations */}
            <section aria-labelledby="wardrobe-recs-heading">
              <h3
                id="wardrobe-recs-heading"
                className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Gap Recommendations
              </h3>
              {analysis.recommendations.length === 0 ? (
                <div className="rounded-md border border-primary/30 bg-primary/5 p-4 text-sm">
                  <p className="font-medium text-foreground">
                    Your wardrobe is well-balanced!
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    We couldn&apos;t find any obvious gaps. Try sampling
                    something outside your comfort zone — a note family you
                    don&apos;t usually wear.
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {analysis.recommendations.map(({ fragrance: f, reasons }) => (
                    <li
                      key={f.slug}
                      className="rounded-md border bg-muted/20 p-3"
                    >
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-semibold text-foreground">
                          {f.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {brandName(f)} · {f.concentration}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Why: {reasons.join(" · ")}.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Best for {f.bestOccasion.toLowerCase()} · {f.bestSeason.toLowerCase()}.
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default WardrobeBuilder;
