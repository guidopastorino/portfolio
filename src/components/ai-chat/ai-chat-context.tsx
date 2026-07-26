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

import { trackEvent } from "@/lib/analytics";

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
  const [open, setOpenState] = useState(false);

  const { messages, sendMessage, stop, status, error, setMessages } = useChat({
    id: "portfolio-ai-chat",
    transport: chatTransport,
  });

  const setOpen = useCallback((nextOpen: boolean) => {
    setOpenState((current) => {
      if (nextOpen && !current) {
        trackEvent("ai_chat_opened");
      }
      return nextOpen;
    });
  }, []);

  const toggle = useCallback(() => {
    setOpenState((current) => {
      if (!current) {
        trackEvent("ai_chat_opened");
      }
      return !current;
    });
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  const stopTracked = useCallback(() => {
    trackEvent("ai_chat_stopped");
    stop();
  }, [stop]);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      toggle,
      messages,
      sendMessage,
      stop: stopTracked,
      status,
      error,
      resetChat,
    }),
    [
      open,
      setOpen,
      toggle,
      messages,
      sendMessage,
      stopTracked,
      status,
      error,
      resetChat,
    ],
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
