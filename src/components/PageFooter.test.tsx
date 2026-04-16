import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageFooter from './PageFooter';

describe('PageFooter', () => {
  it('should render footer with copyright text', () => {
    render(<PageFooter />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent(/© 202[0-9] Alex Sabalete/);
  });

  it('should display all rights reserved message', () => {
    render(<PageFooter />);

    const footerContent = screen.getByText(/Tots els drets reservats/);
    expect(footerContent).toBeInTheDocument();
  });
});