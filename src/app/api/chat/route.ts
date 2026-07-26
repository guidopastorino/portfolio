import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  smoothStream,
  streamText,
  type UIMessage,
} from "ai";

import { buildRagContext, retrieveRelevantChunks } from "@/lib/ai/rag";
import { buildSystemPrompt } from "@/lib/ai/system-prompt";

export const maxDuration = 30;

function getLastUserText(messages: UIMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message?.role !== "user") continue;

    const text = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n")
      .trim();

    if (text) return text;
  }

  return "";
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      { error: "Missing GOOGLE_GENERATIVE_AI_API_KEY." },
      { status: 500 },
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();
  const question = getLastUserText(messages);

  if (!question) {
    return Response.json({ error: "Missing user message." }, { status: 400 });
  }

  const chunks = await retrieveRelevantChunks(question);
  const context = buildRagContext(chunks);

  const result = streamText({
    model: google("gemini-3.1-flash-lite"),
    system: buildSystemPrompt(context),
    messages: await convertToModelMessages(messages),
    abortSignal: req.signal,
    experimental_transform: smoothStream({
      delayInMs: 15,
      chunking: "word",
    }),
  });

  return result.toUIMessageStreamResponse();
}
