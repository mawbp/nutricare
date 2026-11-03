import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnalogCalorieGauge } from './AnalogCalorieGauge';

describe('AnalogCalorieGauge Component', () => {
  it('renders consumed calories and daily goal correctly', () => {
    render(<AnalogCalorieGauge consumed={1450} goal={2000} />);
    
    expect(screen.getByText('1,450')).toBeInTheDocument();
    expect(screen.getByText(/2,000/)).toBeInTheDocument();
    // Remaining calories should be 550
    expect(screen.getByText('550')).toBeInTheDocument();
    expect(screen.getByText(/Remaining/i)).toBeInTheDocument();
  });

  it('handles calorie surplus gracefully with explicit indicator', () => {
    render(<AnalogCalorieGauge consumed={2350} goal={2000} />);
    
    expect(screen.getByText('2,350')).toBeInTheDocument();
    // In surplus, shows +350 surplus
    expect(screen.getByText('+350')).toBeInTheDocument();
    expect(screen.getByText(/Surplus/i)).toBeInTheDocument();
  });
});
