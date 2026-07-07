"use client";

import * as React from "react";
import Link from "next/link";
import fragrances from "@/data/fragrances.json";
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

type Fragrance = (typeof fragrances)[number];

type Family = "Citrus" | "Woody" | "Amber" | "Gourmand" | "Fresh";

/** Family → note slugs that define membership. Used to filter recommendations. */
const FAMILY_NOTES: Record<Family, string[]> = {
  Citrus: ["bergamot", "neroli"],
  Woody: ["cedar", "vetiver", "sandalwood", "patchouli"],
  Amber: ["amber", "benzoin", "saffron"],
  Gourmand: ["vanilla", "tonka", "almond", "cinnamon"],
  Fresh: ["lavender", "musk", "iris", "violet"],
};

const FAMILY_DESCRIPTIONS: Record<Family, string> = {
  Citrus:
    "Bergamot, neroli, and other citrus oils. Fresh, energizing, and perfect for warm weather or daytime wear. Citrus fragrances rarely overstay their welcome.",
  Woody:
    "Cedar, vetiver, and sandalwood. Dry, structured, and grounded — the backbone of masculine perfumery and the most versatile family for everyday wear.",
  Amber:
    "Labdanum, benzoin, and saffron. Warm, resinous, and sensual — the oriental family. Built for cold weather, evenings, and special occasions.",
  Gourmand:
    "Vanilla, tonka, and almond. Sweet, edible, and crowd-pleasing — the dessert family. Loud, projection-heavy, and aimed at younger audiences.",
  Fresh:
    "Lavender, musk, and iris. Clean, soft, and skin-close — the most versatile family. Light enough for the office, soft enough for any season.",
};

interface QuestionOption {
  label: string;
  family: Family;
}

interface Question {
  id: string;
  prompt: string;
  help: string;
  options: QuestionOption[];
}

const QUESTIONS: Question[] = [
  {
    id: "feel",
    prompt: "How do you want to feel?",
    help: "Pick the mood that fits you best.",
    options: [
      { label: "Energized and bright", family: "Citrus" },
      { label: "Grounded and composed", family: "Woody" },
      { label: "Cozy and warm", family: "Amber" },
      { label: "Indulgent and sweet", family: "Gourmand" },
      { label: "Clean and reset", family: "Fresh" },
    ],
  },
  {
    id: "setting",
    prompt: "Where will you wear it most?",
    help: "Setting shapes the right strength and projection.",
    options: [
      { label: "Office / daytime", family: "Fresh" },
      { label: "Outdoor / active", family: "Citrus" },
      { label: "Evening out", family: "Amber" },
      { label: "Date night", family: "Gourmand" },
      { label: "Creative / studio work", family: "Woody" },
    ],
  },
  {
    id: "sweet",
    prompt: "Sweet or dry?",
    help: "Your sweet-tooth (or lack of it) is the strongest family signal.",
    options: [
      { label: "Sweet and edible", family: "Gourmand" },
      { label: "Dry and woody", family: "Woody" },
      { label: "Warm and resinous", family: "Amber" },
      { label: "Fresh and clean", family: "Fresh" },
      { label: "Zesty and bright", family: "Citrus" },
    ],
  },
  {
    id: "weight",
    prompt: "Light or heavy?",
    help: "How much body do you want the scent to have?",
    options: [
      { label: "Light as air", family: "Citrus" },
      { label: "Soft and skin-close", family: "Fresh" },
      { label: "Balanced and structured", family: "Woody" },
      { label: "Heavy and bold", family: "Amber" },
      { label: "Sweet and rich", family: "Gourmand" },
    ],
  },
  {
    id: "budget",
    prompt: "What's your budget?",
    help: "We'll filter to fragrances that fit your price band.",
    options: [
      { label: "Under $50 — value", family: "Citrus" },
      { label: "$50–150 — designer", family: "Fresh" },
      { label: "$150–300 — entry niche", family: "Woody" },
      { label: "$300+ — luxury", family: "Amber" },
      { label: "No limit", family: "Gourmand" },
    ],
  },
];

/** Tallies family weights from the user's answers and returns the dominant family. */
function tallyFamilies(answers: (Family | null)[]): Family | null {
  const weights: Record<Family, number> = {
    Citrus: 0,
    Woody: 0,
    Amber: 0,
    Gourmand: 0,
    Fresh: 0,
  };
  for (const a of answers) {
    if (a) weights[a] += 1;
  }
  let best: Family | null = null;
  let bestScore = 0;
  // Iterate in a stable order so ties resolve deterministically.
  const order: Family[] = ["Citrus", "Woody", "Amber", "Gourmand", "Fresh"];
  for (const f of order) {
    if (weights[f] > bestScore) {
      bestScore = weights[f];
      best = f;
    }
  }
  return best;
}

/**
 * Returns up to `limit` fragrances that contain at least one note from the
 * family. Sorted by value desc, then complimentFactor desc, then longevity.
 */
function recommendFragrances(family: Family, limit: number): Fragrance[] {
  const familyNotes = new Set(FAMILY_NOTES[family]);
  return fragrances
    .filter((f) => f.noteSlugs.some((n) => familyNotes.has(n)))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      if (b.complimentFactor !== a.complimentFactor)
        return b.complimentFactor - a.complimentFactor;
      return b.longevityHours - a.longevityHours;
    })
    .slice(0, limit);
}

export interface FragranceQuizProps {
  /**
   * Optional list of post slugs that exist under /blog/[slug]. Used to decide
   * whether to render a recommendation as a link or as plain text. The parent
   * page (a server component) can pass `getAllPosts().map(p => p.slug)` here.
   * Defaults to an empty array — recommendations render as plain text.
   */
  postSlugs?: string[];
}

export function FragranceQuiz({ postSlugs = [] }: FragranceQuizProps) {
  const [answers, setAnswers] = React.useState<(Family | null)[]>(
    QUESTIONS.map(() => null)
  );
  const [submitted, setSubmitted] = React.useState(false);

  const postSlugSet = React.useMemo(() => new Set(postSlugs), [postSlugs]);

  const allAnswered = answers.every((a) => a !== null);

  const setAnswer = (qIdx: number, family: Family) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = family;
      return next;
    });
  };

  const handleReset = () => {
    setAnswers(QUESTIONS.map(() => null));
    setSubmitted(false);
  };

  const winningFamily = submitted ? tallyFamilies(answers) : null;
  const recommendations =
    winningFamily !== null ? recommendFragrances(winningFamily, 3) : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Fragrance Quiz</CardTitle>
        <CardDescription>
          Answer five quick questions about your preferences and we&apos;ll match you to a
          scent family — plus three fragrances from our directory that fit it.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {!submitted && (
          <div className="flex flex-col gap-6">
            {QUESTIONS.map((q, qIdx) => (
              <fieldset key={q.id} className="flex flex-col gap-2">
                <legend className="text-sm font-semibold text-foreground">
                  {qIdx + 1}. {q.prompt}
                </legend>
                <p className="text-xs text-muted-foreground">{q.help}</p>
                <div className="mt-1 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {q.options.map((opt) => {
                    const id = `${q.id}-${opt.family}`;
                    const checked = answers[qIdx] === opt.family;
                    return (
                      <label
                        key={id}
                        htmlFor={id}
                        className={cn(
                          "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-sm transition-colors",
                          checked
                            ? "border-primary bg-primary/5 font-medium"
                            : "border-border bg-background hover:bg-accent/50"
                        )}
                      >
                        <input
                          id={id}
                          type="radio"
                          name={q.id}
                          className="size-4 accent-primary"
                          checked={checked}
                          onChange={() => setAnswer(qIdx, opt.family)}
                        />
                        <span className="text-foreground">{opt.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <Button
              size="sm"
              onClick={() => setSubmitted(true)}
              disabled={!allAnswered}
              className="self-start"
            >
              Show my matches
            </Button>
          </div>
        )}

        {submitted && winningFamily && (
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Your scent family
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{winningFamily}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {FAMILY_DESCRIPTIONS[winningFamily]}
              </p>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Recommended fragrances
              </h3>
              {recommendations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No fragrances in our directory match this family yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {recommendations.map((f) => {
                    const hasPost = postSlugSet.has(f.slug);
                    return (
                      <li
                        key={f.slug}
                        className="flex flex-col gap-1 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex flex-col">
                          {hasPost ? (
                            <Link
                              href={`/blog/${f.slug}`}
                              className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                            >
                              {f.name}
                            </Link>
                          ) : (
                            <span className="text-sm font-medium text-foreground">
                              {f.name}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {f.concentration} &middot; {f.bestSeason} &middot;{" "}
                            {f.bestOccasion}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {f.noteSlugs
                            .filter((n) => FAMILY_NOTES[winningFamily].includes(n))
                            .map((n) => (
                              <Badge key={n} variant="secondary" className="text-[10px]">
                                {n}
                              </Badge>
                            ))}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <Button variant="outline" size="sm" onClick={handleReset} className="self-start">
              Retake quiz
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default FragranceQuiz;
