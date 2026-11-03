import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { WeeklyAlmanac } from './WeeklyAlmanac';
import { WeeklySummary } from '../types';

describe('WeeklyAlmanac Component', () => {
  const mockSummary: WeeklySummary = {
    days: [
      { date: '2026-10-28', dayLabel: 'Wed', calories: 1950, waterMl: 2600, calorieGoal: 2000, waterGoal: 2500, goalMet: true, macros: { protein: 110, carbs: 210, fat: 65 } },
      { date: '2026-10-29', dayLabel: 'Thu', calories: 2100, waterMl: 2400, calorieGoal: 2000, waterGoal: 2500, goalMet: false, macros: { protein: 125, carbs: 220, fat: 70 } },
      { date: '2026-10-30', dayLabel: 'Fri', calories: 1850, waterMl: 2550, calorieGoal: 2000, waterGoal: 2500, goalMet: true, macros: { protein: 105, carbs: 190, fat: 60 } },
      { date: '2026-10-31', dayLabel: 'Sat', calories: 2400, waterMl: 2200, calorieGoal: 2000, waterGoal: 2500, goalMet: false, macros: { protein: 130, carbs: 260, fat: 85 } },
      { date: '2026-11-01', dayLabel: 'Sun', calories: 1750, waterMl: 2700, calorieGoal: 2000, waterGoal: 2500, goalMet: true, macros: { protein: 100, carbs: 180, fat: 55 } },
      { date: '2026-11-02', dayLabel: 'Mon', calories: 1980, waterMl: 2500, calorieGoal: 2000, waterGoal: 2500, goalMet: true, macros: { protein: 115, carbs: 205, fat: 62 } },
      { date: '2026-11-03', dayLabel: 'Tue', calories: 2020, waterMl: 2800, calorieGoal: 2000, waterGoal: 2500, goalMet: true, macros: { protein: 120, carbs: 215, fat: 64 } },
    ],
    totalCalories: 14050,
    avgCalories: 2007,
    totalWaterMl: 17750,
    avgWaterMl: 2536,
    peakCalorieDay: { date: '2026-10-31', dayLabel: 'Sat', calories: 2400, waterMl: 2200, calorieGoal: 2000, waterGoal: 2500, goalMet: false, macros: { protein: 130, carbs: 260, fat: 85 } },
    lightestCalorieDay: { date: '2026-11-01', dayLabel: 'Sun', calories: 1750, waterMl: 2700, calorieGoal: 2000, waterGoal: 2500, goalMet: true, macros: { protein: 100, carbs: 180, fat: 55 } },
    macroTotals: { protein: 805, carbs: 1480, fat: 461 },
    macroSplit: { proteinPct: 30, carbsPct: 45, fatPct: 25 },
    curatorNote: 'Splendid discipline: your hydration average surpassed the target goal with balanced macro distributions.',
  };

  it('renders weekly almanac header and average metrics cards', () => {
    render(<WeeklyAlmanac summary={mockSummary} />);

    expect(screen.getByText(/Seven-Day Almanac/i)).toBeInTheDocument();
    expect(screen.getByText('2,007')).toBeInTheDocument();
    expect(screen.getByText('2,536')).toBeInTheDocument();
  });

  it('renders 7 day bars with day labels and wax seal achievements', () => {
    render(<WeeklyAlmanac summary={mockSummary} />);

    expect(screen.getByText('Wed')).toBeInTheDocument();
    expect(screen.getAllByText('Sun').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Tue')).toBeInTheDocument();
    // 5 days met goals in mockSummary
    const waxSeals = screen.getAllByTestId('wax-seal-badge');
    expect(waxSeals.length).toBe(5);
  });

  it('displays curator handwritten ink note', () => {
    render(<WeeklyAlmanac summary={mockSummary} />);

    expect(screen.getByText(/Splendid discipline/i)).toBeInTheDocument();
    expect(screen.getByText(/Nutritional Curator/i)).toBeInTheDocument();
  });

  it('allows clicking day bars to select date', () => {
    const handleSelect = vi.fn();
    render(<WeeklyAlmanac summary={mockSummary} onSelectDate={handleSelect} />);

    const satBar = screen.getByRole('button', { name: /Sat/i });
    fireEvent.click(satBar);
    expect(handleSelect).toHaveBeenCalledWith('2026-10-31');
  });
});
