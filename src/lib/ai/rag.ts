import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { google } from "@ai-sdk/google";
import { cosineSimilarity, embed, embedMany } from "ai";

import {
  chunkKnowledgeBase,
  type KnowledgeChunk,
} from "@/lib/ai/chunk-knowledge";

type IndexedChunk = KnowledgeChunk & {
  embedding: number[];
};

const TOP_K = 6;
const EMBEDDING_MODEL = google.embedding("gemini-embedding-001");

let indexPromise: Promise<IndexedChunk[]> | null = null;

async function loadKnowledgeMarkdown() {
  const filePath = join(process.cwd(), "guido_pastorino_perfil_rag.md");
  return readFile(filePath, "utf8");
}

async function buildIndex(): Promise<IndexedChunk[]> {
  const markdown = await loadKnowledgeMarkdown();
  const chunks = chunkKnowledgeBase(markdown);

  if (chunks.length === 0) {
    throw new Error("Knowledge base produced zero chunks.");
  }

  const { embeddings } = await embedMany({
    model: EMBEDDING_MODEL,
    values: chunks.map((chunk) => chunk.content),
  });

  return chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index] ?? [],
  }));
}

export async function getKnowledgeIndex() {
  if (!indexPromise) {
    indexPromise = buildIndex().catch((error) => {
      indexPromise = null;
      throw error;
    });
  }

  return indexPromise;
}

export async function retrieveRelevantChunks(query: string, topK = TOP_K) {
  const index = await getKnowledgeIndex();

  const { embedding } = await embed({
    model: EMBEDDING_MODEL,
    value: query,
  });

  return index
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(embedding, chunk.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

export function buildRagContext(
  chunks: Array<KnowledgeChunk & { score: number }>,
) {
  return chunks
    .map(
      (chunk, index) =>
        `[Fuente ${index + 1} | ${chunk.title} | score=${chunk.score.toFixed(3)}]\n${chunk.content}`,
    )
    .join("\n\n---\n\n");
}
