"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { notes } from "@/lib/notesData";
import { layeringCompatibility } from "@/lib/layering";

/** Risk band → verdict text + indicator color classes (no indigo/blue). */
interface RiskBand {
  min: number;
  max: number;
  verdict: string;
  barClass: string;
  pillClass: string;
}

const RISK_BANDS: RiskBand[] = [
  {
    min: 0,
    max: 29,
    verdict: "Low risk — safe blind buy",
    barClass: "bg-emerald-600",
    pillClass: "border-emerald-300 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
  },
  {
    min: 30,
    max: 60,
    verdict: "Moderate risk — sample first",
    barClass: "bg-amber-500",
    pillClass: "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  {
    min: 61,
    max: 100,
    verdict: "High risk — do not blind buy",
    barClass: "bg-red-600",
    pillClass: "border-red-300 bg-red-100 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  },
];

function bandFor(risk: number): RiskBand {
  return RISK_BANDS.find((b) => risk >= b.min && risk <= b.max) ?? RISK_BANDS[0];
}

interface RiskResult {
  risk: number;
  triggers: { loved: string; hated: string; lovedName: string; hatedName: string }[];
  triggeredHatedNames: string[];
}

/**
 * Computes blind-buy risk. Base 20%, +15% per (loved, hated) incompatible
 * pair (compatibility score <= 1), capped at 95%.
 */
function computeRisk(loved: string[], hated: string[]): RiskResult {
  let risk = 20;
  const triggers: RiskResult["triggers"] = [];
  const triggeredHatedNames: string[] = [];

  const nameFor = (slug: string) =>
    notes.find((n) => n.slug === slug)?.name ?? slug;

  for (const h of hated) {
    for (const l of loved) {
      const score = layeringCompatibility(l, h);
      if (score <= 1) {
        risk += 15;
        triggers.push({
          loved: l,
          hated: h,
          lovedName: nameFor(l),
          hatedName: nameFor(h),
        });
        const hatedName = nameFor(h);
        if (!triggeredHatedNames.includes(hatedName)) {
          triggeredHatedNames.push(hatedName);
        }
      }
    }
  }
  return { risk: Math.min(95, risk), triggers, triggeredHatedNames };
}

/** Renders one multi-select column. */
function NoteChecklist({
  title,
  description,
  selected,
  onToggle,
}: {
  title: string;
  description: string;
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="max-h-72 overflow-y-auto rounded-md border border-border bg-background/50 p-2">
        <ul className="flex flex-col gap-1">
          {notes.map((n) => {
            const id = `${title}-${n.slug}`;
            const checked = selected.includes(n.slug);
            return (
              <li key={n.slug}>
                <label
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-start gap-2.5 rounded-md px-2 py-1.5 transition-colors",
                    checked ? "bg-primary/10" : "hover:bg-accent/50"
                  )}
                >
                  <Checkbox
                    id={id}
                    checked={checked}
                    onCheckedChange={() => onToggle(n.slug)}
                    className="mt-0.5"
                  />
                  <span className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{n.name}</span>
                    <span className="text-xs text-muted-foreground">{n.family}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function BlindBuyRisk() {
  const [loved, setLoved] = React.useState<string[]>([]);
  const [hated, setHated] = React.useState<string[]>([]);

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (slug: string) => {
      setter((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
    };

  const result = React.useMemo(
    () => computeRisk(loved, hated),
    [loved, hated]
  );

  const band = bandFor(result.risk);
  const hasInput = loved.length > 0 && hated.length > 0;
  const effectiveBand = hasInput ? band : RISK_BANDS[0];
  const effectiveRisk = hasInput ? result.risk : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Blind Buy Risk</CardTitle>
        <CardDescription>
          Tell us the notes you love and the notes you hate. We&apos;ll estimate the risk
          that a fragrance containing your hated notes will clash with the rest of your
          taste — and tell you which ones to watch out for.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <NoteChecklist
            title="Notes you love"
            description="Pick everything you actively enjoy wearing."
            selected={loved}
            onToggle={toggle(setLoved)}
          />
          <NoteChecklist
            title="Notes you hate"
            description="Pick anything you can&apos;t stand or that gives you a headache."
            selected={hated}
            onToggle={toggle(setHated)}
          />
        </div>

        {/* Risk meter */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Blind-buy risk
            </span>
            <span className="text-2xl font-bold tabular-nums text-foreground">
              {effectiveRisk}%
            </span>
          </div>
          <div
            className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-primary/15"
            role="progressbar"
            aria-valuenow={effectiveRisk}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Blind-buy risk"
          >
            <div
              className={cn("h-full rounded-full transition-all", effectiveBand.barClass)}
              style={{ width: `${effectiveRisk}%` }}
            />
          </div>
          <div className="mt-3">
            <Badge variant="outline" className={cn("text-xs", effectiveBand.pillClass)}>
              {hasInput ? effectiveBand.verdict : "Pick at least one note from each column"}
            </Badge>
          </div>
        </div>

        {/* Triggered hated notes */}
        {hasInput && result.triggers.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Hated notes that triggered risk
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {result.triggeredHatedNames.map((name) => (
                <Badge key={name} variant="destructive" className="text-xs">
                  {name}
                </Badge>
              ))}
            </div>
            <ul className="mt-3 flex flex-col gap-1 text-xs text-muted-foreground">
              {result.triggers.map((t, idx) => (
                <li key={idx}>
                  <span className="font-medium text-foreground">{t.lovedName}</span> clashes
                  with <span className="font-medium text-foreground">{t.hatedName}</span>.
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasInput && result.triggers.length === 0 && (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            None of your hated notes clash with the notes you love. You can blind-buy with
            more confidence — though sampling is always safer.
          </div>
        )}

        <div className="rounded-md border border-dashed border-border bg-background/50 p-3">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">How this works:</span> Base risk
            is 20%. For every pair where a loved note is incompatible (layering score
            &le; 1) with a hated note, we add 15% — capped at 95%. The lower the score,
            the more likely a fragrance built around your hated notes will fight your
            existing taste.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default BlindBuyRisk;
