import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

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

/** Recursively extract plain text from React children (for slug generation). */
function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return extractText((children as { props: { children?: React.ReactNode } }).props.children);
  }
  return "";
}

/** Slugify a heading text. MUST match slugifyHeading in lib/posts.ts. */
function slugify(text: string): string {
  let id = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (!id) id = "section";
  return id;
}

const components: Components = {
  h2: (props) => {
    const { children, ...rest } = withoutNode(props);
    const text = extractText(children);
    return (
      <h2
        {...rest}
        id={slugify(text)}
        className="mt-10 scroll-mt-24 border-b border-border pb-2 font-serif text-2xl font-bold leading-tight text-foreground"
      >
        {children}
      </h2>
    );
  },
  h3: (props) => {
    const { children, ...rest } = withoutNode(props);
    const text = extractText(children);
    return (
      <h3
        {...rest}
        id={slugify(text)}
        className="mt-8 scroll-mt-24 font-serif text-xl font-bold leading-tight text-foreground"
      >
        {children}
      </h3>
    );
  },
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
  ul: (props) => (
    <ul
      {...withoutNode(props)}
      className="my-5 list-disc space-y-1.5 pl-6 marker:text-primary"
    />
  ),
  ol: (props) => (
    <ol
      {...withoutNode(props)}
      className="my-5 list-decimal space-y-1.5 pl-6 marker:font-semibold marker:text-primary"
    />
  ),
  li: (props) => <li {...withoutNode(props)} className="leading-relaxed" />,
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
  // Wrap the table in an overflow-x-auto container so wide tables scroll
  // horizontally on mobile instead of breaking the layout. Use a plain
  // <table> with Tailwind classes rather than the shadcn Table primitives —
  // the primitives override display:table on cells which can conflict with
  // react-markdown's table model.
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table
        {...withoutNode(props)}
        className="w-full border-collapse text-sm"
      />
    </div>
  ),
  thead: (props) => <thead {...withoutNode(props)} className="bg-muted" />,
  tbody: (props) => <tbody {...withoutNode(props)} />,
  tr: (props) => (
    <tr
      {...withoutNode(props)}
      className="border-b border-border last:border-b-0 even:bg-muted/30"
    />
  ),
  th: (props) => (
    <th
      {...withoutNode(props)}
      className="border-b border-border px-4 py-3 text-left font-semibold text-foreground"
    />
  ),
  td: (props) => (
    <td
      {...withoutNode(props)}
      className="px-4 py-3 text-foreground align-top"
    />
  ),
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose-scentduel max-w-none">
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
