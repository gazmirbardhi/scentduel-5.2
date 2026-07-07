import Link from "next/link";
import type { Note } from "@/lib/notesData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Card className="group h-full transition-shadow hover:shadow-lg">
      <Link
        href={`/notes/${note.slug}`}
        className="flex h-full flex-col"
        aria-label={`View note: ${note.name}`}
      >
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-primary">
              {note.name}
            </h3>
            <Badge variant="secondary" className="font-medium">
              {note.family}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="mt-auto pt-0">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {note.summary}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
