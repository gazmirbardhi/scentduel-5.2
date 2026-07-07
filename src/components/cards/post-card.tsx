import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import type { Post } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface PostCardProps {
  post: Post;
  /** Render a more compact variant for sidebars and related lists. */
  compact?: boolean;
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const category = getCategory(post.category);
  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link
        href={`/blog/${post.slug}`}
        className="relative block w-full overflow-hidden bg-muted"
        style={{ aspectRatio: "16 / 9" }}
        aria-label={`Read: ${post.title}`}
      >
        <img
          src={post.featuredImage}
          alt={post.featuredImageAlt}
          width={640}
          height={360}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <CardHeader className="pb-2">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {category && (
            <Badge variant="secondary" className="font-medium" asChild>
              <Link href={`/categories/${category.slug}`} className="hover:underline">
                {category.label}
              </Link>
            </Badge>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {post.readingMinutes} min read
          </span>
        </div>
        <h3
          className={`font-serif font-bold leading-snug ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent className="mt-auto pt-0">
        <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-0.5 text-xs text-muted-foreground"
            >
              <Tag className="h-2.5 w-2.5" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
