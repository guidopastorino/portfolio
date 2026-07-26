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
      className="sticky top-0 z-50 flex h-dvh shrink-0 flex-col border-l bg-background relative"
      style={{ width }}
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

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    root.classList.add("scrollbar-none");

    return () => {
      root.classList.remove("scrollbar-none");
    };
  }, [open]);

  return (
    <div className="flex min-h-full bg-background">
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <div className="flex-1">{children}</div>
      </div>

      {open && !isMobile ? <DesktopChatSidebar /> : null}

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
