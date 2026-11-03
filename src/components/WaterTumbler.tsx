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
    <div className="w-full bg-[#fcf9f1] p-4 rounded-xl border border-[#dfd6c3] shadow-md parchment-sheet relative overflow-hidden">
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
      <div className="flex items-end justify-center gap-6 my-2">
        {/* Skeuomorphic Glass Tumbler Vessel */}
        <div className="relative w-36 h-60 water-glass-vibe rounded-b-2xl border-t border-white/40 flex flex-col justify-end shadow-2xl">
          {/* Calibrated Tick Marks on Glass */}
          <div className="absolute inset-y-2 left-2 flex flex-col justify-between pointer-events-none z-20 text-[9px] font-mono text-[#4a340b]/70 font-semibold select-none">
            {tickMarks.map((tick, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className="w-2.5 h-[1.5px] bg-[#3d2b09]/50 inline-block" />
                <span>{tick.label}</span>
              </div>
            ))}
          </div>

          {/* Vertical Specular Glass Refraction Beam */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/20 pointer-events-none z-20" />

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
                  className="absolute bottom-2 left-1/4 w-2 h-2 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDuration: '2s' }}
                />
                <div 
                  className="absolute bottom-6 right-1/3 w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce"
                  style={{ animationDuration: '1.4s' }}
                />
                <div 
                  className="absolute bottom-12 left-1/2 w-1 h-1 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDuration: '2.5s' }}
                />
              </>
            )}
          </div>
        </div>

        {/* Quick Add Brass Action Buttons */}
        <div className="flex flex-col gap-2.5 justify-end">
          <button
            type="button"
            onClick={() => handleAction(250)}
            className="brass-btn px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#5a3f0d]" />
            <span>+250ml (Cup)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(500)}
            className="brass-btn px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#5a3f0d]" />
            <span>+500ml (Bottle)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(100)}
            className="brass-btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3 h-3 text-[#52301c]" />
            <span>+100ml (Sip)</span>
          </button>

          <button
            type="button"
            onClick={() => handleAction(-250)}
            className="brass-btn-secondary px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 text-[#962d22] active:scale-95 mt-1"
          >
            <Minus className="w-3 h-3" />
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
