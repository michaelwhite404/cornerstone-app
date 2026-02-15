import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/code/CodeBlock';

export const mdxComponents: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold tracking-tight mb-6">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold mt-10 mb-4 pb-2 border-b border-[rgb(var(--border))]">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold mt-8 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="leading-7 mb-4 text-[rgb(var(--foreground))]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-[rgb(var(--foreground))]">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-[rgb(var(--foreground))]">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-7">{children}</li>,
  code: ({ children, className }) => {
    // Inline code (no language class)
    if (!className) {
      return (
        <code className="px-1.5 py-0.5 rounded bg-[rgb(var(--muted))] text-sm font-mono">
          {children}
        </code>
      );
    }
    // Code block - handled by pre
    return <code className={className}>{children}</code>;
  },
  pre: ({ children }) => {
    // Extract language from code element's className
    const codeElement = children as React.ReactElement<{ className?: string; children: string }>;
    const className = codeElement?.props?.className || '';
    const language = className.replace('language-', '') || 'text';
    const code = codeElement?.props?.children || '';

    return <CodeBlock code={String(code).trim()} language={language} />;
  },
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-[rgb(var(--muted))]">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-4 py-3 font-semibold border border-[rgb(var(--border))]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 border border-[rgb(var(--border))]">{children}</td>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-[rgb(var(--primary))] pl-4 my-4 italic text-[rgb(var(--muted-foreground))]">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-[rgb(var(--primary))] hover:underline"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-[rgb(var(--border))]" />,
};
