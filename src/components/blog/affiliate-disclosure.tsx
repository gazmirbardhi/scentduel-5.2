import Link from "next/link";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface AffiliateDisclosureProps {
  variant?: "inline" | "full";
  className?: string;
}

export function AffiliateDisclosure({
  variant = "full",
  className,
}: AffiliateDisclosureProps) {
  if (variant === "inline") {
    return (
      <Alert
        className={cn(
          "flex items-center gap-2 py-2 text-xs",
          className,
        )}
      >
        <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <AlertDescription className="text-xs text-muted-foreground">
          Reader-supported. Affiliate links may earn us a commission at no
          extra cost to you.{" "}
          <Link
            href="/disclaimer"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            Full disclosure
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={cn("bg-muted/40", className)}>
      <Info className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <AlertTitle className="text-sm font-semibold">
        Affiliate disclosure
      </AlertTitle>
      <AlertDescription className="text-sm text-muted-foreground">
        ScentDuel is reader-supported. Purchases made through links on this page
        may earn us a commission at no extra cost to you. See our{" "}
        <Link
          href="/disclaimer"
          className="font-medium text-foreground underline-offset-2 hover:underline"
        >
          full affiliate disclosure
        </Link>
        .
      </AlertDescription>
    </Alert>
  );
}
