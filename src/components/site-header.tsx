import { DownloadIcon, MenuIcon } from "lucide-react";

import { AiChatToggle } from "@/components/ai-chat/ai-chat-toggle";
import { GitHubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navLinks, siteConfig } from "@/lib/portfolio";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <a
          href="#about"
          className="flex size-8 items-center justify-center border bg-foreground font-sans text-sm font-semibold text-background"
        >
          {siteConfig.initials}
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <a
            href={siteConfig.resumeUrl}
            download
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            <DownloadIcon data-icon="inline-start" />
            Resume
          </a>

          <Button
            variant="outline"
            size="icon-sm"
            nativeButton={false}
            render={
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            aria-label="GitHub"
          >
            <GitHubIcon />
          </Button>

          <ThemeToggle />

          <AiChatToggle />

          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" size="icon-sm" aria-label="Menu" />}
      >
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        {navLinks.map((link) => (
          <DropdownMenuItem key={link.href} className="p-0">
            <a href={link.href} className="flex w-full items-center px-2 py-2">
              {link.label}
            </a>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem className="p-0">
          <a
            href={siteConfig.resumeUrl}
            download
            className="flex w-full items-center px-2 py-2"
          >
            Resume
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
