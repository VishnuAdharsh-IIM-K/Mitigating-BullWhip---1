# Hawkins Bullwhip Command Simulator

> **Interactive Multi-Tier Supply Chain Simulation & Proportional Order-Up-To (POUT) Policy Decision-Support Suite**  
> Calibrated for Hawkins Cookers Limited (Plants: Thane, Hoshiarpur, Jaunpur).

---

## Overview

This repository contains the complete interactive simulation and decision-support web application for analyzing, visualizing, and mitigating the **Bullwhip Effect** across Hawkins Cookers' 5-tier supply chain:

- **Tier 0:** Consumer Kitchens (Retail offtake with festive Diwali seasonality)
- **Tier 1:** Secondary Sales (600+ authorized retail dealer outlets)
- **Tier 2:** Primary Orders (29 national distributors across 6 archetypes — root epicenter of 15.77x AS-IS bullwhip)
- **Tier 3:** Central Depots (Buffering regional warehouses)
- **Tier 4:** Factory Production (Thane, Hoshiarpur, Jaunpur plants)

It features:
- **Deterministic 104-week simulation engine** powered by Mulberry32 PRNG (seed `31071959`).
- **Centered 13-week moving average (MA13)** seasonal detrending.
- **POUT replenishment law** with tunable proportional damping ($\alpha$) and POS data sharing.
- **Service Trap demonstration** (undamped vs. damped order policies with/without POS counter telemetry).
- **Executive-grade PDF Operations Manual generator** using `jspdf`.
- **Light & Dark mode** with responsive Tailwind CSS v4 styling.

---

## Quick Start (Run Locally)

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0.0 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### 1. Clone or Extract

If extracted from a ZIP or cloned:

```bash
git clone https://github.com/<your-username>/hawkins-bullwhip-simulator.git
cd hawkins-bullwhip-simulator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Local Development Server

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```
*(or whichever port Vite indicates in the terminal)*

### 4. Build for Production

```bash
npm run build
```

This compiles optimized static assets into the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Hosting on GitHub Pages / Vercel / Netlify

### Option A: Free Hosting on GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.
After pushing it to the `main` branch:

1. Open **Settings > Pages** in the GitHub repository.
2. Set **Build and deployment > Source** to **GitHub Actions**.
3. Push to `main`, or run **Deploy to GitHub Pages** manually from the **Actions** tab.

The published site will be available at:
`https://vishnuadharsh-iim-k.github.io/Mitigating-BullWhip---1/`

### Option B: Free Hosting on Vercel or Netlify

1. Push your repository to GitHub.
2. Log into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Import your GitHub repository.
4. Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. Your app will be live with an HTTPS domain in seconds.

---

## Project Structure

```
├── src/
│   ├── components/            # UI workspace views, charts, and modal
│   │   ├── Navbar.tsx         # Navigation, preset switcher, theme toggle
│   │   ├── OverviewTab.tsx    # Executive dashboard & KPI cards
│   │   ├── PolicySandboxTab.tsx # Interactive POUT parameter tuning
│   │   ├── TiersArchitectureTab.tsx # 5-tier pipeline & BOM visualizer
│   │   ├── CalibrationCheckTab.tsx # 6-preset automated acceptance test
│   │   └── InstructionManualModal.tsx # Interactive manual & PDF export
│   ├── context/
│   │   └── ThemeContext.tsx   # Light/dark mode state with localStorage
│   ├── data/
│   │   ├── hawkinsConstants.ts # Calibration targets & BOM dataset
│   │   └── instructionManual.ts # Operations manual markdown source
│   ├── engine/
│   │   └── simulationEngine.ts # 104-week deterministic Monte Carlo engine
│   ├── utils/
│   │   └── pdfGenerator.ts    # Executive-grade A4 PDF generator (jsPDF)
│   ├── App.tsx                # Main application component
│   ├── index.css              # Global Tailwind CSS v4 styling
│   ├── main.tsx               # Application entry point & ThemeProvider
│   └── types.ts               # Shared TypeScript definitions
├── index.html                 # HTML entry point with metadata
├── package.json               # Dependencies and build scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite configuration with Tailwind CSS plugin
```

---

## License & Attribution

Designed for operational research and policy simulation. Calibrated to empirical benchmarks for **Hawkins Cookers Limited**.
