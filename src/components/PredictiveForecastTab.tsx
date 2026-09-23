import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  BarChart3,
  Sliders,
  DollarSign,
  Download,
  Info,
  ChevronRight,
  RefreshCw,
  Flame,
  Clock,
  Warehouse,
  Factory,
  ShoppingCart
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { SimulationResults } from '../types';
import { generateTwoMonthPredictiveForecast, ForecastOptions } from '../engine/predictiveForecaster';
import { SKUS } from '../data/hawkinsConstants';

interface PredictiveForecastTabProps {
  results: SimulationResults;
  baselineResults: SimulationResults;
  onOpenManual?: () => void;
}

export const PredictiveForecastTab: React.FC<PredictiveForecastTabProps> = ({
  results,
  baselineResults,
  onOpenManual
}) => {
  // Configurable Forecast Controls
  const [originMode, setOriginMode] = useState<'historical_end' | 'diwali_peak' | 'custom'>('historical_end');
  const [customOriginWeek, setCustomOriginWeek] = useState<number>(103);
  const [horizonWeeks, setHorizonWeeks] = useState<number>(8);
  const [policyAlpha, setPolicyAlpha] = useState<number>(0.35);
  const [posSharingPct, setPosSharingPct] = useState<number>(100);
  const [mitigateQuarterEnd, setMitigateQuarterEnd] = useState<boolean>(true);
  const [activeTierView, setActiveTierView] = useState<'t2_primary' | 'all_tiers' | 'production_t4'>('t2_primary');
  const [selectedSku, setSelectedSku] = useState<string>('ALL');

  // Compute effective origin week based on mode
  const effectiveOriginWeek = useMemo(() => {
    if (originMode === 'historical_end') return 103; // End of 104-week simulation
    if (originMode === 'diwali_peak') return 14; // Approaching Diwali festive surge (weeks 15-18)
    return customOriginWeek;
  }, [originMode, customOriginWeek]);

  // Generate 2-month forward predictive forecast
  const forecast = useMemo(() => {
    return generateTwoMonthPredictiveForecast(results, {
      originWeek: effectiveOriginWeek,
      horizonWeeks,
      policyDampingAlpha: policyAlpha,
      posSharingPct,
      quarterEndPushMitigation: mitigateQuarterEnd
    });
  }, [results, effectiveOriginWeek, horizonWeeks, policyAlpha, posSharingPct, mitigateQuarterEnd]);

  // Chart data formatting
  const chartData = useMemo(() => {
    return forecast.weeklyPoints.map((pt, idx) => {
      return {
        label: `Wk ${idx + 1} (${pt.dateStart.slice(5)})`,
        dateStart: pt.dateStart,
        weekNum: idx + 1,
        isQuarterEnd: pt.isQuarterEnd,
        isFestivePeak: pt.isFestivePeak,

        // Consumer Offtake T0
        consumerExpected: pt.t0Expected,
        consumerP10: pt.t0P10,
        consumerP90: pt.t0P90,

        // Secondary Dealer T1
        dealerDemand: pt.t1Expected,

        // Primary Orders T2 AS-IS (Legacy Whiplash)
        asIsExpected: pt.t2AsIsExpected,
        asIsP10: pt.t2AsIsP10,
        asIsP90: pt.t2AsIsP90,
        asIsRangeBand: [pt.t2AsIsP10, pt.t2AsIsP90],

        // Primary Orders T2 Mitigated (POUT + POS)
        mitigatedExpected: pt.t2MitigatedExpected,
        mitigatedP10: pt.t2MitigatedP10,
        mitigatedP90: pt.t2MitigatedP90,
        mitigatedRangeBand: [pt.t2MitigatedP10, pt.t2MitigatedP90],

        // Factory Assembly T4
        factoryAsIs: pt.t4AsIsPlanned,
        factoryMitigated: pt.t4MitigatedPlanned,

        // Savings
        whiplashUnitsDiff: pt.whiplashUnitsDiff
      };
    });
  }, [forecast]);

  // Filtered SKU list or single SKU breakdown
  const displaySkus = useMemo(() => {
    if (selectedSku === 'ALL') return forecast.skuBreakdown;
    return forecast.skuBreakdown.filter(s => s.skuCode === selectedSku);
  }, [forecast, selectedSku]);

  // Export CSV summary
  const handleExportCSV = () => {
    const headers = [
      'Week',
      'Start Date',
      'End Date',
      'Month',
      'Is Quarter-End',
      'Consumer Expected (T0)',
      'Dealer Expected (T1)',
      'AS-IS Primary Expected (T2)',
      'AS-IS Range Low (P10)',
      'AS-IS Range High (P90)',
      'POUT Mitigated Expected (T2)',
      'Mitigated Range Low (P10)',
      'Mitigated Range High (P90)',
      'Factory Mitigated Dispatch (T4)',
      'Surge Order Diff (Units)',
      'Working Capital Saved (INR)'
    ];

    const rows = forecast.weeklyPoints.map((pt, i) => [
      `Week ${i + 1}`,
      pt.dateStart,
      pt.dateEnd,
      pt.monthName,
      pt.isQuarterEnd ? 'YES' : 'NO',
      pt.t0Expected,
      pt.t1Expected,
      pt.t2AsIsExpected,
      pt.t2AsIsP10,
      pt.t2AsIsP90,
      pt.t2MitigatedExpected,
      pt.t2MitigatedP10,
      pt.t2MitigatedP90,
      pt.t4MitigatedPlanned,
      pt.whiplashUnitsDiff,
      pt.workingCapitalExposureDiffINR
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Hawkins_2Month_Predictive_Order_Forecast_W${forecast.forecastOriginWeek}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner: Ultimate Goal & Predictive Range Mission */}
      <div className="rounded-2xl border border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-500/10 via-white dark:via-[#161f30] to-amber-500/5 p-5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start space-x-3.5">
            <div className="p-3 bg-amber-500 text-slate-950 rounded-xl shadow-md shrink-0 mt-0.5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700">
                  Forward Decision-Support
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  2-Month Predictive Order Range & Dispatch Forecast
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                  {forecast.horizonWeeks} Weeks (~2 Calendar Months)
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Projected order ranges based on 104-week historical state, centered MA13 festive detrending,
                negative-binomial consumer dispersion, and POUT proportional order damping principles.
                Compare legacy whiplash against stabilized distributor dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#1f2937] hover:bg-slate-50 dark:hover:bg-[#374151] text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg shadow-2xs transition-colors"
              title="Export 2-month weekly forecast breakdown as CSV"
            >
              <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Export CSV Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Strip: Forecast Origin & Policy Levers */}
      <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Forecast Horizon & Mitigation Parameters
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Current Origin: <span className="font-semibold text-slate-800 dark:text-slate-200">{forecast.forecastOriginDate}</span> &rarr; Horizon through: <span className="font-semibold text-slate-800 dark:text-slate-200">{forecast.horizonEndDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* 1. Time Horizon Origin */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Forecast Origin</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <select
              value={originMode}
              onChange={(e) => setOriginMode(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="historical_end">Historical End (Jul–Aug 2026)</option>
              <option value="diwali_peak">Diwali Peak Scenario (Oct–Nov)</option>
              <option value="custom">Custom Simulation Week</option>
            </select>
          </div>

          {/* 2. Horizon Length */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Horizon Length</span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <select
              value={horizonWeeks}
              onChange={(e) => setHorizonWeeks(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg p-2 font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value={8}>8 Weeks (Standard 2 Months)</option>
              <option value={9}>9 Weeks (Extended 2 Months)</option>
              <option value={6}>6 Weeks (Short Horizon)</option>
            </select>
          </div>

          {/* 3. POUT Damping Alpha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>POUT Damping (&alpha;)</span>
              <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">{policyAlpha.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              value={policyAlpha}
              onChange={(e) => setPolicyAlpha(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.10 (Heavy)</span>
              <span className="font-bold text-emerald-600">0.35 (Optimal)</span>
              <span>1.00 (Undamped)</span>
            </div>
          </div>

          {/* 4. POS Counter Visibility */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300">
              <span>POS Data Sharing</span>
              <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{posSharingPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={posSharingPct}
              onChange={(e) => setPosSharingPct(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Blind)</span>
              <span className="text-amber-600 font-semibold">50%</span>
              <span className="font-bold text-emerald-600">100% (Live)</span>
            </div>
          </div>

          {/* 5. Quarter-End Policy Mode */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Quarter-End Push</label>
            <div className="flex items-center h-9">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={mitigateQuarterEnd}
                  onChange={(e) => setMitigateQuarterEnd(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                <span className="ml-2.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {mitigateQuarterEnd ? 'Smooth (+173% Eliminated)' : 'Legacy +173% Push'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {originMode === 'custom' && (
          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="text-slate-600 dark:text-slate-400">Select Simulation Origin Week (0 to 103):</span>
            <input
              type="number"
              min="0"
              max="103"
              value={customOriginWeek}
              onChange={(e) => setCustomOriginWeek(Math.max(0, Math.min(103, parseInt(e.target.value) || 0)))}
              className="w-20 bg-slate-50 dark:bg-[#111827] border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-slate-900 dark:text-white font-bold"
            />
          </div>
        )}
      </div>

      {/* KPI Cards: The 2-Month Predicted Operational Impact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 2-Month Predicted Demand vs Dispatch */}
        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total 2-Month Primary Orders
            </span>
            <div className="p-1.5 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-md border border-amber-200 dark:border-amber-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {forecast.totalMitigatedPredictedUnits.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">units</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            vs AS-IS push: <span className="font-bold text-slate-700 dark:text-slate-300">{forecast.totalAsIsPredictedUnits.toLocaleString()} units</span>
          </div>
        </div>

        {/* Card 2: Peak Week Surge Reduction */}
        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Peak Week Surge Stabilization
            </span>
            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {forecast.peakWhiplashSurgeReductionPct > 0 ? `-${forecast.peakWhiplashSurgeReductionPct}%` : 'Levelized'}
            </span>
            <span className="text-xs text-slate-500">peak spike cut</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Peak week: <span className="font-semibold text-emerald-700 dark:text-emerald-300">{forecast.peakMitigatedWeekOrder.toLocaleString()}</span> vs AS-IS <span className="text-rose-600 dark:text-rose-400 font-semibold">{forecast.peakAsIsWeekOrder.toLocaleString()}</span>
          </div>
        </div>

        {/* Card 3: Working Capital Exposure Saved */}
        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Working Capital Stabilized
            </span>
            <div className="p-1.5 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 rounded-md border border-sky-200 dark:border-sky-800">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700 dark:text-sky-400">
              ₹{(forecast.estimatedWorkingCapitalSavedINR / 10000000).toFixed(2)} Cr
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Excess inventory buffer prevented in distributor pipeline
          </div>
        </div>

        {/* Card 4: Service Level Reliability */}
        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Predicted Service Reliability
            </span>
            <div
              className={`p-1.5 rounded-md border ${
                forecast.serviceRiskLevel === 'OPTIMAL'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              {forecast.serviceRiskLevel === 'OPTIMAL' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-extrabold ${
                forecast.serviceRiskLevel === 'OPTIMAL' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {forecast.serviceReliabilityPct}%
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              [{forecast.serviceRiskLevel}]
            </span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            {forecast.serviceRiskLevel === 'HIGH'
              ? 'Warning: Service Trap active (damped without POS)'
              : 'Zero stockout risk with POS telemetry'}
          </div>
        </div>
      </div>

      {/* Main Predictive Chart Section */}
      <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              2-Month Forward Order Range & Multi-Echelon Dispatch Trajectory
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Shaded bands represent 80% empirical prediction intervals (P10 to P90). Red dashed curves illustrate unmitigated whiplash.
            </p>
          </div>

          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 dark:bg-[#111827] p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveTierView('t2_primary')}
              className={`px-3 py-1 rounded font-semibold transition-all ${
                activeTierView === 't2_primary'
                  ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Primary Orders (T2 Range)
            </button>
            <button
              onClick={() => setActiveTierView('all_tiers')}
              className={`px-3 py-1 rounded font-semibold transition-all ${
                activeTierView === 'all_tiers'
                  ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Tiers (T0 to T4)
            </button>
            <button
              onClick={() => setActiveTierView('production_t4')}
              className={`px-3 py-1 rounded font-semibold transition-all ${
                activeTierView === 'production_t4'
                  ? 'bg-white dark:bg-[#1f2937] text-slate-900 dark:text-white shadow-2xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Factory Assembly Plan
            </button>
          </div>
        </div>

        {/* Recharts Visualizer */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickMargin={8}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-2 border border-slate-700 max-w-xs">
                      <div className="font-bold border-b border-slate-700 pb-1 flex items-center justify-between">
                        <span>{label}</span>
                        {data.isQuarterEnd && (
                          <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800">
                            Quarter-End Week
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-slate-300">
                          <span>Consumer Offtake (T0):</span>
                          <span className="font-bold text-sky-400">{data.consumerExpected.toLocaleString()} u</span>
                        </div>
                        <div className="flex justify-between text-slate-300">
                          <span>POUT Mitigated Order (T2):</span>
                          <span className="font-bold text-emerald-400">{data.mitigatedExpected.toLocaleString()} u</span>
                        </div>
                        <div className="text-[10px] text-emerald-300/80 pl-2">
                          Range: [{data.mitigatedP10.toLocaleString()} – {data.mitigatedP90.toLocaleString()}]
                        </div>
                        <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                          <span>AS-IS Whiplash Order (T2):</span>
                          <span className="font-bold text-rose-400">{data.asIsExpected.toLocaleString()} u</span>
                        </div>
                        <div className="text-[10px] text-rose-300/80 pl-2">
                          Range: [{data.asIsP10.toLocaleString()} – {data.asIsP90.toLocaleString()}]
                        </div>
                        <div className="flex justify-between text-amber-300 pt-1 border-t border-slate-800 font-semibold">
                          <span>Factory Recommended (T4):</span>
                          <span>{data.factoryMitigated.toLocaleString()} u</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Shaded P10 to P90 range band for POUT Mitigated */}
              <Area
                type="monotone"
                dataKey="mitigatedP90"
                stroke="none"
                fill="#10b981"
                fillOpacity={0.15}
                name="POUT Range Band (P10–P90)"
              />
              <Area
                type="monotone"
                dataKey="mitigatedP10"
                stroke="none"
                fill="#ffffff"
                fillOpacity={0.0}
              />

              {/* Consumer Offtake Baseline */}
              <Line
                type="monotone"
                dataKey="consumerExpected"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Consumer Offtake (T0 Baseline)"
              />

              {/* AS-IS Primary Whiplash Spike */}
              {(activeTierView === 't2_primary' || activeTierView === 'all_tiers') && (
                <Line
                  type="monotone"
                  dataKey="asIsExpected"
                  stroke="#e11d48"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#e11d48' }}
                  name="AS-IS Whiplash Primary (T2)"
                />
              )}

              {/* Mitigated POUT Primary Orders */}
              {(activeTierView === 't2_primary' || activeTierView === 'all_tiers') && (
                <Line
                  type="monotone"
                  dataKey="mitigatedExpected"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                  name="POUT Stabilized Primary (T2)"
                />
              )}

              {/* Secondary Retail Demand */}
              {activeTierView === 'all_tiers' && (
                <Line
                  type="monotone"
                  dataKey="dealerDemand"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  dot={false}
                  name="Secondary Retail Orders (T1)"
                />
              )}

              {/* Factory Assembly Dispatch */}
              {activeTierView === 'production_t4' && (
                <>
                  <Bar
                    dataKey="factoryMitigated"
                    fill="#3b82f6"
                    opacity={0.8}
                    radius={[4, 4, 0, 0]}
                    name="Stabilized Factory Assembly (T4)"
                  />
                  <Line
                    type="monotone"
                    dataKey="factoryAsIs"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    name="AS-IS Factory Assembly"
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Visual Callout Bar */}
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 text-amber-900 dark:text-amber-300 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Operational Takeaway:</strong> Notice how the POUT damped order trajectory (green) eliminates the severe quarter-end artificial spike without starving retail dealer counters.
            </span>
          </div>
          {onOpenManual && (
            <button
              onClick={onOpenManual}
              className="text-amber-800 dark:text-amber-300 underline font-bold shrink-0 hover:text-amber-900"
            >
              Read POUT Law & Damping Math &rarr;
            </button>
          )}
        </div>
      </div>

      {/* SKU-Level 2-Month Predicted Order Range Table */}
      <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              SKU-Level 2-Month Dispatch Forecast & Predicted Order Ranges
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              12 representative national SKUs covering 39.8% volume across Thane, Hoshiarpur, and Jaunpur plants.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500">Filter SKU:</span>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="bg-slate-50 dark:bg-[#111827] text-slate-900 dark:text-slate-100 text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-1.5 font-bold"
            >
              <option value="ALL">All 12 Representative SKUs</option>
              {SKUS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code}: {s.name} ({s.plant})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                <th className="py-2.5 px-3">SKU & Plant</th>
                <th className="py-2.5 px-3">MRP / D.Price</th>
                <th className="py-2.5 px-3 text-right">2-Mo Consumer Demand (T0)</th>
                <th className="py-2.5 px-3 text-right">AS-IS Whiplash Range [P10–P90]</th>
                <th className="py-2.5 px-3 text-right bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-300">
                  POUT Mitigated Range [P10–P90]
                </th>
                <th className="py-2.5 px-3 text-right">Rec. Weekly Batch</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono-numbers">
              {displaySkus.map((sku) => {
                const mitMid = (sku.twoMonthMitigatedPrimaryRange[0] + sku.twoMonthMitigatedPrimaryRange[1]) / 2;
                return (
                  <tr key={sku.skuCode} className="hover:bg-slate-50 dark:hover:bg-[#1a2438] transition-colors">
                    <td className="py-2.5 px-3 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white">{sku.skuCode} - {sku.skuName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Plant: {sku.plant}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">₹{sku.mrpINR.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">₹{sku.distributorPriceINR.toLocaleString()}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-sky-700 dark:text-sky-400">
                      {sku.twoMonthExpectedConsumerUnits.toLocaleString()} u
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600 dark:text-rose-400">
                      [{sku.twoMonthAsIsPrimaryRange[0].toLocaleString()} – {sku.twoMonthAsIsPrimaryRange[1].toLocaleString()}] u
                    </td>
                    <td className="py-2.5 px-3 text-right bg-emerald-50/50 dark:bg-emerald-950/20 font-bold text-emerald-700 dark:text-emerald-400">
                      [{sku.twoMonthMitigatedPrimaryRange[0].toLocaleString()} – {sku.twoMonthMitigatedPrimaryRange[1].toLocaleString()}] u
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900 dark:text-slate-100 font-semibold">
                      {sku.mitigatedRecommendedWeeklyLot.toLocaleString()} u/wk
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Stabilized
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Echelon Order-Up-To Implementation Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase mb-2">
            <Warehouse className="w-4 h-4 text-amber-600" />
            <span>1. Distributor Tier ($T_2$)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Apply POUT replenishment ($\alpha = 0.35$). Maintain target cover of <strong>2.6 weeks</strong> based on live POS sales velocity rather than invoice history.
          </p>
        </div>

        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase mb-2">
            <Layers className="w-4 h-4 text-sky-600" />
            <span>2. Central Depot Tier ($T_3$)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Set safety stock at <strong>1.8x consumer weekly offtake</strong>. Eliminate artificial trade discount volume-tiering in the final week of the quarter.
          </p>
        </div>

        <div className="bg-white dark:bg-[#161f30] border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 dark:text-white uppercase mb-2">
            <Factory className="w-4 h-4 text-emerald-600" />
            <span>3. Plant Assembly Tier ($T_4$)</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Level master production schedules to <strong>{Math.round(forecast.totalMitigatedPredictedUnits / forecast.horizonWeeks).toLocaleString()} units/week</strong> across Thane, Hoshiarpur, and Jaunpur.
          </p>
        </div>
      </div>
    </div>
  );
};
