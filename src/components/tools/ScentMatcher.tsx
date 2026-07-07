"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  allLayerableNotes,
  describeLayering,
  type LayeringResult,
} from "@/lib/layering";
import { getNote } from "@/lib/notesData";

/** Score (0-3) → color + label classes. No indigo/blue. */
function scoreStyles(score: LayeringResult["score"]): {
  badgeClass: string;
  label: string;
} {
  switch (score) {
    case 0:
      return {
        badgeClass: "border-red-300 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
        label: "0 / 3 — Do not layer",
      };
    case 1:
      return {
        badgeClass: "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
        label: "1 / 3 — Marginal",
      };
    case 2:
      return {
        badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        label: "2 / 3 — Good pairing",
      };
    case 3:
      return {
        badgeClass: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
        label: "3 / 3 — Excellent pairing",
      };
    default:
      return {
        badgeClass: "border-border bg-muted text-muted-foreground",
        label: "Unknown",
      };
  }
}

export function ScentMatcher() {
  const noteSlugs = React.useMemo(() => allLayerableNotes(), []);
  const [slugA, setSlugA] = React.useState<string>(noteSlugs[0] ?? "");
  const [slugB, setSlugB] = React.useState<string>(noteSlugs[1] ?? "");

  const noteA = getNote(slugA);
  const noteB = getNote(slugB);
  const result: LayeringResult | null =
    slugA && slugB ? describeLayering(slugA, slugB) : null;

  const styles = result ? scoreStyles(result.score) : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Scent Matcher</CardTitle>
        <CardDescription>
          Pick two notes and see whether they layer well together. The score is based on
          classic perfumery pairings — citrus with woods, amber with vanilla, rose with
          oud — not a guarantee.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="matcher-a" className="text-sm font-medium text-foreground">
              Note A
            </label>
            <Select value={slugA} onValueChange={setSlugA}>
              <SelectTrigger id="matcher-a" className="w-full" aria-label="Select note A">
                <SelectValue placeholder="Pick a note" />
              </SelectTrigger>
              <SelectContent>
                {noteSlugs.map((slug) => {
                  const n = getNote(slug);
                  return (
                    <SelectItem key={slug} value={slug} disabled={slug === slugB}>
                      {n?.name ?? slug}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {noteA && (
              <p className="text-xs text-muted-foreground">
                {noteA.family} &middot; {noteA.scentProfile}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="matcher-b" className="text-sm font-medium text-foreground">
              Note B
            </label>
            <Select value={slugB} onValueChange={setSlugB}>
              <SelectTrigger id="matcher-b" className="w-full" aria-label="Select note B">
                <SelectValue placeholder="Pick a note" />
              </SelectTrigger>
              <SelectContent>
                {noteSlugs.map((slug) => {
                  const n = getNote(slug);
                  return (
                    <SelectItem key={slug} value={slug} disabled={slug === slugA}>
                      {n?.name ?? slug}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {noteB && (
              <p className="text-xs text-muted-foreground">
                {noteB.family} &middot; {noteB.scentProfile}
              </p>
            )}
          </div>
        </div>

        {result && styles && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Verdict:</span>
              <Badge variant="outline" className={cn("text-xs", styles.badgeClass)}>
                {styles.label}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground">{result.advice}</p>
          </div>
        )}

        <div className="rounded-md border border-dashed border-border bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Educational tool.</span>{" "}
            Scent Matcher uses perfumery conventions, not an oracle. Real layering
            depends on dosage, the surrounding composition, and your own skin chemistry.
            Always test on skin before committing to a full wearing.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ScentMatcher;
