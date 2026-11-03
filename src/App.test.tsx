import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App smoke test', () => {
  it('renders NutriCare title', () => {
    render(<App />);
    expect(screen.getByText(/NutriCare/i)).toBeInTheDocument();
  });
});
