"use client";

import type { ComponentProps } from "react";

import { trackEvent } from "@/lib/analytics";

type TrackedAnchorProps = ComponentProps<"a"> & {
  event: string;
  eventParams?: Record<string, string | number | boolean | undefined>;
};

export function TrackedAnchor({
  event,
  eventParams,
  onClick,
  ...props
}: TrackedAnchorProps) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        trackEvent(event, eventParams);
        onClick?.(clickEvent);
      }}
    />
  );
}
