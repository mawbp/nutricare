# NutriCare — Skeuomorphic Food Calorie & Water Tracker Design Specification

**Date:** 2026-11-03  
**Status:** Approved  
**Author:** AI Agent & App Builder  

---

## 1. Overview & Vision

**NutriCare** is a personal nutrition and hydration web application engineered for daily use. It combines tactile skeuomorphic design ("Leather Journal & Brass") with calorie counting, water tracking, weekly visual analytics, and an AI-assisted food photo calorie estimation engine.

### Core Value Propositions
1. **Frictionless Daily Tracking:** Quick-tap logging for water and meals with instant visual, analog feedback.
2. **Tactile Skeuomorphic Aesthetic:** Stitched saddle-brown leather exterior, aged cream parchment paper pages, debossed letterpress typography, brass bezels and buttons, heavy crystal glass water tumbler with liquid animation, and authentic mechanical sound feedback (with mute).
3. **AI Vision Food Scanner:** Polaroid-style camera view where users can snap a photo, upload an image, or click sample meals to receive calorie and macronutrient breakdown with zero friction (built-in intelligent estimator + optional Google Gemini Vision API key integration).
4. **Weekly Nutrition Almanac:** 7-day retrospective ledger with analog bar gauges, goal achievement wax seals, average daily intakes, and macro distribution.
5. **Offline-First & Privacy:** Pure client-side data persistence in `localStorage`, zero required accounts, and instant fast loading.

---

## 2. Architecture & Tech Stack

- **Framework:** React 18+ with TypeScript and Vite.
- **Styling:** Tailwind CSS with custom CSS variables, gradients, inset shadows, and custom keyframes for skeuomorphic depth and fluid dynamics.
- **Icons & Graphics:** Lucide-react icons styled with brass/copper metallic gradients, drop shadows, and debossed letterpress SVG filters.
- **Audio Synthesis Engine:** Native Web Audio API synthesizer for tactile acoustic feedback (mechanical button switch clicks, glass liquid pour/glug, camera shutter click, stamp thud) with persistent mute toggle.
- **Storage Layer:** LocalStorage with schema versioning (`nutricare_state_v1`), automated fallback seeding, and JSON export/import.
- **AI Vision Engine:**
  - *Default / Offline:* Intelligent heuristic visual analysis engine with calibrated food presets, portion scaling, and realistic macronutrient ratios.
  - *Live Multimodal AI:* Direct client-side Google Gemini Vision API (`gemini-1.5-flash` / `gemini-2.5-flash`) integration when a user provides an API key in Settings.

---

## 3. Detailed Component & Feature Design

### 3.1. Shell & Navigation (The Leather Journal)
- **Exterior:** Padded saddle-brown leather binder texture (`#2c180e` to `#1f0f08`), gold edge stitching, and four corner brass brackets with rivets.
- **Interior Page:** Cream textured parchment (`#fcf9f2` to `#f4eee1`) with aged perimeter burnish, subtle ledger rules, and brass ring-binder tabs.
- **Top Utility Header:**
  - Embossed gold-foil logo: *"NutriCare — Daily Nutrition Ledger"*.
  - Date Navigator: Displays current date with `← Yesterday` and `Tomorrow →` navigation, plus a "Jump to Today" brass seal.
  - Rotary Brass Audio Mute Toggle: Switchable sound effects.
- **Navigation Ribbon Tabs (Right / Top Edge):**
  1. **Daily Ledger (Today):** Calorie meter, meals, and water tumbler.
  2. **AI Food Cam:** Polaroid camera interface, photo preview, and macro scanner.
  3. **Weekly Almanac:** 7-day summary ledger, charts, and seals.
  4. **Settings:** Target goals, API key, sound settings, and data management.

---

### 3.2. Daily Ledger View

#### A. Analog Calorie Meter (Pressure Gauge)
- Brass circular bezel with slotted screws and anti-reflective glass glare highlight.
- Smooth rotating analog needle pointing across color-coded arcs:
  - 0–80%: Forest Green (Nourished).
  - 80–100%: Warm Amber (Target Zone).
  - >100%: Crimson (Calorie Surplus).
- Recessed odometer counter displaying `Remaining Calories = Goal - Consumed`.
- Macro breakdown pills: Protein, Carbs, and Fat (grams and % of total).

#### B. Meal Cards & Food Item Ledger
- 4 meal categories: **Breakfast**, **Lunch**, **Dinner**, **Snacks**.
- Each category is styled as an index card clipped with a brass paperclip.
- Displays individual logged items with calorie count, macros, timestamp, and delete action.
- Quick `+ Add Food` modal with name, calories, protein, carbs, fat, and quick-pick presets.

#### C. Crystal Glass Water Tumbler
- Heavy-bottomed faceted crystal glass container with 250ml measurement notches up to 3,000ml.
- Animated dynamic liquid level (ocean blue gradient with surface wave ripple and air bubbles).
- Condensation droplet accents on the glass exterior.
- Tactile brass quick-action tokens:
  - `+250ml (Cup)`
  - `+500ml (Bottle)`
  - `+100ml (Sip)`
  - `-250ml (Undo)`
- Sound feedback: Realistic resonant water glug/pour tone.
- Visual reward: Reaching the daily goal (>2,500ml) unlocks a shimmering golden aura and gold wax badge.

---

### 3.3. AI Food Scanner ("The Nutrition Camera")

#### User Experience Flow
1. User opens the **AI Food Cam** tab.
2. Viewport displays a vintage bellows camera lens with a viewfinder grid.
3. User can:
   - Click **Take Photo / Upload** to choose an image from their camera or file system.
   - Click one of the **Sample Food Plates** (e.g. Avocado Toast, Salmon Bowl, Mediterranean Salad, Burger & Sweet Potato Fries).
4. **Photo Developing Animation:** The image slides out like a developing Polaroid print; a brass laser scanning line passes down the photo with camera shutter and whirring sound effects.
5. **Inspection Tag Result:**
   - Identified food item title.
   - Calories and Macronutrients (Protein, Carbs, Fat, Fiber).
   - Portion size adjuster: `0.5x`, `1.0x`, `1.5x`, `2.0x`.
   - Meal destination selector (Breakfast, Lunch, Dinner, Snacks).
   - `Stamp into Ledger` button: Commits the food item into the active day's log with a heavy ink stamp sound.

#### AI Provider Architecture
- If `geminiApiKey` is saved in user settings:
  - Converts image to base64.
  - Sends prompt to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}` requesting structured JSON output for food name, estimated calories, protein, carbs, fat, fiber, and nutritional notes.
- If no key is set or network fails:
  - Falls back to the built-in intelligent recognition engine with zero error screens, ensuring seamless uninterrupted user experience.

---

### 3.4. Weekly Almanac (Summary View)

- **Two-Page Vintage Ledger Spread:**
  - 7 vertical tactile columns (Monday through Sunday) comparing:
    - Daily calorie consumption vs. calorie goal (colored fluid bar in brass gauge).
    - Daily water intake vs. water goal.
  - Golden Red Wax Seal (`GOAL ACHIEVED`) stamped on days hitting both calorie and hydration goals.
- **Weekly Summary Metrics:**
  - Total Calories Consumed & Daily Average.
  - Total Water Consumed (in Liters and Standard Glasses).
  - Peak Day and Lightest Day.
  - Overall Weekly Macro Ratio (Protein vs Carbs vs Fat percentage split).
  - Health Curator Ink Note: Automatic encouraging observational takeaway (e.g., *"Hydration was strongest mid-week; protein intake peaked on Wednesday. Great consistency!"*).
- **Week Switcher:** Brass arrow buckles (`← Previous Week`, `Next Week →`).

---

### 3.5. Settings & Apothecary

- **Daily Targets:** Editable Calorie Target (e.g., 2,000 kcal) and Water Target (e.g., 2,500 ml).
- **Gemini API Key:** Input field with secure password mask, status indicator, and help guide link.
- **Acoustic Feedback:** Sound FX Master On/Off switch with volume control.
- **Data Management:**
  - "Seed Sample Week": Populates realistic historical week logs for testing.
  - "Export Ledger Backup": Downloads `nutricare-backup-YYYY-MM-DD.json`.
  - "Import Ledger Backup": Restores from JSON.
  - "Clear Ledger": Resets state with confirmation modal.

---

## 4. Data Models & State Architecture

```typescript
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number; // in grams
  carbs: number;   // in grams
  fat: number;     // in grams
  fiber?: number;  // in grams
  imageUrl?: string;
  source: 'ai' | 'manual' | 'preset';
  timestamp: string; // ISO string
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snacks';

export interface DayLog {
  date: string; // YYYY-MM-DD
  waterMl: number;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
}

export interface UserSettings {
  dailyCalorieGoal: number;
  dailyWaterGoalMl: number;
  geminiApiKey: string;
  soundEnabled: boolean;
}

export interface AppState {
  currentDate: string; // YYYY-MM-DD
  activeTab: 'ledger' | 'camera' | 'almanac' | 'settings';
  settings: UserSettings;
  logs: Record<string, DayLog>; // key: YYYY-MM-DD
}
```

---

## 5. Skeuomorphic Design System Specifications

### Color Palette
- **Leather Exterior:**
  - Deep Saddle: `#2b170c`
  - Warm Umber: `#422312`
  - Stitch Gold: `#d4a359`
- **Parchment Paper:**
  - Paper Cream: `#fcf9f1`
  - Aged Shadow: `#e9dec8`
  - Ink Charcoal: `#2c2724`
  - Faded Ink: `#6b635b`
- **Brass & Metallic:**
  - Brass Bright: `#f5d77f`
  - Brass Mid: `#c89e3a`
  - Brass Dark: `#735418`
- **Liquids & Accents:**
  - Water Cyan/Blue: `#22a6b3` to `#30336b`
  - Wax Seal Crimson: `#901a1e`
  - Emerald Calorie Safe: `#27ae60`
  - Amber Warning: `#e67e22`

### Sound FX Synthesizer (Web Audio API)
- **Click:** High-pass filtered pulse oscillator (800Hz to 200Hz, 15ms) for mechanical buttons.
- **Water Glug:** Band-pass filtered dual sine waves (350Hz sliding to 480Hz, 120ms) with slight bubble resonance.
- **Camera Shutter:** White noise burst through high-pass filter + dual click pulses simulating a physical camera mirror reflex.
- **Stamp Thud:** Low frequency sine wave (120Hz to 40Hz, 80ms) with gentle distortion simulating physical ink stamp pressure.

---

## 6. Verification & Quality Plan

1. **Calculations & Ledger Accuracy:**
   - Daily consumed calories must accurately sum across all 4 meal categories.
   - Remaining calories formula: `max(0, goal - consumed)` with explicit surplus indicator when consumed > goal.
   - Water volume increments/decrements bound cleanly (`0 <= waterMl <= 5000`).
   - Weekly averages and percentage splits calculated correctly over 7-day windows.
2. **AI Vision & Mock Resilience:**
   - Photo upload handles large files by auto-scaling on `<canvas>`.
   - Simulated AI engine provides diverse, plausible food recognition on uploaded photos and preset gallery.
   - Live Gemini Vision API validates responses and falls back gracefully on network or key errors.
3. **UI & Responsive Aesthetics:**
   - Flawless appearance on both mobile screens (375px–430px) and wide desktop displays.
   - Crisp textures, inset shadows, needle animations, and water fluid levels without layout shifts.
   - Zero console errors or TypeScript compilation warnings.
