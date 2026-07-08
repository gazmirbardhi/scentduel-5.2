import { Zap } from "lucide-react";

interface TldrProps {
  text: string;
}

/**
 * TL;DR callout shown above the article body. A quick scannable summary for
 * readers who want the verdict without reading 1500 words.
 */
export function Tldr({ text }: TldrProps) {
  return (
    <aside
      className="mb-8 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 sm:px-5 sm:py-4"
      aria-label="TL;DR summary"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <Zap className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">TL;DR</p>
          <p className="mt-1 text-base leading-relaxed text-foreground sm:text-lg">{text}</p>
        </div>
      </div>
    </aside>
  );
}
