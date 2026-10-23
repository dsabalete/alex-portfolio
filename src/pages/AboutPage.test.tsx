import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('AboutPage', () => {
  it('should render main content', () => {
    renderWithRouter(<AboutPage />);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass(/aboutPage/);
  });

  it('should display title heading', () => {
    renderWithRouter(<AboutPage />);

    const title = screen.getByRole('heading', { level: 1, name: 'Jo' });
    expect(title).toBeInTheDocument();
  });

  it('should display bio description', () => {
    renderWithRouter(<AboutPage />);

    expect(
      screen.getByText(/Entusiasta de l’audivisual/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/pujar-me a totes les aventures possibles/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Sempre que pugui, m’embrutaré les mans/),
    ).toBeInTheDocument();
  });

  it('should render about image', () => {
    renderWithRouter(<AboutPage />);

    const image = screen.getByAltText('About me image');
    expect(image).toBeInTheDocument();
  });
});