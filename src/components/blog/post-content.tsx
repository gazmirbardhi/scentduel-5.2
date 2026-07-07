import ReactMarkdown, { type Components } from "react-markdown";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PostContentProps {
  content: string;
}

const AFFILIATE_HOSTS = ["fragrancex", "amazon", "sephora"];

function isAffiliateHref(href: string): boolean {
  const lower = href.toLowerCase();
  return AFFILIATE_HOSTS.some((host) => lower.includes(host));
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

/**
 * Strip the `node` prop that react-markdown injects so it never leaks onto a
 * real DOM element. React 19 will warn on unknown DOM attributes.
 */
function withoutNode<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const { node: _node, ...rest } = props;
  void _node;
  return rest;
}

const components: Components = {
  h2: (props) => (
    <h2
      {...withoutNode(props)}
      className="mt-10 border-b border-border pb-2 font-serif text-2xl font-bold leading-tight text-foreground"
    />
  ),
  h3: (props) => (
    <h3
      {...withoutNode(props)}
      className="mt-8 font-serif text-xl font-bold leading-tight text-foreground"
    />
  ),
  a: ({ node: _node, href = "", children, ...rest }) => {
    void _node;
    const affiliate = isAffiliateHref(href);
    if (!affiliate && isInternalHref(href)) {
      return <Link href={href}>{children}</Link>;
    }
    const rel = affiliate ? "sponsored nofollow noopener" : "noopener noreferrer";
    return (
      <a href={href} target="_blank" rel={rel} {...rest}>
        {children}
      </a>
    );
  },
  blockquote: (props) => (
    <blockquote
      {...withoutNode(props)}
      className="my-6 border-l-4 border-primary/40 bg-muted/40 py-2 pl-4 pr-2 italic text-muted-foreground"
    />
  ),
  code: (props) => (
    <code
      {...withoutNode(props)}
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground"
    />
  ),
  img: ({ node: _node, src = "", alt = "", width, height, ...rest }) => {
    void _node;
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        width={typeof width === "number" ? width : 800}
        height={typeof height === "number" ? height : 450}
        className="my-6 h-auto w-full rounded-md border border-border"
        {...rest}
      />
    );
  },
  table: (props) => (
    <div className="my-6">
      <Table {...withoutNode(props)} />
    </div>
  ),
  thead: (props) => <TableHeader {...withoutNode(props)} />,
  tbody: (props) => <TableBody {...withoutNode(props)} />,
  tr: (props) => <TableRow {...withoutNode(props)} />,
  th: (props) => (
    <TableHead
      {...withoutNode(props)}
      className={cn("[&:not(:first-child)]:text-left")}
    />
  ),
  td: (props) => <TableCell {...withoutNode(props)} />,
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose-scentduel max-w-none">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
    </div>
  );
}
