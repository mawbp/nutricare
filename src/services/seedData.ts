import { DayLog, FoodItem } from '../types';

export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const createEmptyDayLog = (date: string): DayLog => ({
  date,
  waterMl: 0,
  meals: {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  },
});

export const generateSampleWeekLogs = (anchorDate: Date): Record<string, DayLog> => {
  const sampleMealsPool = [
    {
      breakfast: [
        { name: 'Avocado Toast with Poached Eggs', calories: 420, protein: 18, carbs: 32, fat: 24, fiber: 7, source: 'preset' as const },
        { name: 'Espresso & Oat Milk Cortado', calories: 65, protein: 2, carbs: 9, fat: 2, fiber: 0, source: 'preset' as const },
      ],
      lunch: [
        { name: 'Mediterranean Grain Bowl with Chicken', calories: 590, protein: 42, carbs: 54, fat: 18, fiber: 9, source: 'preset' as const },
        { name: 'Sparkling Lemon Water', calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, source: 'preset' as const },
      ],
      dinner: [
        { name: 'Pan-Seared Salmon with Asparagus', calories: 620, protein: 46, carbs: 14, fat: 38, fiber: 5, source: 'preset' as const },
        { name: 'Roasted Herb Sweet Potatoes', calories: 180, protein: 3, carbs: 41, fat: 1, fiber: 6, source: 'preset' as const },
      ],
      snacks: [
        { name: 'Greek Yogurt with Raw Honey & Walnuts', calories: 230, protein: 16, carbs: 18, fat: 12, fiber: 2, source: 'preset' as const },
      ],
      waterMl: 2500,
    },
    {
      breakfast: [
        { name: 'Organic Steel Cut Oats with Blueberries', calories: 340, protein: 11, carbs: 62, fat: 6, fiber: 9, source: 'preset' as const },
        { name: 'Matcha Green Tea Latte', calories: 95, protein: 4, carbs: 14, fat: 2, fiber: 1, source: 'preset' as const },
      ],
      lunch: [
        { name: 'Grilled Herb Chicken Salad', calories: 480, protein: 44, carbs: 16, fat: 22, fiber: 6, source: 'preset' as const },
      ],
      dinner: [
        { name: 'Grass-Fed Ribeye Steak with Baby Carrots', calories: 710, protein: 55, carbs: 18, fat: 42, fiber: 4, source: 'preset' as const },
      ],
      snacks: [
        { name: 'Dark Chocolate (85%) & Roasted Almonds', calories: 210, protein: 5, carbs: 14, fat: 16, fiber: 4, source: 'preset' as const },
      ],
      waterMl: 2750,
    },
    {
      breakfast: [
        { name: 'Smoked Salmon & Cream Cheese Sourdough', calories: 460, protein: 28, carbs: 40, fat: 20, fiber: 3, source: 'preset' as const },
      ],
      lunch: [
        { name: 'Quinoa Fiesta Bowl with Black Beans', calories: 510, protein: 21, carbs: 76, fat: 14, fiber: 16, source: 'preset' as const },
      ],
      dinner: [
        { name: 'Lemon Herb Roasted Chicken Breast', calories: 540, protein: 52, carbs: 12, fat: 26, fiber: 3, source: 'preset' as const },
        { name: 'Sautéed Garlic Spinach', calories: 80, protein: 4, carbs: 6, fat: 5, fiber: 4, source: 'preset' as const },
      ],
      snacks: [
        { name: 'Honeycrisp Apple with Almond Butter', calories: 240, protein: 5, carbs: 32, fat: 12, fiber: 6, source: 'preset' as const },
      ],
      waterMl: 2250,
    },
    {
      breakfast: [
        { name: 'Fluffy Ricotta Pancakes with Fresh Berries', calories: 480, protein: 16, carbs: 68, fat: 15, fiber: 6, source: 'preset' as const },
      ],
      lunch: [
        { name: 'Tuna Salad on Seeded Rye', calories: 450, protein: 36, carbs: 34, fat: 18, fiber: 5, source: 'preset' as const },
      ],
      dinner: [
        { name: 'Grass-Fed Bison Burger with Greens', calories: 660, protein: 48, carbs: 28, fat: 34, fiber: 5, source: 'preset' as const },
      ],
      snacks: [
        { name: 'Artisan Mixed Nuts & Dried Figs', calories: 190, protein: 4, carbs: 22, fat: 11, fiber: 3, source: 'preset' as const },
      ],
      waterMl: 2500,
    },
    {
      breakfast: [
        { name: 'Scrambled Pasture Eggs with Sourdough', calories: 380, protein: 22, carbs: 30, fat: 18, fiber: 2, source: 'preset' as const },
      ],
      lunch: [
        { name: 'Thai Coconut Chicken Soup', calories: 520, protein: 32, carbs: 24, fat: 32, fiber: 4, source: 'preset' as const },
      ],
      dinner: [
        { name: 'Grilled Rainbow Trout with Brown Rice', calories: 580, protein: 44, carbs: 42, fat: 22, fiber: 4, source: 'preset' as const },
      ],
      snacks: [
        { name: 'Protein Chia Seed Pudding', calories: 200, protein: 12, carbs: 20, fat: 8, fiber: 7, source: 'preset' as const },
      ],
      waterMl: 3000,
    },
    {
      breakfast: [
        { name: 'Acai Power Smoothie Bowl', calories: 410, protein: 14, carbs: 65, fat: 12, fiber: 10, source: 'preset' as const },
      ],
      lunch: [
        { name: 'Turkey Avocado Club on Multigrain', calories: 530, protein: 38, carbs: 45, fat: 22, fiber: 6, source: 'preset' as const },
      ],
      dinner: [
        { name: 'Stir-Fried Tofu & Veggies with Soba', calories: 490, protein: 26, carbs: 62, fat: 16, fiber: 8, source: 'preset' as const },
      ],
      snacks: [
        { name: 'Pistachios & Clementines', calories: 170, protein: 6, carbs: 16, fat: 10, fiber: 3, source: 'preset' as const },
      ],
      waterMl: 2600,
    },
  ];

  const logs: Record<string, DayLog> = {};

  // Seed prior 6 days
  for (let i = 6; i >= 1; i--) {
    const d = new Date(anchorDate);
    d.setDate(anchorDate.getDate() - i);
    const dateStr = formatDateKey(d);
    const template = sampleMealsPool[6 - i];

    const convertItem = (item: any): FoodItem => ({
      ...item,
      id: `seed_${dateStr}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date(d.getTime() + 1000 * 60 * 60 * 12).toISOString(),
    });

    logs[dateStr] = {
      date: dateStr,
      waterMl: template.waterMl,
      meals: {
        breakfast: template.breakfast.map(convertItem),
        lunch: template.lunch.map(convertItem),
        dinner: template.dinner.map(convertItem),
        snacks: template.snacks.map(convertItem),
      },
    };
  }

  // Anchor date (today) starts fresh with 0 water and empty meals
  const todayStr = formatDateKey(anchorDate);
  logs[todayStr] = createEmptyDayLog(todayStr);

  return logs;
};
