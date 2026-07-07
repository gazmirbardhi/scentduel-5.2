import type { Metadata } from "next";
import Link from "next/link";
import {
  Swords,
  Layers,
  Calculator,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Barcode,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { buildMetadata, abs } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Tools",
  description:
    "Seven free, interactive tools to help you find, compare, and understand fragrances — head-to-head duels, note layering, spray calculators, blind-buy risk, daily trivia, a personality quiz, and a batch-code checker. All run entirely in your browser.",
  path: "/tools",
});

interface ToolDef {
  name: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

const tools: ToolDef[] = [
  {
    name: "Scent Dueler",
    href: "/tools/scent-dueler",
    description:
      "Compare two fragrances head-to-head on longevity, sillage, value, and compliments.",
    icon: Swords,
  },
  {
    name: "Scent Matcher",
    href: "/tools/scent-matcher",
    description: "Check whether two notes layer well together.",
    icon: Layers,
  },
  {
    name: "Spray Calculator",
    href: "/tools/spray-calculator",
    description: "Get a personalized spray count and application guide.",
    icon: Calculator,
  },
  {
    name: "Blind Buy Risk Assessor",
    href: "/tools/blind-buy-risk",
    description: "Should you blind-buy that fragrance? Find your risk score.",
    icon: AlertTriangle,
  },
  {
    name: "Name That Note",
    href: "/tools/name-that-note",
    description: "Daily fragrance trivia. New question every day.",
    icon: HelpCircle,
  },
  {
    name: "Fragrance Personality Quiz",
    href: "/tools/fragrance-quiz",
    description:
      "Answer 5 questions, get your scent family and 3 recommendations.",
    icon: Sparkles,
  },
  {
    name: "Batch Code Checker",
    href: "/tools/batch-checker",
    description: "Decode fragrance batch codes (demo/educational).",
    icon: Barcode,
  },
];

function buildItemListJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fragrance Tools",
    description:
      "Seven free, interactive tools to help you find, compare, and understand fragrances. All run entirely in your browser.",
    url: abs("/tools"),
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: abs(tool.href),
      description: tool.description,
    })),
  };
}

export default function ToolsIndexPage() {
  const itemListJsonLd = buildItemListJsonLd();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tools" },
        ]}
      />

      <header className="mt-6 mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Fragrance Tools
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          Seven free, interactive tools to help you find, compare, and
          understand fragrances. All run entirely in your browser — no account,
          no data sent anywhere.
        </p>
      </header>

      <section
        aria-label={`${tools.length} interactive fragrance tools`}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Card
              key={tool.href}
              className="group flex flex-col transition-shadow hover:shadow-lg"
            >
              <CardHeader>
                <div
                  className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="font-serif text-xl">
                  <Link
                    href={tool.href}
                    className="group-hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                </CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Open tool
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </div>
  );
}
