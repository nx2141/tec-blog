declare module '*.md' {
  import type { MarkdownInstance } from 'astro';
  const result: MarkdownInstance<Record<string, any>>;
  export { result as default };
}