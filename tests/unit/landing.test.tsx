import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '@/pages/landing-page';

test('renders hero title', () => {
  render(<BrowserRouter><LandingPage /></BrowserRouter>);
  expect(screen.getByText(/Build startup MVPs/i)).toBeInTheDocument();
});
