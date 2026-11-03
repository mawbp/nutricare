import React from 'react';
import { Award, Flame, Droplets, TrendingUp, Feather, Calendar } from 'lucide-react';
import { WeeklySummary } from '../types';
import { soundEffects } from '../services/soundEffects';

interface WeeklyAlmanacProps {
  summary: WeeklySummary;
  onSelectDate?: (date: string) => void;
  selectedDate?: string;
}

export const WeeklyAlmanac: React.FC<WeeklyAlmanacProps> = ({
  summary,
  onSelectDate,
  selectedDate,
}) => {
  // Find highest calorie value to scale vertical bars gracefully (at least 2500)
  const maxCalories = Math.max(2600, ...summary.days.map((d) => d.calories));

  const handleDayClick = (date: string) => {
    soundEffects.playClick();
    if (onSelectDate) {
      onSelectDate(date);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Parchment Ledger Header */}
      <div className="parchment-sheet p-6 rounded-2xl border border-[#dfd6c3] shadow-xl relative overflow-hidden">
        {/* Brass Screws on Corners */}
        <div className="brass-rivet absolute top-3 left-3" />
        <div className="brass-rivet absolute top-3 right-3" />
        <div className="brass-rivet absolute bottom-3 left-3" />
        <div className="brass-rivet absolute bottom-3 right-3" />

        {/* Ledger Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#dfd6c3] mb-6 gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full brass-plate flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-[#2b1807]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#3d2314] tracking-wide debossed-text">
                Seven-Day Almanac & Ledger
              </h2>
              <p className="text-xs text-[#8c7a65]">
                Weekly Nutritional Balance & Water Consumption Records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-[#52301c] bg-[#e8dec7] px-3 py-1 rounded-full border border-[#c5b9a0]">
              7 Days Active
            </span>
          </div>
        </div>

        {/* 4 Macro / Summary Metric Plates */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#dfd6c3] shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#8c7a65] mb-1">
              <Flame className="w-3.5 h-3.5 text-[#e67e22]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Daily Cal Avg</span>
            </div>
            <div className="text-xl font-bold font-mono text-[#2c2724]">
              {summary.avgCalories.toLocaleString()}
              <span className="text-xs text-[#8c7a65] ml-1 font-sans">kcal</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#dfd6c3] shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#8c7a65] mb-1">
              <Droplets className="w-3.5 h-3.5 text-[#1b9cfc]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Daily Water Avg</span>
            </div>
            <div className="text-xl font-bold font-mono text-[#1b6ca8]">
              {summary.avgWaterMl.toLocaleString()}
              <span className="text-xs text-[#8c7a65] ml-1 font-sans">ml</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#dfd6c3] shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#8c7a65] mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#27ae60]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Peak Energy</span>
            </div>
            <div className="text-base font-bold font-mono text-[#2c2724] truncate">
              {summary.peakCalorieDay?.dayLabel || 'N/A'}{' '}
              <span className="text-xs text-[#8c7a65] font-normal">
                ({summary.peakCalorieDay?.calories} kcal)
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#dfd6c3] shadow-sm">
            <div className="flex items-center gap-1.5 text-xs text-[#8c7a65] mb-1">
              <Award className="w-3.5 h-3.5 text-[#c89e3a]" />
              <span className="font-semibold uppercase tracking-wider text-[10px]">Lightest Intake</span>
            </div>
            <div className="text-base font-bold font-mono text-[#2c2724] truncate">
              {summary.lightestCalorieDay?.dayLabel || 'N/A'}{' '}
              <span className="text-xs text-[#8c7a65] font-normal">
                ({summary.lightestCalorieDay?.calories} kcal)
              </span>
            </div>
          </div>
        </div>

        {/* 7-Day Vertical Bar Ledger Chart */}
        <div className="bg-[#f5ede0] p-4 rounded-xl border border-[#cbb998] shadow-inner mb-6 relative">
          <div className="flex items-center justify-between text-xs font-bold text-[#52301c] uppercase tracking-wider mb-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c89e3a]" />
              7-Day Caloric Expenditure & Hydration Wax Seals
            </span>
            <span className="text-[11px] text-[#8c7a65] font-mono">
              Target: 2,000 kcal / 2,500 ml
            </span>
          </div>

          {/* Chart Columns Container */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6 pb-2 px-1 relative">
            {/* Calorie Goal Reference Line */}
            <div
              className="absolute left-2 right-2 border-b border-dashed border-[#c0392b]/40 pointer-events-none z-10 flex items-center justify-end"
              style={{ bottom: `${(2000 / maxCalories) * 100}%` }}
            >
              <span className="text-[9px] font-mono text-[#c0392b] font-bold bg-[#f5ede0] px-1 -mr-1">
                2,000 kcal
              </span>
            </div>

            {summary.days.map((day) => {
              const heightPct = Math.min(100, Math.max(12, (day.calories / maxCalories) * 100));
              const isSelected = selectedDate === day.date;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => handleDayClick(day.date)}
                  aria-label={`${day.dayLabel} ${day.date} - ${day.calories} calories`}
                  className={`flex flex-col items-center justify-end h-full group focus:outline-none transition-all ${
                    isSelected ? 'scale-105' : 'hover:scale-102'
                  }`}
                >
                  {/* Wax Seal Badge if Goal Met */}
                  <div className="h-6 flex items-center justify-center mb-1">
                    {day.goalMet && (
                      <div
                        data-testid="wax-seal-badge"
                        className="wax-seal w-5 h-5 flex items-center justify-center shadow-md animate-fade-in"
                        title="Calorie & Hydration Goals Met!"
                      >
                        <Award className="w-3 h-3 text-[#fdf0a6]" />
                      </div>
                    )}
                  </div>

                  {/* Calorie Readout above bar */}
                  <span className="text-[10px] font-mono font-bold text-[#52301c] mb-1 group-hover:text-[#c89e3a] transition-colors">
                    {day.calories > 0 ? day.calories : '0'}
                  </span>

                  {/* The Vertical Calorie Bar */}
                  <div className="w-full max-w-[36px] bg-[#dfd6c3] rounded-t-md p-0.5 border border-[#cbb998] shadow-sm flex flex-col justify-end overflow-hidden h-36">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t transition-all duration-700 ease-out ${
                        day.calories > day.calorieGoal * 1.15
                          ? 'bg-gradient-to-t from-[#c0392b] to-[#e74c3c]'
                          : day.calories >= day.calorieGoal * 0.85
                          ? 'bg-gradient-to-t from-[#27ae60] to-[#2ecc71]'
                          : 'bg-gradient-to-t from-[#d4af37] to-[#f39c12]'
                      } ${isSelected ? 'ring-2 ring-[#c89e3a] ring-offset-1' : ''}`}
                    />
                  </div>

                  {/* Water Droplet Volume Tag */}
                  <div className="mt-1 flex items-center gap-0.5 text-[9px] font-mono text-[#1b6ca8]">
                    <Droplets className="w-2.5 h-2.5" />
                    <span>{(day.waterMl / 1000).toFixed(1)}L</span>
                  </div>

                  {/* Day Label (Mon, Tue, etc.) */}
                  <span
                    className={`mt-1 text-xs font-bold uppercase tracking-wider ${
                      isSelected
                        ? 'text-[#901a1e] underline underline-offset-2'
                        : 'text-[#3d2314] group-hover:text-[#c89e3a]'
                    }`}
                  >
                    {day.dayLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Macro Distribution Across the Week */}
        <div className="p-4 rounded-xl bg-[#ffffff]/90 border border-[#dfd6c3] shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-2">
            <span>Weekly Macronutrient Balance</span>
            <span className="font-mono text-[#8c7a65]">
              Total: {summary.macroTotals.protein}g P · {summary.macroTotals.carbs}g C · {summary.macroTotals.fat}g F
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-[#52301c] mb-2 font-mono">
            <span className="text-[#2980b9]">Protein: {summary.macroSplit.proteinPct}%</span>
            <span className="text-[#d35400]">Carbohydrates: {summary.macroSplit.carbsPct}%</span>
            <span className="text-[#27ae60]">Fats: {summary.macroSplit.fatPct}%</span>
          </div>

          <div className="h-3 w-full bg-[#dfd6c3] rounded-full overflow-hidden flex p-0.5 border border-[#cbb998] shadow-inner">
            <div
              style={{ width: `${summary.macroSplit.proteinPct}%` }}
              className="h-full bg-gradient-to-r from-[#2980b9] to-[#3498db] rounded-l-full"
            />
            <div
              style={{ width: `${summary.macroSplit.carbsPct}%` }}
              className="h-full bg-gradient-to-r from-[#d35400] to-[#e67e22]"
            />
            <div
              style={{ width: `${summary.macroSplit.fatPct}%` }}
              className="h-full bg-gradient-to-r from-[#1e824c] to-[#27ae60] rounded-r-full"
            />
          </div>
        </div>

        {/* Nutritional Curator Ink Inscription */}
        <div className="p-4 rounded-xl bg-[#fcf8ec] border border-[#d5c4a1] relative shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Feather className="w-4 h-4 text-[#8c6717]" />
            <h4 className="text-xs font-bold text-[#6b4f10] uppercase tracking-wider">
              Health Curator & Physician Inscription
            </h4>
          </div>

          <p className="font-handwriting text-xl text-[#2c2724] leading-relaxed italic pl-2 border-l-2 border-[#c89e3a]/60 my-2">
            "{summary.curatorNote}"
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-[#e2d5bd] mt-3">
            <span className="text-[11px] font-mono text-[#8c7a65]">
              Inspected & Verified for Cycle
            </span>
            <div className="flex items-center gap-1.5 font-handwriting text-sm text-[#3d2314]">
              <span>Nutritional Curator, M.D.</span>
              <div className="wax-seal w-4 h-4 inline-flex items-center justify-center text-[7px] text-white">
                ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
