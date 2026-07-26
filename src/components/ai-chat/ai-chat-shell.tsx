"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

import {
  AiChatProvider,
  useAiChat,
} from "@/components/ai-chat/ai-chat-context";
import { AiChatPanel } from "@/components/ai-chat/ai-chat-panel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-is-mobile";

const CHAT_DEFAULT_WIDTH = 380;
const CHAT_MIN_WIDTH = CHAT_DEFAULT_WIDTH;
const CHAT_MAX_WIDTH = 560;
const HEADER_HEIGHT = "3.5rem";

function DesktopChatSidebar() {
  const [width, setWidth] = useState(CHAT_DEFAULT_WIDTH);
  const draggingRef = useRef(false);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;

      const nextWidth = window.innerWidth - event.clientX;
      setWidth(Math.min(CHAT_MAX_WIDTH, Math.max(CHAT_MIN_WIDTH, nextWidth)));
    };

    const onPointerUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
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

  return (
    <aside
      className="sticky top-14 z-30 flex shrink-0 flex-col self-start border-l bg-background relative"
      style={{
        width,
        height: `calc(100dvh - ${HEADER_HEIGHT})`,
      }}
    >
      <button
        type="button"
        aria-label="Resize chat panel"
        className="absolute inset-y-0 left-0 z-10 flex w-px -translate-x-1/2 cursor-col-resize items-center justify-center border-0 bg-transparent p-0 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2"
        onPointerDown={(event) => {
          event.preventDefault();
          draggingRef.current = true;
          document.body.style.cursor = "col-resize";
          document.body.style.userSelect = "none";
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            setWidth((current) => Math.min(CHAT_MAX_WIDTH, current + 16));
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            setWidth((current) => Math.max(CHAT_MIN_WIDTH, current - 16));
          }
        }}
      >
        <span className="z-10 flex h-6 w-1 shrink-0 bg-border" />
      </button>
      <AiChatPanel />
    </aside>
  );
}

function AiChatShellInner({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  const { open, setOpen } = useAiChat();
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-full flex-col bg-background">
      {header}

      <div className="flex flex-1 items-start">
        <div className="min-w-0 flex-1">{children}</div>
        {open && !isMobile ? <DesktopChatSidebar /> : null}
      </div>

      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent
            side="right"
            showCloseButton={false}
            className="h-dvh w-full gap-0 overflow-hidden p-0 sm:max-w-md"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>AI Chat</SheetTitle>
              <SheetDescription>
                Chat with an AI assistant about this portfolio.
              </SheetDescription>
            </SheetHeader>
            <AiChatPanel />
          </SheetContent>
        </Sheet>
      ) : null}
    </div>
  );
}

export function AiChatShell({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) {
  return (
    <AiChatProvider>
      <AiChatShellInner header={header}>{children}</AiChatShellInner>
    </AiChatProvider>
  );
}
