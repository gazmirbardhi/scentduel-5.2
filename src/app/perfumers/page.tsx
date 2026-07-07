import type { Metadata } from "next";
import { perfumers } from "@/lib/perfumersData";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PerfumerCard } from "@/components/cards/perfumer-card";

export const metadata: Metadata = buildMetadata({
  title: "Perfumer Directory",
  description:
    "A directory of the perfumers behind the fragrances we cover on ScentDuel — the noses behind Bleu de Chanel, Sauvage, Baccarat Rouge 540, Terre d'Hermès and more.",
  path: "/perfumers",
});

export default function PerfumersIndexPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Perfumers" },
        ]}
      />

      <header className="mt-6 mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Perfumer Directory
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          A directory of the perfumers behind the fragrances we cover. Each
          profile covers the nose&rsquo;s background, signature style, notable
          creations, and the fragrances in our review database credited to
          them. The fragrance industry credits its artists more openly than
          most; this is where we collect those credits.
        </p>
      </header>

      <section
        aria-label={`${perfumers.length} perfumers`}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {perfumers.map((perfumer) => (
          <PerfumerCard key={perfumer.slug} perfumer={perfumer} />
        ))}
      </section>
    </div>
  );
}
