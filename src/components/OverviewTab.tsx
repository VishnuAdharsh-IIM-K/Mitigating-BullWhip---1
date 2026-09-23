import React, { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Package,
  Layers,
  Flame,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Calendar,
  Eye,
  EyeOff,
  BookOpen,
  Download,
  Boxes,
  Percent,
  Warehouse,
  ShieldAlert,
  Sliders,
  FileDown
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { SimulationResults } from '../types';
import { CALIBRATION_TARGETS } from '../data/hawkinsConstants';
import { INSTRUCTION_MANUAL_MARKDOWN } from '../data/instructionManual';
import { generateManualPDF } from '../utils/pdfGenerator';

interface OverviewTabProps {
  results: SimulationResults;
  baselineResults: SimulationResults;
  activePresetId: string;
  onSelectPreset: (presetId: string) => void;
  compareMode: boolean;
  onOpenManual?: () => void;
  onNavigateForecast?: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  results,
  baselineResults,
  activePresetId,
  onSelectPreset,
  compareMode,
  onOpenManual,
  onNavigateForecast
}) => {
  // Multi-tier order chart visibility toggles
  const [showT0, setShowT0] = useState(true);
  const [showT1, setShowT1] = useState(false);
  const [showT2, setShowT2] = useState(true);
  const [showT3, setShowT3] = useState(false);
  const [showT4, setShowT4] = useState(true);
  const [showQuarterMarkers, setShowQuarterMarkers] = useState(true);

  // Inventory comparison chart toggles & modes
  const [inventoryViewMode, setInventoryViewMode] = useState<'units' | 'weeks'>('units');
  const [showTotalInventory, setShowTotalInventory] = useState(true);
  const [showDistStock, setShowDistStock] = useState(true);
  const [showDepotStock, setShowDepotStock] = useState(false);
  const [showPlantStock, setShowPlantStock] = useState(false);

  // Download manual helper (Generates executive-grade multi-page PDF)
  const handleDownloadManual = () => {
    try {
      generateManualPDF();
    } catch (err) {
      console.error('Error generating PDF manual:', err);
    }
  };

  // Smoking gun numbers
  const qtrPrimaryUplift = results.quarterEndVsNormal.primaryQtrEndUpliftPct;
  const qtrConsumerUplift = results.quarterEndVsNormal.consumerQtrEndUpliftPct;

  // Bullwhip improvement vs baseline
  const bwDeltaPct =
    baselineResults.bullwhipT2 > 0
      ? ((results.bullwhipT2 - baselineResults.bullwhipT2) / baselineResults.bullwhipT2) * 100
      : 0;

  // Average weekly consumer offtake across 104 weeks for cover calculation
  const avgWeeklyOfftake =
    results.weeklySeries.reduce((sum, w) => sum + w.t0Consumer, 0) / (results.weeklySeries.length || 1);

  // Clean Milestone weeks for Quarter Ends (single clean tick per quarter):
  // W13 (Q1), W26 (Q2), W39 (Q3), W52 (FY25 Close), W65 (Q5), W78 (Q6), W91 (Q7), W104 (FY26 Close)
  const quarterMilestones = [
    { week: 13, label: 'Q1 End', isFY: false },
    { week: 26, label: 'Q2 End', isFY: false },
    { week: 39, label: 'Q3 End', isFY: false },
    { week: 52, label: 'FY25 Close', isFY: true },
    { week: 65, label: 'Q5 End', isFY: false },
    { week: 78, label: 'Q6 End', isFY: false },
    { week: 91, label: 'Q7 End', isFY: false },
    { week: 104, label: 'FY26 Close', isFY: true }
  ];

  // Multi-tier order chart data format
  const chartData = results.weeklySeries.map((w, idx) => {
    const baseW = baselineResults.weeklySeries[idx];
    return {
      week: `W${w.week + 1}`,
      weekNum: w.week + 1,
      weekStart: w.weekStart,
      t0Consumer: w.t0Consumer,
      t1Secondary: w.t1Secondary,
      t2Primary: w.t2Primary,
      t3Depot: w.t3Depot,
      t4Production: w.t4Production,
      baseT2Primary: baseW ? baseW.t2Primary : 0,
      isQuarterEnd: w.isQuarterEnd,
      isFiscalYearEnd: w.isFiscalYearEnd,
      schemeActive: w.schemeActive,
      schemeType: w.schemeType
    };
  });

  // Pipeline Inventory comparison chart data
  const inventoryChartData = results.weeklySeries.map((w, idx) => {
    const baseW = baselineResults.weeklySeries[idx] || w;

    const currentTotal = w.distributorStock + w.depotStock + w.plantFGStock;
    const baseTotal = baseW.distributorStock + baseW.depotStock + baseW.plantFGStock;

    const currentTotalWeeks = avgWeeklyOfftake > 0 ? currentTotal / avgWeeklyOfftake : 0;
    const baseTotalWeeks = avgWeeklyOfftake > 0 ? baseTotal / avgWeeklyOfftake : 0;

    const currentDistWeeks = avgWeeklyOfftake > 0 ? w.distributorStock / avgWeeklyOfftake : 0;
    const baseDistWeeks = avgWeeklyOfftake > 0 ? baseW.distributorStock / avgWeeklyOfftake : 0;

    const currentDepotWeeks = avgWeeklyOfftake > 0 ? w.depotStock / avgWeeklyOfftake : 0;
    const baseDepotWeeks = avgWeeklyOfftake > 0 ? baseW.depotStock / avgWeeklyOfftake : 0;

    const currentPlantWeeks = avgWeeklyOfftake > 0 ? w.plantFGStock / avgWeeklyOfftake : 0;
    const basePlantWeeks = avgWeeklyOfftake > 0 ? baseW.plantFGStock / avgWeeklyOfftake : 0;

    return {
      week: `W${w.week + 1}`,
      weekNum: w.week + 1,
      weekStart: w.weekStart,
      // Units
      currentTotalStock: currentTotal,
      baseTotalStock: baseTotal,
      currentDistStock: w.distributorStock,
      baseDistStock: baseW.distributorStock,
      currentDepotStock: w.depotStock,
      baseDepotStock: baseW.depotStock,
      currentPlantStock: w.plantFGStock,
      basePlantStock: baseW.plantFGStock,
      // Weeks of Cover
      currentTotalWeeks: parseFloat(currentTotalWeeks.toFixed(2)),
      baseTotalWeeks: parseFloat(baseTotalWeeks.toFixed(2)),
      currentDistWeeks: parseFloat(currentDistWeeks.toFixed(2)),
      baseDistWeeks: parseFloat(baseDistWeeks.toFixed(2)),
      currentDepotWeeks: parseFloat(currentDepotWeeks.toFixed(2)),
      baseDepotWeeks: parseFloat(baseDepotWeeks.toFixed(2)),
      currentPlantWeeks: parseFloat(currentPlantWeeks.toFixed(2)),
      basePlantWeeks: parseFloat(basePlantWeeks.toFixed(2)),
      diffTotalUnits: currentTotal - baseTotal,
      diffTotalPct: baseTotal > 0 ? ((currentTotal - baseTotal) / baseTotal) * 100 : 0
    };
  });

  // Calculate summary stats for inventory cards
  const avgCurrentInventoryUnits = Math.round(
    inventoryChartData.reduce((sum, item) => sum + item.currentTotalStock, 0) / (inventoryChartData.length || 1)
  );
  const avgBaselineInventoryUnits = Math.round(
    inventoryChartData.reduce((sum, item) => sum + item.baseTotalStock, 0) / (inventoryChartData.length || 1)
  );
  const inventoryDeltaUnits = avgCurrentInventoryUnits - avgBaselineInventoryUnits;
  const inventoryDeltaPct =
    avgBaselineInventoryUnits > 0 ? (inventoryDeltaUnits / avgBaselineInventoryUnits) * 100 : 0;

  // Approximate working capital released (estimated at ₹1,900 avg distributor price per unit)
  const workingCapitalCrores = (Math.abs(inventoryDeltaUnits) * 1900) / 10000000;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Smoking Gun Disconnect Banner (Light Theme) */}
      <div
        id="smoking-gun-banner"
        className="rounded-xl border border-amber-300 bg-gradient-to-r from-amber-50/90 via-white to-amber-50/70 p-5 shadow-xs relative overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl border border-amber-300/80 mt-0.5 shrink-0">
              <Flame className="w-6 h-6 animate-pulse text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Empirical Finding
                </span>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  The Quarter-End Disconnect: The Root Cause of Hawkins' Bullwhip
                </h2>
              </div>
              <p className="text-xs text-slate-700 mt-1 max-w-3xl leading-relaxed">
                In the closing weeks of each fiscal quarter, distributor primary orders surge by{' '}
                <span className="font-bold text-amber-700">
                  {qtrPrimaryUplift > 0 ? `+${qtrPrimaryUplift}%` : `${qtrPrimaryUplift}%`}
                </span>{' '}
                above normal, while genuine consumer kitchen offtake moves by only{' '}
                <span className="font-bold text-sky-700">{qtrConsumerUplift}%</span>. This artificial volume push is
                followed by post-quarter demand slumps, creating a massive 15.77x primary order bullwhip ratio ($T_2$).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl p-3 self-stretch md:self-auto shrink-0 justify-around shadow-xs">
            <div className="text-center px-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Qtr-End Primary</div>
              <div className="text-lg font-extrabold text-amber-600">
                {results.quarterEndVsNormal.qtrEndAvgPrimary.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> u/wk</span>
              </div>
              <div className="text-[11px] text-amber-700 font-semibold">+{qtrPrimaryUplift}% vs normal</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Qtr-End Consumer</div>
              <div className="text-lg font-extrabold text-sky-600">
                {results.quarterEndVsNormal.qtrEndAvgConsumer.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> u/wk</span>
              </div>
              <div className="text-[11px] text-sky-700 font-semibold">{qtrConsumerUplift}% vs normal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction Manual Download & Guide Callout Strip */}
      <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">Hawkins Bullwhip Command Operations Manual</h3>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-200/80 text-slate-700 rounded font-semibold border border-slate-300">
                Official PDF & Interactive Reader
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Complete documentation on the 104-week simulation engine, POUT damping laws, the Service Trap anomaly, and how to read the visualizer.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onNavigateForecast && (
            <button
              onClick={onNavigateForecast}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg border border-amber-300 transition-colors shadow-2xs"
            >
              <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
              <span>View 2-Month Forecast</span>
            </button>
          )}

          {onOpenManual && (
            <button
              id="open-manual-btn-overview"
              onClick={onOpenManual}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Read Guide Online</span>
            </button>
          )}

          <button
            id="download-manual-btn-overview"
            onClick={handleDownloadManual}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-lg shadow-2xs transition-colors border border-amber-600/30"
            title="Download formatted instruction manual as a PDF document"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Manual (PDF)</span>
          </button>
        </div>
      </div>

      {/* Preset Fast Switcher (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
        <div className="text-xs font-bold text-slate-700 mb-2 px-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-600" />
            Select Verified Calibration Preset:
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            All 6 presets land within ±15% of empirical benchmarks
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {CALIBRATION_TARGETS.map((t) => {
            const isSelected = activePresetId === t.id;
            return (
              <button
                key={t.id}
                id={`preset-btn-${t.id}`}
                onClick={() => onSelectPreset(t.id)}
                className={`text-left p-2.5 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-amber-50/80 border-amber-400 shadow-sm ring-1 ring-amber-400 text-slate-900'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-amber-900' : 'text-slate-800'}`}>
                    {t.id}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      t.policy === 'ASIS'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {t.policy}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">{t.label}</div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px]">
                  <span className="text-slate-500">BW T2:</span>
                  <span className={`font-bold ${t.bullwhipT2 > 10 ? 'text-rose-600' : 'text-emerald-700'}`}>
                    {t.bullwhipT2.toFixed(2)}x
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">Service:</span>
                  <span className={`font-bold ${t.servicePct < 92 ? 'text-amber-700' : 'text-slate-800'}`}>
                    {t.servicePct.toFixed(1)}%
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main KPI Cards Grid (Light Theme) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Bullwhip Ratio */}
        <div id="kpi-card-bullwhip" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Primary Bullwhip Ratio (T2)
            </span>
            <div
              className={`p-1.5 rounded-md ${
                results.bullwhipT2 > 10
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : results.bullwhipT2 > 5
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                results.bullwhipT2 > 10
                  ? 'text-rose-600'
                  : results.bullwhipT2 > 5
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {results.bullwhipT2.toFixed(2)}x
            </span>
            {compareMode && (
              <span
                className={`text-xs font-semibold flex items-center ${
                  bwDeltaPct < 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {bwDeltaPct < 0 ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                {Math.abs(bwDeltaPct).toFixed(1)}% vs AS-IS
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-snug">
            Variance of detrended T2 Primary Orders divided by variance of detrended T0 Consumer Offtake.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>CV Ratio (T2 / T0):</span>
            <span className="font-bold text-slate-900">{results.cvRatioT2}x</span>
          </div>
        </div>

        {/* Card 2: Consumer Service Level */}
        <div id="kpi-card-service" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Consumer Service Level</span>
            <div
              className={`p-1.5 rounded-md ${
                results.servicePct >= 97
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : results.servicePct >= 90
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-rose-50 text-rose-600 border border-rose-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold tracking-tight ${
                results.servicePct >= 97
                  ? 'text-emerald-600'
                  : results.servicePct >= 90
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {results.servicePct.toFixed(1)}%
            </span>
            {results.params.poutAlpha === 0.35 && results.params.posSharingCoverage === 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold border border-amber-300">
                Service Trap
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-snug">
            Percentage of consumer kitchen offtake fulfilled without retail stockouts across 104 weeks.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Primary Fill Rate:</span>
            <span className="font-bold text-slate-900">{results.primaryFillPct.toFixed(1)}%</span>
          </div>
        </div>

        {/* Card 3: Total Inventory Cover */}
        <div id="kpi-card-inventory" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pipeline Inventory Cover</span>
            <div className="p-1.5 rounded-md bg-sky-50 text-sky-600 border border-sky-200">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-sky-600">
              {results.totalInventoryWeeks.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-semibold">weeks cover</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-snug">
            Combined stock holding across Distributor, Depot, and Plant Finished Goods tiers.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Distributor: {results.distributorCoverWks}w</span>
            <span>Depot: {results.depotCoverWks}w</span>
            <span>Plant: {results.plantFGCoverWks}w</span>
          </div>
        </div>

        {/* Card 4: Multi-Tier Volatility (CV T4 Plant) */}
        <div id="kpi-card-production-cv" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Plant Production Volatility</span>
            <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-200">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-purple-600">
              {results.bullwhipT4.toFixed(2)}x
            </span>
            <span className="text-xs text-slate-500 font-semibold">BW T4</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-snug">
            Production campaign variance at Thane & Hoshiarpur plants, driven by depot replenishment lag.
          </p>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Safety Valve Breaches:</span>
            <span
              className={`font-bold ${
                results.safetyValveBreaches.length > 0 ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {results.safetyValveBreaches.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Chart 1: 104-Week Multi-Tier Order Series & Quarter-End Loading Spikes (OPTIMIZED X-AXIS LABELS) */}
      <div id="simulation-chart-container" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              104-Week Multi-Tier Order Series & Quarter-End Loading Spikes
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Weekly demand transmission through distributor, depot, and factory tiers. Quarter milestones are marked at top.
            </p>
          </div>

          {/* Tier Visibility Toggles */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setShowT0(!showT0)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                showT0
                  ? 'bg-sky-50 text-sky-800 border-sky-300 font-semibold'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              T0 Consumer
            </button>

            <button
              onClick={() => setShowT1(!showT1)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                showT1
                  ? 'bg-teal-50 text-teal-800 border-teal-300 font-semibold'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              T1 Secondary
            </button>

            <button
              onClick={() => setShowT2(!showT2)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                showT2
                  ? 'bg-amber-50 text-amber-900 border-amber-400 font-bold'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              T2 Primary Orders
            </button>

            <button
              onClick={() => setShowT3(!showT3)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                showT3
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              T3 Depot
            </button>

            <button
              onClick={() => setShowT4(!showT4)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                showT4
                  ? 'bg-purple-50 text-purple-800 border-purple-300 font-semibold'
                  : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              T4 Production
            </button>

            <button
              onClick={() => setShowQuarterMarkers(!showQuarterMarkers)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                showQuarterMarkers
                  ? 'bg-rose-50 text-rose-800 border-rose-300 font-semibold'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
            >
              {showQuarterMarkers ? <Eye className="w-3 h-3 text-rose-600" /> : <EyeOff className="w-3 h-3" />}
              Quarter Markers
            </button>
          </div>
        </div>

        {/* Chart View with Generous Top Margin to Prevent Label Clutter */}
        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 28, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="weekNum"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                ticks={[1, 13, 26, 39, 52, 65, 78, 91, 104]}
                tickFormatter={(v) => `W${v}`}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                domain={[0, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#0f172a',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any) => {
                  const num = Number(value);
                  const labels: Record<string, string> = {
                    t0Consumer: 'T0 Consumer Offtake',
                    t1Secondary: 'T1 Secondary Sales',
                    t2Primary: 'T2 Primary Orders',
                    t3Depot: 'T3 Depot Orders',
                    t4Production: 'T4 Factory Production',
                    baseT2Primary: 'Baseline AS-IS Primary'
                  };
                  return [`${num.toLocaleString()} units`, labels[name] || name];
                }}
                labelFormatter={(label) => `Simulation Week ${label} of 104`}
              />

              {/* Optimised Single Milestone Reference Lines Per Quarter (No Overlapping Multi-Line Clutter!) */}
              {showQuarterMarkers &&
                quarterMilestones.map((m) => (
                  <ReferenceLine
                    key={`qtr-marker-${m.week}`}
                    x={m.week}
                    stroke={m.isFY ? '#dc2626' : '#d97706'}
                    strokeDasharray={m.isFY ? '2 2' : '3 3'}
                    strokeWidth={m.isFY ? 2 : 1.25}
                    label={{
                      value: m.label,
                      fill: m.isFY ? '#b91c1c' : '#b45309',
                      fontSize: 10,
                      fontWeight: 700,
                      position: 'top',
                      offset: 6
                    }}
                  />
                ))}

              {/* T0 Consumer Offtake */}
              {showT0 && (
                <Line
                  type="monotone"
                  dataKey="t0Consumer"
                  stroke="#0284c7"
                  strokeWidth={2}
                  dot={false}
                  name="t0Consumer"
                />
              )}

              {/* T1 Secondary Sales */}
              {showT1 && (
                <Line
                  type="monotone"
                  dataKey="t1Secondary"
                  stroke="#0d9488"
                  strokeWidth={1.5}
                  dot={false}
                  name="t1Secondary"
                />
              )}

              {/* T2 Primary Orders - Highlighted */}
              {showT2 && (
                <Line
                  type="monotone"
                  dataKey="t2Primary"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  dot={false}
                  name="t2Primary"
                />
              )}

              {/* Compare Mode: Base AS-IS Primary Orders */}
              {compareMode && showT2 && (
                <Line
                  type="monotone"
                  dataKey="baseT2Primary"
                  stroke="#dc2626"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  dot={false}
                  name="baseT2Primary"
                />
              )}

              {/* T3 Depot */}
              {showT3 && (
                <Line
                  type="monotone"
                  dataKey="t3Depot"
                  stroke="#4f46e5"
                  strokeWidth={1.5}
                  dot={false}
                  name="t3Depot"
                />
              )}

              {/* T4 Production */}
              {showT4 && (
                <Line
                  type="monotone"
                  dataKey="t4Production"
                  stroke="#9333ea"
                  strokeWidth={2}
                  dot={false}
                  name="t4Production"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Legend Footer */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-amber-800">
              <span className="w-3 h-1 bg-amber-500 rounded-xs inline-block" /> T2 Primary (Distributor Orders)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-sky-800">
              <span className="w-3 h-1 bg-sky-600 rounded-xs inline-block" /> T0 Consumer (True Kitchen Demand)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-purple-800">
              <span className="w-3 h-1 bg-purple-600 rounded-xs inline-block" /> T4 Factory Production
            </span>
            {compareMode && (
              <span className="flex items-center gap-1.5 font-medium text-rose-700">
                <span className="w-3 h-1 bg-rose-600 border-t border-dashed inline-block" /> Baseline AS-IS T2
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-400">
            Top vertical milestones: Regular Quarters (Amber) &bull; Fiscal Year Ends (Crimson)
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* Chart 2: NEW 104-Week Pipeline Inventory Level Comparison Line Chart */}
      {/* ========================================================================= */}
      <div id="inventory-trend-chart-container" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Working Capital Analysis
              </span>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-amber-600" />
                104-Week Pipeline Inventory Level Trends: Current Policy vs. Baseline AS-IS
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing pipeline stock holding across Distributor, Central Depot, and Plant Finished Goods tiers.
            </p>
          </div>

          {/* Metric & Tier Toggle Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle: Total Units vs Weeks of Cover */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setInventoryViewMode('units')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  inventoryViewMode === 'units'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Units Holding
              </button>
              <button
                onClick={() => setInventoryViewMode('weeks')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                  inventoryViewMode === 'weeks'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Weeks of Cover
              </button>
            </div>

            {/* Series Toggles */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setShowTotalInventory(!showTotalInventory)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
                  showTotalInventory
                    ? 'bg-amber-50 text-amber-900 border-amber-400'
                    : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Total Pipeline
              </button>

              <button
                onClick={() => setShowDistStock(!showDistStock)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  showDistStock
                    ? 'bg-teal-50 text-teal-900 border-teal-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                Distributor
              </button>

              <button
                onClick={() => setShowDepotStock(!showDepotStock)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  showDepotStock
                    ? 'bg-indigo-50 text-indigo-900 border-indigo-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                Depot
              </button>

              <button
                onClick={() => setShowPlantStock(!showPlantStock)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors ${
                  showPlantStock
                    ? 'bg-purple-50 text-purple-900 border-purple-300'
                    : 'bg-slate-50 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                Plant FG
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Comparison Strip above the Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500">Baseline Pipeline Stock</div>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              {avgBaselineInventoryUnits.toLocaleString()} units
            </div>
            <div className="text-[11px] text-slate-500">
              Avg {baselineResults.totalInventoryWeeks.toFixed(1)} weeks cover
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Policy Stock</div>
            <div className="text-base font-extrabold text-amber-700 mt-0.5">
              {avgCurrentInventoryUnits.toLocaleString()} units
            </div>
            <div className="text-[11px] text-slate-500">
              Avg {results.totalInventoryWeeks.toFixed(1)} weeks cover
            </div>
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
            <div className="text-[10px] uppercase font-bold text-emerald-800">Working Capital Impact</div>
            <div className="text-base font-extrabold text-emerald-700 mt-0.5">
              {inventoryDeltaPct <= 0 ? `${inventoryDeltaPct.toFixed(1)}%` : `+${inventoryDeltaPct.toFixed(1)}%`}
            </div>
            <div className="text-[11px] text-emerald-800 font-medium">
              {inventoryDeltaUnits < 0
                ? `Released ~₹${workingCapitalCrores.toFixed(1)} Cr`
                : `+${inventoryDeltaUnits.toLocaleString()} units holding`}
            </div>
          </div>

          <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200">
            <div className="text-[10px] uppercase font-bold text-sky-800">Pipeline Whiplash Status</div>
            <div className="text-base font-extrabold text-sky-700 mt-0.5">
              {results.bullwhipT2 <= 5 ? 'Damped & Stable' : results.bullwhipT2 <= 10 ? 'Moderately Oscillating' : 'Severe Whiplash'}
            </div>
            <div className="text-[11px] text-sky-800">
              {results.bullwhipT2 <= 3 ? 'Minimal holding variance' : 'Quarter-end inventory swings'}
            </div>
          </div>
        </div>

        {/* Recharts Inventory Comparison Line Chart (Light Theme) */}
        <div className="h-80 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={inventoryChartData} margin={{ top: 25, right: 15, left: -5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="weekNum"
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                ticks={[1, 13, 26, 39, 52, 65, 78, 91, 104]}
                tickFormatter={(v) => `W${v}`}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(v) =>
                  inventoryViewMode === 'units' ? `${(v / 1000).toFixed(0)}k` : `${v.toFixed(1)}w`
                }
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#cbd5e1',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#0f172a',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: any, name: any) => {
                  const num = Number(value);
                  const labels: Record<string, string> = {
                    currentTotalStock: 'Current Total Pipeline',
                    baseTotalStock: 'Baseline AS-IS Total',
                    currentDistStock: 'Current Distributor Stock',
                    baseDistStock: 'Baseline Distributor Stock',
                    currentDepotStock: 'Current Depot Stock',
                    baseDepotStock: 'Baseline Depot Stock',
                    currentPlantStock: 'Current Plant FG Stock',
                    basePlantStock: 'Baseline Plant FG Stock',
                    currentTotalWeeks: 'Current Total Cover',
                    baseTotalWeeks: 'Baseline Total Cover',
                    currentDistWeeks: 'Current Distributor Cover',
                    baseDistWeeks: 'Baseline Distributor Cover',
                    currentDepotWeeks: 'Current Depot Cover',
                    baseDepotWeeks: 'Baseline Depot Cover',
                    currentPlantWeeks: 'Current Plant FG Cover',
                    basePlantWeeks: 'Baseline Plant FG Cover'
                  };
                  const suffix = inventoryViewMode === 'units' ? ' units' : ' weeks';
                  return [`${num.toLocaleString()}${suffix}`, labels[name] || name];
                }}
                labelFormatter={(label) => `Week ${label} of 104`}
              />

              {/* Milestone lines */}
              {quarterMilestones.map((m) => (
                <ReferenceLine
                  key={`inv-qtr-${m.week}`}
                  x={m.week}
                  stroke={m.isFY ? '#dc2626' : '#d97706'}
                  strokeDasharray={m.isFY ? '2 2' : '3 3'}
                  strokeWidth={m.isFY ? 1.5 : 1}
                  label={{
                    value: m.label,
                    fill: m.isFY ? '#b91c1c' : '#b45309',
                    fontSize: 9,
                    fontWeight: 700,
                    position: 'top',
                    offset: 4
                  }}
                />
              ))}

              {/* Total Pipeline Inventory: Current vs Baseline */}
              {showTotalInventory && (
                <>
                  <Line
                    type="monotone"
                    dataKey={inventoryViewMode === 'units' ? 'currentTotalStock' : 'currentTotalWeeks'}
                    stroke="#d97706"
                    strokeWidth={2.75}
                    dot={false}
                    name={inventoryViewMode === 'units' ? 'currentTotalStock' : 'currentTotalWeeks'}
                  />
                  <Line
                    type="monotone"
                    dataKey={inventoryViewMode === 'units' ? 'baseTotalStock' : 'baseTotalWeeks'}
                    stroke="#dc2626"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                    dot={false}
                    name={inventoryViewMode === 'units' ? 'baseTotalStock' : 'baseTotalWeeks'}
                  />
                </>
              )}

              {/* Distributor Stock */}
              {showDistStock && (
                <>
                  <Line
                    type="monotone"
                    dataKey={inventoryViewMode === 'units' ? 'currentDistStock' : 'currentDistWeeks'}
                    stroke="#0d9488"
                    strokeWidth={2}
                    dot={false}
                    name={inventoryViewMode === 'units' ? 'currentDistStock' : 'currentDistWeeks'}
                  />
                  {compareMode && (
                    <Line
                      type="monotone"
                      dataKey={inventoryViewMode === 'units' ? 'baseDistStock' : 'baseDistWeeks'}
                      stroke="#0d9488"
                      strokeWidth={1.25}
                      strokeDasharray="3 3"
                      dot={false}
                      opacity={0.6}
                      name={inventoryViewMode === 'units' ? 'baseDistStock' : 'baseDistWeeks'}
                    />
                  )}
                </>
              )}

              {/* Depot Stock */}
              {showDepotStock && (
                <>
                  <Line
                    type="monotone"
                    dataKey={inventoryViewMode === 'units' ? 'currentDepotStock' : 'currentDepotWeeks'}
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={false}
                    name={inventoryViewMode === 'units' ? 'currentDepotStock' : 'currentDepotWeeks'}
                  />
                  {compareMode && (
                    <Line
                      type="monotone"
                      dataKey={inventoryViewMode === 'units' ? 'baseDepotStock' : 'baseDepotWeeks'}
                      stroke="#4f46e5"
                      strokeWidth={1.25}
                      strokeDasharray="3 3"
                      dot={false}
                      opacity={0.6}
                      name={inventoryViewMode === 'units' ? 'baseDepotStock' : 'baseDepotWeeks'}
                    />
                  )}
                </>
              )}

              {/* Plant FG Stock */}
              {showPlantStock && (
                <>
                  <Line
                    type="monotone"
                    dataKey={inventoryViewMode === 'units' ? 'currentPlantStock' : 'currentPlantWeeks'}
                    stroke="#9333ea"
                    strokeWidth={2}
                    dot={false}
                    name={inventoryViewMode === 'units' ? 'currentPlantStock' : 'currentPlantWeeks'}
                  />
                  {compareMode && (
                    <Line
                      type="monotone"
                      dataKey={inventoryViewMode === 'units' ? 'basePlantStock' : 'basePlantWeeks'}
                      stroke="#9333ea"
                      strokeWidth={1.25}
                      strokeDasharray="3 3"
                      dot={false}
                      opacity={0.6}
                      name={inventoryViewMode === 'units' ? 'basePlantStock' : 'basePlantWeeks'}
                    />
                  )}
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend for Inventory Chart */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 font-semibold text-amber-800">
              <span className="w-3.5 h-1 bg-amber-600 rounded-xs inline-block" /> Current Policy Total
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-rose-700">
              <span className="w-3.5 h-1 bg-rose-600 border-t border-dashed inline-block" /> Baseline AS-IS Total (Dashed)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-teal-800">
              <span className="w-3.5 h-1 bg-teal-600 rounded-xs inline-block" /> Distributor Stock
            </span>
            <span className="flex items-center gap-1.5 font-medium text-indigo-800">
              <span className="w-3.5 h-1 bg-indigo-600 rounded-xs inline-block" /> Central Depot Stock
            </span>
            <span className="flex items-center gap-1.5 font-medium text-purple-800">
              <span className="w-3.5 h-1 bg-purple-600 rounded-xs inline-block" /> Plant Finished Goods
            </span>
          </div>
          <div className="text-[11px] text-slate-400">
            Notice how POUT eliminates post-quarter inventory starvation and prevents excessive warehouse accumulation.
          </div>
        </div>
      </div>

      {/* Multi-Tier Volatility Transmission Table (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
          Multi-Tier Variance Amplification Across the Hawkins Network
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking the progressive distortion from final consumer kitchen offtake up through distributors to plant production.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="py-2.5 px-3 font-bold">Tier</th>
                <th className="py-2.5 px-3 font-bold">Description</th>
                <th className="py-2.5 px-3 font-bold text-right">Mean Wkly Units</th>
                <th className="py-2.5 px-3 font-bold text-right">Bullwhip Ratio</th>
                <th className="py-2.5 px-3 font-bold text-right">CV Ratio (vs T0)</th>
                <th className="py-2.5 px-3 font-bold">Primary Distortion Drivers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-3 font-bold text-sky-700">T0</td>
                <td className="py-3 px-3 font-semibold text-slate-900">Consumer Offtake</td>
                <td className="py-3 px-3 text-right font-mono">{results.meanConsumer.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-bold text-slate-600 font-mono">1.00x</td>
                <td className="py-3 px-3 text-right font-bold text-slate-600 font-mono">1.00x</td>
                <td className="py-3 px-3 text-slate-500">Baseline consumer demand (Diwali seasonal surge + secular trend)</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-3 font-bold text-teal-700">T1</td>
                <td className="py-3 px-3 font-semibold text-slate-900">Secondary Sales</td>
                <td className="py-3 px-3 text-right font-mono">{results.meanSecondary.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-bold text-teal-700 font-mono">{results.bullwhipT1.toFixed(2)}x</td>
                <td className="py-3 px-3 text-right font-bold text-teal-700 font-mono">{results.cvRatioT1.toFixed(2)}x</td>
                <td className="py-3 px-3 text-slate-500">600+ Dealers buffer orders; retail stocking up ahead of festivals</td>
              </tr>
              <tr className="hover:bg-amber-50/50 bg-amber-50/30">
                <td className="py-3 px-3 font-bold text-amber-700">T2</td>
                <td className="py-3 px-3 font-bold text-amber-900">Primary Orders (Distributor)</td>
                <td className="py-3 px-3 text-right font-bold font-mono">{results.meanPrimary.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-extrabold text-amber-700 text-sm font-mono">
                  {results.bullwhipT2.toFixed(2)}x
                </td>
                <td className="py-3 px-3 text-right font-extrabold text-amber-700 text-sm font-mono">
                  {results.cvRatioT2.toFixed(2)}x
                </td>
                <td className="py-3 px-3 text-amber-900 font-medium">
                  Quarter-end push (+173%), scheme forward buying, MOQ batching, no POS visibility
                </td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-3 font-bold text-indigo-700">T3</td>
                <td className="py-3 px-3 font-semibold text-slate-900">Depot Replenishment</td>
                <td className="py-3 px-3 text-right font-mono">{results.meanDepot.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-bold text-indigo-700 font-mono">{results.bullwhipT3.toFixed(2)}x</td>
                <td className="py-3 px-3 text-right font-bold text-indigo-700 font-mono">{results.cvRatioT3.toFixed(2)}x</td>
                <td className="py-3 px-3 text-slate-500">Central stock buffers (4.2 wks target) + open-order backlog tracking</td>
              </tr>
              <tr className="hover:bg-slate-50/70">
                <td className="py-3 px-3 font-bold text-purple-700">T4</td>
                <td className="py-3 px-3 font-semibold text-slate-900">Plant Production</td>
                <td className="py-3 px-3 text-right font-mono">{results.meanProduction.toLocaleString()}</td>
                <td className="py-3 px-3 text-right font-bold text-purple-700 font-mono">{results.bullwhipT4.toFixed(2)}x</td>
                <td className="py-3 px-3 text-right font-bold text-purple-700 font-mono">{results.cvRatioT4.toFixed(2)}x</td>
                <td className="py-3 px-3 text-slate-500">Campaign batching (2.4 wks MOQ), die setup changeovers, festive pre-builds</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
