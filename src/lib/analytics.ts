declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

export function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID || typeof document === "undefined" || typeof window === "undefined") return;
  if (document.getElementById("ga4-script")) return;

  const script = document.createElement("script");
  script.async = true;
  script.id = "ga4-script";
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
    anonymize_ip: true,
  });
}

export function trackPageView(path: string): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
  });
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}
