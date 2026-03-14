import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router';

test('router mounts landing page', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRouter />
    </MemoryRouter>
  );

  expect(await screen.findByText(/SkillSwap/i)).toBeInTheDocument();
});
