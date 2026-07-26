"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AiChatContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  messages: UIMessage[];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  stop: ReturnType<typeof useChat>["stop"];
  status: ReturnType<typeof useChat>["status"];
  error: Error | undefined;
  resetChat: () => void;
};

const AiChatContext = createContext<AiChatContextValue | null>(null);

const chatTransport = new DefaultChatTransport({
  api: "/api/chat",
});

export function AiChatProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const { messages, sendMessage, stop, status, error, setMessages } = useChat({
    id: "portfolio-ai-chat",
    transport: chatTransport,
  });

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      messages,
      sendMessage,
      stop,
      status,
      error,
      resetChat,
    }),
    [open, toggle, messages, sendMessage, stop, status, error, resetChat],
  );

  return (
    <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>
  );
}

export function useAiChat() {
  const context = useContext(AiChatContext);

  if (!context) {
    throw new Error("useAiChat must be used within an AiChatProvider.");
  }

  return context;
}
