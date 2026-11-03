import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MealCard } from './MealCard';
import { FoodItem } from '../types';

describe('MealCard Component', () => {
  const mockItems: FoodItem[] = [
    {
      id: 'food_1',
      name: 'Wild Blueberry Pancakes',
      calories: 360,
      protein: 10,
      carbs: 60,
      fat: 8,
      source: 'manual',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'food_2',
      name: 'Fresh Orange Juice',
      calories: 110,
      protein: 2,
      carbs: 26,
      fat: 0,
      source: 'manual',
      timestamp: new Date().toISOString(),
    },
  ];

  it('renders meal title and itemized entries with sum calories', () => {
    render(
      <MealCard
        mealType="breakfast"
        title="Morning Breakfast"
        items={mockItems}
        onAddItem={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    );

    expect(screen.getByText('Morning Breakfast')).toBeInTheDocument();
    expect(screen.getByText('Wild Blueberry Pancakes')).toBeInTheDocument();
    expect(screen.getByText('Fresh Orange Juice')).toBeInTheDocument();
    // Sum is 360 + 110 = 470 kcal
    expect(screen.getByText('470')).toBeInTheDocument();
  });

  it('calls onRemoveItem when delete button is clicked', () => {
    const handleRemove = vi.fn();
    render(
      <MealCard
        mealType="breakfast"
        title="Morning Breakfast"
        items={mockItems}
        onAddItem={vi.fn()}
        onRemoveItem={handleRemove}
      />
    );

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);
    expect(handleRemove).toHaveBeenCalledWith('food_1');
  });

  it('opens add food modal when "+ Add Food" is clicked', () => {
    render(
      <MealCard
        mealType="breakfast"
        title="Morning Breakfast"
        items={[]}
        onAddItem={vi.fn()}
        onRemoveItem={vi.fn()}
      />
    );

    const addButton = screen.getByRole('button', { name: /\+ Add/i });
    fireEvent.click(addButton);
    // Modal input should now appear
    expect(screen.getByPlaceholderText(/e\.g\. Steel Cut Oats/i)).toBeInTheDocument();
  });
});
