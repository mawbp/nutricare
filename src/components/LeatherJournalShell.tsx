import React from 'react';
import { 
  BookOpen, 
  Camera, 
  Calendar, 
  Sliders, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight,
  Flame,
  Droplets
} from 'lucide-react';
import { ActiveTab, UserSettings } from '../types';
import { soundEffects } from '../services/soundEffects';

interface LeatherJournalShellProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentDate: string;
  onDateChange: (date: string) => void;
  settings: UserSettings;
  onOpenSettings: () => void;
  onToggleSound: () => void;
  todayCalorieTotal: number;
  todayWaterTotal: number;
  children: React.ReactNode;
}

export const LeatherJournalShell: React.FC<LeatherJournalShellProps> = ({
  activeTab,
  onTabChange,
  currentDate,
  onDateChange,
  settings,
  onOpenSettings,
  onToggleSound,
  todayCalorieTotal,
  todayWaterTotal,
  children,
}) => {
  const handleTabClick = (tab: ActiveTab) => {
    soundEffects.playClick();
    onTabChange(tab);
  };

  const handlePrevDay = () => {
    soundEffects.playClick();
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    onDateChange(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    soundEffects.playClick();
    const d = new Date(currentDate + 'T12:00:00');
    d.setDate(d.getDate() + 1);
    onDateChange(d.toISOString().slice(0, 10));
  };

  const formattedDateString = (() => {
    const d = new Date(currentDate + 'T12:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  })();

  const isToday = currentDate === new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen py-4 px-2 sm:px-4 flex flex-col items-center justify-start">
      {/* Centered Leather Binder Enclosure */}
      <div className="w-full max-w-4xl leather-binder leather-stitched-border rounded-3xl p-3 sm:p-6 shadow-2xl relative">
        {/* Brass Corner Rivets */}
        <div className="brass-rivet absolute top-4 left-4" />
        <div className="brass-rivet absolute top-4 right-4" />
        <div className="brass-rivet absolute bottom-4 left-4" />
        <div className="brass-rivet absolute bottom-4 right-4" />

        {/* Top Spine & Journal Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#52301c] gap-3 relative z-10 px-2 sm:px-3">
          {/* Brand Logo & Embossed Gold Seal */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full brass-plate flex items-center justify-center shadow-lg border-2 border-[#5a3f0d]">
              <span className="text-xl font-serif font-black text-[#2b1807]">N</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#fdf0a6] embossed-gold font-serif">
                NutriCare
              </h1>
              <p className="text-[11px] text-[#d5c4a1]/80 tracking-wide font-sans">
                The Physician's Skeuomorphic Nutrition Ledger
              </p>
            </div>
          </div>

          {/* Date Selector Navigation & Header Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
            {/* Quick Calorie & Water Indicators */}
            <div className="hidden md:flex items-center gap-3 bg-[#150b06]/80 px-3 py-1.5 rounded-xl border border-[#52301c] text-xs font-mono">
              <span className="flex items-center gap-1 text-[#f39c12]">
                <Flame className="w-3.5 h-3.5" />
                {todayCalorieTotal} / {settings.dailyCalorieGoal} kcal
              </span>
              <span className="w-1 h-3 bg-[#52301c]" />
              <span className="flex items-center gap-1 text-[#38d6ea]">
                <Droplets className="w-3.5 h-3.5" />
                {todayWaterTotal} / {settings.dailyWaterGoalMl} ml
              </span>
            </div>

            {/* Date Navigator */}
            <div className="flex items-center bg-[#261309] rounded-xl border border-[#52301c] p-0.5 shadow-inner">
              <button
                type="button"
                onClick={handlePrevDay}
                aria-label="Previous day"
                className="p-1.5 text-[#d5c4a1] hover:text-[#fdf0a6] hover:bg-[#3d2112] rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 text-xs font-serif font-bold text-[#fdf0a6] min-w-[120px] text-center">
                {formattedDateString}
                {isToday && <span className="ml-1 text-[10px] text-[#2ecc71]">(Today)</span>}
              </span>

              <button
                type="button"
                onClick={handleNextDay}
                aria-label="Next day"
                className="p-1.5 text-[#d5c4a1] hover:text-[#fdf0a6] hover:bg-[#3d2112] rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Toggle Button */}
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={settings.soundEnabled ? 'Mute sound' : 'Unmute sound'}
              title={settings.soundEnabled ? 'Mute acoustic audio' : 'Enable acoustic audio'}
              className="p-2 rounded-xl bg-[#261309] hover:bg-[#3d2112] border border-[#52301c] text-[#d5c4a1] hover:text-[#fdf0a6] transition-colors shadow-sm"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#2ecc71]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#9a9187]" />
              )}
            </button>

            {/* Settings Modal Button */}
            <button
              type="button"
              onClick={onOpenSettings}
              aria-label="Settings"
              title="Open preferences & calibration"
              className="p-2 rounded-xl brass-btn flex items-center justify-center transition-all shadow-sm"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Bookmark Ribbon Tabs */}
        <nav aria-label="Journal sections" className="flex items-center gap-1.5 mb-3 px-1 sm:px-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => handleTabClick('ledger')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x ${
              activeTab === 'ledger'
                ? 'parchment-sheet text-[#3d2314] border-[#dfd6c3] shadow-md -mb-1 z-20'
                : 'bg-[#261309] text-[#d5c4a1] border-[#52301c] hover:bg-[#3d2112] hover:text-[#fdf0a6]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Daily Ledger</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('camera')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x ${
              activeTab === 'camera'
                ? 'parchment-sheet text-[#3d2314] border-[#dfd6c3] shadow-md -mb-1 z-20'
                : 'bg-[#261309] text-[#d5c4a1] border-[#52301c] hover:bg-[#3d2112] hover:text-[#fdf0a6]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>AI Food Camera</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('almanac')}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 border-t border-x ${
              activeTab === 'almanac'
                ? 'parchment-sheet text-[#3d2314] border-[#dfd6c3] shadow-md -mb-1 z-20'
                : 'bg-[#261309] text-[#d5c4a1] border-[#52301c] hover:bg-[#3d2112] hover:text-[#fdf0a6]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Almanac</span>
          </button>
        </nav>

        {/* Main Content Area in Parchment Folio */}
        <div className="relative z-10">{children}</div>

        {/* Footer Spine Info */}
        <footer className="mt-6 pt-3 border-t border-[#52301c] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#d5c4a1]/60 px-2 gap-2 font-mono">
          <div>NutriCare Artisanal Edition · Offline LocalStorage Vault</div>
          <div className="flex items-center gap-2">
            <span>Acoustics: Web Audio API</span>
            <span>·</span>
            <span>Vision: Google Gemini / Heuristics</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
