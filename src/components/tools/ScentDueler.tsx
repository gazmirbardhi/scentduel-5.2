"use client";

import * as React from "react";
import fragrances from "@/data/fragrances.json";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getBrand } from "@/lib/brandsData";

type Fragrance = (typeof fragrances)[number];

/**
 * Picks the first two distinct fragrances as initial defaults so the
 * comparison table is populated on first render instead of being empty.
 */
function pickDefaults(): [string, string] {
  if (fragrances.length === 0) return ["", ""];
  if (fragrances.length === 1) return [fragrances[0].slug, fragrances[0].slug];
  return [fragrances[0].slug, fragrances[1].slug];
}

/** Returns the fragrance object for a slug, or undefined if not found. */
function findFragrance(slug: string): Fragrance | undefined {
  return fragrances.find((f) => f.slug === slug);
}

/**
 * A small metric row: label + numeric value + a Progress bar.
 * Used for sillage / value / complimentFactor (1-10 scale) and
 * longevityHours (12-hour scale).
 */
function MetricRow({
  label,
  valueA,
  valueB,
  max,
  unit,
}: {
  label: string;
  valueA: number;
  valueB: number;
  max: number;
  unit: string;
}) {
  const pctA = Math.max(0, Math.min(100, (valueA / max) * 100));
  const pctB = Math.max(0, Math.min(100, (valueB / max) * 100));
  return (
    <TableRow>
      <TableHead className="font-medium text-muted-foreground">{label}</TableHead>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold tabular-nums">
            {valueA}
            <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
          </span>
          <Progress value={pctA} className="h-1.5" aria-hidden />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold tabular-nums">
            {valueB}
            <span className="ml-1 text-xs font-normal text-muted-foreground">{unit}</span>
          </span>
          <Progress value={pctB} className="h-1.5" aria-hidden />
        </div>
      </TableCell>
    </TableRow>
  );
}

/** Plain-text comparison row (season, occasion, concentration, year). */
function TextRow({
  label,
  valueA,
  valueB,
}: {
  label: string;
  valueA: string;
  valueB: string;
}) {
  return (
    <TableRow>
      <TableHead className="font-medium text-muted-foreground">{label}</TableHead>
      <TableCell className="text-sm">{valueA}</TableCell>
      <TableCell className="text-sm">{valueB}</TableCell>
    </TableRow>
  );
}

export function ScentDueler() {
  const [defaults] = React.useState(pickDefaults);
  const [slugA, setSlugA] = React.useState<string>(defaults[0]);
  const [slugB, setSlugB] = React.useState<string>(defaults[1]);

  const fragA = findFragrance(slugA);
  const fragB = findFragrance(slugB);

  // Aggregate the deal-finder rows from both fragrances, tagged with their source.
  type DealRow = {
    fragranceName: string;
    fragranceSlug: string;
    retailerName: string;
    price: string;
    url: string;
  };
  const dealRows: DealRow[] = React.useMemo(() => {
    const rows: DealRow[] = [];
    for (const f of [fragA, fragB]) {
      if (!f) continue;
      for (const r of f.retailers) {
        rows.push({
          fragranceName: f.name,
          fragranceSlug: f.slug,
          retailerName: r.name,
          price: r.price,
          url: r.url,
        });
      }
    }
    return rows;
  }, [fragA, fragB]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Scent Dueler</CardTitle>
        <CardDescription>
          Pick two fragrances and compare them head-to-head on longevity, sillage, value,
          and compliment factor — then find the best deal across retailers.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Selectors */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dueler-a"
              className="text-sm font-medium text-foreground"
            >
              Fragrance A
            </label>
            <Select value={slugA} onValueChange={setSlugA}>
              <SelectTrigger id="dueler-a" className="w-full" aria-label="Select fragrance A">
                <SelectValue placeholder="Pick a fragrance" />
              </SelectTrigger>
              <SelectContent>
                {fragrances.map((f) => (
                  <SelectItem key={f.slug} value={f.slug} disabled={f.slug === slugB}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fragA && (
              <p className="text-xs text-muted-foreground">
                {getBrand(fragA.brandSlug)?.name ?? fragA.brandSlug} &middot;{" "}
                {fragA.concentration}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="dueler-b"
              className="text-sm font-medium text-foreground"
            >
              Fragrance B
            </label>
            <Select value={slugB} onValueChange={setSlugB}>
              <SelectTrigger id="dueler-b" className="w-full" aria-label="Select fragrance B">
                <SelectValue placeholder="Pick a fragrance" />
              </SelectTrigger>
              <SelectContent>
                {fragrances.map((f) => (
                  <SelectItem key={f.slug} value={f.slug} disabled={f.slug === slugA}>
                    {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fragB && (
              <p className="text-xs text-muted-foreground">
                {getBrand(fragB.brandSlug)?.name ?? fragB.brandSlug} &middot;{" "}
                {fragB.concentration}
              </p>
            )}
          </div>
        </div>

        {fragA && fragB && (
          <>
            {/* Comparison table */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Head-to-head comparison
              </h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[28%]">Metric</TableHead>
                    <TableHead>
                      <span className="font-semibold text-foreground">{fragA.name}</span>
                    </TableHead>
                    <TableHead>
                      <span className="font-semibold text-foreground">{fragB.name}</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <MetricRow
                    label="Longevity"
                    valueA={fragA.longevityHours}
                    valueB={fragB.longevityHours}
                    max={12}
                    unit="hrs"
                  />
                  <MetricRow
                    label="Sillage"
                    valueA={fragA.sillage}
                    valueB={fragB.sillage}
                    max={10}
                    unit="/10"
                  />
                  <MetricRow
                    label="Value"
                    valueA={fragA.value}
                    valueB={fragB.value}
                    max={10}
                    unit="/10"
                  />
                  <MetricRow
                    label="Compliment factor"
                    valueA={fragA.complimentFactor}
                    valueB={fragB.complimentFactor}
                    max={10}
                    unit="/10"
                  />
                  <TextRow
                    label="Best season"
                    valueA={fragA.bestSeason}
                    valueB={fragB.bestSeason}
                  />
                  <TextRow
                    label="Best occasion"
                    valueA={fragA.bestOccasion}
                    valueB={fragB.bestOccasion}
                  />
                  <TextRow
                    label="Concentration"
                    valueA={fragA.concentration}
                    valueB={fragB.concentration}
                  />
                  <TextRow
                    label="Year released"
                    valueA={String(fragA.yearReleased)}
                    valueB={String(fragB.yearReleased)}
                  />
                  <TableRow>
                    <TableHead className="font-medium text-muted-foreground">
                      Key notes
                    </TableHead>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {fragA.noteSlugs.map((n) => (
                          <Badge key={n} variant="secondary" className="text-[10px]">
                            {n}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {fragB.noteSlugs.map((n) => (
                          <Badge key={n} variant="secondary" className="text-[10px]">
                            {n}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Separator />

            {/* Deal Finder */}
            <div>
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Deal Finder
                </h3>
                <span className="text-xs text-muted-foreground">
                  {dealRows.length} retailer{dealRows.length === 1 ? "" : "s"} listed
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fragrance</TableHead>
                    <TableHead>Retailer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Link</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealRows.map((row, idx) => (
                    <TableRow key={`${row.fragranceSlug}-${row.retailerName}-${idx}`}>
                      <TableCell className="max-w-[180px] truncate text-sm" title={row.fragranceName}>
                        {row.fragranceName}
                      </TableCell>
                      <TableCell className="text-sm">{row.retailerName}</TableCell>
                      <TableCell className="text-sm font-medium tabular-nums">{row.price}</TableCell>
                      <TableCell className="text-right">
                        <a
                          href={row.url}
                          target="_blank"
                          rel="sponsored nofollow noopener"
                          className={cn(buttonVariants({ size: "sm", variant: "outline" }), "h-7 px-2.5 text-xs")}
                        >
                          Visit store
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* FTC affiliate disclosure — visible, not just a code comment. */}
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Affiliate disclosure:</span>{" "}
                ScentDuel earns a commission on purchases through these links. Prices are
                illustrative and may not reflect current retailer pricing.
              </p>
            </div>
          </>
        )}

        {!fragA && !fragB && (
          <p className="text-sm text-muted-foreground">
            Pick two fragrances above to start the duel.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default ScentDueler;
