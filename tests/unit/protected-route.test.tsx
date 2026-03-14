import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi } from 'vitest';
import { ProtectedRoute } from '@/components/layout/protected-route';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false })
}));

test('redirects to auth when user missing', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Private</div>
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<div>Auth</div>} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Auth')).toBeInTheDocument();
});
