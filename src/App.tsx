import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AppState, MealType, FoodItem, UserSettings, ActiveTab } from './types';
import { 
  getAppState, 
  getDayLog, 
  addFoodItem, 
  removeFoodItem, 
  updateWater, 
  updateSettings, 
  updateActiveTab, 
  updateCurrentDate, 
  resetAppState, 
  getWeeklySummary, 
  calculateDayTotals 
} from './services/storage';
import { soundEffects } from './services/soundEffects';
import { LeatherJournalShell } from './components/LeatherJournalShell';
import { DailyLedger } from './components/DailyLedger';
import { AIFoodScanner } from './components/AIFoodScanner';
import { WeeklyAlmanac } from './components/WeeklyAlmanac';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => getAppState());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const celebratedDates = useRef<Set<string>>(new Set());

  // Keep sound effects service in sync with user settings
  useEffect(() => {
    if (state.settings.soundEnabled !== undefined) {
      soundEffects.setMuted(!state.settings.soundEnabled);
    }
  }, [state.settings.soundEnabled]);

  const currentDayLog = getDayLog(state, state.currentDate);
  const currentTotals = calculateDayTotals(currentDayLog);
  const weeklySummary = getWeeklySummary(state, state.currentDate);

  // Check goal achievement celebration
  const checkGoalCelebration = useCallback(() => {
    const isCalorieMet = 
      currentTotals.calories >= state.settings.dailyCalorieGoal * 0.85 &&
      currentTotals.calories <= state.settings.dailyCalorieGoal * 1.15;
    const isWaterMet = currentDayLog.waterMl >= state.settings.dailyWaterGoalMl;

    if (isCalorieMet && isWaterMet && !celebratedDates.current.has(state.currentDate)) {
      celebratedDates.current.add(state.currentDate);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#c89e3a', '#fdf0a6', '#2ecc71', '#901a1e'],
        });
      } catch {
        // Confetti unavailable in test environments
      }
    }
  }, [currentTotals.calories, currentDayLog.waterMl, state.settings, state.currentDate]);

  useEffect(() => {
    checkGoalCelebration();
  }, [checkGoalCelebration]);

  const handleAddFood = (meal: MealType, item: Omit<FoodItem, 'id' | 'timestamp'>) => {
    const newState = addFoodItem(state.currentDate, meal, item);
    setState(newState);
  };

  const handleRemoveFood = (meal: MealType, itemId: string) => {
    const newState = removeFoodItem(state.currentDate, meal, itemId);
    setState(newState);
  };

  const handleUpdateWater = (delta: number) => {
    const newState = updateWater(state.currentDate, delta);
    setState(newState);
  };

  const handleTabChange = (tab: ActiveTab) => {
    const newState = updateActiveTab(tab);
    setState(newState);
  };

  const handleDateChange = (date: string) => {
    const newState = updateCurrentDate(date);
    setState(newState);
  };

  const handleSaveSettings = (newSettings: Partial<UserSettings>) => {
    const newState = updateSettings(newSettings);
    setState(newState);
  };

  const handleResetData = () => {
    const newState = resetAppState();
    setState(newState);
    celebratedDates.current.clear();
  };

  const handleToggleSound = () => {
    const currentMuted = soundEffects.isMuted();
    soundEffects.setMuted(!currentMuted);
    const newState = updateSettings({ soundEnabled: currentMuted });
    setState(newState);
  };

  return (
    <>
      <LeatherJournalShell
        activeTab={state.activeTab}
        onTabChange={handleTabChange}
        currentDate={state.currentDate}
        onDateChange={handleDateChange}
        settings={state.settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleSound={handleToggleSound}
        todayCalorieTotal={currentTotals.calories}
        todayWaterTotal={currentDayLog.waterMl}
      >
        {state.activeTab === 'ledger' && (
          <DailyLedger
            dayLog={currentDayLog}
            settings={state.settings}
            onAddFood={handleAddFood}
            onRemoveFood={handleRemoveFood}
            onUpdateWater={handleUpdateWater}
            onOpenAiCamera={() => handleTabChange('camera')}
          />
        )}

        {state.activeTab === 'camera' && (
          <AIFoodScanner
            onCommitFood={(item, meal) => {
              handleAddFood(meal, item);
              handleTabChange('ledger');
            }}
            apiKey={state.settings.geminiApiKey}
          />
        )}

        {state.activeTab === 'almanac' && (
          <WeeklyAlmanac
            summary={weeklySummary}
            selectedDate={state.currentDate}
            onSelectDate={(date) => {
              handleDateChange(date);
              handleTabChange('ledger');
            }}
          />
        )}
      </LeatherJournalShell>

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={state.settings}
        onClose={() => setIsSettingsOpen(false)}
        onSaveSettings={handleSaveSettings}
        onResetData={handleResetData}
      />
    </>
  );
}
