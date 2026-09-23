export interface SKU {
  code: string;
  name: string;
  family: string;
  capacityL: number | null;
  plant: string;
  mrpINR: number;
  distributorPriceINR: number;
  casePack: number;
  abc: 'A' | 'B' | 'C';
  weeklyBaseUnits: number;
}

export interface Partner {
  code: string;
  name: string;
  channel: 'Traditional' | 'Modern-Trade' | 'E-Commerce';
  demandWeight: number;
  qtrEndLoadingPropensity: number;
  schemeResponsiveness: number;
  orderDiscipline: number;
  targetCoverWeeks: number;
  sharesSecondaryData: boolean;
  representsRealPartners: number;
}

export interface WeeklyCalendarEntry {
  week: number;
  weekStart: string;
  seasonalIndex: number;
  trendIndex: number;
  schemeActive: boolean;
  schemeType: string;
  schemeDepthPct: number;
  quarterEndWeek: boolean;
  fiscalYearEndWeek: boolean;
}

export interface CalibrationTarget {
  id: string;
  label: string;
  policy: 'ASIS' | 'POUT';
  alpha: number;
  posSharing: number;
  bullwhipT2: number;
  bullwhipT3: number;
  bullwhipT4: number;
  bullwhipT1: number;
  servicePct: number;
  primaryFillPct: number;
  cvPrimary: number;
  cvRatioPrimary: number;
  distributorCoverWks: number;
  depotCoverWks: number;
  plantFGCoverWks: number;
}

export interface BOMItem {
  sku: string;
  subAssembly: string;
  component: string;
  description: string;
  uom: string;
  qtyPer: number;
  scrapPct: number;
  effectiveQtyPer: number;
}

export interface SimulationParams {
  policy: 'ASIS' | 'POUT';
  poutAlpha: number; // 0.1 to 1.0
  targetCoverWeeks: number; // 1.0 to 6.0
  forecastSmoothingAlpha: number; // 0.1 to 0.6
  qtrEndLoadingIntensity: number; // 0 to 1.0 (0% to 100%)
  schemeDepthFrequency: number; // 0 to 1.0 (0% to 100%)
  orderBatchingStrictness: number; // 0 to 1.0 (0% to 100%)
  posSharingCoverage: number; // 0 to 1.0 (0% to 100%)
  dataLatencyDays: number; // 0 to 21
  vendorLeadTimeMultiplier: number; // 0.5 to 2.0
  plantCapacityHeadroom: number; // 1.2 to 3.0
}

export interface TierWeeklyMetrics {
  week: number;
  weekStart: string;
  t0Consumer: number;
  t1Secondary: number;
  t2Primary: number;
  t3Depot: number;
  t4Production: number;
  distributorStock: number;
  depotStock: number;
  plantFGStock: number;
  isQuarterEnd: boolean;
  isFiscalYearEnd: boolean;
  schemeActive: boolean;
  schemeType: string;
}

export interface SimulationResults {
  params: SimulationParams;
  weeklySeries: TierWeeklyMetrics[]; // 104 weeks
  bullwhipT1: number;
  bullwhipT2: number;
  bullwhipT3: number;
  bullwhipT4: number;
  servicePct: number; // Consumer service level %
  primaryFillPct: number; // Primary fill rate %
  cvRatioT2: number; // CV of T2 / CV of T0
  cvRatioT1: number;
  cvRatioT3: number;
  cvRatioT4: number;
  distributorCoverWks: number;
  depotCoverWks: number;
  plantFGCoverWks: number;
  totalInventoryWeeks: number;
  netStockAmp: number; // Var(Inventory) / Var(Demand)
  meanConsumer: number;
  meanSecondary: number;
  meanPrimary: number;
  meanDepot: number;
  meanProduction: number;
  quarterEndVsNormal: {
    primaryQtrEndUpliftPct: number;
    consumerQtrEndUpliftPct: number;
    qtrEndAvgPrimary: number;
    normalAvgPrimary: number;
    qtrEndAvgConsumer: number;
    normalAvgConsumer: number;
  };
  safetyValveBreaches: {
    week: number;
    reason: string;
    value: number;
    limit: number;
    orderQty: number;
    prevOrderQty: number;
  }[];
}

export interface SavedBatch {
  id: string;
  name: string;
  timestamp: number;
  params: SimulationParams;
  results: SimulationResults;
}

export interface AgentDefect {
  id: string;
  week: number;
  type: string;
  sku: string;
  partner: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
  rawRecord: string;
}

export interface AgentRecommendation {
  agent: 'Data Quality' | 'Forecast & Event' | 'Supply' | 'Channel' | 'Audit';
  status: 'active' | 'warning' | 'stable';
  headline: string;
  details: string;
  metrics: Record<string, string | number>;
  actionPrompt?: string;
}

export interface WeeklyForecastPoint {
  weekIndex: number;
  calendarWeek: number;
  dateStart: string;
  dateEnd: string;
  monthName: string;
  isQuarterEnd: boolean;
  isFestivePeak: boolean;
  seasonalFactor: number;
  trendFactor: number;

  // Consumer Kitchen Offtake (T0)
  t0Expected: number;
  t0P10: number;
  t0P90: number;

  // Secondary Retail Dealer Demand (T1)
  t1Expected: number;
  t1P10: number;
  t1P90: number;

  // Primary Distributor Orders (T2) - AS-IS Whiplash scenario
  t2AsIsExpected: number;
  t2AsIsP10: number;
  t2AsIsP90: number;

  // Primary Distributor Orders (T2) - Mitigated POUT Damped scenario
  t2MitigatedExpected: number;
  t2MitigatedP10: number;
  t2MitigatedP90: number;

  // Factory Assembly Production Plan (T4) - AS-IS vs Mitigated
  t4AsIsPlanned: number;
  t4MitigatedPlanned: number;

  // Variance & Savings
  whiplashUnitsDiff: number; // ASIS excess peak order spike vs Mitigated
  workingCapitalExposureDiffINR: number; // In Rupees
  depotRecommendedSafetyStock: number;
  distributorRecommendedCoverWeeks: number;
}

export interface PredictiveForecastSummary {
  forecastOriginWeek: number;
  forecastOriginDate: string;
  horizonWeeks: number; // 8 or 9 weeks (2 calendar months)
  horizonEndDate: string;
  totalAsIsPredictedUnits: number;
  totalMitigatedPredictedUnits: number;
  totalConsumerExpectedUnits: number;
  peakAsIsWeekOrder: number;
  peakMitigatedWeekOrder: number;
  peakWhiplashSurgeReductionPct: number;
  estimatedWorkingCapitalSavedINR: number;
  serviceRiskLevel: 'LOW' | 'OPTIMAL' | 'ELEVATED' | 'HIGH';
  serviceReliabilityPct: number;
  bullwhipDampingFactorAchieved: number;
  weeklyPoints: WeeklyForecastPoint[];
  skuBreakdown: {
    skuCode: string;
    skuName: string;
    mrpINR: number;
    distributorPriceINR: number;
    plant: string;
    twoMonthExpectedConsumerUnits: number;
    twoMonthAsIsPrimaryRange: [number, number]; // [P10, P90]
    twoMonthMitigatedPrimaryRange: [number, number]; // [P10, P90]
    mitigatedRecommendedWeeklyLot: number;
  }[];
}

