import fragrances from "@/data/fragrances.json";
import { getBrand } from "@/lib/brandsData";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Fragrance = (typeof fragrances)[number];

interface FragranceCardProps {
  fragrance: Fragrance;
}

interface StatPillProps {
  label: string;
  value: string | number;
}

function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="flex flex-col rounded-md border border-border bg-muted/40 px-2.5 py-1.5 text-center">
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function FragranceCard({ fragrance }: FragranceCardProps) {
  const brand = getBrand(fragrance.brandSlug);

  return (
    <Card className="group h-full transition-shadow hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-primary">
              {fragrance.name}
            </h3>
            {brand && (
              <p className="text-xs text-muted-foreground">{brand.name}</p>
            )}
          </div>
          <Badge variant="secondary" className="font-medium">
            {fragrance.concentration}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatPill label="Longevity" value={`${fragrance.longevityHours}h`} />
          <StatPill label="Sillage" value={fragrance.sillage} />
          <StatPill label="Value" value={fragrance.value} />
          <StatPill label="Compliments" value={fragrance.complimentFactor} />
        </div>
      </CardContent>
    </Card>
  );
}
