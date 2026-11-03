import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WaterTumbler } from './WaterTumbler';

describe('WaterTumbler Component', () => {
  it('renders current water volume and goal', () => {
    render(<WaterTumbler currentMl={1250} goalMl={2500} onAddWater={vi.fn()} />);
    
    expect(screen.getByText('1,250')).toBeInTheDocument();
    expect(screen.getByText(/Target:\s*2,500/i)).toBeInTheDocument();
  });

  it('triggers quick add callbacks with correct delta amounts', () => {
    const handleAdd = vi.fn();
    render(<WaterTumbler currentMl={500} goalMl={2500} onAddWater={handleAdd} />);

    // Click +250ml Cup
    fireEvent.click(screen.getByRole('button', { name: /\+250/i }));
    expect(handleAdd).toHaveBeenCalledWith(250);

    // Click +500ml Bottle
    fireEvent.click(screen.getByRole('button', { name: /\+500/i }));
    expect(handleAdd).toHaveBeenCalledWith(500);

    // Click -250ml Undo
    fireEvent.click(screen.getByRole('button', { name: /-250/i }));
    expect(handleAdd).toHaveBeenCalledWith(-250);
  });

  it('displays goal achievement badge when goal is reached', () => {
    render(<WaterTumbler currentMl={2500} goalMl={2500} onAddWater={vi.fn()} />);
    expect(screen.getByText(/GOAL MET/i)).toBeInTheDocument();
  });
});
