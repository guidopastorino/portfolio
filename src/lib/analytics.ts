import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: AnalyticsParams) {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined") return;

  const cleaned = params
    ? Object.fromEntries(
        Object.entries(params).filter(([, value]) => value !== undefined),
      )
    : undefined;

  sendGAEvent("event", name, cleaned);
}
