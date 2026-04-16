import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from './HomePage';

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  it('should render main content area', () => {
    renderWithRouter(<HomePage />);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass(/mainContent/);
  });

  it('should render project cards', () => {
    renderWithRouter(<HomePage />);

    const projectCards = screen.getAllByRole('img');
    expect(projectCards.length).toBeGreaterThan(0);
  });

  it('should render content without errors', () => {
    renderWithRouter(<HomePage />);

    // Check that project titles from the data are rendered
    expect(screen.getByText('Tercerespai')).toBeInTheDocument();
  });
});