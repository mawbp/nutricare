import React, { useState } from 'react';
import { X, Sparkles, UtensilsCrossed, Plus } from 'lucide-react';
import { FoodItem, MealType } from '../types';
import { soundEffects } from '../services/soundEffects';

interface AddFoodModalProps {
  isOpen: boolean;
  mealType: MealType;
  title: string;
  onClose: () => void;
  onSave: (item: Omit<FoodItem, 'id' | 'timestamp'>) => void;
}

export const AddFoodModal: React.FC<AddFoodModalProps> = ({
  isOpen,
  mealType,
  title,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [fiber, setFiber] = useState('');

  if (!isOpen) return null;

  const quickPresets: Record<MealType, Array<{ name: string; cal: number; p: number; c: number; f: number; fib: number }>> = {
    breakfast: [
      { name: 'Poached Eggs & Sourdough Toast', cal: 340, p: 18, c: 28, f: 16, fib: 2 },
      { name: 'Steel Cut Oats with Berries & Honey', cal: 310, p: 9, c: 58, f: 5, fib: 8 },
      { name: 'Greek Yogurt with Granola & Nuts', cal: 280, p: 17, c: 26, f: 12, fib: 3 },
      { name: 'Avocado Toast with Chili Flakes', cal: 290, p: 6, c: 24, f: 20, fib: 7 },
    ],
    lunch: [
      { name: 'Grilled Herb Chicken Grain Bowl', cal: 520, p: 44, c: 48, f: 14, fib: 7 },
      { name: 'Mediterranean Chopped Salad', cal: 380, p: 14, c: 24, f: 26, fib: 6 },
      { name: 'Turkey, Swiss & Cranberry Wrap', cal: 460, p: 32, c: 44, f: 18, fib: 4 },
      { name: 'Wild Caught Tuna Avocado Salad', cal: 410, p: 38, c: 12, f: 22, fib: 5 },
    ],
    dinner: [
      { name: 'Pan-Seared Salmon with Broccolini', cal: 560, p: 42, c: 14, f: 36, fib: 5 },
      { name: 'Grass-Fed Sirloin & Roasted Potatoes', cal: 640, p: 48, c: 38, f: 32, fib: 4 },
      { name: 'Slow-Cooked Vegetable Lentil Curry', cal: 440, p: 20, c: 68, f: 8, fib: 14 },
      { name: 'Grilled Lemon Herb Chicken & Rice', cal: 510, p: 45, c: 42, f: 15, fib: 3 },
    ],
    snacks: [
      { name: 'Honeycrisp Apple with Almond Butter', cal: 220, p: 4, c: 28, f: 12, fib: 5 },
      { name: 'Artisan Dark Chocolate (85%) & Walnuts', cal: 190, p: 4, c: 12, f: 15, fib: 3 },
      { name: 'Whey Isolate Protein Shake with Milk', cal: 210, p: 30, c: 12, f: 4, fib: 1 },
      { name: 'Roasted Sea Salted Pistachios', cal: 170, p: 6, c: 8, f: 14, fib: 3 },
    ],
  };

  const handleSelectPreset = (preset: { name: string; cal: number; p: number; c: number; f: number; fib: number }) => {
    soundEffects.playClick();
    setName(preset.name);
    setCalories(String(preset.cal));
    setProtein(String(preset.p));
    setCarbs(String(preset.c));
    setFat(String(preset.f));
    setFiber(String(preset.fib));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !calories) return;

    soundEffects.playStamp();
    onSave({
      name: name.trim(),
      calories: parseInt(calories, 10) || 0,
      protein: parseInt(protein, 10) || 0,
      carbs: parseInt(carbs, 10) || 0,
      fat: parseInt(fat, 10) || 0,
      fiber: parseInt(fiber, 10) || 0,
      source: 'manual',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg parchment-sheet p-6 rounded-2xl border-2 border-[#c89e3a] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Leather & Brass Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfd6c3] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full brass-plate flex items-center justify-center">
              <UtensilsCrossed className="w-4 h-4 text-[#2b1807]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3d2314] tracking-wide debossed-text">
                Add to {title}
              </h2>
              <p className="text-xs text-[#8c7a65]">Enter recipe details or choose a staple</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#e2d5bd] hover:bg-[#cbb998] flex items-center justify-center text-[#52301c] transition-colors border border-[#a89578]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Presets Selection */}
        <div className="mb-4">
          <div className="text-xs font-bold text-[#6b4f10] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#c89e3a]" />
            Quick Artisan Staples
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(quickPresets[mealType] || []).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left p-2 rounded-lg bg-[#ffffff]/80 hover:bg-[#ffffff] border border-[#dfd6c3] hover:border-[#c89e3a] transition-all shadow-xs text-xs text-[#3d2314] group"
              >
                <div className="font-semibold line-clamp-1 group-hover:text-[#c89e3a]">
                  {preset.name}
                </div>
                <div className="text-[10px] text-[#8c7a65] mt-0.5 font-mono">
                  {preset.cal} kcal · P:{preset.p}g C:{preset.c}g F:{preset.f}g
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-[#dfd6c3]">
          <div>
            <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
              Food Item Description *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Steel Cut Oats with Blueberries"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] focus:outline-none focus:border-[#c89e3a] focus:ring-1 focus:ring-[#c89e3a] shadow-inner font-serif"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Calories (kcal) *
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="320"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Protein (grams)
              </label>
              <input
                type="number"
                min="0"
                placeholder="15"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                placeholder="40"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                placeholder="10"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Fiber (g)
              </label>
              <input
                type="number"
                min="0"
                placeholder="5"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6b635b] hover:text-[#2c2724] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="brass-btn px-5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Inscribe into Ledger</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
