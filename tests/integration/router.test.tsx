import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router';

test('router mounts', () => {
  render(<BrowserRouter><AppRouter /></BrowserRouter>);
});
