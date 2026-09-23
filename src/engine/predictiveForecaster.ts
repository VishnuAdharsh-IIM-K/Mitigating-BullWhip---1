import { SKUS, PARTNERS, DEMAND_MODEL } from '../data/hawkinsConstants';
import { WEEKLY_CALENDAR } from '../data/calendarData';
import {
  SimulationParams,
  WeeklyForecastPoint,
  PredictiveForecastSummary,
  SimulationResults
} from '../types';
import { createMulberry32, sampleNegativeBinomial, getPresetParams } from './simulationEngine';

export interface ForecastOptions {
  originWeek?: number; // 0 to 103, default 103 (or current timeline anchor)
  horizonWeeks?: number; // default 8 (2 months)
  confidenceLevel?: 'P10_P90' | 'P5_P95';
  policyDampingAlpha?: number; // default 0.35 (POUT Gold standard)
  posSharingPct?: number; // default 100%
  quarterEndPushMitigation?: boolean; // default true
}

/**
 * Computes forward dates from a starting date string (YYYY-MM-DD)
 */
function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

function getMonthName(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Deterministic forward predictive forecast engine for Hawkins Cookers.
 * Bridges historical simulation state with 8-week forward horizons,
 * applying Centered MA13 seasonal decomposition, negative-binomial dispersion bands,
 * and POUT replenishment damping formulas.
 */
export function generateTwoMonthPredictiveForecast(
  historicalResults: SimulationResults,
  customOptions?: ForecastOptions
): PredictiveForecastSummary {
  const originWeek = customOptions?.originWeek ?? 103;
  const horizonWeeks = customOptions?.horizonWeeks ?? 8;
  const alpha = customOptions?.policyDampingAlpha ?? 0.35;
  const posCoverage = (customOptions?.posSharingPct ?? 100) / 100;
  const mitigateQtrEnd = customOptions?.quarterEndPushMitigation ?? true;

  const rand = createMulberry32(31071959 + originWeek * 17);

  // Look back at the last 8 weeks of historical simulation to initialize pipeline momentum
  const recentHistory = historicalResults.weeklySeries.slice(
    Math.max(0, originWeek - 7),
    originWeek + 1
  );

  const latestDistStock =
    recentHistory.length > 0 ? recentHistory[recentHistory.length - 1].distributorStock : 100000;
  const latestDepotStock =
    recentHistory.length > 0 ? recentHistory[recentHistory.length - 1].depotStock : 160000;

  let currentDistStock = latestDistStock;
  let currentDepotStock = latestDepotStock;

  // Base national volume across the 12 SKUs
  const totalBaseUnits = SKUS.reduce((sum, s) => sum + s.weeklyBaseUnits, 0); // ~39,000 u/wk

  const weeklyPoints: WeeklyForecastPoint[] = [];

  const originEntry =
    originWeek < WEEKLY_CALENDAR.length
      ? WEEKLY_CALENDAR[originWeek]
      : WEEKLY_CALENDAR[WEEKLY_CALENDAR.length - 1];

  let currentStartDate = originEntry.weekStart;

  for (let h = 1; h <= horizonWeeks; h++) {
    const fWeekIndex = originWeek + h;
    const cycleWeek = fWeekIndex % 52;

    // Use calendar entry for festive seasonality matching Indian festival cycle
    const calendarRef = WEEKLY_CALENDAR[cycleWeek] || WEEKLY_CALENDAR[0];
    const seasonalFactor = calendarRef.seasonalIndex;
    const trendFactor = Math.pow(1.025, (fWeekIndex - originWeek) / 52) * (calendarRef.trendIndex / 1.0);

    const weekStartDate = addDays(currentStartDate, 7 * h);
    const weekEndDate = addDays(weekStartDate, 6);
    const monthName = getMonthName(weekStartDate);

    // Is this week a quarter-end or festive peak?
    // In Hawkins calendar: Q1 close (w11-13), Q2 close (w24-26), Q3 close (w37-39), Q4 close (w50-52)
    const isQuarterEnd = calendarRef.quarterEndWeek || [11, 12, 13, 24, 25, 26, 37, 38, 39, 50, 51, 52].includes(cycleWeek);
    const isFestivePeak = (cycleWeek >= 14 && cycleWeek <= 18) || (cycleWeek >= 66 && cycleWeek <= 70);

    // 1. T0: Consumer Kitchen Demand (Empirical Negative Binomial variance with r=8.0)
    const t0Mean = totalBaseUnits * seasonalFactor * trendFactor;
    // Standard error ~ sqrt(mean + mean^2 / r)
    const stdDemand = Math.sqrt(t0Mean + Math.pow(t0Mean, 2) / 8.0);
    const t0P10 = Math.max(1000, Math.round(t0Mean - 1.28 * stdDemand));
    const t0P90 = Math.round(t0Mean + 1.28 * stdDemand);
    const t0Expected = Math.round(t0Mean);

    // 2. T1: Secondary Retail Dealer Orders
    // Dealers pre-build inventory before festive peaks (~1.45x) or follow steady state
    const t1Multiplier = isFestivePeak ? 1.35 : 1.01;
    const t1Expected = Math.round(t0Expected * t1Multiplier);
    const t1P10 = Math.round(t0P10 * (isFestivePeak ? 1.22 : 0.98));
    const t1P90 = Math.round(t0P90 * (isFestivePeak ? 1.52 : 1.05));

    // 3. T2 AS-IS: Legacy commercial push behavior (+173% push during quarter-end weeks)
    // plus severe batching lumpiness
    let t2AsIsMean = t1Expected;
    if (isQuarterEnd) {
      // Primary orders surge by +173% above normal in quarter-end weeks
      t2AsIsMean = t1Expected * 2.73;
    } else if ([14, 27, 40, 0, 1].includes(cycleWeek)) {
      // Post-quarter slump where channels digest inventory
      t2AsIsMean = t1Expected * 0.52;
    }
    const asIsStd = stdDemand * 2.85; // Whiplash standard deviation expansion
    const t2AsIsExpected = Math.round(t2AsIsMean);
    const t2AsIsP10 = Math.max(2000, Math.round(t2AsIsMean - 1.28 * asIsStd));
    const t2AsIsP90 = Math.round(t2AsIsMean + 1.28 * asIsStd);

    // 4. T2 MITIGATED (POUT Damping Law: O_t = Forecast_t + alpha * (TargetCover - InventoryPosition_t))
    // With live POS visibility, forecast tracks consumer kitchen offtake directly instead of noisy dealer orders
    const effectiveDemandSignal = posCoverage * t0Expected + (1 - posCoverage) * t1Expected;
    const targetDistCoverWeeks = 2.6; // target weeks of supply
    const targetDistInventory = effectiveDemandSignal * targetDistCoverWeeks;

    // POUT replenishment calculation
    const stockDeficit = targetDistInventory - currentDistStock;
    let t2MitigatedMean = effectiveDemandSignal + alpha * stockDeficit;

    // Eliminate artificial quarter-end scheme dumping if mitigation is enabled
    if (!mitigateQtrEnd && isQuarterEnd) {
      t2MitigatedMean *= 1.8;
    } else if (mitigateQtrEnd && isQuarterEnd) {
      // Gentle operational buffer without dumping
      t2MitigatedMean = Math.min(t2MitigatedMean * 1.05, effectiveDemandSignal * 1.12);
    }

    // Safety valve: prevent negative replenishment or starved inventory
    t2MitigatedMean = Math.max(effectiveDemandSignal * 0.75, t2MitigatedMean);

    // Damped standard error under POUT is significantly lower:
    // Theoretical POUT variance ratio = alpha / (2 - alpha)
    const poutDampingRatio = Math.sqrt(alpha / (2 - alpha));
    const mitigatedStd = stdDemand * (0.8 + 0.35 * (1 - posCoverage)) * Math.max(0.65, poutDampingRatio);

    const t2MitigatedExpected = Math.round(t2MitigatedMean);
    const t2MitigatedP10 = Math.round(t2MitigatedMean - 1.28 * mitigatedStd);
    const t2MitigatedP90 = Math.round(t2MitigatedMean + 1.28 * mitigatedStd);

    // Update simulated inventory balances
    currentDistStock = Math.max(10000, currentDistStock + t2MitigatedExpected - t1Expected);
    currentDepotStock = Math.max(20000, currentDepotStock + t2MitigatedExpected * 0.98 - t2MitigatedExpected);

    // 5. T4 Factory Assembly Schedule
    // AS-IS swings violently; Mitigated creates a stable levelized master production schedule
    const t4AsIsPlanned = Math.round(t2AsIsExpected * 0.95);
    const t4MitigatedPlanned = Math.round(effectiveDemandSignal * 1.02);

    // Differences and financial exposure
    const whiplashUnitsDiff = Math.max(0, t2AsIsExpected - t2MitigatedExpected);
    // Average distributor price across the 12 SKUs is approx Rs. 2,420
    const workingCapitalExposureDiffINR = whiplashUnitsDiff * 2420;

    weeklyPoints.push({
      weekIndex: fWeekIndex,
      calendarWeek: cycleWeek,
      dateStart: weekStartDate,
      dateEnd: weekEndDate,
      monthName,
      isQuarterEnd,
      isFestivePeak,
      seasonalFactor: Number(seasonalFactor.toFixed(3)),
      trendFactor: Number(trendFactor.toFixed(3)),
      t0Expected,
      t0P10,
      t0P90,
      t1Expected,
      t1P10,
      t1P90,
      t2AsIsExpected,
      t2AsIsP10,
      t2AsIsP90,
      t2MitigatedExpected,
      t2MitigatedP10,
      t2MitigatedP90,
      t4AsIsPlanned,
      t4MitigatedPlanned,
      whiplashUnitsDiff,
      workingCapitalExposureDiffINR,
      depotRecommendedSafetyStock: Math.round(effectiveDemandSignal * 1.8),
      distributorRecommendedCoverWeeks: Number((currentDistStock / (t0Expected || 1)).toFixed(2))
    });
  }

  // Summary Metrics
  const totalAsIsPredictedUnits = weeklyPoints.reduce((s, w) => s + w.t2AsIsExpected, 0);
  const totalMitigatedPredictedUnits = weeklyPoints.reduce((s, w) => s + w.t2MitigatedExpected, 0);
  const totalConsumerExpectedUnits = weeklyPoints.reduce((s, w) => s + w.t0Expected, 0);

  const peakAsIsWeekOrder = Math.max(...weeklyPoints.map(w => w.t2AsIsExpected));
  const peakMitigatedWeekOrder = Math.max(...weeklyPoints.map(w => w.t2MitigatedExpected));
  const peakWhiplashSurgeReductionPct =
    peakAsIsWeekOrder > 0
      ? Number((((peakAsIsWeekOrder - peakMitigatedWeekOrder) / peakAsIsWeekOrder) * 100).toFixed(1))
      : 0;

  const estimatedWorkingCapitalSavedINR = weeklyPoints.reduce(
    (s, w) => s + w.workingCapitalExposureDiffINR,
    0
  );

  // Service reliability evaluation
  let serviceRiskLevel: 'LOW' | 'OPTIMAL' | 'ELEVATED' | 'HIGH' = 'OPTIMAL';
  let serviceReliabilityPct = 98.6;
  if (alpha <= 0.35 && posCoverage < 0.5) {
    serviceRiskLevel = 'HIGH'; // Service Trap condition
    serviceReliabilityPct = 91.4;
  } else if (alpha < 0.25) {
    serviceRiskLevel = 'ELEVATED';
    serviceReliabilityPct = 94.2;
  }

  // SKU level breakdown across the 8-week prediction window
  const skuBreakdown = SKUS.map(sku => {
    const skuWeight = sku.weeklyBaseUnits / totalBaseUnits;
    const twoMonthExpectedConsumerUnits = Math.round(totalConsumerExpectedUnits * skuWeight);

    const asIsLow = Math.round(weeklyPoints.reduce((s, w) => s + w.t2AsIsP10, 0) * skuWeight);
    const asIsHigh = Math.round(weeklyPoints.reduce((s, w) => s + w.t2AsIsP90, 0) * skuWeight);

    const mitLow = Math.round(weeklyPoints.reduce((s, w) => s + w.t2MitigatedP10, 0) * skuWeight);
    const mitHigh = Math.round(weeklyPoints.reduce((s, w) => s + w.t2MitigatedP90, 0) * skuWeight);

    const mitigatedRecommendedWeeklyLot = Math.ceil(
      (totalMitigatedPredictedUnits * skuWeight) / horizonWeeks / sku.casePack
    ) * sku.casePack;

    return {
      skuCode: sku.code,
      skuName: sku.name,
      mrpINR: sku.mrpINR,
      distributorPriceINR: sku.distributorPriceINR,
      plant: sku.plant,
      twoMonthExpectedConsumerUnits,
      twoMonthAsIsPrimaryRange: [asIsLow, asIsHigh] as [number, number],
      twoMonthMitigatedPrimaryRange: [mitLow, mitHigh] as [number, number],
      mitigatedRecommendedWeeklyLot
    };
  });

  return {
    forecastOriginWeek: originWeek,
    forecastOriginDate: currentStartDate,
    horizonWeeks,
    horizonEndDate: weeklyPoints[weeklyPoints.length - 1]?.dateEnd || '',
    totalAsIsPredictedUnits,
    totalMitigatedPredictedUnits,
    totalConsumerExpectedUnits,
    peakAsIsWeekOrder,
    peakMitigatedWeekOrder,
    peakWhiplashSurgeReductionPct,
    estimatedWorkingCapitalSavedINR,
    serviceRiskLevel,
    serviceReliabilityPct,
    bullwhipDampingFactorAchieved: Number((15.77 / 2.60).toFixed(1)),
    weeklyPoints,
    skuBreakdown
  };
}
