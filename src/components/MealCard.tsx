import React, { useState } from 'react';
import { Plus, Trash2, Camera, Flame } from 'lucide-react';
import { FoodItem, MealType } from '../types';
import { AddFoodModal } from './AddFoodModal';
import { soundEffects } from '../services/soundEffects';

interface MealCardProps {
  mealType: MealType;
  title: string;
  items: FoodItem[];
  onAddItem: (item: Omit<FoodItem, 'id' | 'timestamp'>) => void;
  onRemoveItem: (id: string) => void;
  onOpenAiCamera?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  title,
  items,
  onAddItem,
  onRemoveItem,
  onOpenAiCamera,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const totalCalories = items.reduce((sum, item) => sum + (item.calories || 0), 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = items.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFat = items.reduce((sum, item) => sum + (item.fat || 0), 0);

  const handleOpenModal = () => {
    soundEffects.playClick();
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    soundEffects.playClick();
    onRemoveItem(id);
  };

  return (
    <div className="relative recipe-card rounded-xl p-4 transition-all duration-200">
      {/* Decorative Brass Paperclip in Top Right */}
      <div className="paperclip -top-3 right-5 z-20 pointer-events-none" />

      {/* Header: Title and Subtotal */}
      <div className="flex items-center justify-between pb-2 border-b border-[#ebdcc4] mb-3">
        <div>
          <h4 className="font-bold text-[#3d2314] text-base tracking-wide flex items-center gap-1.5 debossed-text">
            <span>{title}</span>
          </h4>
          <span className="text-[11px] text-[#8c7a65] font-mono">
            P:{totalProtein}g · C:{totalCarbs}g · F:{totalFat}g
          </span>
        </div>

        {/* Calorie Subtotal Badge */}
        <div className="flex items-center gap-1 bg-[#f4ede0] px-2.5 py-1 rounded-md border border-[#dfd6c3] shadow-inner">
          <Flame className="w-3.5 h-3.5 text-[#e67e22]" />
          <span className="font-bold text-[#2c2724] font-mono text-sm">
            {totalCalories}
          </span>
          <span className="text-[10px] text-[#8c7a65] font-medium">kcal</span>
        </div>
      </div>

      {/* Food Items List */}
      <div className="space-y-2 mb-3">
        {items.length === 0 ? (
          <div className="text-center py-4 text-xs text-[#9a9187] italic font-serif">
            No culinary entries recorded for this sitting.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group flex items-center justify-between p-2 rounded-lg bg-[#fbf9f4] hover:bg-[#f4efe4] border border-[#eee6d7] transition-all"
            >
              <div className="flex-1 pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#2c2724]">
                    {item.name}
                  </span>
                  {item.source === 'ai' && (
                    <span className="text-[9px] px-1.5 py-0.2 bg-[#d4af37]/20 text-[#7a5814] rounded border border-[#d4af37]/40 font-mono font-medium">
                      AI Vision
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#8c7a65] font-mono mt-0.5">
                  {item.calories} kcal · {item.protein}g protein · {item.carbs}g carbs · {item.fat}g fat
                </div>
              </div>

              {/* Delete Action Button */}
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                aria-label="Delete entry"
                className="opacity-60 group-hover:opacity-100 hover:text-[#901a1e] p-1 rounded transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={handleOpenModal}
          className="brass-btn flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Add Food</span>
        </button>

        {onOpenAiCamera && (
          <button
            type="button"
            onClick={onOpenAiCamera}
            className="brass-btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 active:scale-95 shadow-sm"
            title="Scan with AI Food Camera"
          >
            <Camera className="w-3.5 h-3.5 text-[#52301c]" />
            <span className="hidden sm:inline">AI Cam</span>
          </button>
        )}
      </div>

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={isAddModalOpen}
        mealType={mealType}
        title={title}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddItem}
      />
    </div>
  );
};
