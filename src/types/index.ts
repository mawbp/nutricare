export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export type FoodSource = 'ai' | 'manual' | 'preset';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
  imageUrl?: string;
  source: FoodSource;
  timestamp: string; // ISO string
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  waterMl: number;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
}

export interface UserSettings {
  dailyCalorieGoal: number;
  dailyWaterGoalMl: number;
  geminiApiKey: string;
  soundEnabled: boolean;
}

export type ActiveTab = 'ledger' | 'camera' | 'almanac' | 'settings';

export interface AppState {
  currentDate: string; // YYYY-MM-DD
  activeTab: ActiveTab;
  settings: UserSettings;
  logs: Record<string, DayLog>;
}

export interface WeeklyDaySummary {
  date: string; // YYYY-MM-DD
  dayLabel: string; // 'Mon', 'Tue', etc.
  calories: number;
  waterMl: number;
  calorieGoal: number;
  waterGoal: number;
  goalMet: boolean;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface WeeklySummary {
  days: WeeklyDaySummary[];
  totalCalories: number;
  avgCalories: number;
  totalWaterMl: number;
  avgWaterMl: number;
  peakCalorieDay: WeeklyDaySummary | null;
  lightestCalorieDay: WeeklyDaySummary | null;
  macroTotals: {
    protein: number;
    carbs: number;
    fat: number;
  };
  macroSplit: {
    proteinPct: number;
    carbsPct: number;
    fatPct: number;
  };
  curatorNote: string;
}

export interface AIFoodAnalysisResult {
  foodName: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: number;
  suggestedMeal: MealType;
  portionMultiplier: number;
  source: 'gemini' | 'heuristic';
}
