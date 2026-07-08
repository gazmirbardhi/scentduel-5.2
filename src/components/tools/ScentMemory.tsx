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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Brain,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Flame,
  Trophy,
} from "lucide-react";

type Fragrance = (typeof fragrances)[number];

/**
 * Fragrances eligible as a question answer. We require at least 4 note slugs
 * so the clue is non-trivial (otherwise a 2-note fragrance is too easy).
 */
const ELIGIBLE = fragrances.filter((f) => f.noteSlugs.length >= 4);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Question {
  answer: Fragrance;
  options: Fragrance[];
  /** Notes shown as the clue, in random order. */
  clueNotes: { name: string; family: string }[];
}

function makeQuestion(prevAnswerSlug?: string): Question {
  // Pick the answer, avoiding an immediate repeat of the previous answer.
  let answer: Fragrance;
  let guard = 0;
  do {
    answer = ELIGIBLE[Math.floor(Math.random() * ELIGIBLE.length)];
    guard++;
  } while (prevAnswerSlug && answer.slug === prevAnswerSlug && guard < 8);

  // Pick 3 distractors from a different brand (so brand cues don't give it away).
  const distractorPool = ELIGIBLE.filter(
    (f) => f.slug !== answer.slug && f.brandSlug !== answer.brandSlug
  );
  const distractors = shuffle(distractorPool).slice(0, 3);

  // If we somehow couldn't find 3 distractors (very small pool), top up.
  if (distractors.length < 3) {
    const extra = shuffle(
      ELIGIBLE.filter(
        (f) =>
          f.slug !== answer.slug &&
          !distractors.some((d) => d.slug === f.slug)
      )
    ).slice(0, 3 - distractors.length);
    distractors.push(...extra);
  }

  const options = shuffle([answer, ...distractors]);

  // Build the clue: all of the answer's notes, shuffled.
  const clueNotes = shuffle(
    answer.noteSlugs
      .map((slug) => {
        const n = getNote(slug);
        return n ? { name: n.name, family: n.family } : null;
      })
      .filter((n): n is { name: string; family: string } => Boolean(n))
  );

  return { answer, options, clueNotes };
}

function brandName(f: Fragrance): string {
  return getBrand(f.brandSlug)?.name ?? f.brandSlug;
}

export function ScentMemory() {
  const [mounted, setMounted] = React.useState(false);
  const [question, setQuestion] = React.useState<Question | null>(null);
  const [selectedSlug, setSelectedSlug] = React.useState<string | null>(null);
  const [answered, setAnswered] = React.useState(false);

  const [answeredCount, setAnsweredCount] = React.useState(0);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [streak, setStreak] = React.useState(0);
  const [bestStreak, setBestStreak] = React.useState(0);

  // Generate first question after mount (avoids SSR/CSR mismatch from Math.random).
  React.useEffect(() => {
    setMounted(true);
    setQuestion(makeQuestion());
  }, []);

  const handlePick = (slug: string) => {
    if (answered || !question) return;
    const correct = slug === question.answer.slug;
    setSelectedSlug(slug);
    setAnswered(true);
    setAnsweredCount((n) => n + 1);
    if (correct) {
      setCorrectCount((n) => n + 1);
      setStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (!question) return;
    setQuestion(makeQuestion(question.answer.slug));
    setSelectedSlug(null);
    setAnswered(false);
  };

  const handleReset = () => {
    setQuestion(makeQuestion());
    setSelectedSlug(null);
    setAnswered(false);
    setAnsweredCount(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
  };

  const accuracy =
    answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  if (!mounted || !question) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          Loading today&apos;s round…
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-5 w-5 text-primary" aria-hidden="true" />
          Scent Memory
        </CardTitle>
        <CardDescription>
          Read the note list, then guess which fragrance in our database contains
          every one of them. Build a streak — the longer you go without missing,
          the higher your score climbs.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Score bar */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <ScoreStat label="Answered" value={answeredCount} icon={<Trophy className="h-4 w-4" />} />
          <ScoreStat
            label="Correct"
            value={correctCount}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
          />
          <ScoreStat
            label="Streak"
            value={streak}
            icon={<Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
          />
          <ScoreStat label="Accuracy" value={`${accuracy}%`} />
        </div>

        {bestStreak > 0 && (
          <p className="text-center text-xs text-muted-foreground">
            Best streak this session:{" "}
            <span className="font-semibold text-foreground">{bestStreak}</span>
          </p>
        )}

        {/* Clue */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            This fragrance contains these notes
          </p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Fragrance notes clue">
            {question.clueNotes.map((n, i) => (
              <li key={`${n.name}-${i}`}>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {n.name}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Which fragrance has <em>all</em> of the notes above?
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2">
          {question.options.map((opt) => {
            const isCorrect = opt.slug === question.answer.slug;
            const isSelected = selectedSlug === opt.slug;
            let stateClass = "border-border bg-background hover:bg-accent/50";
            if (answered) {
              if (isCorrect) {
                stateClass =
                  "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100";
              } else if (isSelected) {
                stateClass =
                  "border-red-400 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100";
              } else {
                stateClass = "border-border bg-background opacity-60";
              }
            }
            return (
              <button
                key={opt.slug}
                type="button"
                onClick={() => handlePick(opt.slug)}
                disabled={answered}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-colors",
                  stateClass,
                  answered && "cursor-default"
                )}
              >
                <span>
                  <span className="block">{opt.name}</span>
                  <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                    {brandName(opt)}
                  </span>
                </span>
                {answered && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        {/* Reveal */}
        {answered && (
          <div
            className={cn(
              "rounded-md border p-4",
              selectedSlug === question.answer.slug
                ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                : "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            )}
          >
            <p className="font-semibold">
              {selectedSlug === question.answer.slug
                ? "Correct!"
                : `Not quite — it was ${question.answer.name}.`}
            </p>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <dt className="text-muted-foreground">Brand</dt>
              <dd>{brandName(question.answer)}</dd>
              <dt className="text-muted-foreground">Concentration</dt>
              <dd>{question.answer.concentration}</dd>
              <dt className="text-muted-foreground">Released</dt>
              <dd>{question.answer.yearReleased}</dd>
              <dt className="text-muted-foreground">Best season</dt>
              <dd>{question.answer.bestSeason}</dd>
              <dt className="text-muted-foreground">Best occasion</dt>
              <dd>{question.answer.bestOccasion}</dd>
            </dl>
            {streak >= 3 && selectedSlug === question.answer.slug && (
              <p className="mt-3 flex items-center gap-1.5 text-sm font-medium">
                <Flame className="h-4 w-4 text-orange-500" aria-hidden="true" />
                {streak}-in-a-row streak! Keep going.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-muted-foreground"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Reset score
          </Button>
          <Button
            type="button"
            onClick={handleNext}
            disabled={!answered}
            className="min-w-[160px]"
          >
            Next question
          </Button>
        </div>

        {answeredCount > 0 && (
          <div>
            <Progress value={accuracy} className="h-1.5" aria-hidden />
            <p className="mt-1 text-xs text-muted-foreground">
              {correctCount} of {answeredCount} correct ({accuracy}% accuracy)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ScoreStat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-md border bg-muted/20 px-3 py-2 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 flex items-center justify-center gap-1 text-lg font-bold tabular-nums text-foreground">
        {icon}
        {value}
      </p>
    </div>
  );
}

export default ScentMemory;
