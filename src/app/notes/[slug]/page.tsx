import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fragrances from "@/data/fragrances.json";
import {
  noteSlugs,
  getNote,
  getNotesBySlugs,
  type Note,
} from "@/lib/notesData";
import { getPostsByNote } from "@/lib/posts";
import { buildMetadata, buildBreadcrumbJsonLd, abs } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FragranceCard } from "@/components/cards/fragrance-card";
import { PostCard } from "@/components/cards/post-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return noteSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) {
    return buildMetadata({
      title: "Note not found",
      description: "The requested fragrance note could not be found.",
      path: `/notes/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${note.name} — Fragrance Note`,
    description: note.summary,
    path: `/notes/${slug}`,
  });
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}|\r\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function buildNoteJsonLd(note: Note) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: note.name,
    description: note.summary,
    termCode: note.slug,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: `${siteConfig.name} Fragrance Note Glossary`,
      url: abs("/notes"),
    },
    url: abs(`/notes/${note.slug}`),
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const relatedNotes = getNotesBySlugs(note.relatedNotes);
  const fragrancesWithNote = fragrances.filter((f) =>
    f.noteSlugs.includes(note.slug)
  );
  const relatedPosts = getPostsByNote(slug).slice(0, 3);

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Notes", url: "/notes" },
    { name: note.name, url: `/notes/${note.slug}` },
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Notes", href: "/notes" },
          { label: note.name },
        ]}
      />

      <header className="mt-6 mb-6">
        <h1 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
          {note.name}
        </h1>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="font-medium">
            {note.family}
          </Badge>
          <Badge variant="outline" className="font-medium">
            {note.longevity} longevity
          </Badge>
        </div>
      </header>

      <section className="space-y-4 text-base leading-relaxed text-foreground/90">
        {splitParagraphs(note.description).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </section>

      <section
        aria-label="Scent profile"
        className="mt-8 rounded-lg border border-border bg-muted/40 p-4"
      >
        <h2 className="font-serif text-lg font-bold">Scent Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {note.scentProfile}
        </p>
      </section>

      <section aria-label="Typical use">
        <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
          Typical Use
        </h2>
        <p className="text-base leading-relaxed text-foreground/90">
          {note.typicalUse}
        </p>
      </section>

      {relatedNotes.length > 0 && (
        <section aria-label="Related notes">
          <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
            Related Notes
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedNotes.map((related) => (
              <li key={related.slug}>
                <Link
                  href={`/notes/${related.slug}`}
                  className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-accent hover:text-primary"
                >
                  {related.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section
        aria-label={`Fragrances containing ${note.name}`}
      >
        <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
          Fragrances Containing {note.name}
        </h2>
        {fragrancesWithNote.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {fragrancesWithNote.map((fragrance) => (
              <FragranceCard key={fragrance.slug} fragrance={fragrance} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No fragrances in our database currently feature {note.name} as a
            listed note.
          </p>
        )}
      </section>

      {relatedPosts.length > 0 && (
        <section aria-label="Related articles">
          <h2 className="font-serif text-2xl font-bold mt-10 mb-4">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildNoteJsonLd(note)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
