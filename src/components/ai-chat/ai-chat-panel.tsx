"use client";

import {
  BotIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  RotateCcwIcon,
  SendIcon,
  SquareIcon,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const COMPOSER_MAX_HEIGHT = 220;

const SUGGESTED_PROMPTS = [
  "Who is Guido and what does he do?",
  "What tech stack does Guido use?",
  "What projects has Guido built?",
  "How can I contact Guido?",
] as const;

function getMessageText(parts: { type: string; text?: string }[]) {
  return parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

function previewText(text: string, maxLength = 48) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength)}…`;
}

function formatExportTimestamp(date: Date) {
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  const gmt =
    minutes === 0
      ? `GMT${sign}${hours}`
      : `GMT${sign}${hours}:${String(minutes).padStart(2, "0")}`;

  const datePart = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const timePart = [
    String(date.getHours()).padStart(2, "0"),
    String(date.getMinutes()).padStart(2, "0"),
    String(date.getSeconds()).padStart(2, "0"),
  ].join(":");

  return `${datePart} at ${timePart} ${gmt}`;
}

function getTranscriptTitle(
  messages: { role: string; parts: { type: string; text?: string }[] }[],
) {
  const firstUserText = messages
    .filter((message) => message.role === "user")
    .map((message) => getMessageText(message.parts).trim())
    .find((text) => text.length > 0);

  if (!firstUserText) return "AI Chat";
  return previewText(firstUserText, 72).replace(/…$/, "");
}

function buildTranscriptMarkdown(
  messages: { role: string; parts: { type: string; text?: string }[] }[],
  title: string,
) {
  const turns = messages
    .map((message) => {
      const text = getMessageText(message.parts).trim();
      if (!text) return null;

      const role =
        message.role === "user"
          ? "User"
          : message.role === "assistant"
            ? "Assistant"
            : "System";

      return `---\n\n**${role}**\n\n${text}`;
    })
    .filter((turn): turn is string => turn !== null)
    .join("\n\n");

  return `# ${title}\n_Exported on ${formatExportTimestamp(new Date())} from Portfolio AI_\n\n${turns}\n`;
}

function downloadTranscriptMarkdown(markdown: string, title: string) {
  const safeName =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "ai-chat-transcript";

  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${safeName}.md`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AiChatPanel() {
  const { setOpen, messages, sendMessage, stop, status, error, resetChat } =
    useAiChat();
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = status === "submitted" || status === "streaming";
  const isEmpty = messages.length === 0 && !isLoading;

  const jumpItems = messages
    .map((message) => ({
      id: message.id,
      role: message.role,
      text: getMessageText(message.parts),
    }))
    .filter((item) => item.text.length > 0);

  function startConversation(text: string) {
    if (!text.trim() || isLoading) return;
    sendMessage({ text: text.trim() });
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, COMPOSER_MAX_HEIGHT)}px`;
  }, [input]);

  function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    startConversation(text);
    setInput("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }

  function handleExportTranscript() {
    if (messages.length === 0) return;

    const title = getTranscriptTitle(messages);
    downloadTranscriptMarkdown(buildTranscriptMarkdown(messages, title), title);
  }

  return (
    <MessageScrollerProvider autoScroll defaultScrollPosition="last-anchor">
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
        <header className="shrink-0 border-b bg-background">
          <div className="flex h-14 items-center justify-between gap-2 px-3">
            <div className="min-w-0 leading-none">
              <p className="text-sm font-medium">AI Chat</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Ask about my work
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <JumpToMessageMenu items={jumpItems} />

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Reset chat"
                onClick={resetChat}
                disabled={messages.length === 0 && !isLoading}
              >
                <RotateCcwIcon />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Export transcript"
                onClick={handleExportTranscript}
                disabled={messages.length === 0}
              >
                <DownloadIcon />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close AI chat"
                onClick={() => setOpen(false)}
              >
                <XIcon />
              </Button>
            </div>
          </div>
        </header>

        {isEmpty ? (
          <ChatEmptyState
            onSelectSuggestion={startConversation}
            disabled={isLoading}
          />
        ) : (
          <MessageScroller className="min-h-0 flex-1">
            <MessageScrollerViewport className="scrollbar-composer p-4">
              <MessageScrollerContent className="gap-4">
                {messages.map((message, index) => {
                  const text = getMessageText(message.parts);
                  if (!text) return null;

                  const isStreamingAssistant =
                    status === "streaming" &&
                    message.role === "assistant" &&
                    index === messages.length - 1;

                  return (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      <ChatMessage
                        from={message.role}
                        copyText={isStreamingAssistant ? undefined : text}
                        content={
                          message.role === "assistant" ? (
                            <>
                              <MarkdownMessage content={text} />
                              {isStreamingAssistant ? (
                                <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-foreground align-middle" />
                              ) : null}
                            </>
                          ) : (
                            <p className="whitespace-pre-wrap">{text}</p>
                          )
                        }
                      />
                    </MessageScrollerItem>
                  );
                })}

                {status === "submitted" ? (
                  <MessageScrollerItem messageId="ai-status">
                    <Message
                      align="start"
                      aria-live="polite"
                      className="items-center"
                    >
                      <BotAvatar />
                      <MessageContent className="w-fit max-w-[85%]">
                        <p className="shimmer px-0.5 text-xs text-muted-foreground">
                          Thinking…
                        </p>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ) : null}

                {error ? (
                  <MessageScrollerItem messageId="error">
                    <p className="text-xs text-destructive">
                      Something went wrong. Check your API key and try again.
                    </p>
                  </MessageScrollerItem>
                ) : null}
              </MessageScrollerContent>
            </MessageScrollerViewport>

            <MessageScrollerButton />
          </MessageScroller>
        )}

        <form
          onSubmit={handleSubmit}
          className="shrink-0 border-t bg-background p-3"
        >
          <div className="flex items-end gap-2 border bg-background px-2 py-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Guido..."
              aria-label="Message"
              rows={1}
              style={{ maxHeight: COMPOSER_MAX_HEIGHT }}
              className="scrollbar-composer min-h-10 min-w-0 flex-1 resize-none overflow-y-auto border-0 bg-transparent px-1 py-2 focus-visible:ring-0 dark:bg-transparent"
            />

            {isLoading ? (
              <Button
                type="button"
                size="icon-sm"
                aria-label="Stop generating"
                onClick={() => stop()}
                className="mb-0.5 shrink-0"
              >
                <SquareIcon className="size-3 fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon-sm"
                aria-label="Send message"
                disabled={!input.trim()}
                className="mb-0.5 shrink-0"
              >
                <SendIcon />
              </Button>
            )}
          </div>
        </form>
      </div>
    </MessageScrollerProvider>
  );
}

function ChatEmptyState({
  onSelectSuggestion,
  disabled,
}: {
  onSelectSuggestion: (text: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="scrollbar-composer min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
      <div className="flex min-h-full items-center justify-center">
        <Empty className="border-0 p-2">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <BotIcon />
            </EmptyMedia>
            <EmptyTitle>Ask about Guido</EmptyTitle>
            <EmptyDescription>
              Pick a suggested question or type your own to start the
              conversation.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex w-full flex-col gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  className="h-auto justify-start whitespace-normal px-3 py-2 text-left"
                  onClick={() => onSelectSuggestion(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}

function JumpToMessageMenu({
  items,
}: {
  items: Array<{ id: string; role: string; text: string }>;
}) {
  const { scrollToMessage } = useMessageScroller();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={items.length === 0}
          />
        }
      >
        Jump to...
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56 max-w-72">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onClick={() => {
              scrollToMessage(item.id);
            }}
          >
            <span className="truncate">
              <span className="text-muted-foreground">
                {item.role === "user" ? "You" : "AI"}:{" "}
              </span>
              {previewText(item.text)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function BotAvatar() {
  return (
    <div
      data-slot="message-avatar"
      className="flex size-7 shrink-0 items-center justify-center self-start border bg-muted text-foreground"
    >
      <BotIcon className="size-3.5" />
    </div>
  );
}

function ChatMessage({
  from,
  content,
  copyText,
}: {
  from: "user" | "assistant" | "system";
  content: ReactNode;
  copyText?: string;
}) {
  const isUser = from === "user";

  return (
    <Message align={isUser ? "end" : "start"}>
      {!isUser ? <BotAvatar /> : null}
      <MessageContent className="w-fit max-w-[85%]">
        <div
          className={cn(
            "w-fit max-w-full px-3 py-2 text-xs leading-relaxed",
            isUser
              ? "border border-foreground bg-foreground text-background"
              : "border bg-muted/50 text-foreground",
          )}
        >
          {content}
        </div>
        {copyText ? (
          <MessageFooter className="px-0">
            <CopyMessageButton text={copyText} />
          </MessageFooter>
        ) : null}
      </MessageContent>
    </Message>
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
