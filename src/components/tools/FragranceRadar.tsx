"use client";

import * as React from "react";
import fragrances from "@/data/fragrances.json";
import { getBrand } from "@/lib/brandsData";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Fragrance = (typeof fragrances)[number];

/** Sorted by brand then name for the dropdowns. */
const FRAGRANCES: Fragrance[] = [...fragrances].sort((a, b) => {
  const ba = getBrand(a.brandSlug)?.name ?? a.brandSlug;
  const bb = getBrand(b.brandSlug)?.name ?? b.brandSlug;
  if (ba === bb) return a.name.localeCompare(b.name);
  return ba.localeCompare(bb);
});

/**
 * The four comparison axes. Each axis has a label, a function to extract
 * the raw value from a fragrance, and a `max` for normalization. The radar
 * always plots on a 0-10 scale; longevity (which can be up to ~12h) is
 * normalized as longevityHours / 12 * 10 per the spec.
 */
interface Axis {
  key: "longevity" | "sillage" | "value" | "complimentFactor";
  label: string;
  shortLabel: string;
  max: number;
  extract: (f: Fragrance) => number;
  /** Display string for the raw value in the comparison table. */
  format: (f: Fragrance) => string;
}

const AXES: Axis[] = [
  {
    key: "longevity",
    label: "Longevity",
    shortLabel: "Longevity",
    max: 12,
    extract: (f) => f.longevityHours,
    format: (f) => `${f.longevityHours} hrs`,
  },
  {
    key: "sillage",
    label: "Sillage",
    shortLabel: "Sillage",
    max: 10,
    extract: (f) => f.sillage,
    format: (f) => `${f.sillage} / 10`,
  },
  {
    key: "value",
    label: "Value",
    shortLabel: "Value",
    max: 10,
    extract: (f) => f.value,
    format: (f) => `${f.value} / 10`,
  },
  {
    key: "complimentFactor",
    label: "Compliment Factor",
    shortLabel: "Compliments",
    max: 10,
    extract: (f) => f.complimentFactor,
    format: (f) => `${f.complimentFactor} / 10`,
  },
];

/** Normalize any raw value to a 0-10 radar coordinate. */
function normalize(axis: Axis, f: Fragrance): number {
  const raw = axis.extract(f);
  return Math.max(0, Math.min(10, (raw / axis.max) * 10));
}

/** Average of the 4 normalized axes — the "overall" score shown in the legend. */
function averageScore(f: Fragrance): number {
  const sum = AXES.reduce((acc, axis) => acc + normalize(axis, f), 0);
  return Math.round((sum / AXES.length) * 10) / 10;
}

// ---- SVG geometry constants ----
const VIEWBOX = 440;
const CENTER = VIEWBOX / 2;
const RADIUS = 140;
// 4 axes arranged at 0°(top), 90°(right), 180°(bottom), 270°(left).
// In SVG coords (y grows downward), top = -90° = -π/2.
const AXIS_ANGLES: number[] = AXES.map((_, i) => -Math.PI / 2 + (i * Math.PI) / 2);
const GRID_LEVELS = [2, 4, 6, 8, 10];

/** Point on axis `i` at normalized value v (0-10). */
function pointOnAxis(i: number, v: number): { x: number; y: number } {
  const angle = AXIS_ANGLES[i];
  const r = (v / 10) * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
}

/** Build an SVG `points` string for a fragrance polygon. */
function polygonPoints(f: Fragrance): string {
  return AXES.map((axis, i) => {
    const v = normalize(axis, f);
    const p = pointOnAxis(i, v);
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
  }).join(" ");
}

/** Label position for an axis — pushed slightly past the outer ring. */
function axisLabel(i: number): { x: number; y: number; anchor: "start" | "middle" | "end" } {
  const angle = AXIS_ANGLES[i];
  const labelR = RADIUS + 24;
  const x = CENTER + labelR * Math.cos(angle);
  const y = CENTER + labelR * Math.sin(angle);
  // Anchor based on horizontal position relative to center.
  let anchor: "start" | "middle" | "end" = "middle";
  if (x > CENTER + 8) anchor = "start";
  else if (x < CENTER - 8) anchor = "end";
  return { x, y: y + 4, anchor };
}

const COLOR_A = "var(--primary, #b45309)"; // amber-brown — primary
const COLOR_B = "#c2410c"; // warm orange-700 — contrasting warm

function findFragrance(slug: string): Fragrance | undefined {
  return FRAGRANCES.find((f) => f.slug === slug);
}

function brandName(f: Fragrance): string {
  return getBrand(f.brandSlug)?.name ?? f.brandSlug;
}

export function FragranceRadar() {
  const [slugA, setSlugA] = React.useState<string>(FRAGRANCES[0]?.slug ?? "");
  const [slugB, setSlugB] = React.useState<string>(FRAGRANCES[1]?.slug ?? "");

  const fragA = findFragrance(slugA);
  const fragB = findFragrance(slugB);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Fragrance Radar</CardTitle>
        <CardDescription>
          Pick one or two fragrances and overlay their performance profiles on a
          4-axis radar chart. All axes are normalized to a 0–10 scale: longevity
          is shown as hours-out-of-12 × 10, sillage / value / compliment factor
          are already 1–10.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {/* Pickers */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="frag-a" className="flex items-center gap-2 text-sm font-medium">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: COLOR_A }}
              />
              Fragrance A
            </Label>
            <Select value={slugA} onValueChange={setSlugA}>
              <SelectTrigger id="frag-a" aria-label="Select fragrance A">
                <SelectValue placeholder="Choose a fragrance" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {FRAGRANCES.map((f) => (
                  <SelectItem key={f.slug} value={f.slug}>
                    {brandName(f)} — {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fragA && (
              <p className="text-xs text-muted-foreground">
                Avg score:{" "}
                <span className="font-semibold text-foreground">
                  {averageScore(fragA).toFixed(1)} / 10
                </span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="frag-b" className="flex items-center gap-2 text-sm font-medium">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: COLOR_B }}
              />
              Fragrance B
            </Label>
            <Select value={slugB} onValueChange={setSlugB}>
              <SelectTrigger id="frag-b" aria-label="Select fragrance B">
                <SelectValue placeholder="Choose a fragrance" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {FRAGRANCES.map((f) => (
                  <SelectItem key={f.slug} value={f.slug}>
                    {brandName(f)} — {f.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fragB && (
              <p className="text-xs text-muted-foreground">
                Avg score:{" "}
                <span className="font-semibold text-foreground">
                  {averageScore(fragB).toFixed(1)} / 10
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Radar chart */}
        {fragA && fragB ? (
          <div className="rounded-lg border bg-muted/20 p-2 sm:p-4">
            <svg
              viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
              width="100%"
              role="img"
              aria-label={`Radar chart comparing ${fragA.name} and ${fragB.name} on longevity, sillage, value, and compliment factor`}
              className="mx-auto block max-w-xl"
            >
              {/* Grid: concentric polygons */}
              {GRID_LEVELS.map((level) => {
                const pts = AXES.map((_, i) => {
                  const p = pointOnAxis(i, level);
                  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
                }).join(" ");
                return (
                  <polygon
                    key={`grid-${level}`}
                    points={pts}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={level === 10 ? 1.25 : 0.75}
                    className="text-border"
                  />
                );
              })}

              {/* Axis spokes */}
              {AXES.map((_, i) => {
                const p = pointOnAxis(i, 10);
                return (
                  <line
                    key={`spoke-${i}`}
                    x1={CENTER}
                    y1={CENTER}
                    x2={p.x}
                    y2={p.y}
                    stroke="currentColor"
                    strokeWidth={0.75}
                    className="text-border"
                  />
                );
              })}

              {/* Polygon B (drawn first so A overlays on top) */}
              <polygon
                points={polygonPoints(fragB)}
                fill={COLOR_B}
                fillOpacity={0.18}
                stroke={COLOR_B}
                strokeWidth={2}
                strokeLinejoin="round"
              />

              {/* Polygon A */}
              <polygon
                points={polygonPoints(fragA)}
                fill={COLOR_A}
                fillOpacity={0.22}
                stroke={COLOR_A}
                strokeWidth={2}
                strokeLinejoin="round"
              />

              {/* Vertex dots for both polygons */}
              {AXES.map((_, i) => {
                const va = normalize(AXES[i], fragA);
                const vb = normalize(AXES[i], fragB);
                const pa = pointOnAxis(i, va);
                const pb = pointOnAxis(i, vb);
                return (
                  <g key={`dots-${i}`}>
                    <circle cx={pa.x} cy={pa.y} r={3.5} fill={COLOR_A} />
                    <circle cx={pb.x} cy={pb.y} r={3.5} fill={COLOR_B} />
                  </g>
                );
              })}

              {/* Axis labels + ring value labels */}
              {AXES.map((axis, i) => {
                const pos = axisLabel(i);
                return (
                  <text
                    key={`label-${axis.key}`}
                    x={pos.x}
                    y={pos.y}
                    textAnchor={pos.anchor}
                    className="fill-foreground font-medium"
                    style={{ fontSize: 13 }}
                  >
                    {axis.shortLabel}
                  </text>
                );
              })}
              {GRID_LEVELS.map((level) => {
                // Place a tiny scale label just left of the top axis.
                const p = pointOnAxis(0, level);
                return (
                  <text
                    key={`scale-${level}`}
                    x={p.x - 6}
                    y={p.y - 2}
                    textAnchor="end"
                    className="fill-muted-foreground"
                    style={{ fontSize: 9 }}
                  >
                    {level}
                  </text>
                );
              })}
            </svg>

            {/* Legend */}
            <div className="mt-3 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row sm:gap-6">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: COLOR_A }}
                />
                <span className="font-medium">{fragA.name}</span>
                <Badge variant="secondary" className="tabular-nums">
                  avg {averageScore(fragA).toFixed(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block h-3 w-3 rounded-sm"
                  style={{ backgroundColor: COLOR_B }}
                />
                <span className="font-medium">{fragB.name}</span>
                <Badge variant="secondary" className="tabular-nums">
                  avg {averageScore(fragB).toFixed(1)}
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            Pick two fragrances to see the radar comparison.
          </p>
        )}

        {/* Raw numbers table */}
        {fragA && fragB && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[34%]">Metric</TableHead>
                  <TableHead>
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: COLOR_A }}
                      />
                      {fragA.name}
                    </span>
                  </TableHead>
                  <TableHead>
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="inline-block h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: COLOR_B }}
                      />
                      {fragB.name}
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {AXES.map((axis) => {
                  const aRaw = axis.extract(fragA);
                  const bRaw = axis.extract(fragB);
                  const aNorm = normalize(axis, fragA);
                  const bNorm = normalize(axis, fragB);
                  const aWins = aNorm > bNorm;
                  const bWins = bNorm > aNorm;
                  return (
                    <TableRow key={axis.key}>
                      <TableHead className="font-medium text-muted-foreground">
                        {axis.label}
                      </TableHead>
                      <TableCell
                        className={
                          aWins
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {axis.format(fragA)}
                      </TableCell>
                      <TableCell
                        className={
                          bWins
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }
                      >
                        {axis.format(fragB)}
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableHead className="font-medium text-muted-foreground">
                    Average (normalized)
                  </TableHead>
                  <TableCell className="font-semibold text-primary tabular-nums">
                    {averageScore(fragA).toFixed(1)} / 10
                  </TableCell>
                  <TableCell className="font-semibold text-primary tabular-nums">
                    {averageScore(fragB).toFixed(1)} / 10
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FragranceRadar;
