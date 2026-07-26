"use client";

import { BotIcon, SendIcon, XIcon } from "lucide-react";
import { type FormEvent, useState } from "react";

import { useAiChat } from "@/components/ai-chat/ai-chat-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AiChatPanel() {
  const { setOpen } = useAiChat();
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center border bg-foreground text-background">
            <BotIcon className="size-3.5" />
          </div>
          <div>
            <p className="text-sm font-medium">AI Chat</p>
            <p className="text-xs text-muted-foreground">Ask about my work</p>
          </div>
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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <div className="flex gap-2.5">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center border bg-muted">
            <BotIcon className="size-3.5" />
          </div>
          <div className="border bg-muted/50 px-3 py-2">
            <p className="text-xs leading-relaxed text-foreground">
              Hi! I&apos;m Guido&apos;s AI assistant. Ask me anything about his
              experience, projects, or skills.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex shrink-0 items-center gap-2 border-t bg-background p-3"
      >
        <Input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Type a message..."
          aria-label="Message"
          className="flex-1"
        />
        <Button type="submit" size="icon-sm" aria-label="Send message">
          <SendIcon />
        </Button>
      </form>
    </div>
  );
}
