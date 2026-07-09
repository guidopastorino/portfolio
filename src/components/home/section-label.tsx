import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[11px] tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
