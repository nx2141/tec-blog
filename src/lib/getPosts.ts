import type { MarkdownInstance } from "astro";

// Markdownファイルをビルド時に一括して読み込み
const modules = import.meta.glob<
  MarkdownInstance<{
    title: string;
    date: string;
    description?: string;
  }>
>("../contents/*.md", { eager: true });

export const posts = Object.entries(modules)
  .map(([file, mod]) => {
    const slug = file.split("/").at(-1)!.replace(".md", "");
    return {
      slug,
      title: mod.frontmatter.title,
      date: mod.frontmatter.date,
      description: mod.frontmatter.description ?? "",
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
