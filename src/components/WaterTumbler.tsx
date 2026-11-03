import React from 'react';
import { Droplets, Plus, Minus, Award } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface WaterTumblerProps {
  currentMl: number;
  goalMl: number;
  onAddWater: (delta: number) => void;
}

export const WaterTumbler: React.FC<WaterTumblerProps> = ({ currentMl, goalMl, onAddWater }) => {
  const safeGoal = Math.max(1, goalMl);
  const fillPct = Math.min(100, Math.max(0, (currentMl / safeGoal) * 100));
  const isGoalMet = currentMl >= safeGoal;

  const handleAction = (delta: number) => {
    if (delta > 0) {
      soundEffects.playGlug();
    } else {
      soundEffects.playClick();
    }
    onAddWater(delta);
  };

  const tickMarks = [
    { label: '3,000ml', pct: 100 },
    { label: '2,500ml', pct: 83.3 },
    { label: '2,000ml', pct: 66.6 },
    { label: '1,500ml', pct: 50 },
    { label: '1,000ml', pct: 33.3 },
    { label: '500ml', pct: 16.6 },
  ];

  return (
    <div className="w-full h-full bg-[#fcf9f1] p-4 rounded-xl border border-[#dfd6c3] shadow-md parchment-sheet relative overflow-hidden flex flex-col justify-between">
      {/* Header with Title and Volume */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#dfd6c3]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#22a6b3]/15 flex items-center justify-center border border-[#22a6b3]/40">
            <Droplets className="w-4 h-4 text-[#1b9cfc]" />
          </div>
          <div>
            <h3 className="font-bold text-[#3d2314] text-base tracking-wide debossed-text">
              Hydration Tumbler
            </h3>
            <p className="text-xs text-[#8c7a65]">Crystal Glass Carafe</p>
          </div>
        </div>

        {/* Current Volume Counter */}
        <div className="text-right">
          <div className="text-xl font-bold text-[#1b6ca8] font-mono leading-none">
            {currentMl.toLocaleString()}
            <span className="text-xs text-[#6b635b] ml-1">ml</span>
          </div>
          <div className="text-[11px] text-[#8c7a65]">
            Target: {goalMl.toLocaleString()} ml
          </div>
        </div>
      </div>

      {/* Main Glass Tumbler Body & Controls Row */}
      <div className="flex items-end justify-center gap-6 my-4">
        {/* Skeuomorphic Glass Tumbler Vessel */}
        <div className="relative w-40 h-64 rounded-b-3xl border-x-2 border-b-8 border-white/70 bg-gradient-to-b from-white/20 via-sky-50/10 to-sky-100/30 flex flex-col justify-end shadow-2xl relative overflow-hidden backdrop-blur-[2px]">
          {/* Glass specular rim and highlight reflection */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-white/80 via-white/40 to-white/80 rounded-t-sm shadow-xs pointer-events-none z-30" />
          <div className="absolute inset-y-0 left-2 w-3 bg-gradient-to-r from-white/40 to-transparent pointer-events-none z-30" />
          <div className="absolute inset-y-0 right-3 w-1.5 bg-gradient-to-l from-white/30 to-transparent pointer-events-none z-30" />

          {/* Heavy Crystal Glass Thick Base */}
          <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-white/60 to-transparent pointer-events-none z-30 border-t border-white/40" />

          {/* Calibrated Etched Measurement Ticks on Glass Wall */}
          <div className="absolute inset-y-4 left-3 flex flex-col justify-between pointer-events-none z-20 text-[10px] font-mono text-[#3d2314] font-bold select-none">
            {tickMarks.map((tick, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-3 h-[2px] bg-[#3d2314] shadow-[0_1px_0_rgba(255,255,255,0.8)] inline-block" />
                <span className="text-[#3d2314] bg-white/70 px-1 py-0.2 rounded-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  {tick.label}
                </span>
              </div>
            ))}
          </div>

          {/* Animated Water Column */}
          <div 
            className="w-full water-fluid relative z-10 transition-all duration-700 ease-out"
            style={{ height: `${fillPct}%` }}
          >
            {/* Liquid Surface Meniscus */}
            {fillPct > 0 && <div className="water-meniscus" />}

            {/* Rising Bubbles */}
            {fillPct > 10 && (
              <>
                <div 
                  className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDuration: '2s' }}
                />
                <div 
                  className="absolute bottom-6 right-1/3 w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDuration: '1.4s' }}
                />
                <div 
                  className="absolute bottom-12 left-1/2 w-1 h-1 rounded-full bg-white/80 animate-bounce"
                  style={{ animationDuration: '2.5s' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Quick Add Brass Action Buttons */}
        <div className="flex flex-col gap-2 justify-end w-40">
          <button
            type="button"
            onClick={() => handleAction(250)}
            className="brass-btn px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#5a3f0d]" />
            <span>+250ml (Cup)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(500)}
            className="brass-btn px-3 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#5a3f0d]" />
            <span>+500ml (Bottle)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(100)}
            className="brass-btn-secondary px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#52301c]" />
            <span>+100ml (Sip)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(-250)}
            className="brass-btn-secondary px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 text-[#962d22] active:scale-95 mt-1 border-[#b7282d]/30 hover:border-[#b7282d]/60"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-250ml (Undo)</span>
          </button>
        </div>
      </div>

      {/* Goal Met Wax Seal Banner */}
      {isGoalMet && (
        <div className="mt-4 pt-2 border-t border-[#dfd6c3] flex items-center justify-center gap-2 animate-fade-in">
          <div className="wax-seal w-7 h-7 flex items-center justify-center text-white shadow-md">
            <Award className="w-4 h-4 text-[#fdf0a6]" />
          </div>
          <span className="text-xs font-bold text-[#901a1e] tracking-wider uppercase">
            Hydration Goal Met!
          </span>
        </div>
      )}
    </div>
  );
};
