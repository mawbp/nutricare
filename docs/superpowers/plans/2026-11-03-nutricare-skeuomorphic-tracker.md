# NutriCare Skeuomorphic Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tactile skeuomorphic ("Leather Journal & Brass") daily food calorie and water tracking web app featuring an analog pressure gauge, crystal glass water tumbler, AI vision food scanner (smart heuristic + Gemini Vision API), and a 7-day Weekly Almanac ledger.

**Architecture:** A client-side React 18+ / TypeScript single page app powered by Vite and Tailwind CSS extended with custom skeuomorphic CSS layers (leather textures, parchment paper, debossed typography, metallic brass gradients, and fluid animations). State is maintained offline-first in `localStorage` with versioned migrations, Web Audio API sound synthesis, and zero required external servers.

**Tech Stack:** React 18+, TypeScript, Vite, Tailwind CSS, Lucide React, Web Audio API, Vitest.

**Spec:** `docs/superpowers/specs/2026-11-03-nutricare-skeuomorphic-tracker-design.md`

## Global Constraints

- Standalone client-side application running via `npm run dev` and building with `npm run build` with zero TypeScript errors.
- Skeuomorphic palette strictly adheres to Saddle Leather (`#2b170c`), Cream Parchment (`#fcf9f1`), Antique Brass (`#c89e3a`), Deep Wax Crimson (`#901a1e`), and Water Cyan (`#22a6b3`).
- Audio synthesis must gracefully handle browser autoplay restrictions and respect the user's Mute toggle.
- AI Food scanner must function reliably offline/zero-config using smart heuristics, while supporting personal Google Gemini Vision API keys.
- Pre-seeded sample data must populate the prior 6 days on first launch so the Weekly Almanac and stats look rich and alive immediately.

## Review Focus

1. **Water volume boundaries:** Incrementing and decrementing water must clamp between 0ml and 5,000ml without NaN or negative values.
2. **Remaining calories edge cases:** When calories consumed exceed daily goal, remaining calories must not break or show negative confusing values; gauge enters crimson over-budget state cleanly.
3. **Large photo payload resilience:** Camera photo uploads exceeding 1MB must be dynamically downscaled via canvas before passing to AI or storing, avoiding `localStorage` quota crashes.
4. **Invalid / Failed Gemini API responses:** When an API key is invalid or rate limited, the app must fall back to the built-in intelligent estimator with an ink-stamped advisory instead of crashing.
5. **Date navigation integrity:** Switching between days in the ledger must preserve each day's independent meal logs and water tally accurately.

---

### Task 1: Project Scaffolding & Setup

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces: Runnable React + Vite + Tailwind + Vitest app environment.

- [ ] **Step 1: Initialize package.json and install dependencies**
Run `npm init -y` and install `react`, `react-dom`, `lucide-react`, `canvas-confetti` (plus devDeps: `vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/react-dom`, `@types/canvas-confetti`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`).
- [ ] **Step 2: Configure Vite, TypeScript, and Tailwind CSS**
Setup `vite.config.ts` (with test config for jsdom), `tailwind.config.js`, and `tsconfig.json`.
- [ ] **Step 3: Write failing smoke test `src/App.test.tsx`**
Assert that `<App />` renders with title text "NutriCare".
- [ ] **Step 4: Run test to verify it fails**
Run: `npm test` or `npx vitest run src/App.test.tsx`
Expected: FAIL.
- [ ] **Step 5: Implement minimal App.tsx and index.html**
Write `index.html`, `src/main.tsx`, `src/App.tsx` displaying "NutriCare".
- [ ] **Step 6: Run test to verify it passes**
Run: `npx vitest run src/App.test.tsx`
Expected: PASS.
- [ ] **Step 7: Commit**
`git add . && git commit -m "chore: scaffold React Vite TypeScript and Tailwind app"`

---

### Task 2: Skeuomorphic Design System, CSS Utilities & Audio FX Engine

**Files:**
- Create: `src/styles/skeuomorphic.css`
- Create: `src/services/soundEffects.ts`
- Test: `src/services/soundEffects.test.ts`
- Modify: `src/index.css`

**Interfaces:**
- Produces: 
  - CSS utility classes: `.leather-binder`, `.parchment-sheet`, `.brass-plate`, `.brass-btn`, `.debossed-text`, `.water-glass-vibe`, `.polaroid-frame`, `.wax-seal`.
  - `soundService.playClick()`, `soundService.playGlug()`, `soundService.playShutter()`, `soundService.playStamp()`, `soundService.setMuted(muted: boolean)`, `soundService.isMuted(): boolean`.

- [ ] **Step 1: Write tests for SoundEffects service**
Test sound enable/disable state toggle, volume clamping, and mute persistence in localStorage.
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/services/soundEffects.test.ts`
Expected: FAIL.
- [ ] **Step 3: Implement Web Audio API synthesis in `src/services/soundEffects.ts`**
Synthesize click (high-pass pulse), glug (dual sine frequency sweep), camera shutter (filtered noise burst + double pulse), and stamp thud (low sine resonance). Guard with AudioContext state resume on user click.
- [ ] **Step 4: Implement skeuomorphic CSS styles in `src/styles/skeuomorphic.css`**
Define leather texture gradients, stitched borders with gold dashes, debossed and embossed text shadow utilities, recessed brass bezels with inset specular reflections, and parchment paper textures.
- [ ] **Step 5: Run test to verify SoundEffects passes**
Run: `npx vitest run src/services/soundEffects.test.ts`
Expected: PASS.
- [ ] **Step 6: Commit**
`git add src/styles/skeuomorphic.css src/services/soundEffects* src/index.css && git commit -m "feat: add skeuomorphic styles and Web Audio synthesizer"`

---

### Task 3: Core Domain Types, Storage Manager & Pre-seeded Sample Engine

**Files:**
- Create: `src/types/index.ts`
- Create: `src/services/storage.ts`
- Create: `src/services/seedData.ts`
- Test: `src/services/storage.test.ts`

**Interfaces:**
- Produces:
  - Types: `FoodItem`, `MealType`, `DayLog`, `UserSettings`, `AppState`, `WeeklySummary`.
  - `getAppState(): AppState`
  - `saveAppState(state: AppState): void`
  - `getDayLog(state: AppState, date: string): DayLog`
  - `updateDayLog(date: string, updater: (log: DayLog) => DayLog): AppState`
  - `addFoodItem(date: string, meal: MealType, item: Omit<FoodItem, 'id' | 'timestamp'>): AppState`
  - `removeFoodItem(date: string, meal: MealType, itemId: string): AppState`
  - `updateWater(date: string, deltaMl: number): AppState`
  - `getWeeklySummary(state: AppState, targetDate: string): WeeklySummary`

- [ ] **Step 1: Define types in `src/types/index.ts`**
Define `FoodItem`, `MealType`, `DayLog`, `UserSettings`, `AppState`, `WeeklySummary`.
- [ ] **Step 2: Write failing tests in `src/services/storage.test.ts`**
Test: Initial load creates default settings and pre-seeds past 6 days; updating water clamps to [0, 5000]; adding and removing food recalculates meal calories accurately; weekly summary aggregates 7-day stats correctly.
- [ ] **Step 3: Run test to verify it fails**
Run: `npx vitest run src/services/storage.test.ts`
Expected: FAIL.
- [ ] **Step 4: Implement `src/services/seedData.ts` and `src/services/storage.ts`**
Implement storage with `localStorage` fallback, versioning, immutable log updates, clamped water calculations, and 7-day rolling weekly metrics.
- [ ] **Step 5: Run test to verify it passes**
Run: `npx vitest run src/services/storage.test.ts`
Expected: PASS.
- [ ] **Step 6: Commit**
`git add src/types src/services/storage* src/services/seedData* && git commit -m "feat: implement domain types, storage manager, and seed data generator"`

---

### Task 4: Analog Calorie Pressure Gauge & Macro Summary Cards

**Files:**
- Create: `src/components/AnalogCalorieGauge.tsx`
- Create: `src/components/MacroBar.tsx`
- Test: `src/components/AnalogCalorieGauge.test.tsx`

**Interfaces:**
- Consumes: `DayLog`, `UserSettings`.
- Produces:
  - `<AnalogCalorieGauge consumed={number} goal={number} />`
  - `<MacroBar protein={number} carbs={number} fat={number} />`

- [ ] **Step 1: Write failing tests in `src/components/AnalogCalorieGauge.test.tsx`**
Assert needle angle calculation (maps 0 to goal to 180 degrees), remaining calories calculation, surplus warning state when consumed > goal.
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/components/AnalogCalorieGauge.test.tsx`
Expected: FAIL.
- [ ] **Step 3: Implement `AnalogCalorieGauge.tsx` and `MacroBar.tsx`**
Create realistic brass circular bezel with screws, curved SVG arc with green/amber/crimson zones, animated rotating needle with smooth CSS transition, debossed odometer digital readout, and tactile macro pill gauges.
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/AnalogCalorieGauge.test.tsx`
Expected: PASS.
- [ ] **Step 5: Commit**
`git add src/components/AnalogCalorieGauge* src/components/MacroBar* && git commit -m "feat: add analog calorie gauge and macro summary components"`

---

### Task 5: Skeuomorphic Crystal Glass Water Tumbler

**Files:**
- Create: `src/components/WaterTumbler.tsx`
- Test: `src/components/WaterTumbler.test.tsx`

**Interfaces:**
- Consumes: `waterMl: number`, `goalMl: number`, `onUpdateWater: (delta: number) => void`.
- Produces: `<WaterTumbler currentMl={number} goalMl={number} onAddWater={(ml: number) => void} />`

- [ ] **Step 1: Write failing tests in `src/components/WaterTumbler.test.tsx`**
Test clicking quick-add tokens (+250ml, +500ml, +100ml, -250ml) triggers callback with exact values and triggers sound effect; checks goal-met golden badge when `currentMl >= goalMl`.
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/components/WaterTumbler.test.tsx`
Expected: FAIL.
- [ ] **Step 3: Implement `WaterTumbler.tsx`**
Build faceted crystal tumbler with glass refraction highlights, animated fluid level with dynamic height percentage, surface wave ripple keyframes, rising air bubbles, measurement tick marks, and 4 brass token buttons (`+250ml`, `+500ml`, `+100ml`, `-250ml`).
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/WaterTumbler.test.tsx`
Expected: PASS.
- [ ] **Step 5: Commit**
`git add src/components/WaterTumbler* && git commit -m "feat: implement skeuomorphic crystal glass water tumbler"`

---

### Task 6: Food Items Ledger & Meal Cards (Breakfast, Lunch, Dinner, Snacks)

**Files:**
- Create: `src/components/MealCard.tsx`
- Create: `src/components/AddFoodModal.tsx`
- Create: `src/components/DailyLedger.tsx`
- Test: `src/components/MealCard.test.tsx`

**Interfaces:**
- Consumes: `DayLog`, `onAddFood`, `onRemoveFood`, `onUpdateWater`.
- Produces:
  - `<MealCard mealType={MealType} items={FoodItem[]} onAdd={...} onRemove={...} />`
  - `<AddFoodModal isOpen={boolean} onClose={...} onSave={...} />`
  - `<DailyLedger ... />`

- [ ] **Step 1: Write failing tests in `src/components/MealCard.test.tsx`**
Test meal item rendering, item deletion callback, modal open on "+ Add Food" click, and preset quick-pick population.
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/components/MealCard.test.tsx`
Expected: FAIL.
- [ ] **Step 3: Implement `MealCard.tsx`, `AddFoodModal.tsx`, and `DailyLedger.tsx`**
Style cards as tucked recipe index cards clipped with brass paperclips; itemized rows with calorie badges, macros, and trash button; AddFood modal with preset suggestions (e.g. Oatmeal & Berries, Grilled Chicken, Avocado Salad, Greek Yogurt).
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/MealCard.test.tsx`
Expected: PASS.
- [ ] **Step 5: Commit**
`git add src/components/MealCard* src/components/AddFoodModal* src/components/DailyLedger* && git commit -m "feat: implement meal cards, add food modal, and daily ledger view"`

---

### Task 7: AI Vision Food Scanner & Gemini Client

**Files:**
- Create: `src/services/aiVision.ts`
- Create: `src/components/AIFoodScanner.tsx`
- Test: `src/services/aiVision.test.ts`
- Test: `src/components/AIFoodScanner.test.tsx`

**Interfaces:**
- Produces:
  - `analyzeFoodImage(base64Image: string, apiKey?: string): Promise<AIFoodAnalysisResult>`
  - `<AIFoodScanner onCommitFood={(item: Omit<FoodItem, 'id' | 'timestamp'>, meal: MealType) => void} apiKey?: string />`

- [ ] **Step 1: Write failing test in `src/services/aiVision.test.ts`**
Test heuristic fallback returns realistic calories and macronutrients for images, handles canvas downscaling, and formats JSON properly.
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/services/aiVision.test.ts`
Expected: FAIL.
- [ ] **Step 3: Implement `src/services/aiVision.ts`**
Image downscaler helper, sample meal presets with rich macro profiles, heuristic color/keyword vision classifier, and direct Gemini API client calling `generateContent`.
- [ ] **Step 4: Implement `src/components/AIFoodScanner.tsx`**
Vintage bellows camera lens viewfinder, Polaroid photo developing animation with scanning laser line, sample dish quick-picks, portion size multiplier slider (`0.5x` - `2.0x`), meal destination selector, and "Stamp into Ledger" brass button.
- [ ] **Step 5: Run tests to verify they pass**
Run: `npx vitest run src/services/aiVision.test.ts src/components/AIFoodScanner.test.tsx`
Expected: PASS.
- [ ] **Step 6: Commit**
`git add src/services/aiVision* src/components/AIFoodScanner* && git commit -m "feat: implement AI food scanner and vision analysis service"`

---

### Task 8: Weekly Almanac Summary Ledger & Wax Seals

**Files:**
- Create: `src/components/WeeklyAlmanac.tsx`
- Test: `src/components/WeeklyAlmanac.test.tsx`

**Interfaces:**
- Consumes: `state: AppState`, `currentDate: string`, `onSelectDate: (date: string) => void`.
- Produces: `<WeeklyAlmanac state={AppState} currentDate={string} />`

- [ ] **Step 1: Write failing tests in `src/components/WeeklyAlmanac.test.tsx`**
Test rendering of 7 days, calculation of weekly total calories, average water volume, goal-met red wax seal display for qualifying days, and week navigation arrows.
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/components/WeeklyAlmanac.test.tsx`
Expected: FAIL.
- [ ] **Step 3: Implement `WeeklyAlmanac.tsx`**
Two-page vintage ledger layout, 7 vertical test-tube/ruler gauge columns with fluid calorie and water levels, red wax stamp badges (`GOAL MET`), weekly macro pie/ribbon breakdown, weekly stats summary cards, and AI dietary curator cursive ink note.
- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest run src/components/WeeklyAlmanac.test.tsx`
Expected: PASS.
- [ ] **Step 5: Commit**
`git add src/components/WeeklyAlmanac* && git commit -m "feat: implement weekly almanac ledger with wax seals and charts"`

---

### Task 9: Apothecary Settings & Navigation Shell (Leather Binder & Tabs)

**Files:**
- Create: `src/components/SettingsModal.tsx`
- Create: `src/components/LeatherJournalShell.tsx`
- Modify: `src/App.tsx`
- Test: `src/components/SettingsModal.test.tsx`

**Interfaces:**
- Produces:
  - `<SettingsModal settings={UserSettings} onUpdate={...} onReset={...} onExport={...} onImport={...} />`
  - Complete `<LeatherJournalShell />` binding header, date navigator, audio rotary toggle, ribbon tabs, and active tab view switcher.

- [ ] **Step 1: Write failing tests for settings updates and date navigation**
- [ ] **Step 2: Run test to verify failure**
Run: `npx vitest run src/components/SettingsModal.test.tsx`
Expected: FAIL.
- [ ] **Step 2: Implement `SettingsModal.tsx` and `LeatherJournalShell.tsx`**
Leather binder exterior with brass corner plates and perimeter gold stitching, aged paper interior with rings, ribbon tabs on top/right (Today's Ledger, AI Food Cam, Weekly Almanac, Settings), rotary sound toggle switch, and date navigator (`← Yesterday`, `Today`, `Tomorrow →`).
- [ ] **Step 4: Connect full reactive state in `src/App.tsx`**
Integrate `DailyLedger`, `AIFoodScanner`, `WeeklyAlmanac`, and `SettingsModal` with synchronized storage and sound effects.
- [ ] **Step 5: Run tests to verify they pass**
Run: `npx vitest run`
Expected: ALL PASS.
- [ ] **Step 6: Commit**
`git add src/components/Settings* src/components/LeatherJournal* src/App.tsx && git commit -m "feat: integrate leather journal shell, settings modal, and ribbon tabs"`

---

### Task 10: End-to-End Polish, Responsive Styling & Production Build Verification

**Files:**
- Modify: `src/styles/skeuomorphic.css`, `src/index.css`, `README.md`
- Test: `npm run build`, `npm test`

- [ ] **Step 1: Mobile & Desktop Responsive Audit**
Ensure optimal centering on desktop with textured desk surface backdrop, and full fluid scaling on mobile viewports (375px - 430px).
- [ ] **Step 2: Run full test suite**
Run: `npm test`
Expected: All tests pass.
- [ ] **Step 3: Run production build**
Run: `npm run build`
Expected: Zero TypeScript errors, clean bundle generated in `dist/`.
- [ ] **Step 4: Create detailed README with usage instructions and screenshot guide**
- [ ] **Step 5: Final Commit**
`git add . && git commit -m "docs: finalize README and build verification"`
