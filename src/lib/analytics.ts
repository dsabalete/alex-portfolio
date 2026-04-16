import ReactGA from "react-ga4";

const getGA_MEASUREMENT_ID = () => import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initAnalytics = () => {
  const GA_MEASUREMENT_ID = getGA_MEASUREMENT_ID();
  if (GA_MEASUREMENT_ID) {
    ReactGA.initialize(GA_MEASUREMENT_ID, {
      testMode: import.meta.env.DEV,
    });
  }
};

export const trackPageView = (path: string) => {
  const GA_MEASUREMENT_ID = getGA_MEASUREMENT_ID();
  if (GA_MEASUREMENT_ID) {
    ReactGA.send({ hitType: "pageview", page: path });
  }
};

export const trackEvent = (
  category: string,
  action: string,
  label?: string
) => {
  const GA_MEASUREMENT_ID = getGA_MEASUREMENT_ID();
  if (GA_MEASUREMENT_ID) {
    ReactGA.event({ category, action, label });
  }
};
