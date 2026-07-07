import type { Metadata } from "next";
import { notes } from "@/lib/notesData";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { NoteCard } from "@/components/cards/note-card";

export const metadata: Metadata = buildMetadata({
  title: "Fragrance Note Glossary",
  description:
    "A reference glossary of the most important fragrance notes in perfumery — from bergamot and vetiver to oud and amber. Learn how each note smells, where it's used, and what it pairs with.",
  path: "/notes",
});

export default function NotesIndexPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Notes" },
        ]}
      />

      <header className="mt-6 mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          Fragrance Note Glossary
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground">
          A reference glossary of the individual materials that make up a
          fragrance. Each entry covers what the note smells like, the olfactory
          family it belongs to, how long it lasts on skin, and the compositions
          where it plays a starring role. Use this as a decoder ring when you
          read a fragrance pyramid or a ScentDuel review.
        </p>
      </header>

      <section
        aria-label={`${notes.length} fragrance notes`}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {notes.map((note) => (
          <NoteCard key={note.slug} note={note} />
        ))}
      </section>
    </div>
  );
}
