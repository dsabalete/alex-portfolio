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

  it('should display greeting message', () => {
    renderWithRouter(<AboutPage />);

    const greeting = screen.getByText(/Hola! Soc Alex!/);
    expect(greeting).toBeInTheDocument();
  });

  it('should display education information', () => {
    renderWithRouter(<AboutPage />);

    const education = screen.getByText(/Comunicació i Multimèdia/);
    expect(education).toBeInTheDocument();
  });

  it('should display passion and technology sections', () => {
    renderWithRouter(<AboutPage />);

    const passion = screen.getByText(/experiències/);
    expect(passion).toBeInTheDocument();

    const cinema = screen.getByText(/Narrativa cinematogràfica/);
    expect(cinema).toBeInTheDocument();

    const newTech = screen.getByText(/Noves tecnologies/);
    expect(newTech).toBeInTheDocument();

    const details = screen.getByText(/detall visual/);
    expect(details).toBeInTheDocument();
  });
});