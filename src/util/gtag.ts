/* eslint-disable @typescript-eslint/ban-ts-comment */
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: Record<string, any>;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// @ts-ignore
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
