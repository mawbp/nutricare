import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SettingsModal } from './SettingsModal';
import { UserSettings } from '../types';

describe('SettingsModal Component', () => {
  const mockSettings: UserSettings = {
    dailyCalorieGoal: 2100,
    dailyWaterGoalMl: 2800,
    geminiApiKey: 'TEST_GEMINI_KEY_123',
    soundEnabled: true,
  };

  it('renders input fields with current user settings', () => {
    render(
      <SettingsModal
        isOpen={true}
        settings={mockSettings}
        onClose={vi.fn()}
        onSaveSettings={vi.fn()}
        onResetData={vi.fn()}
      />
    );

    expect(screen.getByDisplayValue('2100')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2800')).toBeInTheDocument();
    expect(screen.getByDisplayValue('TEST_GEMINI_KEY_123')).toBeInTheDocument();
  });

  it('calls onSaveSettings when form is submitted', () => {
    const handleSave = vi.fn();
    render(
      <SettingsModal
        isOpen={true}
        settings={mockSettings}
        onClose={vi.fn()}
        onSaveSettings={handleSave}
        onResetData={vi.fn()}
      />
    );

    const calorieInput = screen.getByDisplayValue('2100');
    fireEvent.change(calorieInput, { target: { value: '2300' } });

    const saveBtn = screen.getByRole('button', { name: /Save Journal Settings/i });
    fireEvent.click(saveBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        dailyCalorieGoal: 2300,
      })
    );
  });
});
