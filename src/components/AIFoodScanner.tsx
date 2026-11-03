import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Check, RefreshCw, Zap, Sliders, Stamp } from 'lucide-react';
import { AIFoodAnalysisResult, FoodItem, MealType } from '../types';
import { analyzeFoodImage, downscaleImageBase64, SAMPLE_FOOD_DISHES, SampleFoodDish } from '../services/aiVision';
import { soundEffects } from '../services/soundEffects';

interface AIFoodScannerProps {
  onCommitFood: (item: Omit<FoodItem, 'id' | 'timestamp'>, meal: MealType) => void;
  apiKey?: string;
}

export const AIFoodScanner: React.FC<AIFoodScannerProps> = ({ onCommitFood, apiKey }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<AIFoodAnalysisResult | null>(null);
  const [portion, setPortion] = useState<number>(1.0);
  const [selectedMeal, setSelectedMeal] = useState<MealType>('lunch');
  const [stampedSuccess, setStampedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playShutter();
    setIsScanning(true);
    setAnalysis(null);
    setStampedSuccess(false);

    try {
      const base64 = await downscaleImageBase64(file);
      setSelectedImage(base64);
      processImageAnalysis(base64);
    } catch {
      setIsScanning(false);
    }
  };

  const handleSelectSample = (sample: SampleFoodDish) => {
    soundEffects.playShutter();
    setIsScanning(true);
    setSelectedImage(sample.imageUrl);
    setAnalysis(null);
    setStampedSuccess(false);
    setSelectedMeal(sample.category);

    setTimeout(() => {
      setAnalysis({
        foodName: sample.name,
        description: sample.description,
        calories: sample.calories,
        protein: sample.protein,
        carbs: sample.carbs,
        fat: sample.fat,
        fiber: sample.fiber,
        confidence: 0.96,
        suggestedMeal: sample.category,
        portionMultiplier: 1.0,
        source: 'heuristic',
      });
      setIsScanning(false);
    }, 700);
  };

  const processImageAnalysis = async (base64: string) => {
    const result = await analyzeFoodImage(base64, apiKey);
    setAnalysis(result);
    setSelectedMeal(result.suggestedMeal);
    setIsScanning(false);
  };

  const handlePortionChange = (multiplier: number) => {
    soundEffects.playClick();
    setPortion(multiplier);
  };

  const handleCommit = () => {
    if (!analysis) return;
    soundEffects.playStamp();
    setStampedSuccess(true);

    const scaledCalories = Math.round(analysis.calories * portion);
    const scaledProtein = Math.round(analysis.protein * portion);
    const scaledCarbs = Math.round(analysis.carbs * portion);
    const scaledFat = Math.round(analysis.fat * portion);
    const scaledFiber = Math.round(analysis.fiber * portion);

    onCommitFood(
      {
        name: portion === 1 ? analysis.foodName : `${analysis.foodName} (${portion}x portion)`,
        calories: scaledCalories,
        protein: scaledProtein,
        carbs: scaledCarbs,
        fat: scaledFat,
        fiber: scaledFiber,
        imageUrl: selectedImage || undefined,
        source: 'ai',
      },
      selectedMeal
    );

    setTimeout(() => {
      setStampedSuccess(false);
    }, 2000);
  };

  const resetScanner = () => {
    soundEffects.playClick();
    setSelectedImage(null);
    setAnalysis(null);
    setPortion(1.0);
    setStampedSuccess(false);
  };

  const scaledCals = analysis ? Math.round(analysis.calories * portion) : 0;
  const scaledP = analysis ? Math.round(analysis.protein * portion) : 0;
  const scaledC = analysis ? Math.round(analysis.carbs * portion) : 0;
  const scaledF = analysis ? Math.round(analysis.fat * portion) : 0;
  const scaledFib = analysis ? Math.round(analysis.fiber * portion) : 0;

  return (
    <div className="w-full space-y-6">
      {/* Vintage Leather & Brass Camera Box */}
      <div className="leather-binder p-6 rounded-2xl relative overflow-hidden shadow-2xl border-2 border-[#52301c]">
        {/* Brass Screws on Corners */}
        <div className="brass-rivet absolute top-3 left-3" />
        <div className="brass-rivet absolute top-3 right-3" />
        <div className="brass-rivet absolute bottom-3 left-3" />
        <div className="brass-rivet absolute bottom-3 right-3" />

        {/* Camera Nameplate */}
        <div className="flex items-center justify-between pb-3 border-b border-[#52301c]/80 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full brass-plate flex items-center justify-center">
              <Camera className="w-5 h-5 text-[#2b1807]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#fdf0a6] tracking-wide embossed-gold">
                The Nutrition Camera
              </h2>
              <p className="text-xs text-[#d5c4a1]/70">
                AI Vision Calorie & Macronutrient Analyzer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {apiKey ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#27ae60]/20 text-[#2ecc71] border border-[#27ae60]/40 font-mono font-medium flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#2ecc71]" />
                Gemini Vision Active
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f39c12]/20 text-[#f1c40f] border border-[#f39c12]/40 font-mono font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#f1c40f]" />
                Smart Heuristic Mode
              </span>
            )}
          </div>
        </div>

        {/* Viewfinder / Upload View */}
        {!selectedImage ? (
          <div className="space-y-5">
            {/* Viewfinder Lens Aperture Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#d4af37]/50 rounded-xl p-8 text-center bg-[#150b06]/80 hover:bg-[#150b06] hover:border-[#d4af37] transition-all cursor-pointer group shadow-inner relative overflow-hidden"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Viewfinder Crosshair Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
                <div className="w-32 h-32 border border-[#fdf0a6] rounded-full" />
                <div className="absolute w-44 h-0.5 bg-[#fdf0a6]" />
                <div className="absolute h-44 w-0.5 bg-[#fdf0a6]" />
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#422312] to-[#261309] border-2 border-[#c89e3a] flex items-center justify-center mb-3 shadow-lg group-hover:scale-105 transition-transform">
                  <Upload className="w-7 h-7 text-[#fdf0a6]" />
                </div>
                <h3 className="text-base font-bold text-[#fcf9f1] mb-1">
                  Snap or Upload Food Photo
                </h3>
                <p className="text-xs text-[#d5c4a1]/70 max-w-sm">
                  Click to choose a photo from your gallery or camera. AI will inspect the plate and determine calories and nutrients.
                </p>
              </div>
            </div>

            {/* Quick Sample Plates Section */}
            <div>
              <div className="text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Sample Food Plates (One-Click Test)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {SAMPLE_FOOD_DISHES.map((dish) => (
                  <button
                    key={dish.id}
                    type="button"
                    onClick={() => handleSelectSample(dish)}
                    className="p-2 rounded-xl bg-[#26140a] hover:bg-[#3d2314] border border-[#52301c] hover:border-[#c89e3a] text-left transition-all shadow-md group flex flex-col justify-between"
                  >
                    <img
                      src={dish.imageUrl}
                      alt={dish.name}
                      className="w-full h-20 object-cover rounded-lg mb-1.5 border border-[#150b06]"
                    />
                    <div>
                      <div className="text-xs font-semibold text-[#fcf9f1] line-clamp-1 group-hover:text-[#fdf0a6]">
                        {dish.name}
                      </div>
                      <div className="text-[10px] text-[#c89e3a] font-mono mt-0.5">
                        {dish.calories} kcal · {dish.category}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Image Developing & Analysis Inspection Tag View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Polaroid Frame Container */}
              <div className="flex flex-col items-center">
                <div className="polaroid-frame max-w-[280px] w-full relative">
                  <div className="relative aspect-square w-full rounded overflow-hidden bg-black">
                    <img
                      src={selectedImage}
                      alt="Captured Food Plate"
                      className="w-full h-full object-cover"
                    />

                    {/* Scanning Laser Beam Animation */}
                    {isScanning && (
                      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#fdf0a6] to-transparent shadow-[0_0_12px_#fdf0a6] animate-pulse top-1/2 -translate-y-1/2" />
                    )}
                  </div>

                  <div className="mt-3 text-center">
                    <div className="font-handwriting text-lg text-[#2c2724] leading-tight">
                      {isScanning ? 'Developing photo...' : analysis?.foodName || 'Food Plate'}
                    </div>
                    <div className="text-[10px] font-mono text-[#8c7a65]">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetScanner}
                  className="mt-3 text-xs text-[#d5c4a1] hover:text-[#fdf0a6] flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Take another photo
                </button>
              </div>

              {/* Inspection Tag Result Card */}
              {analysis && (
                <div className="parchment-sheet p-5 rounded-xl border border-[#c89e3a] shadow-xl relative animate-fade-in">
                  {/* Stamped Tag Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#dfd6c3] mb-3">
                    <div className="flex items-center gap-1.5">
                      <Stamp className="w-4 h-4 text-[#901a1e]" />
                      <span className="text-xs font-bold text-[#901a1e] uppercase tracking-wider">
                        Nutrition Inspection Tag
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#27ae60] font-bold bg-[#27ae60]/10 px-2 py-0.5 rounded border border-[#27ae60]/30">
                      {(analysis.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  {/* Food Title & Description */}
                  <h3 className="text-base font-bold text-[#3d2314] leading-snug">
                    {analysis.foodName}
                  </h3>
                  <p className="text-xs text-[#6b635b] mt-1 leading-relaxed">
                    {analysis.description}
                  </p>

                  {/* Scaled Calories & Macros Display */}
                  <div className="my-4 p-3 bg-[#f4ede0] rounded-lg border border-[#dfd6c3] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#8c7a65]">
                        Estimated Energy
                      </div>
                      <div className="text-2xl font-bold text-[#2c2724] font-mono leading-none mt-0.5">
                        {scaledCals}
                        <span className="text-xs font-normal text-[#6b635b] ml-1">kcal</span>
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono space-y-0.5 text-[#3d2314]">
                      <div>Protein: <span className="font-bold">{scaledP}g</span></div>
                      <div>Carbs: <span className="font-bold">{scaledC}g</span></div>
                      <div>Fat: <span className="font-bold">{scaledF}g</span></div>
                      <div>Fiber: <span className="font-bold">{scaledFib}g</span></div>
                    </div>
                  </div>

                  {/* Portion Size Multiplier Slider */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-[#52301c]">
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-[#c89e3a]" />
                        Portion Scale:
                      </span>
                      <span className="font-mono font-bold text-[#c89e3a]">{portion}x</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0.5, 1.0, 1.5, 2.0].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handlePortionChange(val)}
                          className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                            portion === val
                              ? 'bg-[#c89e3a] text-[#1a0d06] shadow-inner'
                              : 'bg-white border border-[#dfd6c3] text-[#52301c] hover:bg-[#f4ede0]'
                          }`}
                        >
                          {val}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Meal Selector */}
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#52301c] uppercase tracking-wider mb-1">
                      Inscribe into Sitting:
                    </label>
                    <select
                      value={selectedMeal}
                      onChange={(e) => {
                        soundEffects.playClick();
                        setSelectedMeal(e.target.value as MealType);
                      }}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-[#dfd6c3] text-[#2c2724] font-semibold focus:outline-none focus:border-[#c89e3a] shadow-inner"
                    >
                      <option value="breakfast">Morning Breakfast</option>
                      <option value="lunch">Midday Luncheon</option>
                      <option value="dinner">Evening Dinner</option>
                      <option value="snacks">Apothecary Snacks</option>
                    </select>
                  </div>

                  {/* Stamp into Ledger Button */}
                  <button
                    type="button"
                    onClick={handleCommit}
                    disabled={stampedSuccess}
                    className="w-full brass-btn py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-98"
                  >
                    {stampedSuccess ? (
                      <>
                        <Check className="w-4 h-4 text-[#27ae60]" />
                        <span>Stamped into Ledger!</span>
                      </>
                    ) : (
                      <>
                        <Stamp className="w-4 h-4" />
                        <span>Stamp into Ledger</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
