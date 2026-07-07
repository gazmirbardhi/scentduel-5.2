"use client";

// NOTE: The Community Consensus value is illustrative/seeded data and must NEVER
// be wired into JSON-LD AggregateRating schema. Google's policies require rating
// markup to reflect genuine editorial or user input. This component is for
// visitor engagement only and the displayed consensus is a deterministic
// pseudo-random number derived from the post slug, not real aggregated data.

import { useCallback, useMemo, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ReviewPollProps {
  postSlug: string;
  postTitle: string;
}

function storageKey(postSlug: string): string {
  return `scentduel-poll-${postSlug}`;
}

/**
 * Derive a deterministic consensus score (72-88) from the post slug. This is
 * illustrative/seeded data — NOT real aggregated ratings. See the file-level
 * comment for why this must never feed into structured-data AggregateRating.
 */
function consensusForSlug(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) | 0;
  }
  const abs = Math.abs(hash);
  return 72 + (abs % 17); // 72..88 inclusive
}

function deltaColor(user: number, consensus: number): string {
  const diff = Math.abs(user - consensus);
  if (diff <= 4) return "text-emerald-600 dark:text-emerald-500";
  if (diff <= 10) return "text-amber-600 dark:text-amber-500";
  return "text-destructive";
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Read the user's previous vote from localStorage. Returns `null` on the
 * server and when no vote (or an unparseable one) is stored. useSyncExternalStore
 * gives us a referentially-stable primitive (number) snapshot.
 */
function useStoredVote(postSlug: string): number | null {
  const key = storageKey(postSlug);

  const getSnapshot = useCallback((): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }, [key]);

  const getServerSnapshot = useCallback((): string | null => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (raw === null) return null;
  const parsed = Number.parseInt(raw, 10);
  if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 100) {
    return parsed;
  }
  return null;
}

export function ReviewPoll({ postSlug, postTitle }: ReviewPollProps) {
  const consensus = useMemo(() => consensusForSlug(postSlug), [postSlug]);
  const storedVote = useStoredVote(postSlug);
  const vote = storedVote;

  function handleChange(value: number[]) {
    const next = value[0];
    if (typeof next !== "number" || !Number.isFinite(next)) return;
    try {
      window.localStorage.setItem(storageKey(postSlug), String(next));
      // Same-tab writes don't fire the native `storage` event; dispatch one
      // so useSyncExternalStore re-reads the snapshot.
      window.dispatchEvent(
        new StorageEvent("storage", { key: storageKey(postSlug) }),
      );
    } catch {
      // Storage may be unavailable (private mode); the next render may not
      // reflect the new vote, but the slider remains interactive.
    }
  }

  const userVsConsensus = vote !== null ? vote - consensus : 0;
  const userVsLabel =
    vote === null
      ? null
      : userVsConsensus === 0
        ? "Right on the consensus"
        : userVsConsensus > 0
          ? `${userVsConsensus} pts above consensus`
          : `${Math.abs(userVsConsensus)} pts below consensus`;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Rate This Fragrance</CardTitle>
        <CardDescription>
          Drag the slider to vote on {postTitle}. Your vote is saved to this
          browser only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor={`review-poll-${postSlug}`} className="text-xs">
              Your rating
            </Label>
            <span className="font-mono text-sm font-semibold text-foreground">
              {vote !== null ? vote : "—"}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
          <Slider
            id={`review-poll-${postSlug}`}
            min={0}
            max={100}
            step={1}
            value={vote === null ? [50] : [vote]}
            onValueChange={handleChange}
            aria-label={`Your rating for ${postTitle}`}
          />
          <div className="flex justify-between text-[10px] uppercase tracking-wide text-muted-foreground">
            <span>0 — Pass</span>
            <span>100 — Masterpiece</span>
          </div>
        </div>

        <div className="space-y-2 rounded-md border border-border bg-muted/40 p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Community Consensus
              <span className="sr-only"> (illustrative seeded data)</span>
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {consensus}
              <span className="text-muted-foreground">/100</span>
            </span>
          </div>
          {/* Visual comparison: the consensus is a fixed marker, the user's
              vote is an overlay bar from 0 to vote. */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-primary/30"
              style={{ width: `${consensus}%` }}
              aria-hidden="true"
            />
            {vote !== null && (
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-primary"
                style={{ width: `${vote}%` }}
                aria-hidden="true"
              />
            )}
          </div>
          {vote !== null && userVsLabel ? (
            <p
              className={cn("text-xs font-medium", deltaColor(vote, consensus))}
            >
              You: {vote} &middot; {userVsLabel}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Cast a vote to see how you compare to the consensus.
            </p>
          )}
          <p className="text-[11px] italic text-muted-foreground">
            Community Consensus (illustrative seeded data) — not real aggregated
            ratings and never exported as structured-data AggregateRating.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
