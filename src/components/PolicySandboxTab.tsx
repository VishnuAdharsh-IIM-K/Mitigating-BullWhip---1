import React from 'react';
import {
  Sliders,
  ShieldAlert,
  Info,
  Zap,
  TrendingDown,
  Activity,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { SimulationParams, SimulationResults } from '../types';

interface PolicySandboxTabProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  results: SimulationResults;
  baselineResults: SimulationResults;
  onApplyPreset: (presetId: string) => void;
}

export const PolicySandboxTab: React.FC<PolicySandboxTabProps> = ({
  params,
  setParams,
  results,
  baselineResults,
  onApplyPreset
}) => {
  const isPOUT = params.policy === 'POUT';
  const isServiceTrap = isPOUT && params.poutAlpha <= 0.4 && params.posSharingCoverage < 0.5;

  const handleParamChange = <K extends keyof SimulationParams>(key: K, value: SimulationParams[K]) => {
    setParams((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Policy Mode Switcher */}
      <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
              Core Architecture
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight mt-1">
              Supply Chain Replenishment Policy
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Switch between Hawkins' legacy quarter-end push mechanism and the Proportional Order-Up-To (POUT) damping algorithm.
            </p>
          </div>

          <div className="flex items-center bg-[#e2e6ed] p-1 rounded-lg border border-slate-300 self-stretch sm:self-auto">
            <button
              id="policy-toggle-asis"
              onClick={() => handleParamChange('policy', 'ASIS')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all ${
                !isPOUT
                  ? 'bg-white text-rose-700 border border-rose-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AS-IS (Legacy Push)
            </button>
            <button
              id="policy-toggle-pout"
              onClick={() => handleParamChange('policy', 'POUT')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-xs font-bold transition-all ${
                isPOUT
                  ? 'bg-white text-emerald-700 border border-emerald-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              POUT (Order Damping)
            </button>
          </div>
        </div>

        {/* Live Delta Summary Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-300">
          <div className="bg-[#f0f3f8] p-3 rounded-lg border border-slate-300/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Bullwhip (T2)</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className={`text-lg font-extrabold ${
                  results.bullwhipT2 > 10 ? 'text-rose-600' : results.bullwhipT2 > 5 ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {results.bullwhipT2.toFixed(2)}x
              </span>
              <span className="text-[10px] text-slate-500">vs 15.77x (AS-IS)</span>
            </div>
          </div>

          <div className="bg-[#f0f3f8] p-3 rounded-lg border border-slate-300/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Consumer Service Level</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className={`text-lg font-extrabold ${
                  results.servicePct >= 97 ? 'text-emerald-600' : results.servicePct >= 91 ? 'text-amber-600' : 'text-rose-600'
                }`}
              >
                {results.servicePct.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500">target &gt;97%</span>
            </div>
          </div>

          <div className="bg-[#f0f3f8] p-3 rounded-lg border border-slate-300/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Primary Fill Rate</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-extrabold text-slate-800">{results.primaryFillPct.toFixed(1)}%</span>
              <span className="text-[10px] text-slate-500">vs 80.0% (AS-IS)</span>
            </div>
          </div>

          <div className="bg-[#f0f3f8] p-3 rounded-lg border border-slate-300/80">
            <div className="text-[10px] uppercase font-bold text-slate-500">Pipeline Inventory Cover</div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-extrabold text-sky-600">{results.totalInventoryWeeks.toFixed(1)}w</span>
              <span className="text-[10px] text-slate-500">vs 9.3w (AS-IS)</span>
            </div>
          </div>
        </div>
      </div>

      {/* The Service Trap Warning Callout */}
      {isServiceTrap && (
        <div
          id="service-trap-warning"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-xs flex items-start gap-3.5"
        >
          <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5 border border-amber-300">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Behavioral Anomaly: The Service Trap
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold border border-amber-300">
                Service: {results.servicePct.toFixed(1)}%
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              At low damping factor (<span className="font-bold text-amber-950">&alpha; = {params.poutAlpha.toFixed(2)}</span>) without POS data sharing, order variance is heavily suppressed (Bullwhip drops to {results.bullwhipT2.toFixed(2)}x). However, because distributors only observe lagging secondary orders, inventory replenishment cannot react fast enough during seasonal festive surges (Diwali), causing retail stockouts and dropping service level to{' '}
              <span className="font-extrabold text-amber-900">{results.servicePct.toFixed(1)}%</span>.
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <button
                onClick={() => {
                  handleParamChange('posSharingCoverage', 1.0);
                  handleParamChange('poutAlpha', 0.35);
                }}
                className="text-xs px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded shadow-xs transition-colors"
              >
                Resolve with POS Sharing (pout-35-pos)
              </button>
              <button
                onClick={() => onApplyPreset('pout-60')}
                className="text-xs px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded border border-slate-300 transition-colors shadow-xs"
              >
                Switch to Balanced pout-60
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Levers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: POUT Replenishment & Damping Controls */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              POUT Damping & Replenishment Parameters
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Governs the proportional feedback loop: <span className="font-mono text-slate-700 font-semibold">Order = Forecast + &alpha; &times; (TargetStock - Position)</span>
            </p>
          </div>

          {/* Lever 1: POUT Alpha */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-pout-alpha" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                POUT Damping Factor (&alpha;)
                <span className="text-[10px] text-slate-400 font-normal">
                  ({params.poutAlpha === 1 ? 'Classical Order-Up-To' : params.poutAlpha === 0.35 ? 'Optimal Damped' : 'Custom'})
                </span>
              </label>
              <span className="text-xs font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {params.poutAlpha.toFixed(2)}
              </span>
            </div>
            <input
              id="slider-pout-alpha"
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              value={params.poutAlpha}
              onChange={(e) => handleParamChange('poutAlpha', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span onClick={() => handleParamChange('poutAlpha', 0.1)} className="cursor-pointer hover:text-slate-900">0.10 (Slow)</span>
              <span onClick={() => handleParamChange('poutAlpha', 0.35)} className="cursor-pointer font-bold text-emerald-700 hover:underline">0.35 (Target)</span>
              <span onClick={() => handleParamChange('poutAlpha', 0.60)} className="cursor-pointer font-bold text-emerald-700 hover:underline">0.60 (Balanced)</span>
              <span onClick={() => handleParamChange('poutAlpha', 1.0)} className="cursor-pointer hover:text-slate-900">1.00 (Undamped)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Fraction of inventory gap ordered per cycle. A factor of 0.35 spreads deficit correction over ~3 weeks, eliminating the whiplash effect.
            </p>
          </div>

          {/* Lever 2: POS Data Sharing Coverage */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-pos-sharing" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                POS Data Sharing Coverage
                <span className="text-[10px] text-slate-400 font-normal">
                  ({params.posSharingCoverage >= 0.8 ? 'Full Visibility' : params.posSharingCoverage === 0 ? 'No Sharing' : 'Partial'})
                </span>
              </label>
              <span className="text-xs font-bold text-sky-700 font-mono bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {Math.round(params.posSharingCoverage * 100)}%
              </span>
            </div>
            <input
              id="slider-pos-sharing"
              type="range"
              min="0.0"
              max="1.0"
              step="0.1"
              value={params.posSharingCoverage}
              onChange={(e) => handleParamChange('posSharingCoverage', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span onClick={() => handleParamChange('posSharingCoverage', 0)} className="cursor-pointer hover:text-slate-900">0% (Secondary Only)</span>
              <span onClick={() => handleParamChange('posSharingCoverage', 0.5)} className="cursor-pointer hover:text-slate-900">50% (Key Partners)</span>
              <span onClick={() => handleParamChange('posSharingCoverage', 1.0)} className="cursor-pointer font-bold text-sky-700 hover:underline">100% (National POS)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              When enabled, Hawkins depots receive telemetry directly from dealer counters rather than relying solely on distributor purchase orders.
            </p>
          </div>

          {/* Lever 3: Target Distributor Cover Weeks */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-target-cover" className="text-xs font-semibold text-slate-700">
                Target Distributor Cover Weeks
              </label>
              <span className="text-xs font-bold text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {params.targetCoverWeeks.toFixed(1)} wks
              </span>
            </div>
            <input
              id="slider-target-cover"
              type="range"
              min="1.5"
              max="6.0"
              step="0.5"
              value={params.targetCoverWeeks}
              onChange={(e) => handleParamChange('targetCoverWeeks', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span>1.5w (Lean)</span>
              <span className="text-amber-700 font-bold">3.5w (Nominal)</span>
              <span>6.0w (Excessive)</span>
            </div>
          </div>

          {/* Lever 4: Forecast Smoothing Alpha */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-forecast-alpha" className="text-xs font-semibold text-slate-700">
                Forecast Smoothing Factor (&alpha;<sub>fc</sub>)
              </label>
              <span className="text-xs font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {params.forecastSmoothingAlpha.toFixed(2)}
              </span>
            </div>
            <input
              id="slider-forecast-alpha"
              type="range"
              min="0.05"
              max="0.60"
              step="0.05"
              value={params.forecastSmoothingAlpha}
              onChange={(e) => handleParamChange('forecastSmoothingAlpha', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span>0.05 (Heavy smoothing)</span>
              <span>0.30 (Default)</span>
              <span>0.60 (Rapid response)</span>
            </div>
          </div>
        </div>

        {/* Column 2: Channel Distortions & Operational Levers */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Channel Distortions & Operational Headroom
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate or dismantle commercial practices causing the 173% quarter-end whiplash.
            </p>
          </div>

          {/* Lever 5: Quarter-End Loading Intensity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-qtr-loading" className="text-xs font-semibold text-slate-700">
                Quarter-End Push Intensity
              </label>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                  params.qtrEndLoadingIntensity > 0
                    ? 'text-rose-700 bg-rose-50 border-rose-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}
              >
                {Math.round(params.qtrEndLoadingIntensity * 100)}%
              </span>
            </div>
            <input
              id="slider-qtr-loading"
              type="range"
              min="0.0"
              max="1.5"
              step="0.1"
              value={params.qtrEndLoadingIntensity}
              onChange={(e) => handleParamChange('qtrEndLoadingIntensity', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span className="text-emerald-700 font-bold">0% (Disciplined)</span>
              <span>100% (Legacy AS-IS)</span>
              <span className="text-rose-600">150% (Extreme Push)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Commercial pressure applied in the last 2 weeks of March, June, September, and December to achieve target quotas.
            </p>
          </div>

          {/* Lever 6: Scheme Depth & Frequency */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-scheme-depth" className="text-xs font-semibold text-slate-700">
                Trade Scheme Depth & Frequency
              </label>
              <span
                className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                  params.schemeDepthFrequency > 0
                    ? 'text-amber-800 bg-amber-50 border-amber-200'
                    : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                }`}
              >
                {Math.round(params.schemeDepthFrequency * 100)}%
              </span>
            </div>
            <input
              id="slider-scheme-depth"
              type="range"
              min="0.0"
              max="1.5"
              step="0.1"
              value={params.schemeDepthFrequency}
              onChange={(e) => handleParamChange('schemeDepthFrequency', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span className="text-emerald-700 font-bold">0% (EDLP - No Schemes)</span>
              <span>100% (Historical Schemes)</span>
              <span>150% (Aggressive Discounts)</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Special festive quantity discounts (3.5% - 7.5%) that trigger massive forward-buying followed by ordering droughts.
            </p>
          </div>

          {/* Lever 7: Order Batching Strictness */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-batching" className="text-xs font-semibold text-slate-700">
                Order Batching & MOQ Rounding
              </label>
              <span className="text-xs font-bold text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {Math.round(params.orderBatchingStrictness * 100)}%
              </span>
            </div>
            <input
              id="slider-batching"
              type="range"
              min="0.0"
              max="1.0"
              step="0.2"
              value={params.orderBatchingStrictness}
              onChange={(e) => handleParamChange('orderBatchingStrictness', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span>0% (Smooth Unit Ordering)</span>
              <span>100% (Strict Case Pack / Multi-Pack)</span>
            </div>
          </div>

          {/* Lever 8: Plant Capacity Headroom */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <label htmlFor="slider-plant-capacity" className="text-xs font-semibold text-slate-700">
                Plant Capacity Surge Headroom
              </label>
              <span className="text-xs font-bold text-purple-700 font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                {params.plantCapacityHeadroom.toFixed(2)}x
              </span>
            </div>
            <input
              id="slider-plant-capacity"
              type="range"
              min="1.2"
              max="2.5"
              step="0.15"
              value={params.plantCapacityHeadroom}
              onChange={(e) => handleParamChange('plantCapacityHeadroom', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-[10px] text-slate-500 px-0.5 font-mono">
              <span>1.2x (Tight)</span>
              <span className="text-purple-700 font-bold">1.95x (Default)</span>
              <span>2.5x (Flexible)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Valve Breach Monitor */}
      <div id="safety-valve-monitor" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Safety Valve Operational Guardrails (&gt;45% Week-on-Week Shift)
            </h3>
          </div>
          <span
            className={`text-xs px-2.5 py-0.5 rounded font-bold border ${
              results.safetyValveBreaches.length === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {results.safetyValveBreaches.length === 0
              ? 'Clean Stream — No Breaches'
              : `${results.safetyValveBreaches.length} Interventions Required`}
          </span>
        </div>

        {results.safetyValveBreaches.length === 0 ? (
          <p className="text-xs text-slate-500 mt-3">
            Under this policy, all weekly primary order changes remain within normal operational variance tolerances (under 45% WoW). Factory production schedules remain stable.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <div className="text-xs text-slate-600 mb-2 font-medium">
              The following weeks exhibited destabilizing order spikes requiring manual managerial overrides or emergency transport allocations:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {results.safetyValveBreaches.slice(0, 9).map((b, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-amber-800 font-bold">Week {b.week + 1}</span>
                    <span className="text-rose-600 font-bold">+{b.value}% WoW</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 truncate">{b.reason}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Order: {b.orderQty.toLocaleString()} vs Prior: {b.prevOrderQty.toLocaleString()} units
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
