"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getQuestionForDate, type QuizQuestion } from "@/lib/quiz-questions";

type Status = "unanswered" | "correct" | "wrong";

export function NameThatNote() {
  // Deterministic by UTC date — every visitor sees the same question today.
  const [question] = React.useState<QuizQuestion>(() => getQuestionForDate(new Date()));
  const [selected, setSelected] = React.useState<number | null>(null);
  const [status, setStatus] = React.useState<Status>("unanswered");

  const answered = selected !== null;

  const handleClick = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setStatus(idx === question.correctIndex ? "correct" : "wrong");
  };

  // Today's date for the "come back tomorrow" copy.
  const todayLabel = React.useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Name That Note</CardTitle>
        <CardDescription>
          A daily trivia question. Today&apos;s clue ({todayLabel}, UTC) is the same for
          every visitor — share it, debate it, and come back tomorrow for the next one.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Today&apos;s clue
          </p>
          <p className="mt-1 text-base leading-relaxed text-foreground">{question.clue}</p>
        </div>

        <div className="flex flex-col gap-2">
          {question.options.map((opt, idx) => {
            const isCorrect = idx === question.correctIndex;
            const isSelected = selected === idx;

            let stateClass = "border-border bg-background hover:bg-accent/50";
            if (answered) {
              if (isCorrect) {
                stateClass = "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100";
              } else if (isSelected) {
                stateClass = "border-red-400 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100";
              } else {
                stateClass = "border-border bg-background opacity-60";
              }
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleClick(idx)}
                disabled={answered}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm font-medium transition-colors",
                  stateClass,
                  answered && "cursor-default"
                )}
              >
                <span>{opt}</span>
                {answered && isCorrect && (
                  <Badge
                    variant="outline"
                    className="border-emerald-400 bg-emerald-100 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                  >
                    Correct
                  </Badge>
                )}
                {answered && isSelected && !isCorrect && (
                  <Badge
                    variant="outline"
                    className="border-red-400 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
                  >
                    Your pick
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="flex flex-col gap-3">
            <div
              className={cn(
                "rounded-md border p-3 text-sm",
                status === "correct"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                  : "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
              )}
            >
              <p className="font-medium">
                {status === "correct" ? "Nice — that&apos;s right." : "Not quite."}
              </p>
              <p className="mt-1 leading-relaxed">{question.explanation}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Come back tomorrow for a new question!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NameThatNote;
