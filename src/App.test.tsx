import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('NutriCare App Full Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders NutriCare title, calorie gauge, and hydration tumbler by default', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /NutriCare/i })).toBeInTheDocument();
    expect(screen.getByText(/Caloric Pressure Meter/i)).toBeInTheDocument();
    expect(screen.getByText(/Hydration Tumbler/i)).toBeInTheDocument();
    expect(screen.getByText(/Culinary Provisions by Sitting/i)).toBeInTheDocument();
  });

  it('switches between tabs: AI Food Camera and Weekly Almanac', () => {
    render(<App />);

    // Click AI Food Camera tab
    const cameraTab = screen.getByRole('button', { name: /AI Food Camera/i });
    fireEvent.click(cameraTab);

    expect(screen.getByText(/The Nutrition Camera/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample Food Plates/i)).toBeInTheDocument();

    // Click Weekly Almanac tab
    const almanacTab = screen.getByRole('button', { name: /Weekly Almanac/i });
    fireEvent.click(almanacTab);

    expect(screen.getByText(/Seven-Day Almanac & Ledger/i)).toBeInTheDocument();
    expect(screen.getByText(/Health Curator & Physician Inscription/i)).toBeInTheDocument();

    // Return to Daily Ledger
    const ledgerTab = screen.getByRole('button', { name: /Daily Ledger/i });
    fireEvent.click(ledgerTab);

    expect(screen.getByText(/Caloric Pressure Meter/i)).toBeInTheDocument();
  });

  it('increments water volume when +250ml button is clicked', () => {
    render(<App />);

    const addWaterBtn = screen.getByRole('button', { name: /\+250ml \(Cup\)/i });
    fireEvent.click(addWaterBtn);

    // Current volume should now reflect 250ml
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('opens and closes settings modal', () => {
    render(<App />);

    const settingsBtn = screen.getByRole('button', { name: /Settings/i });
    fireEvent.click(settingsBtn);

    expect(screen.getByText(/Journal Preferences & Calibration/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Journal Preferences & Calibration/i)).not.toBeInTheDocument();
  });
});
