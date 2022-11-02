import { render, screen } from '@testing-library/react';
import App from './app';

test('renders TODO LIST', () => {
  render(<App />);
  const element = screen.getByText(/TODO LIST/i);
  expect(element).toBeInTheDocument();
});
