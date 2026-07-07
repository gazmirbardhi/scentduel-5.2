import Link from "next/link";
import type { Perfumer } from "@/lib/perfumersData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PerfumerCardProps {
  perfumer: Perfumer;
}

export function PerfumerCard({ perfumer }: PerfumerCardProps) {
  return (
    <Card className="group h-full transition-shadow hover:shadow-lg">
      <Link
        href={`/perfumers/${perfumer.slug}`}
        className="flex h-full flex-col"
        aria-label={`View perfumer: ${perfumer.name}`}
      >
        <CardHeader className="pb-2">
          <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-primary">
            {perfumer.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {perfumer.nationality} &middot; {perfumer.born}
          </p>
        </CardHeader>
        <CardContent className="mt-auto pt-0">
          <p className="line-clamp-2 text-sm italic text-muted-foreground">
            {perfumer.signature}
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
