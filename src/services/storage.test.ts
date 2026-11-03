import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getAppState, 
  getDayLog, 
  updateWater, 
  addFoodItem, 
  removeFoodItem, 
  getWeeklySummary,
  exportStateJson,
  importStateJson,
  resetAppState
} from './storage';

describe('Storage Manager & Domain Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes default state with pre-seeded past days on first load', () => {
    const state = getAppState();
    expect(state).toBeDefined();
    expect(state.settings.dailyCalorieGoal).toBe(2000);
    expect(state.settings.dailyWaterGoalMl).toBe(2500);
    expect(state.currentDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    
    // Should have seeded prior days
    const logDates = Object.keys(state.logs);
    expect(logDates.length).toBeGreaterThanOrEqual(6);
  });

  it('clamps water volume between 0 and 5000ml without overflowing or going negative', () => {
    const today = '2026-11-03';
    
    // Add 500ml
    let state = updateWater(today, 500);
    expect(getDayLog(state, today).waterMl).toBe(500);

    // Try subtracting 1000ml (should floor at 0)
    state = updateWater(today, -1000);
    expect(getDayLog(state, today).waterMl).toBe(0);

    // Try adding 6000ml (should ceiling at 5000)
    state = updateWater(today, 6000);
    expect(getDayLog(state, today).waterMl).toBe(5000);
  });

  it('adds food items and removes them with correct calorie and macro persistence', () => {
    const today = '2026-11-03';
    
    const stateWithFood = addFoodItem(today, 'breakfast', {
      name: 'Steel Cut Oats with Blueberries',
      calories: 310,
      protein: 10,
      carbs: 55,
      fat: 5,
      fiber: 8,
      source: 'manual',
    });

    const dayLog = getDayLog(stateWithFood, today);
    expect(dayLog.meals.breakfast).toHaveLength(1);
    expect(dayLog.meals.breakfast[0].name).toBe('Steel Cut Oats with Blueberries');
    expect(dayLog.meals.breakfast[0].calories).toBe(310);

    const addedId = dayLog.meals.breakfast[0].id;
    const stateAfterRemoval = removeFoodItem(today, 'breakfast', addedId);
    expect(getDayLog(stateAfterRemoval, today).meals.breakfast).toHaveLength(0);
  });

  it('calculates 7-day weekly summary accurately', () => {
    const state = getAppState();
    const summary = getWeeklySummary(state, state.currentDate);

    expect(summary.days).toHaveLength(7);
    expect(summary.totalCalories).toBeGreaterThan(0);
    expect(summary.avgCalories).toBeGreaterThan(0);
    expect(summary.totalWaterMl).toBeGreaterThan(0);
    expect(summary.avgWaterMl).toBeGreaterThan(0);
    expect(summary.macroTotals.protein).toBeGreaterThan(0);
    expect(summary.macroSplit.proteinPct + summary.macroSplit.carbsPct + summary.macroSplit.fatPct).toBeCloseTo(100, 0);
    expect(typeof summary.curatorNote).toBe('string');
  });

  it('exports and imports state json cleanly', () => {
    const original = getAppState();
    const json = exportStateJson();
    expect(json).toContain('nutricare');

    resetAppState();
    const cleared = getAppState();
    expect(cleared.logs).toBeDefined();

    const importSuccess = importStateJson(json);
    expect(importSuccess).toBe(true);
    const restored = getAppState();
    expect(restored.settings.dailyCalorieGoal).toBe(original.settings.dailyCalorieGoal);
  });
});
