"use client";

import { BotIcon } from "lucide-react";

import { useAiChat } from "@/components/ai-chat/ai-chat-context";
import { Button } from "@/components/ui/button";

export function AiChatToggle() {
  const { open, toggle } = useAiChat();

  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label={open ? "Close AI chat" : "Open AI chat"}
      aria-expanded={open}
      onClick={toggle}
    >
      <BotIcon />
    </Button>
  );
}
