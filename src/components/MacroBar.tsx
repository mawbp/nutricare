import React from 'react';

interface MacroBarProps {
  protein: number;
  carbs: number;
  fat: number;
}

export const MacroBar: React.FC<MacroBarProps> = ({ protein, carbs, fat }) => {
  const total = protein + carbs + fat;
  const pPct = total > 0 ? Math.round((protein / total) * 100) : 30;
  const cPct = total > 0 ? Math.round((carbs / total) * 100) : 45;
  const fPct = total > 0 ? Math.max(0, 100 - pPct - cPct) : 25;

  return (
    <div className="w-full bg-[#f4ede0] p-2.5 rounded-lg border border-[#dfd6c3] shadow-xs">
      <div className="grid grid-cols-3 gap-1 text-[11px] font-bold text-[#52301c] mb-1.5 uppercase tracking-tight">
        <span className="flex items-center gap-1 truncate">
          <span className="w-2 h-2 rounded-full bg-[#3498db] shrink-0 border border-[#1b6ca8]" />
          <span className="truncate">P: <strong className="font-mono text-[#2c2724]">{protein}g</strong> ({pPct}%)</span>
        </span>
        <span className="flex items-center gap-1 justify-center truncate">
          <span className="w-2 h-2 rounded-full bg-[#e67e22] shrink-0 border border-[#b35b0d]" />
          <span className="truncate">C: <strong className="font-mono text-[#2c2724]">{carbs}g</strong> ({cPct}%)</span>
        </span>
        <span className="flex items-center gap-1 justify-end truncate">
          <span className="w-2 h-2 rounded-full bg-[#27ae60] shrink-0 border border-[#19753e]" />
          <span className="truncate">F: <strong className="font-mono text-[#2c2724]">{fat}g</strong> ({fPct}%)</span>
        </span>
      </div>

      {/* Segmented Tactile Bar */}
      <div className="h-2.5 w-full bg-[#dfd6c3] rounded-full overflow-hidden flex p-0.5 border border-[#c5b9a0] shadow-inner">
        <div 
          style={{ width: `${pPct}%` }} 
          className="h-full bg-gradient-to-r from-[#2980b9] to-[#3498db] rounded-l-full transition-all duration-500" 
          title={`Protein: ${protein}g`}
        />
        <div 
          style={{ width: `${cPct}%` }} 
          className="h-full bg-gradient-to-r from-[#d35400] to-[#e67e22] transition-all duration-500" 
          title={`Carbs: ${carbs}g`}
        />
        <div 
          style={{ width: `${fPct}%` }} 
          className="h-full bg-gradient-to-r from-[#1e824c] to-[#27ae60] rounded-r-full transition-all duration-500" 
          title={`Fat: ${fat}g`}
        />
      </div>
    </div>
  );
};
