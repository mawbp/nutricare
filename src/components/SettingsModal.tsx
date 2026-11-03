import React, { useState } from 'react';
import { X, Sliders, Volume2, VolumeX, Download, Upload, AlertTriangle, Key, Check } from 'lucide-react';
import { UserSettings } from '../types';
import { soundEffects } from '../services/soundEffects';
import { exportStateJson, importStateJson } from '../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onClose: () => void;
  onSaveSettings: (settings: Partial<UserSettings>) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
  onResetData,
}) => {
  const [calorieGoal, setCalorieGoal] = useState(String(settings.dailyCalorieGoal));
  const [waterGoal, setWaterGoal] = useState(String(settings.dailyWaterGoalMl));
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled ?? true);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEffects.setMuted(!next);
    if (next) {
      soundEffects.playClick();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playStamp();
    onSaveSettings({
      dailyCalorieGoal: Math.max(500, parseInt(calorieGoal, 10) || 2000),
      dailyWaterGoalMl: Math.max(500, parseInt(waterGoal, 10) || 2500),
      geminiApiKey: apiKey.trim(),
      soundEnabled,
    });
    onClose();
  };

  const handleExport = () => {
    soundEffects.playClick();
    const jsonStr = exportStateJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutricare-journal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playClick();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importStateJson(content);
      if (success) {
        setImportStatus('Backup restored successfully! Refreshing...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setImportStatus('Error: Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    if (window.confirm('Reset all journal entries back to factory sample week? This cannot be undone.')) {
      soundEffects.playStamp();
      onResetData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg parchment-sheet p-6 rounded-2xl border-2 border-[#c89e3a] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Brass Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#dfd6c3] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full brass-plate flex items-center justify-center">
              <Sliders className="w-4 h-4 text-[#2b1807]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#3d2314] tracking-wide debossed-text">
                Journal Preferences & Calibration
              </h2>
              <p className="text-xs text-[#8c7a65]">Configure targets, acoustic feedback, and storage</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Goals */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-1">
                Hydration Target (ml)
              </label>
              <input
                type="number"
                min="500"
                max="10000"
                step="50"
                value={waterGoal}
                onChange={(e) => setWaterGoal(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
              />
            </div>
          </div>

          {/* Acoustic Web Audio Feedback Toggle */}
          <div className="p-3 bg-[#f4ede0] rounded-xl border border-[#dfd6c3] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#27ae60]" />
              ) : (
                <VolumeX className="w-5 h-5 text-[#9a9187]" />
              )}
              <div>
                <div className="text-xs font-bold text-[#3d2314]">Acoustic Synthesizer Feedback</div>
                <div className="text-[10px] text-[#8c7a65]">
                  Authentic mechanical clicks, liquid glug, and stamp sounds
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                soundEnabled
                  ? 'bg-[#27ae60] text-white hover:bg-[#219150]'
                  : 'bg-[#dfd6c3] text-[#6b635b] hover:bg-[#d5c4a1]'
              }`}
            >
              {soundEnabled ? 'Acoustics Active' : 'Muted'}
            </button>
          </div>

          {/* Gemini Vision API Key (Optional) */}
          <div className="p-3 bg-[#fcf8ec] rounded-xl border border-[#d5c4a1] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#52301c] uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#c89e3a]" />
                Google Gemini API Key (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-[10px] text-[#8c7a65] hover:text-[#3d2314] underline"
              >
                {showApiKey ? 'Hide' : 'Reveal'}
              </button>
            </div>

            <input
              type={showApiKey ? 'text' : 'password'}
              placeholder="AIzaSy... (leave blank for built-in heuristic mode)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-mono focus:outline-none focus:border-[#c89e3a] shadow-inner"
            />
            <p className="text-[11px] text-[#8c7a65] leading-normal">
              When empty, NutriCare automatically uses its intelligent heuristic nutrition analyzer. Adding your personal Google Gemini API key enables live multimodal image recognition.
            </p>
          </div>

          {/* Backup & Restore Data */}
          <div className="pt-2 border-t border-[#dfd6c3]">
            <div className="text-xs font-bold text-[#3d2314] uppercase tracking-wider mb-2">
              Archival Backup & Transfer
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="brass-btn-secondary flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger JSON</span>
              </button>

              <label className="brass-btn-secondary flex-1 py-1.5 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer active:scale-95">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Backup</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="mt-2 text-xs font-semibold text-[#27ae60] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {importStatus}
              </div>
            )}
          </div>

          {/* Danger Zone: Factory Reset */}
          <div className="pt-2 border-t border-[#dfd6c3] flex items-center justify-between">
            <button
              type="button"
              onClick={handleConfirmReset}
              className="text-xs text-[#901a1e] hover:text-[#5e0d10] font-semibold flex items-center gap-1 py-1 px-2 rounded hover:bg-[#901a1e]/10 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reset Factory Sample Data</span>
            </button>
          </div>

          {/* Save Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#dfd6c3]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#6b635b] hover:text-[#2c2724] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="brass-btn px-6 py-2 rounded-lg text-xs font-bold shadow-md active:scale-95"
            >
              Save Journal Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
