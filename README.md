# NutriCare — The Physician's Skeuomorphic Nutrition Ledger

An artisanal, skeuomorphic daily calorie and hydration tracking journal built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Web Audio API**. Designed with a tactile **"Leather Journal & Brass"** aesthetic that avoids flat, generic modern UI tropes in favor of material depth, warm parchment textures, debossed letterpress typography, fluid physics, and analog acoustic feedback.

---

## 🌟 Key Features

### 1. Analog Caloric Pressure Meter
- Heavy antique brass bezel with circular tachymeter calibrated face.
- Color-zoned performance arcs: **Green (0–80%)**, **Amber (80–100%)**, and **Red surplus warning**.
- Dynamic rotating brass needle with mechanical return easing.
- Recessed debossed odometer readout showing calories consumed, daily budget, and remaining/surplus allowance.

### 2. Skeuomorphic Crystal Glass Water Tumbler
- Heavy crystal glass carafe with internal refraction beam highlights and etched milliliter tick marks (500ml to 3,000ml).
- Smooth animated water column with concave meniscus curve and rising fluid bubbles.
- Tactile brass push buttons for quick intake logging: `+250ml (Cup)`, `+500ml (Bottle)`, `+100ml (Sip)`, and `-250ml (Undo)`.
- Crimson wax seal award banner unlocking upon reaching the daily hydration target.

### 3. Culinary Provisions by Sitting
- Itemized recipe cards pinned with brass paperclips for **Morning Breakfast**, **Midday Luncheon**, **Evening Dinner**, and **Apothecary Snacks**.
- Macro breakdowns (Protein, Carbohydrates, Fats) calculated per sitting and summarized across the day with segmented tactile bars.
- Instant itemization modal featuring quick artisan presets (Poached Eggs & Sourdough, Grain Bowls, Seared Salmon, etc.) and custom gram entries.

### 4. Vintage AI Food Camera
- Styled as an antique leather-bound field camera with brass corner rivets and viewfinder lens dropzone.
- Dual-mode image analysis engine:
  - **Live Google Gemini Vision**: Multimodal visual nutritional estimation via user's Gemini API key.
  - **Intelligent Heuristic Engine**: Works out-of-the-box with zero configuration or keys required.
- **Polaroid developing frame** displaying photo with timestamp and scanning laser beam effect.
- **Nutrition Inspection Tag** with confidence score, description, calories, and grams of protein, carbs, fat, and fiber.
- **Interactive portion multiplier** (0.5x, 1.0x, 1.5x, 2.0x) and one-click ink stamping directly into the desired meal sitting.
- One-click sample plates (Avocado Toast, Salmon Grain Bowl, Bison Burger, Acai Bowl) for rapid testing.

### 5. Seven-Day Almanac & Weekly Ledger
- 7-day vertical bar chart contrasting daily intake against caloric and hydration targets.
- Crimson wax seals automatically stamped on days that met both caloric balance and hydration requirements.
- 4 key weekly metric cards: **Daily Calorie Average**, **Daily Water Average**, **Peak Energy Day**, and **Lightest Intake Day**.
- 7-day macro distribution percentage bar and cumulative gram totals.
- Handwritten **Health Curator & Physician Inscription** note rendered in fluid cursive script (`Caveat`) with verified physician stamp.
- Interactive bars allow clicking any prior day to jump straight to its daily ledger.

### 6. Tactile Web Audio Synthesizer
- Built natively using the browser's **Web Audio API** (zero heavy external audio asset downloads).
- Synthesizes realistic mechanical switch clicks, liquid bubble glugs, two-stage vintage camera shutter snaps, and rubber/wood ink stamp thuds.
- Persistent mute toggle accessible at any time from the top leather spine.

### 7. Offline-First Storage & Archival Transfer
- All daily logs, nutrition entries, water intake, and user settings persist immediately in `localStorage`.
- Pre-seeded with 6 prior days of realistic meals and hydration so the Weekly Almanac demonstrates full utility on first launch.
- Full archival export to JSON (`nutricare-journal-backup-YYYY-MM-DD.json`) and import capability.
- Factory reset utility to safely restore default demo data.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite 6
- **Styling**: Tailwind CSS + Custom Skeuomorphic CSS Design System (`src/styles/skeuomorphic.css`)
- **Sound**: Native Browser Web Audio API (`src/services/soundEffects.ts`)
- **Icons**: Lucide React
- **Celebration**: Canvas-Confetti
- **Testing**: Vitest + React Testing Library + jsdom (30 tests passing)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node v26)
- npm

### Installation
```bash
git clone <repo-url>
cd nutricare
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Automated Tests
```bash
npm test
```
Runs 30 unit and integration tests across storage, sound, UI components, and AI vision analyzer.

### Build Production Bundle
```bash
npm run build
```
Generates optimized, typesafe production assets in `dist/`.

---

## 📜 License
MIT License. Crafted with dedication to authentic tactile skeuomorphism.
