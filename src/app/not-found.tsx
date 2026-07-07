import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { FlaskConical, Home, Search } from "lucide-react";

export const metadata = buildMetadata({
  title: "Page Not Found (404)",
  description: "The page you're looking for doesn't exist.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <FlaskConical className="h-10 w-10" />
      </div>
      <p className="font-serif text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-serif text-2xl font-bold md:text-3xl">
        This scent has evaporated.
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist, may have moved, or never
        existed. Try one of these instead:
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/blog">
            <Search className="mr-2 h-4 w-4" aria-hidden="true" />
            Browse articles
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/tools">Try the tools</Link>
        </Button>
      </div>
    </div>
  );
}
