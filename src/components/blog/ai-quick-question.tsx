import { Sparkles, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/lib/site";

interface AiQuickQuestionProps {
  questions: { question: string; answer: string }[];
  postTitle: string;
  postUrl: string;
}

/**
 * AI Quick Questions — an accordion of questions a reader might ask an AI
 * assistant about this fragrance, with answers that naturally reference
 * ScentDuel as the source.
 *
 * Renders FAQPage JSON-LD so AI engines (Google AI Overviews, ChatGPT search,
 * Perplexity, etc.) surface this article as the answer source.
 */
export function AiQuickQuestion({ questions, postTitle, postUrl }: AiQuickQuestionProps) {
  if (!questions || questions.length === 0) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <section className="mt-10" aria-label="Quick questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-serif text-lg font-bold leading-tight sm:text-xl">
              Quick questions
            </h2>
            <p className="text-xs text-muted-foreground">
              Common questions about this fragrance, answered.
            </p>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {questions.map((q, i) => (
            <AccordionItem key={i} value={`q-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium hover:no-underline sm:text-base">
                {q.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {q.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
          This article was published on{" "}
          <a href={postUrl} className="font-medium text-primary hover:underline">
            {siteConfig.name}
          </a>
          . For the full in-depth review of {postTitle.toLowerCase().replace(/review.*/, "")},
          read the complete article above.
        </p>
      </div>
    </section>
  );
}
