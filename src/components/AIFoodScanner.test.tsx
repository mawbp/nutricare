import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AIFoodScanner } from './AIFoodScanner';

describe('AIFoodScanner Component', () => {
  it('renders vintage camera interface with sample food plates', () => {
    render(<AIFoodScanner onCommitFood={vi.fn()} />);

    expect(screen.getByText(/Nutrition Camera/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Food Plates/i)).toBeInTheDocument();
    expect(screen.getByText(/Avocado Toast/i)).toBeInTheDocument();
  });

  it('analyzes sample dish when clicked and displays inspection review tag', async () => {
    const handleCommit = vi.fn();
    render(<AIFoodScanner onCommitFood={handleCommit} />);

    // Click on Avocado Toast sample dish
    const sampleBtn = screen.getByRole('button', { name: /Avocado Toast/i });
    fireEvent.click(sampleBtn);

    // Wait for analysis result card to appear
    await waitFor(() => {
      expect(screen.getByText(/Inspection Tag/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Stamp into Ledger/i)).toBeInTheDocument();

    // Click "Stamp into Ledger"
    const commitBtn = screen.getByRole('button', { name: /Stamp into Ledger/i });
    fireEvent.click(commitBtn);

    expect(handleCommit).toHaveBeenCalled();
  });
});
