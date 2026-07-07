import Link from "next/link";
import type { Brand } from "@/lib/brandsData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Card className="group h-full transition-shadow hover:shadow-lg">
      <Link
        href={`/brands/${brand.slug}`}
        className="flex h-full flex-col"
        aria-label={`View brand: ${brand.name}`}
      >
        <CardHeader className="pb-2">
          <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-primary">
            {brand.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {brand.country} &middot; Est. {brand.founded}
          </p>
        </CardHeader>
        <CardContent className="mt-auto pt-0">
          <p className="line-clamp-2 text-sm italic text-muted-foreground">
            &ldquo;{brand.tagline}&rdquo;
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
