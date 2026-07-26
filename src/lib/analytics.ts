import { sendGAEvent } from "@next/third-parties/google";

type AnalyticsParams = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: string, params?: AnalyticsParams) {
  if (!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) return;
  if (typeof window === "undefined") return;

  if (!params) {
    sendGAEvent("event", name);
    return;
  }

  const cleaned = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  );

  sendGAEvent("event", name, cleaned);
}
