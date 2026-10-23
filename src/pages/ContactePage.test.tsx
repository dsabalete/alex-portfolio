import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ContactePage from './ContactePage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ContactePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render hero overlay with title', () => {
    renderWithRouter(<ContactePage />);

    expect(screen.getByRole('heading', { level: 1, name: 'ÀLEX SABALETE' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Director · Editor · DOP' })).toBeInTheDocument();
  });

  it('should render contact links', () => {
    renderWithRouter(<ContactePage />);

    const instagramLink = screen.getByText('@alexsabalete').closest('a');
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/alexsabalete/');
    expect(instagramLink).toHaveAttribute('target', '_blank');
    expect(instagramLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render email with mailto link', () => {
    renderWithRouter(<ContactePage />);

    const emailLink = screen.getByText('a.sabalete.p@gmail.com').closest('a');
    expect(emailLink).toHaveAttribute('href', 'mailto:a.sabalete.p@gmail.com');
  });

  it('should close hero and navigate to home', () => {
    renderWithRouter(<ContactePage />);

    const closeButton = screen.getByText('tancar');
    fireEvent.click(closeButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  describe('Email link accessibility', () => {
    it('should have correct aria-label on email link', () => {
      renderWithRouter(<ContactePage />);

      const emailLink = screen.getByLabelText("Enviar correu a Alex Sabalete");
      expect(emailLink).toBeInTheDocument();
      expect(emailLink).toHaveAttribute('title', 'Correu');
    });

    it('should have correct aria-label on Instagram link', () => {
      renderWithRouter(<ContactePage />);

      const instagramLink = screen.getByLabelText("Instagram d'Alex Sabalete");
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('title', 'Instagram');
    });

    it('should allow default mailto behavior without preventDefault on click', () => {
      renderWithRouter(<ContactePage />);

      const emailLink = screen.getByLabelText("Enviar correu a Alex Sabalete");
      const clickEvent = new MouseEvent('click', { cancelable: true, bubbles: true });
      emailLink.dispatchEvent(clickEvent);

      expect(clickEvent.defaultPrevented).toBe(false);
    });

    it('should render explicit copy button and copy email to clipboard', async () => {
      Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

      renderWithRouter(<ContactePage />);

      const copyButton = screen.getByRole('button', { name: /copiar correu/i });
      expect(copyButton).toBeInTheDocument();

      fireEvent.click(copyButton);

      expect(writeTextMock).toHaveBeenCalledWith('a.sabalete.p@gmail.com');
      expect(alertMock).toHaveBeenCalledWith('Copiat!');
      alertMock.mockRestore();
    });
  });
});
