/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { OverviewTab } from './components/OverviewTab';
import { PolicySandboxTab } from './components/PolicySandboxTab';
import { TiersArchitectureTab } from './components/TiersArchitectureTab';
import { CalibrationCheckTab } from './components/CalibrationCheckTab';
import { PredictiveForecastTab } from './components/PredictiveForecastTab';
import { InstructionManualModal } from './components/InstructionManualModal';
import { SimulationParams } from './types';
import { runSimulation, getPresetParams } from './engine/simulationEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'sandbox' | 'architecture' | 'calibration'>('forecast');
  const [activePresetId, setActivePresetId] = useState<string>('as-is');
  const [params, setParams] = useState<SimulationParams>(() => getPresetParams('as-is'));
  const [compareMode, setCompareMode] = useState<boolean>(true);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);

  // Baseline results (always computed using AS-IS parameters)
  const baselineResults = useMemo(() => {
    return runSimulation(getPresetParams('as-is'));
  }, []);

  // Current simulation results (computed deterministically via Mulberry32 with seed 31071959)
  const results = useMemo(() => {
    return runSimulation(params);
  }, [params]);

  // Handle Preset Switching
  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    if (presetId !== 'custom') {
      const presetParams = getPresetParams(presetId);
      setParams(presetParams);
    }
  };

  // Reset to default AS-IS preset
  const handleReset = () => {
    handleSelectPreset('as-is');
  };

  return (
    <div className="min-h-screen bg-[#eaedf2] dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white antialiased transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        compareMode={compareMode}
        onToggleCompare={() => setCompareMode((prev) => !prev)}
        onOpenManual={() => setIsManualOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'overview' && (
          <OverviewTab
            results={results}
            baselineResults={baselineResults}
            activePresetId={activePresetId}
            onSelectPreset={handleSelectPreset}
            compareMode={compareMode}
            onOpenManual={() => setIsManualOpen(true)}
            onNavigateForecast={() => setActiveTab('forecast')}
          />
        )}

        {activeTab === 'forecast' && (
          <PredictiveForecastTab
            results={results}
            baselineResults={baselineResults}
            onOpenManual={() => setIsManualOpen(true)}
          />
        )}

        {activeTab === 'sandbox' && (
          <PolicySandboxTab
            params={params}
            setParams={(updater) => {
              setActivePresetId('custom');
              setParams(updater);
            }}
            results={results}
            baselineResults={baselineResults}
            onApplyPreset={handleSelectPreset}
          />
        )}

        {activeTab === 'architecture' && <TiersArchitectureTab />}

        {activeTab === 'calibration' && <CalibrationCheckTab />}
      </main>

      {/* Interactive Instruction Manual Modal */}
      <InstructionManualModal isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      {/* Footer */}
      <footer className="bg-[#f0f3f7] dark:bg-[#111827] border-t border-slate-300 dark:border-slate-800 py-4 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Hawkins Cookers Limited</span>
            <span>&bull;</span>
            <span>Supply Chain Operations Research</span>
            <span>&bull;</span>
            <span className="font-mono text-[11px] text-amber-800 dark:text-amber-400 font-semibold">PRNG Seed: 31071959</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
            <span>12 Representative SKUs (39.8% Volume)</span>
            <span>&bull;</span>
            <span>6 Channel Partner Archetypes</span>
            <span>&bull;</span>
            <span>104 Simulation Weeks (26w Burn-in)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
