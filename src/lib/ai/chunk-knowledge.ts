export type KnowledgeChunk = {
  id: string;
  title: string;
  content: string;
};

/**
 * Split the profile markdown into retrieval chunks by headings.
 */
export function chunkKnowledgeBase(markdown: string): KnowledgeChunk[] {
  const withoutFrontmatter = markdown.replace(/^---[\s\S]*?---\s*/, "").trim();
  const sections = withoutFrontmatter.split(/\n(?=#{1,3}\s+)/);

  const chunks: KnowledgeChunk[] = [];

  for (const [index, section] of sections.entries()) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    const titleMatch = trimmed.match(/^#{1,3}\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? `Section ${index + 1}`;
    const content = trimmed.replace(/^#{1,3}\s+.+$/m, "").trim();

    if (!content && !titleMatch) continue;

    const text = content ? `${title}\n\n${content}` : title;

    // Keep chunks reasonably sized for embedding quality.
    if (text.length > 2200) {
      const parts = splitLongChunk(text, 1800);
      for (const [partIndex, part] of parts.entries()) {
        chunks.push({
          id: `chunk-${index + 1}-${partIndex + 1}`,
          title: `${title} (${partIndex + 1})`,
          content: part,
        });
      }
      continue;
    }

    chunks.push({
      id: `chunk-${index + 1}`,
      title,
      content: text,
    });
  }

  return chunks;
}

function splitLongChunk(text: string, maxLength: number): string[] {
  const paragraphs = text.split(/\n{2,}/);
  const parts: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const next = current ? `${current}\n\n${paragraph}` : paragraph;
    if (next.length > maxLength && current) {
      parts.push(current);
      current = paragraph;
      continue;
    }
    current = next;
  }

  if (current) parts.push(current);
  return parts;
}
