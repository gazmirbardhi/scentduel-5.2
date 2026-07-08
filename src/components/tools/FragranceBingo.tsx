"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Grid3x3,
  Trophy,
  Share2,
  CalendarDays,
  RefreshCw,
  PartyPopper,
} from "lucide-react";

/** Pool of relatable fragrance-community experiences. 24 are drawn daily. */
const EXPERIENCES: string[] = [
  "Got a compliment from a stranger",
  "Someone asked 'what are you wearing?'",
  "Oversprayed and regretted it",
  "Bought a fragrance blind and loved it",
  "Bought a fragrance blind and hated it",
  "Own more than 10 full bottles",
  "Have a fragrance you've never actually worn",
  "Layered two fragrances and it was amazing",
  "Layered two fragrances and it was terrible",
  "Got a fragrance just because an influencer recommended it",
  "Own a clone that's better than the original",
  "Paid full retail when it was on sale elsewhere",
  "Decanted a fragrance for travel",
  "Had a fragrance 'go bad' before finishing it",
  "Wore a winter fragrance in summer",
  "Got carded at a fragrance counter",
  "Own a fragrance that reminds you of an ex",
  "Bought a fragrance for the bottle, not the scent",
  "Have a 'signature scent' you wear 90% of the time",
  "Own a niche fragrance that smells like designer",
  "Got a sample that changed your mind about a house",
  "Tracked a package daily until it arrived",
  "Have a fragrance you only wear at home",
  "Bought a backup bottle of something you love",
  "Regifted a fragrance you didn't like",
  "Own a fragrance older than some of your friends",
  "Got a headache from someone else's fragrance",
  "Wore fragrance to the gym (and got looks)",
  "Own a fragrance with a celebrity name on it",
  "Have a 'no fragrance' day and felt naked",
  "Discovered a note you hated and now love",
  "Bought from a discounter and worried it was fake",
  "Own a fragrance that smells different every time",
  "Got a compliment from someone half your age",
  "Have a fragrance for every season",
  "Own a fragrance you've never decanted or shared",
  "Told someone their fragrance was too strong",
  "Own a 'beast mode' fragrance you're afraid to wear",
  "Bought a fragrance because of the notes, ignored the brand",
  "Have a fragrance that's 'too much' for any occasion",
  "Own the same fragrance in multiple concentrations",
  "Sprayed a fragrance in-store and walked out without buying",
  "Hid a fragrance purchase from someone",
  "Wore the same fragrance two days in a row on purpose",
];

/** 5×5 = 25 cells. Index 12 (the center) is the FREE space. */
const CENTER = 12;
const CELLS = 25;
const CELLS_NEEDED = 24; // 25 cells minus the free center

/**
 * All 12 winning lines on a 5×5 bingo card: 5 rows, 5 cols, 2 diagonals.
 * Each line is the 5 cell indices it passes through.
 */
const WINNING_LINES: number[][] = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

/** Storage key prefix — daily cards are persisted per-date. */
const STORAGE_PREFIX = "scentduel-bingo-";

/** Returns YYYY-MM-DD in UTC. */
function utcDateString(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 1-indexed day-of-year in UTC. */
function utcDayOfYear(d: Date): number {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

/** Human-friendly UTC date label, e.g. "December 15, 2024". */
function utcDateLabel(d: Date): string {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Deterministic 32-bit hash of a string — used as a PRNG seed. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic shuffle of an array using a PRNG. Returns a new array. */
function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const rng = mulberry32(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build the 25-cell card for a given UTC date string. */
function buildCard(dateStr: string): string[] {
  const seed = hashString(dateStr);
  const picked = seededShuffle(EXPERIENCES, seed).slice(0, CELLS_NEEDED);
  const cells: string[] = [];
  let pickedIdx = 0;
  for (let i = 0; i < CELLS; i++) {
    if (i === CENTER) {
      cells.push("FREE");
    } else {
      cells.push(picked[pickedIdx] ?? "");
      pickedIdx++;
    }
  }
  return cells;
}

interface BingoState {
  marked: boolean[];
}

function emptyMarked(): boolean[] {
  const arr = new Array<boolean>(CELLS).fill(false);
  arr[CENTER] = true; // center is always free
  return arr;
}

/** Find all winning lines completed by a `marked` state. */
function findWins(marked: boolean[]): number[][] {
  return WINNING_LINES.filter((line) => line.every((idx) => marked[idx]));
}

export function FragranceBingo() {
  const [mounted, setMounted] = React.useState(false);
  const [dateStr, setDateStr] = React.useState<string>("");
  const [dayOfYear, setDayOfYear] = React.useState<number>(0);
  const [dateLabel, setDateLabel] = React.useState<string>("");
  const [cells, setCells] = React.useState<string[]>([]);
  const [marked, setMarked] = React.useState<boolean[]>(emptyMarked);
  const [justWon, setJustWon] = React.useState(false);

  // Initialize on mount (client-only — avoids SSR/CSR timezone mismatch).
  React.useEffect(() => {
    const now = new Date();
    const ds = utcDateString(now);
    setDateStr(ds);
    setDayOfYear(utcDayOfYear(now));
    setDateLabel(utcDateLabel(now));
    setCells(buildCard(ds));

    // Load persisted marks for this date.
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + ds);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === "object" &&
          Array.isArray((parsed as BingoState).marked) &&
          (parsed as BingoState).marked.length === CELLS
        ) {
          const stored = (parsed as BingoState).marked as boolean[];
          // Always force center to true.
          stored[CENTER] = true;
          setMarked(stored);
        }
      }
    } catch {
      // ignore malformed storage
    }
    setMounted(true);
  }, []);

  // Persist marks whenever they change (after mount).
  React.useEffect(() => {
    if (!mounted || !dateStr) return;
    try {
      window.localStorage.setItem(
        STORAGE_PREFIX + dateStr,
        JSON.stringify({ marked } satisfies BingoState)
      );
    } catch {
      // ignore quota errors
    }
  }, [marked, mounted, dateStr]);

  // Detect new wins and fire confetti + toast.
  const wins = React.useMemo(() => findWins(marked), [marked]);
  const prevWonRef = React.useRef(false);

  React.useEffect(() => {
    if (!mounted) return;
    const hasWon = wins.length > 0;
    if (hasWon && !prevWonRef.current) {
      setJustWon(true);
      toast.success("BINGO! You did it! 🎉", {
        description: `You completed ${wins.length} line${wins.length === 1 ? "" : "s"}. Share your card with the community.`,
        duration: 6000,
      });
      // Reset confetti after a few seconds so it can re-trigger on a new win.
      const t = window.setTimeout(() => setJustWon(false), 6000);
      prevWonRef.current = true;
      return () => window.clearTimeout(t);
    }
    if (!hasWon) {
      prevWonRef.current = false;
      setJustWon(false);
    }
  }, [wins, mounted]);

  const toggleCell = (idx: number) => {
    if (idx === CENTER) return; // can't toggle the free space
    setMarked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const resetCard = () => {
    setMarked(emptyMarked());
    prevWonRef.current = false;
    setJustWon(false);
    toast.info("Card reset. Mark your squares again!");
  };

  const markedCount = marked.filter(Boolean).length;

  const handleShare = async () => {
    const lines: string[] = [];
    lines.push("🎯 ScentDuel Fragrance Bingo");
    lines.push(`Day ${dayOfYear} · ${dateLabel} (UTC)`);
    lines.push("");
    // 5x5 emoji grid
    for (let r = 0; r < 5; r++) {
      let row = "";
      for (let c = 0; c < 5; c++) {
        const idx = r * 5 + c;
        if (idx === CENTER) {
          row += "🎁";
        } else {
          row += marked[idx] ? "✅" : "⬜";
        }
      }
      lines.push(row);
    }
    lines.push("");
    if (wins.length > 0) {
      lines.push(
        `BINGO! ${wins.length} line${wins.length === 1 ? "" : "s"} completed 🎉`
      );
    }
    lines.push(`${markedCount}/25 squares marked`);
    lines.push("");
    lines.push("Play at scentduel.com/tools/fragrance-bingo");

    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!", {
        description: "Paste your bingo card anywhere — Reddit, IG, Discord.",
      });
    } catch {
      // Fallback for browsers without clipboard API.
      toast.error("Couldn't copy automatically — select the text below to copy.");
    }
  };

  if (!mounted) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Loading today&apos;s bingo card…
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Confetti overlay */}
      {justWon && (
        <div
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
          aria-hidden="true"
        >
          {Array.from({ length: 36 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 0.6;
            const duration = 2.4 + Math.random() * 1.2;
            const size = 8 + Math.random() * 8;
            const colors = [
              "#b45309", // amber-700
              "#d97706", // amber-600
              "#c2410c", // orange-700
              "#a16207", // yellow-700
              "#92400e", // amber-800
              "#f59e0b", // amber-500
            ];
            const color = colors[i % colors.length];
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  top: "-5vh",
                  left: `${left}%`,
                  width: `${size}px`,
                  height: `${size * 1.4}px`,
                  backgroundColor: color,
                  borderRadius: "2px",
                  animation: `bingo-confetti-fall ${duration}s linear ${delay}s forwards`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes bingo-confetti-fall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
            }
          `}</style>
        </div>
      )}

      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Grid3x3 className="h-5 w-5 text-primary" aria-hidden="true" />
                Fragrance Bingo
              </CardTitle>
              <CardDescription className="mt-1">
                A new 5×5 bingo card every day, the same for everyone (UTC). Mark
                the squares you&apos;ve done, get a bingo, and share your card.
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/40 bg-primary/10 px-3 py-1 text-primary"
            >
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Day {dayOfYear}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{dateLabel} (UTC)</p>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          {/* Status row */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <StatusTile
              label="Squares marked"
              value={`${markedCount} / 25`}
              tone="default"
            />
            <StatusTile
              label="Bingos completed"
              value={wins.length.toString()}
              tone={wins.length > 0 ? "win" : "default"}
              icon={<Trophy className="h-4 w-4" />}
            />
            <StatusTile
              label="Status"
              value={wins.length > 0 ? "BINGO!" : "Keep marking"}
              tone={wins.length > 0 ? "win" : "default"}
              icon={wins.length > 0 ? <PartyPopper className="h-4 w-4" /> : undefined}
            />
          </div>

          {/* Bingo banner */}
          {wins.length > 0 && (
            <div
              role="status"
              aria-live="polite"
              className="rounded-md border border-primary/50 bg-primary/15 px-4 py-3 text-center"
            >
              <p className="flex items-center justify-center gap-2 text-lg font-bold tracking-wide text-primary">
                <PartyPopper className="h-5 w-5" aria-hidden="true" />
                BINGO! You completed {wins.length} line
                {wins.length === 1 ? "" : "s"}.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Share your card and see how your friends compare.
              </p>
            </div>
          )}

          {/* The 5×5 card */}
          <div className="mx-auto w-full max-w-2xl">
            <div
              role="grid"
              aria-label="Fragrance bingo card"
              className="grid grid-cols-5 gap-1.5 sm:gap-2"
            >
              {cells.map((text, idx) => {
                const isCenter = idx === CENTER;
                const isMarked = marked[idx];
                // Highlight cells in a winning line.
                const inWinningLine = wins.some((line) => line.includes(idx));
                return (
                  <button
                    key={idx}
                    type="button"
                    role="gridcell"
                    aria-selected={isMarked}
                    aria-label={
                      isCenter
                        ? "Free space (marked)"
                        : `${text} — ${isMarked ? "marked" : "unmarked"}`
                    }
                    disabled={isCenter}
                    onClick={() => toggleCell(idx)}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-md border p-1.5 text-center text-[11px] font-medium leading-tight transition-all sm:text-xs",
                      isCenter
                        ? "cursor-default border-primary/60 bg-primary/25 text-primary"
                        : isMarked
                          ? cn(
                              "border-primary bg-primary text-primary-foreground shadow-sm",
                              inWinningLine && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                            )
                          : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-accent/50"
                    )}
                  >
                    <span className="line-clamp-4">
                      {isCenter ? "🎁 FREE" : text}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={handleShare}
              className="gap-1.5"
              size="lg"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share my card
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={resetCard}
              className="gap-1.5"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Reset card
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Come back tomorrow (UTC) for a new card. The card and your progress
            are saved on this device — no account needed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusTile({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: string;
  tone: "default" | "win";
  icon?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 text-center",
        tone === "win"
          ? "border-primary/50 bg-primary/15"
          : "border-border bg-muted/20"
      )}
    >
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 flex items-center justify-center gap-1.5 text-base font-bold tabular-nums text-foreground">
        {icon}
        {value}
      </p>
    </div>
  );
}

export default FragranceBingo;
