import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Shell } from '@/components/layout/shell';

test('opens command palette with keyboard shortcut', () => {
  render(
    <MemoryRouter>
      <Shell>
        <div>content</div>
      </Shell>
    </MemoryRouter>
  );

  fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
  expect(screen.getByPlaceholderText(/Search projects, pages, commands/i)).toBeInTheDocument();
});
