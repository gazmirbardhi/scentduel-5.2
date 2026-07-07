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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  batchCodeDatabase,
  getBatchInfo,
  lookupCode,
  type BatchCodeEntry,
} from "@/lib/batchCodes";

interface LookupResult {
  found: boolean;
  entry: BatchCodeEntry;
  sample?: BatchCodeEntry["samples"][number];
  code: string;
}

export function BatchChecker() {
  const [brandSlug, setBrandSlug] = React.useState<string>(
    batchCodeDatabase[0]?.brandSlug ?? ""
  );
  const [code, setCode] = React.useState<string>("");
  const [lookup, setLookup] = React.useState<LookupResult | null>(null);

  const entry = brandSlug ? getBatchInfo(brandSlug) : undefined;

  const handleLookup = () => {
    if (!brandSlug || !code.trim()) return;
    const result = lookupCode(brandSlug, code.trim());
    if (result) {
      setLookup({
        found: true,
        entry: result.entry,
        sample: result.sample,
        code: code.trim(),
      });
    } else {
      const fallbackEntry = getBatchInfo(brandSlug);
      if (fallbackEntry) {
        setLookup({
          found: false,
          entry: fallbackEntry,
          code: code.trim(),
        });
      }
    }
  };

  // Reset the lookup result whenever the brand changes so we don't show stale
  // decoded data for the wrong brand.
  React.useEffect(() => {
    setLookup(null);
    setCode("");
  }, [brandSlug]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Batch Code Checker</CardTitle>
        <CardDescription>
          Look up a fragrance batch code to see its (illustrative) manufacturing date and
          factory. Pick a brand, enter the code, and hit look up.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* CRITICAL: visible disclaimer — not just a code comment. */}
        <Alert variant="destructive">
          <AlertTitle>
            <span aria-hidden>&#9888;</span> Demo / educational lookup
          </AlertTitle>
          <AlertDescription>
            This is a demo/educational lookup using illustrative codes, not an official
            manufacturer database. Do not rely on this as proof of authenticity. Only the
            brand itself can verify a batch code.
          </AlertDescription>
        </Alert>

        {/* Lookup controls */}
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="flex flex-col gap-2">
            <label htmlFor="bc-brand" className="text-sm font-medium text-foreground">
              Brand
            </label>
            <Select value={brandSlug} onValueChange={setBrandSlug}>
              <SelectTrigger id="bc-brand" className="w-full" aria-label="Select brand">
                <SelectValue placeholder="Pick a brand" />
              </SelectTrigger>
              <SelectContent>
                {batchCodeDatabase.map((b) => (
                  <SelectItem key={b.brandSlug} value={b.brandSlug}>
                    {b.brandName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bc-code" className="text-sm font-medium text-foreground">
              Batch code
            </label>
            <Input
              id="bc-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={entry?.exampleCode ?? "e.g. 2104"}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLookup();
              }}
            />
          </div>

          <Button onClick={handleLookup} disabled={!brandSlug || !code.trim()} className="sm:mb-0.5">
            Look up
          </Button>
        </div>

        {/* Brand format & example — always shown. */}
        {entry && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">{entry.brandName}</h3>
              <Badge variant="outline" className="text-[10px]">
                Format
              </Badge>
            </div>
            <p className="mt-2 text-sm text-foreground">{entry.format}</p>
            <div className="mt-3 flex flex-col gap-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Example code
              </p>
              <code className="self-start rounded bg-background px-2 py-1 font-mono text-sm text-foreground">
                {entry.exampleCode}
              </code>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Date logic:</span>{" "}
              {entry.dateLogic}
            </p>
          </div>
        )}

        {/* Lookup result */}
        {lookup && (
          <div
            className={
              "rounded-lg border p-4 " +
              (lookup.found
                ? "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40"
                : "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/40")
            }
          >
            {lookup.found && lookup.sample ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Code found</h3>
                  <Badge
                    variant="outline"
                    className="border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  >
                    Match
                  </Badge>
                </div>
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Code
                    </dt>
                    <dd className="font-mono text-foreground">{lookup.sample.code}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Decoded date
                    </dt>
                    <dd className="font-medium text-foreground">
                      {lookup.sample.decodedDate}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Factory
                    </dt>
                    <dd className="text-foreground">{lookup.sample.factory}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted-foreground">
                  This code is part of the demo database. It is illustrative only and
                  does not confirm authenticity.
                </p>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">
                    Code not in demo database
                  </h3>
                  <Badge
                    variant="outline"
                    className="border-amber-400 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
                  >
                    No match
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-foreground">
                  The code <code className="font-mono">{lookup.code}</code> for{" "}
                  {lookup.entry.brandName} was not found in our illustrative sample set.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Using the brand&apos;s format described above, you may be able to decode
                  it yourself. The sample codes for this brand are:{" "}
                  {lookup.entry.samples.map((s) => s.code).join(", ")}.
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  For an authoritative answer, contact {lookup.entry.brandName} directly
                  with photos of the box and bottle.
                </p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default BatchChecker;
