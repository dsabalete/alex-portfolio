import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock lib/analytics
vi.mock('./lib/analytics', () => ({
  trackPageView: vi.fn(),
}));

describe('App', () => {
  it('renders correctly', () => {
    const { container } = render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    expect(container).toBeDefined();
  });
});
