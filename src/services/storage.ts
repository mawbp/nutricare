import { AppState, DayLog, FoodItem, MealType, UserSettings, WeeklySummary, WeeklyDaySummary } from '../types';
import { formatDateKey, createEmptyDayLog, generateSampleWeekLogs } from './seedData';

const STORAGE_KEY = 'nutricare_state_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  dailyCalorieGoal: 2000,
  dailyWaterGoalMl: 2500,
  geminiApiKey: '',
  soundEnabled: true,
};

const safeGetStorage = (): string | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(STORAGE_KEY);
    }
  } catch {
    // Storage access issue
  }
  return null;
};

const safeSetStorage = (value: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // Storage write issue
  }
};

export const getAppState = (): AppState => {
  const raw = safeGetStorage();
  const today = formatDateKey(new Date());

  if (raw) {
    try {
      const parsed: AppState = JSON.parse(raw);
      // Ensure today's log exists
      if (!parsed.logs[today]) {
        parsed.logs[today] = createEmptyDayLog(today);
      }
      // Ensure settings has all required keys
      parsed.settings = { ...DEFAULT_SETTINGS, ...parsed.settings };
      return parsed;
    } catch {
      // JSON corruption, fallback to fresh seed
    }
  }

  // First time initialization
  const seededLogs = generateSampleWeekLogs(new Date());
  const initialState: AppState = {
    currentDate: today,
    activeTab: 'ledger',
    settings: DEFAULT_SETTINGS,
    logs: seededLogs,
  };

  safeSetStorage(JSON.stringify(initialState));
  return initialState;
};

export const saveAppState = (state: AppState): void => {
  safeSetStorage(JSON.stringify(state));
};

export const getDayLog = (state: AppState, date: string): DayLog => {
  if (state.logs[date]) {
    return state.logs[date];
  }
  return createEmptyDayLog(date);
};

export const updateWater = (date: string, deltaMl: number): AppState => {
  const state = getAppState();
  const currentLog = getDayLog(state, date);
  const newVolume = Math.max(0, Math.min(5000, (currentLog.waterMl || 0) + deltaMl));

  const updatedLog: DayLog = {
    ...currentLog,
    waterMl: newVolume,
  };

  const newState: AppState = {
    ...state,
    logs: {
      ...state.logs,
      [date]: updatedLog,
    },
  };

  saveAppState(newState);
  return newState;
};

export const addFoodItem = (
  date: string,
  meal: MealType,
  item: Omit<FoodItem, 'id' | 'timestamp'>
): AppState => {
  const state = getAppState();
  const currentLog = getDayLog(state, date);
  const newItem: FoodItem = {
    ...item,
    id: `food_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  const updatedMeals = {
    ...currentLog.meals,
    [meal]: [...(currentLog.meals[meal] || []), newItem],
  };

  const newState: AppState = {
    ...state,
    logs: {
      ...state.logs,
      [date]: {
        ...currentLog,
        meals: updatedMeals,
      },
    },
  };

  saveAppState(newState);
  return newState;
};

export const removeFoodItem = (date: string, meal: MealType, itemId: string): AppState => {
  const state = getAppState();
  const currentLog = getDayLog(state, date);

  const updatedMeals = {
    ...currentLog.meals,
    [meal]: (currentLog.meals[meal] || []).filter(item => item.id !== itemId),
  };

  const newState: AppState = {
    ...state,
    logs: {
      ...state.logs,
      [date]: {
        ...currentLog,
        meals: updatedMeals,
      },
    },
  };

  saveAppState(newState);
  return newState;
};

export const updateSettings = (settings: Partial<UserSettings>): AppState => {
  const state = getAppState();
  const newState: AppState = {
    ...state,
    settings: {
      ...state.settings,
      ...settings,
    },
  };
  saveAppState(newState);
  return newState;
};

export const updateActiveTab = (tab: AppState['activeTab']): AppState => {
  const state = getAppState();
  const newState: AppState = { ...state, activeTab: tab };
  saveAppState(newState);
  return newState;
};

export const updateCurrentDate = (date: string): AppState => {
  const state = getAppState();
  if (!state.logs[date]) {
    state.logs[date] = createEmptyDayLog(date);
  }
  const newState: AppState = { ...state, currentDate: date };
  saveAppState(newState);
  return newState;
};

export const calculateDayTotals = (log: DayLog) => {
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  let fiber = 0;

  const mealCategories: MealType[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  mealCategories.forEach(meal => {
    (log.meals[meal] || []).forEach(item => {
      calories += item.calories || 0;
      protein += item.protein || 0;
      carbs += item.carbs || 0;
      fat += item.fat || 0;
      fiber += item.fiber || 0;
    });
  });

  return { calories, protein, carbs, fat, fiber };
};

export const getWeeklySummary = (state: AppState, anchorDateStr: string): WeeklySummary => {
  const anchorDate = new Date(anchorDateStr + 'T12:00:00');
  const days: WeeklyDaySummary[] = [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  let totalCalories = 0;
  let totalWaterMl = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  // 7 days ending at anchorDate
  for (let i = 6; i >= 0; i--) {
    const d = new Date(anchorDate);
    d.setDate(anchorDate.getDate() - i);
    const dateKey = formatDateKey(d);
    const log = getDayLog(state, dateKey);
    const totals = calculateDayTotals(log);

    const goalMet = totals.calories >= state.settings.dailyCalorieGoal * 0.85 && 
                    totals.calories <= state.settings.dailyCalorieGoal * 1.15 &&
                    log.waterMl >= state.settings.dailyWaterGoalMl;

    totalCalories += totals.calories;
    totalWaterMl += log.waterMl;
    totalProtein += totals.protein;
    totalCarbs += totals.carbs;
    totalFat += totals.fat;

    days.push({
      date: dateKey,
      dayLabel: dayNames[d.getDay()],
      calories: totals.calories,
      waterMl: log.waterMl,
      calorieGoal: state.settings.dailyCalorieGoal,
      waterGoal: state.settings.dailyWaterGoalMl,
      goalMet,
      macros: {
        protein: totals.protein,
        carbs: totals.carbs,
        fat: totals.fat,
      },
    });
  }

  const avgCalories = Math.round(totalCalories / 7);
  const avgWaterMl = Math.round(totalWaterMl / 7);

  const sortedByCals = [...days].sort((a, b) => b.calories - a.calories);
  const peakCalorieDay = sortedByCals[0] || null;
  const lightestCalorieDay = sortedByCals[sortedByCals.length - 1] || null;

  const totalMacroGrams = totalProtein + totalCarbs + totalFat;
  const macroSplit = {
    proteinPct: totalMacroGrams > 0 ? Math.round((totalProtein / totalMacroGrams) * 100) : 30,
    carbsPct: totalMacroGrams > 0 ? Math.round((totalCarbs / totalMacroGrams) * 100) : 45,
    fatPct: totalMacroGrams > 0 ? Math.round((totalFat / totalMacroGrams) * 100) : 25,
  };

  // Adjust rounding so sum is 100
  const sum = macroSplit.proteinPct + macroSplit.carbsPct + macroSplit.fatPct;
  if (sum !== 100 && totalMacroGrams > 0) {
    macroSplit.carbsPct += (100 - sum);
  }

  // Health Curator Ink Note
  let curatorNote = '';
  if (avgWaterMl >= state.settings.dailyWaterGoalMl) {
    curatorNote = `Splendid discipline: your hydration average (${(avgWaterMl / 1000).toFixed(1)}L/day) surpassed the target goal! Balanced macro distributions supported consistent cellular recovery across the week.`;
  } else if (avgCalories <= state.settings.dailyCalorieGoal) {
    curatorNote = `Well-metered caloric restraint this week (averaging ${avgCalories} kcal/day). Elevating hydration by one extra glass daily will optimize metabolic efficiency.`;
  } else {
    curatorNote = `Hearty energy expenditure this cycle with peak intake on ${peakCalorieDay?.dayLabel || 'the weekend'}. Maintain steady hydration to balance peak expenditure days.`;
  }

  return {
    days,
    totalCalories,
    avgCalories,
    totalWaterMl,
    avgWaterMl,
    peakCalorieDay,
    lightestCalorieDay,
    macroTotals: {
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    },
    macroSplit,
    curatorNote,
  };
};

export const exportStateJson = (): string => {
  const state = getAppState();
  return JSON.stringify({
    app: 'nutricare',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    data: state,
  }, null, 2);
};

export const importStateJson = (jsonString: string): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.data && parsed.data.settings && parsed.data.logs) {
      saveAppState(parsed.data);
      return true;
    }
  } catch {
    // Malformed JSON
  }
  return false;
};

export const resetAppState = (): AppState => {
  const fresh = generateSampleWeekLogs(new Date());
  const state: AppState = {
    currentDate: formatDateKey(new Date()),
    activeTab: 'ledger',
    settings: DEFAULT_SETTINGS,
    logs: fresh,
  };
  saveAppState(state);
  return state;
};
