import React from 'react';
import {
  Layers,
  Activity,
  GitBranch,
  CheckCircle2,
  Sliders,
  RefreshCw,
  BarChart3,
  ArrowRightLeft,
  BookOpen,
  Download,
  Sun,
  Moon,
  TrendingUp
} from 'lucide-react';
import { CALIBRATION_TARGETS } from '../data/hawkinsConstants';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  activeTab: 'overview' | 'forecast' | 'sandbox' | 'architecture' | 'calibration';
  setActiveTab: (tab: 'overview' | 'forecast' | 'sandbox' | 'architecture' | 'calibration') => void;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  onReset: () => void;
  compareMode: boolean;
  onToggleCompare: () => void;
  onOpenManual: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activePresetId,
  onSelectPreset,
  onReset,
  compareMode,
  onToggleCompare,
  onOpenManual
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-[#f0f3f8] dark:bg-[#111827] text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md font-bold text-white text-xl tracking-wider border border-amber-400">
              H
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white">Hawkins Cookers</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  Bullwhip Simulator
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                Multi-Tier Supply Chain Simulation & Proportional Order-Up-To (POUT) Suite
              </p>
            </div>
          </div>

          {/* Preset Selector & Quick Controls */}
          <div className="hidden lg:flex items-center space-x-2.5">
            <div className="flex items-center bg-[#e2e6ed] dark:bg-[#1f2937] rounded-lg p-1 border border-slate-300 dark:border-slate-700">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Preset:
              </span>
              <select
                id="preset-selector"
                value={activePresetId}
                onChange={(e) => onSelectPreset(e.target.value)}
                className="bg-white dark:bg-[#111827] text-xs font-bold text-amber-950 dark:text-amber-300 rounded px-2.5 py-1 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
              >
                {CALIBRATION_TARGETS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.label}
                  </option>
                ))}
                <option value="custom">Custom Policy</option>
              </select>
            </div>

            <button
              id="compare-mode-toggle"
              onClick={onToggleCompare}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors shadow-2xs ${
                compareMode
                  ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-300 font-bold'
                  : 'bg-white dark:bg-[#1f2937] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-[#e8ebf0] dark:hover:bg-[#374151]'
              }`}
              title="Compare current policy against AS-IS baseline"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{compareMode ? 'Comparing vs AS-IS' : 'Compare vs AS-IS'}</span>
            </button>

            <button
              id="manual-btn-navbar"
              onClick={onOpenManual}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 transition-colors shadow-2xs border border-amber-600/30"
              title="Read or download the complete instruction manual (PDF & Interactive)"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Manual & Guide</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#1f2937] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#374151] transition-colors shadow-2xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            <button
              id="reset-simulation-btn"
              onClick={onReset}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e4e7ee] dark:hover:bg-[#1f2937] transition-colors border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
              title="Reset parameters to AS-IS baseline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-t border-slate-300 dark:border-slate-800 -mb-px overflow-x-auto scrollbar-none py-1.5">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-700 shadow-xs border-b-2 border-b-amber-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e4e7ee] dark:hover:bg-[#1f2937]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Executive Overview & Bullwhip</span>
          </button>

          <button
            id="tab-forecast"
            onClick={() => setActiveTab('forecast')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap relative ${
              activeTab === 'forecast'
                ? 'bg-white dark:bg-[#1f2937] text-amber-950 dark:text-amber-300 font-bold border border-slate-300 dark:border-slate-700 shadow-xs border-b-2 border-b-amber-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e4e7ee] dark:hover:bg-[#1f2937]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>2-Month Order Range Forecast</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider">
              Goal
            </span>
          </button>

          <button
            id="tab-sandbox"
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'sandbox'
                ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-700 shadow-xs border-b-2 border-b-amber-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e4e7ee] dark:hover:bg-[#1f2937]'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Policy Sandbox & POUT Levers</span>
          </button>

          <button
            id="tab-architecture"
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white font-bold border border-slate-300 dark:border-slate-700 shadow-xs border-b-2 border-b-amber-500'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e4e7ee] dark:hover:bg-[#1f2937]'
            }`}
          >
            <GitBranch className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>5-Tier Supply Chain & BOM</span>
          </button>

          <button
            id="tab-calibration"
            onClick={() => setActiveTab('calibration')}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'calibration'
                ? 'bg-white dark:bg-[#1f2937] text-emerald-950 dark:text-emerald-300 font-bold border border-slate-300 dark:border-slate-700 shadow-xs border-b-2 border-b-emerald-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-[#e4e7ee] dark:hover:bg-[#1f2937]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Acceptance & Calibration Engine</span>
          </button>
        </div>
      </div>
    </header>
  );
};

