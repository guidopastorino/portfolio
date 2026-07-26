"use client";

import {
  BotIcon,
  CheckIcon,
  CopyIcon,
  LoaderCircleIcon,
  SendIcon,
  XIcon,
} from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAiChat } from "@/components/ai-chat/ai-chat-context";
import { MarkdownMessage } from "@/components/ai-chat/markdown-message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const WELCOME_MESSAGE =
  "Hi! I'm Guido's AI assistant. Ask me anything about his experience, projects, or skills.";

const COMPOSER_MIN_HEIGHT = 72;
const COMPOSER_MAX_HEIGHT = 220;
const COMPOSER_DEFAULT_HEIGHT = 72;

export function AiChatPanel() {
  const { setOpen, messages, sendMessage, status, error } = useAiChat();
  const [input, setInput] = useState("");
  const [composerHeight, setComposerHeight] = useState(COMPOSER_DEFAULT_HEIGHT);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const resizeDragRef = useRef<{
    startY: number;
    startHeight: number;
  } | null>(null);

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

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!resizeDragRef.current) return;

      const delta = resizeDragRef.current.startY - event.clientY;
      const nextHeight = Math.min(
        COMPOSER_MAX_HEIGHT,
        Math.max(
          COMPOSER_MIN_HEIGHT,
          resizeDragRef.current.startHeight + delta,
        ),
      );
      setComposerHeight(nextHeight);
    };

    const onPointerUp = () => {
      if (!resizeDragRef.current) return;
      resizeDragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    sendMessage({ text });
    setInput("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
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
        <ChatBubble from="assistant" copyText={WELCOME_MESSAGE}>
          <MarkdownMessage content={WELCOME_MESSAGE} />
        </ChatBubble>

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
            <ChatBubble
              key={message.id}
              from={message.role}
              copyText={isStreamingAssistant ? undefined : text}
            >
              {message.role === "assistant" ? (
                <>
                  <MarkdownMessage content={text} />
                  {isStreamingAssistant ? (
                    <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-foreground align-middle" />
                  ) : null}
                </>
              ) : (
                text
              )}
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
        className="shrink-0 border-t bg-background p-3"
      >
        <div
          className="relative flex flex-col border bg-background"
          style={{ height: composerHeight }}
        >
          <button
            type="button"
            aria-label="Resize message input"
            className="absolute inset-x-0 top-0 z-10 flex h-3 cursor-ns-resize items-center justify-center border-0 bg-transparent p-0"
            onPointerDown={(event) => {
              event.preventDefault();
              resizeDragRef.current = {
                startY: event.clientY,
                startHeight: composerHeight,
              };
              document.body.style.cursor = "ns-resize";
              document.body.style.userSelect = "none";
            }}
          >
            <span className="h-0.5 w-8 bg-border" />
          </button>

          <div className="flex h-full min-h-0 items-end gap-2 px-2 pt-3 pb-2">
            <Textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Guido..."
              aria-label="Message"
              disabled={isLoading}
              className="scrollbar-composer h-full min-h-0 min-w-0 flex-1 resize-none border-0 bg-transparent px-1 py-1 focus-visible:ring-0 dark:bg-transparent"
            />

            <Button
              type="submit"
              size="icon-sm"
              aria-label="Send message"
              disabled={isLoading || !input.trim()}
              className="shrink-0"
            >
              {isLoading ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <SendIcon />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function ChatBubble({
  from,
  children,
  copyText,
}: {
  from: "user" | "assistant" | "system";
  children: ReactNode;
  copyText?: string;
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
          "flex max-w-[85%] flex-col gap-1",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "px-3 py-2 text-xs leading-relaxed",
            isUser
              ? "whitespace-pre-wrap border border-foreground bg-foreground text-background"
              : "border bg-muted/50 text-foreground",
          )}
        >
          {children}
        </div>
        {copyText ? <CopyMessageButton text={copyText} /> : null}
      </div>
    </div>
  );
}

function CopyMessageButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy message"}
      onClick={handleCopy}
      className="text-muted-foreground hover:text-foreground"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}
