import { beforeEach, describe, it, expect, vi } from 'vitest';

// Mock ReactGA before importing the module under test
vi.mock('react-ga4', () => {
  return {
    default: {
      initialize: vi.fn(),
      send: vi.fn(),
      event: vi.fn(),
    },
  };
});

// Import after mocks are set up
import ReactGA from 'react-ga4';
import { initAnalytics, trackPageView, trackEvent } from './analytics';

describe('Analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (ReactGA.initialize as ReturnType<typeof vi.fn>).mockClear();
    (ReactGA.send as ReturnType<typeof vi.fn>).mockClear();
    (ReactGA.event as ReturnType<typeof vi.fn>).mockClear();
    vi.unstubAllEnvs();
  });

  describe('initAnalytics', () => {
    it('should initialize analytics with test mode when env var is set', () => {
      const GA_MEASUREMENT_ID = 'G-TEST123';
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_MEASUREMENT_ID);
      vi.stubEnv('DEV', 'true' as unknown as boolean);

      initAnalytics();

      expect(ReactGA.initialize).toHaveBeenCalledWith(GA_MEASUREMENT_ID, {
        testMode: true,
      });
    });

    it('should not initialize analytics if GA_MEASUREMENT_ID is not set', () => {
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');

      initAnalytics();

      expect(ReactGA.initialize).not.toHaveBeenCalled();
    });
  });

  describe('trackPageView', () => {
    it('should track page view with path if GA_MEASUREMENT_ID is set', () => {
      const GA_MEASUREMENT_ID = 'G-TEST123';
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_MEASUREMENT_ID);
      const path = '/about';

      trackPageView(path);

      expect(ReactGA.send).toHaveBeenCalledWith({ hitType: 'pageview', page: path });
    });

    it('should not track page view if GA_MEASUREMENT_ID is not set', () => {
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
      const path = '/contacte';

      trackPageView(path);

      expect(ReactGA.send).not.toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    it('should track event with category, action, and label if GA_MEASUREMENT_ID is set', () => {
      const GA_MEASUREMENT_ID = 'G-TEST123';
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_MEASUREMENT_ID);
      const category = 'Button';
      const action = 'Click';
      const label = 'SubmitForm';

      trackEvent(category, action, label);

      expect(ReactGA.event).toHaveBeenCalledWith({ category, action, label });
    });

    it('should track event with category and action if no label is provided', () => {
      const GA_MEASUREMENT_ID = 'G-TEST123';
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', GA_MEASUREMENT_ID);
      const category = 'Navigation';
      const action = 'Home';

      trackEvent(category, action);

      expect(ReactGA.event).toHaveBeenCalledWith({ category, action });
    });

    it('should not track event if GA_MEASUREMENT_ID is not set', () => {
      vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
      const category = 'Project';
      const action = 'View';

      trackEvent(category, action);

      expect(ReactGA.event).not.toHaveBeenCalled();
    });
  });
});
