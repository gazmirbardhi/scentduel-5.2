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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Concentration = "EDT" | "EDP" | "Parfum";
type Setting = "office" | "date" | "night" | "gym";
type SkinType = "oily" | "dry" | "normal";
type Strength = "light" | "moderate" | "strong";

interface Answers {
  concentration: Concentration | null;
  setting: Setting | null;
  skinType: SkinType | null;
  strength: Strength | null;
}

interface Step {
  key: keyof Answers;
  title: string;
  help: string;
}

const STEPS: Step[] = [
  {
    key: "concentration",
    title: "What concentration is your fragrance?",
    help: "Check the bottle — EDT, EDP, or Parfum / Extrait.",
  },
  {
    key: "setting",
    title: "Where are you wearing it?",
    help: "Setting determines how loud you want the scent.",
  },
  {
    key: "skinType",
    title: "What is your skin type?",
    help: "Oily skin holds scent longer; dry skin lets it fade faster.",
  },
  {
    key: "strength",
    title: "How strong do you want it?",
    help: "Be honest — overspraying is the most common fragrance mistake.",
  },
];

const CONCENTRATIONS: { value: Concentration; label: string; hint: string }[] = [
  { value: "EDT", label: "Eau de Toilette", hint: "5–15% oils · lightest" },
  { value: "EDP", label: "Eau de Parfum", hint: "15–20% oils · standard" },
  { value: "Parfum", label: "Parfum / Extrait", hint: "20–30%+ oils · strongest" },
];

const SETTINGS: { value: Setting; label: string; hint: string }[] = [
  { value: "office", label: "Office / professional", hint: "Subtle, won't bother coworkers" },
  { value: "date", label: "Date night", hint: "Close projection, inviting" },
  { value: "night", label: "Night out", hint: "Bold, fills a room" },
  { value: "gym", label: "Gym / workout", hint: "Light — sweat amplifies scent" },
];

const SKIN_TYPES: { value: SkinType; label: string; hint: string }[] = [
  { value: "oily", label: "Oily", hint: "Holds scent longer, fewer sprays" },
  { value: "dry", label: "Dry", hint: "Scent fades faster, needs more" },
  { value: "normal", label: "Normal", hint: "Baseline longevity" },
];

const STRENGTHS: { value: Strength; label: string; hint: string }[] = [
  { value: "light", label: "Light", hint: "Just a hint, detectable up close" },
  { value: "moderate", label: "Moderate", hint: "A clear scent trail" },
  { value: "strong", label: "Strong", hint: "Maximum projection — use sparingly" },
];

/** Base spray count by concentration × desired strength. */
const BASE_SPRAYS: Record<Concentration, Record<Strength, number>> = {
  EDT: { light: 2, moderate: 3, strong: 4 },
  EDP: { light: 1, moderate: 2, strong: 3 },
  // Parfum is so concentrated that strength barely moves the count —
  // even "strong" stays at 1 to avoid overwhelming.
  Parfum: { light: 1, moderate: 1, strong: 1 },
};

const SETTING_MODIFIER: Record<Setting, number> = {
  office: -1,
  date: 0,
  night: 1,
  gym: -1,
};

const SKIN_MODIFIER: Record<SkinType, number> = {
  oily: -1,
  dry: 1,
  normal: 0,
};

interface Recommendation {
  sprays: number;
  points: string[];
  reasoning: string[];
}

/**
 * Computes spray count and application points from the four answers.
 * Caps at 1–6 sprays — fewer is wasted, more is antisocial.
 */
function recommend(answers: Answers): Recommendation | null {
  const { concentration, setting, skinType, strength } = answers;
  if (!concentration || !setting || !skinType || !strength) return null;

  const base = BASE_SPRAYS[concentration][strength];
  const settingMod = SETTING_MODIFIER[setting];
  const skinMod = SKIN_MODIFIER[skinType];
  const raw = base + settingMod + skinMod;
  const sprays = Math.max(1, Math.min(6, raw));

  // Application points: 2 by default, 3 if sprays >= 3, drop to just neck at 1.
  const baseBySetting: Record<Setting, string[]> = {
    office: ["neck", "wrists"],
    gym: ["neck", "wrists"],
    date: ["neck", "behind the ears"],
    night: ["neck", "chest"],
  };
  const points = [...baseBySetting[setting]];
  if (sprays >= 3) {
    const extras: Record<Setting, string> = {
      office: "chest",
      gym: "chest",
      date: "wrists",
      night: "behind the ears",
    };
    const extra = extras[setting];
    if (!points.includes(extra)) points.push(extra);
  }
  if (sprays === 1) {
    points.length = 0;
    points.push("neck");
  }

  const reasoning: string[] = [];
  reasoning.push(
    `${concentration} concentration starts at ${base} spray${base === 1 ? "" : "s"} for a "${strength}" target.`
  );
  if (settingMod !== 0) {
    reasoning.push(
      `${setting} setting ${settingMod < 0 ? "reduces" : "adds"} ${Math.abs(settingMod)} spray${
        Math.abs(settingMod) === 1 ? "" : "s"
      }.`
    );
  }
  if (skinMod !== 0) {
    reasoning.push(
      `${skinType} skin ${skinMod < 0 ? "holds scent longer, so" : "lets scent fade faster, so"} ${
        skinMod < 0 ? "subtract" : "add"
      } ${Math.abs(skinMod)}.`
    );
  } else {
    reasoning.push("Normal skin adds no modifier.");
  }
  reasoning.push(
    `Total: ${raw} spray${raw === 1 ? "" : "s"}, clamped to a safe ${sprays}.`
  );

  return { sprays, points, reasoning };
}

/** Renders one step's options as a styled radio group. */
function OptionList<T extends string>({
  options,
  value,
  onChange,
  name,
}: {
  options: { value: T; label: string; hint: string }[];
  value: T | null;
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <RadioGroup
      name={name}
      value={value ?? undefined}
      onValueChange={(v) => onChange(v as T)}
      className="grid gap-2"
    >
      {options.map((opt) => {
        const id = `${name}-${opt.value}`;
        const checked = value === opt.value;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
              checked
                ? "border-primary bg-primary/5"
                : "border-border bg-background hover:bg-accent/50"
            )}
          >
            <RadioGroupItem id={id} value={opt.value} className="mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.hint}</span>
            </div>
          </label>
        );
      })}
    </RadioGroup>
  );
}

export function SprayCalculator() {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({
    concentration: null,
    setting: null,
    skinType: null,
    strength: null,
  });
  const [submitted, setSubmitted] = React.useState(false);

  const step = STEPS[stepIdx];
  const isLast = stepIdx === STEPS.length - 1;
  const canAdvance = answers[step.key] !== null;

  const setAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (!canAdvance) return;
    if (isLast) {
      setSubmitted(true);
    } else {
      setStepIdx((i) => Math.min(STEPS.length - 1, i + 1));
    }
  };

  const handleBack = () => {
    if (stepIdx === 0) return;
    setStepIdx((i) => Math.max(0, i - 1));
  };

  const handleRestart = () => {
    setAnswers({ concentration: null, setting: null, skinType: null, strength: null });
    setStepIdx(0);
    setSubmitted(false);
  };

  const rec = submitted ? recommend(answers) : null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Spray Calculator</CardTitle>
        <CardDescription>
          Answer four quick questions and get a recommended spray count plus the best
          application points for your fragrance, setting, and skin.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {!submitted && (
          <>
            {/* Step progress */}
            <div className="flex items-center gap-2">
              <Progress value={((stepIdx + 1) / STEPS.length) * 100} className="h-1.5" />
              <span className="text-xs font-medium tabular-nums text-muted-foreground">
                {stepIdx + 1} / {STEPS.length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.help}</p>
              </div>

              {step.key === "concentration" && (
                <Select
                  value={answers.concentration ?? undefined}
                  onValueChange={(v) => setAnswer("concentration", v as Concentration)}
                >
                  <SelectTrigger className="w-full" aria-label="Select concentration">
                    <SelectValue placeholder="Pick a concentration" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONCENTRATIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label} — {c.hint}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {step.key === "setting" && (
                <OptionList
                  name="sc-setting"
                  options={SETTINGS}
                  value={answers.setting}
                  onChange={(v) => setAnswer("setting", v)}
                />
              )}

              {step.key === "skinType" && (
                <OptionList
                  name="sc-skin"
                  options={SKIN_TYPES}
                  value={answers.skinType}
                  onChange={(v) => setAnswer("skinType", v)}
                />
              )}

              {step.key === "strength" && (
                <OptionList
                  name="sc-strength"
                  options={STRENGTHS}
                  value={answers.strength}
                  onChange={(v) => setAnswer("strength", v)}
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                disabled={stepIdx === 0}
              >
                Back
              </Button>
              <Button size="sm" onClick={handleNext} disabled={!canAdvance}>
                {isLast ? "Show recommendation" : "Next"}
              </Button>
            </div>
          </>
        )}

        {submitted && rec && (
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Recommended sprays
              </p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-4xl font-bold tabular-nums text-primary">
                  {rec.sprays}
                </span>
                <span className="text-sm text-muted-foreground">
                  spray{rec.sprays === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Apply to
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {rec.points.map((p) => (
                  <Badge key={p} variant="secondary" className="capitalize">
                    {p}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                How we got there
              </h3>
              <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                {rec.reasoning.map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary" aria-hidden>
                      &middot;
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-dashed border-border bg-background/50 p-3">
              <p className="text-xs text-muted-foreground">
                These are general guidelines, not rules. Always test on your own skin and
                adjust based on feedback from people around you.
              </p>
            </div>

            <Button variant="outline" size="sm" onClick={handleRestart} className="self-start">
              Recalculate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SprayCalculator;
