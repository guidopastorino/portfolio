"use client";

import { BotIcon, LoaderCircleIcon, SendIcon, XIcon } from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAiChat } from "@/components/ai-chat/ai-chat-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const WELCOME_MESSAGE =
  "Hi! I'm Guido's AI assistant. Ask me anything about his experience, projects, or skills.";

export function AiChatPanel() {
  const { setOpen, messages, sendMessage, status, error } = useAiChat();
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const isLoading = status === "submitted" || status === "streaming";
  const messageCount = messages.length;
  const lastMessageTextLength = messages
    .at(-1)
    ?.parts.filter((part) => part.type === "text")
    .reduce((total, part) => total + part.text.length, 0);

  // Scroll only the chat messages container — never the page window.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll triggers
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: messageCount === 0 ? "auto" : "smooth",
    });
  }, [messageCount, lastMessageTextLength, status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <div>
          <p className="text-sm font-medium">AI Chat</p>
          <p className="text-xs text-muted-foreground">Ask about my work</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Close AI chat"
          onClick={() => setOpen(false)}
        >
          <XIcon />
        </Button>
      </header>

      <div
        ref={messagesContainerRef}
        className="scrollbar-none min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4"
      >
        <ChatBubble from="assistant">{WELCOME_MESSAGE}</ChatBubble>

        {messages.map((message, index) => {
          const text = message.parts
            .filter((part) => part.type === "text")
            .map((part) => part.text)
            .join("");

          if (!text) return null;

          const isStreamingAssistant =
            status === "streaming" &&
            message.role === "assistant" &&
            index === messages.length - 1;

          return (
            <ChatBubble key={message.id} from={message.role}>
              {text}
              {isStreamingAssistant ? (
                <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-foreground align-middle" />
              ) : null}
            </ChatBubble>
          );
        })}

        {status === "submitted" ? (
          <ChatBubble from="assistant">
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <LoaderCircleIcon className="size-3.5 animate-spin" />
              Thinking...
            </span>
          </ChatBubble>
        ) : null}

        {error ? (
          <p className="text-xs text-destructive">
            Something went wrong. Check your API key and try again.
          </p>
        ) : null}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t bg-background p-3"
      >
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Guido..."
          aria-label="Message"
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon-sm"
          aria-label="Send message"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <SendIcon />
          )}
        </Button>
      </form>
    </div>
  );
}

function ChatBubble({
  from,
  children,
}: {
  from: "user" | "assistant" | "system";
  children: ReactNode;
}) {
  const isUser = from === "user";

  return (
    <div className={cn("flex gap-2.5", isUser && "flex-row-reverse")}>
      {!isUser ? (
        <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border bg-muted">
          <BotIcon className="size-3.5" />
        </div>
      ) : null}
      <div
        className={cn(
          "max-w-[85%] px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap",
          isUser
            ? "border border-foreground bg-foreground text-background"
            : "border bg-muted/50 text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
