import React from 'react';
import { DayLog, FoodItem, MealType, UserSettings } from '../types';
import { AnalogCalorieGauge } from './AnalogCalorieGauge';
import { MacroBar } from './MacroBar';
import { WaterTumbler } from './WaterTumbler';
import { MealCard } from './MealCard';
import { calculateDayTotals } from '../services/storage';

interface DailyLedgerProps {
  dayLog: DayLog;
  settings: UserSettings;
  onAddFood: (meal: MealType, item: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  onRemoveFood: (meal: MealType, itemId: string) => void;
  onUpdateWater: (delta: number) => void;
  onOpenAiCamera: () => void;
}

export const DailyLedger: React.FC<DailyLedgerProps> = ({
  dayLog,
  settings,
  onAddFood,
  onRemoveFood,
  onUpdateWater,
  onOpenAiCamera,
}) => {
  const totals = calculateDayTotals(dayLog);

  const mealSections: Array<{ type: MealType; title: string }> = [
    { type: 'breakfast', title: 'Morning Breakfast' },
    { type: 'lunch', title: 'Midday Luncheon' },
    { type: 'dinner', title: 'Evening Dinner' },
    { type: 'snacks', title: 'Apothecary Snacks & Sustenance' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Nutrition & Hydration Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* Analog Calorie Dial & Macro Card */}
        <div className="parchment-sheet p-4 rounded-xl border border-[#dfd6c3] shadow-md flex flex-col justify-between h-full">
          <div className="text-center pb-1">
            <h3 className="font-bold text-[#3d2314] text-base tracking-wide debossed-text">
              Caloric Pressure Meter
            </h3>
            <p className="text-xs text-[#8c7a65]">Analog Budget Gauge</p>
          </div>

          <AnalogCalorieGauge
            consumed={totals.calories}
            goal={settings.dailyCalorieGoal}
          />

          <div className="mt-3">
            <MacroBar
              protein={totals.protein}
              carbs={totals.carbs}
              fat={totals.fat}
            />
          </div>
        </div>

        {/* Skeuomorphic Glass Water Tumbler */}
        <WaterTumbler
          currentMl={dayLog.waterMl}
          goalMl={settings.dailyWaterGoalMl}
          onAddWater={onUpdateWater}
        />
      </div>

      {/* Meal Ledger Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-[#52301c] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c89e3a] inline-block" />
            Culinary Provisions by Sitting
          </h3>
          <span className="text-xs text-[#8c7a65] italic">
            Tap cards to log meals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealSections.map((section) => (
            <MealCard
              key={section.type}
              mealType={section.type}
              title={section.title}
              items={dayLog.meals[section.type] || []}
              onAddItem={(item) => onAddFood(section.type, item)}
              onRemoveItem={(id) => onRemoveFood(section.type, id)}
              onOpenAiCamera={onOpenAiCamera}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
