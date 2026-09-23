import { SKU, Partner, WeeklyCalendarEntry, CalibrationTarget, BOMItem } from '../types';

export const HAWKINS_META = {
  title: "Hawkins Bullwhip App — calibration constants",
  warning: "ALL DATA IS SYNTHETIC. Not Hawkins Cookers actuals. Do not present as real.",
  derivedFrom: "157-week, 80-SKU seeded supply-chain simulation; metrics measured on this 12-SKU subset",
  subsetShareOfUnitsPct: 39.8,
  weeks: 104,
  window: "2024-07-01 to 2026-06-29",
  rngSeed: 31071959,
  bullwhipMethod: "variance of (series / centred 13-week moving average), divided by the same for consumer offtake",
  measurementWarning: "Do NOT use a fixed 52-week seasonal decomposition: Diwali moves 3-4 weeks a year and a fixed seasonal index over-fits it."
};

export const SKUS: SKU[] = [
  {
    code: "CL3T",
    name: "Classic 3L",
    family: "Cooker-Classic",
    capacityL: 3.0,
    plant: "HP",
    mrpINR: 2790,
    distributorPriceINR: 1752,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 5941
  },
  {
    code: "CL50",
    name: "Classic 5L",
    family: "Cooker-Classic",
    capacityL: 5.0,
    plant: "HP",
    mrpINR: 3560,
    distributorPriceINR: 2243,
    casePack: 4,
    abc: "A",
    weeklyBaseUnits: 5261
  },
  {
    code: "CB30",
    name: "Contura Black 3L",
    family: "Cooker-ConturaBlack",
    capacityL: 3.0,
    plant: "HP",
    mrpINR: 3580,
    distributorPriceINR: 2260,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 2823
  },
  {
    code: "MM30",
    name: "Miss Mary 3L",
    family: "Cooker-StainlessSteel",
    capacityL: 3.0,
    plant: "JA",
    mrpINR: 5020,
    distributorPriceINR: 3150,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 2650
  },
  {
    code: "CL20",
    name: "Classic 2L",
    family: "Cooker-Classic",
    capacityL: 2.0,
    plant: "HP",
    mrpINR: 2270,
    distributorPriceINR: 1466,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 2538
  },
  {
    code: "HC30",
    name: "Contura 3L",
    family: "Cooker-Contura",
    capacityL: 3.0,
    plant: "HP",
    mrpINR: 3400,
    distributorPriceINR: 2171,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 2217
  },
  {
    code: "SSC30",
    name: "IC SS Contura 3L",
    family: "Cooker-StainlessSteel",
    capacityL: 3.0,
    plant: "JA",
    mrpINR: 4900,
    distributorPriceINR: 3076,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 1977
  },
  {
    code: "SV",
    name: "Safety Valve",
    family: "Spare-Valve",
    capacityL: null,
    plant: "JA",
    mrpINR: 120,
    distributorPriceINR: 73,
    casePack: 100,
    abc: "A",
    weeklyBaseUnits: 1604
  },
  {
    code: "HSS50",
    name: "S Steel 5L",
    family: "Cooker-StainlessSteel",
    capacityL: 5.0,
    plant: "JA",
    mrpINR: 6070,
    distributorPriceINR: 3665,
    casePack: 4,
    abc: "A",
    weeklyBaseUnits: 1505
  },
  {
    code: "CXT30",
    name: "Contura Black 3L XT",
    family: "Cooker-ConturaBlack",
    capacityL: 3.0,
    plant: "HP",
    mrpINR: 3600,
    distributorPriceINR: 2329,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 1496
  },
  {
    code: "HSST35",
    name: "Tri-Ply SS PC 3.5L",
    family: "Cookware-TriPly",
    capacityL: 3.5,
    plant: "JA",
    mrpINR: 5820,
    distributorPriceINR: 3717,
    casePack: 6,
    abc: "A",
    weeklyBaseUnits: 984
  },
  {
    code: "BG",
    name: "Baby Gasket",
    family: "Spare-Gasket",
    capacityL: null,
    plant: "TH",
    mrpINR: 190,
    distributorPriceINR: 123,
    casePack: 50,
    abc: "C",
    weeklyBaseUnits: 363
  }
];

export const PARTNERS: Partner[] = [
  {
    code: "DB01",
    name: "E-Commerce Marketplaces",
    channel: "E-Commerce",
    demandWeight: 0.0647,
    qtrEndLoadingPropensity: 0.05,
    schemeResponsiveness: 0.15,
    orderDiscipline: 0.92,
    targetCoverWeeks: 1.6,
    sharesSecondaryData: true,
    representsRealPartners: 1
  },
  {
    code: "DB02",
    name: "East Distributors",
    channel: "Traditional",
    demandWeight: 0.1379,
    qtrEndLoadingPropensity: 0.33,
    schemeResponsiveness: 0.463,
    orderDiscipline: 0.713,
    targetCoverWeeks: 3.39,
    sharesSecondaryData: true,
    representsRealPartners: 4
  },
  {
    code: "DB03",
    name: "Modern Trade National",
    channel: "Modern-Trade",
    demandWeight: 0.0733,
    qtrEndLoadingPropensity: 0.05,
    schemeResponsiveness: 0.15,
    orderDiscipline: 0.92,
    targetCoverWeeks: 2.2,
    sharesSecondaryData: true,
    representsRealPartners: 1
  },
  {
    code: "DB04",
    name: "North Distributors",
    channel: "Traditional",
    demandWeight: 0.2328,
    qtrEndLoadingPropensity: 0.25,
    schemeResponsiveness: 0.609,
    orderDiscipline: 0.747,
    targetCoverWeeks: 3.72,
    sharesSecondaryData: true,
    representsRealPartners: 7
  },
  {
    code: "DB05",
    name: "South Distributors",
    channel: "Traditional",
    demandWeight: 0.2672,
    qtrEndLoadingPropensity: 0.285,
    schemeResponsiveness: 0.68,
    orderDiscipline: 0.672,
    targetCoverWeeks: 3.64,
    sharesSecondaryData: true,
    representsRealPartners: 9
  },
  {
    code: "DB06",
    name: "West Distributors",
    channel: "Traditional",
    demandWeight: 0.2241,
    qtrEndLoadingPropensity: 0.227,
    schemeResponsiveness: 0.577,
    orderDiscipline: 0.733,
    targetCoverWeeks: 3.62,
    sharesSecondaryData: true,
    representsRealPartners: 7
  }
];

export const MONTHLY_OFFTAKE_INDEX: Record<number, number> = {
  1: 103,
  2: 105,
  3: 101,
  4: 108,
  5: 101,
  6: 86,
  7: 75,
  8: 76,
  9: 92,
  10: 134,
  11: 114,
  12: 104
};

export const QUARTER_END_SIGNATURE = {
  primaryOrderUpliftPct: 162,
  consumerOfftakeUpliftPct: -4,
  secondaryUpliftPct: 3
};

export const DEMAND_MODEL = {
  dispersionR: 8.0,
  weeklyTrendPct: 0.21,
  forecastSmoothingAlpha: 0.3,
  dealerCoverWeeks: 2.9,
  dealerFestivePrebuildMultiplier: 1.55,
  depotToDistributorLagWeeks: 2,
  depotCoverWeeksRange: [3.5, 5.0] as [number, number],
  plantReorderPointWeeks: 2.4,
  plantMinCampaignWeeks: 2.0,
  plantCapacityMultiple: 1.95,
  plantPrebuildLookaheadWeeks: 7,
  burnInWeeks: 26
};

export const CALIBRATION_TARGETS: CalibrationTarget[] = [
  {
    id: "as-is",
    label: "As-is: loading + schemes + batching, no POS sharing",
    policy: "ASIS",
    alpha: 1.0,
    posSharing: 0.0,
    bullwhipT2: 15.77,
    bullwhipT3: 46.03,
    bullwhipT4: 20.17,
    bullwhipT1: 2.81,
    servicePct: 85.58,
    primaryFillPct: 80.02,
    cvPrimary: 0.769,
    cvRatioPrimary: 3.36,
    distributorCoverWks: 2.64,
    depotCoverWks: 4.21,
    plantFGCoverWks: 2.41
  },
  {
    id: "pout-100",
    label: "POUT alpha 1.00, no POS sharing",
    policy: "POUT",
    alpha: 1.0,
    posSharing: 0.0,
    bullwhipT2: 13.28,
    bullwhipT3: 34.52,
    bullwhipT4: 10.7,
    bullwhipT1: 3.41,
    servicePct: 98.34,
    primaryFillPct: 85.71,
    cvPrimary: 0.782,
    cvRatioPrimary: 3.38,
    distributorCoverWks: 3.0,
    depotCoverWks: 3.75,
    plantFGCoverWks: 2.44
  },
  {
    id: "pout-60",
    label: "POUT alpha 0.60, no POS sharing",
    policy: "POUT",
    alpha: 0.6,
    posSharing: 0.0,
    bullwhipT2: 8.18,
    bullwhipT3: 25.8,
    bullwhipT4: 10.47,
    bullwhipT1: 2.74,
    servicePct: 97.54,
    primaryFillPct: 93.05,
    cvPrimary: 0.576,
    cvRatioPrimary: 2.49,
    distributorCoverWks: 2.84,
    depotCoverWks: 3.29,
    plantFGCoverWks: 2.68
  },
  {
    id: "pout-35",
    label: "POUT alpha 0.35, no POS sharing (SERVICE TRAP)",
    policy: "POUT",
    alpha: 0.35,
    posSharing: 0.0,
    bullwhipT2: 5.17,
    bullwhipT3: 18.39,
    bullwhipT4: 8.8,
    bullwhipT1: 2.54,
    servicePct: 91.36,
    primaryFillPct: 96.6,
    cvPrimary: 0.454,
    cvRatioPrimary: 1.97,
    distributorCoverWks: 2.85,
    depotCoverWks: 3.08,
    plantFGCoverWks: 3.02
  },
  {
    id: "pout-60-pos",
    label: "POUT alpha 0.60, POS shared",
    policy: "POUT",
    alpha: 0.6,
    posSharing: 1.0,
    bullwhipT2: 4.79,
    bullwhipT3: 7.07,
    bullwhipT4: 4.34,
    bullwhipT1: 1.94,
    servicePct: 98.2,
    primaryFillPct: 93.15,
    cvPrimary: 0.463,
    cvRatioPrimary: 2.0,
    distributorCoverWks: 2.59,
    depotCoverWks: 2.84,
    plantFGCoverWks: 3.34
  },
  {
    id: "pout-35-pos",
    label: "POUT alpha 0.35, POS shared (BEST)",
    policy: "POUT",
    alpha: 0.35,
    posSharing: 1.0,
    bullwhipT2: 2.6,
    bullwhipT3: 4.94,
    bullwhipT4: 3.66,
    bullwhipT1: 1.77,
    servicePct: 98.56,
    primaryFillPct: 96.14,
    cvPrimary: 0.357,
    cvRatioPrimary: 1.56,
    distributorCoverWks: 2.59,
    depotCoverWks: 2.82,
    plantFGCoverWks: 3.39
  }
];

export const ATTRIBUTION_OF_BULLWHIP_REDUCTION = {
  endingCommercialDistortionsPct: 22,
  smoothingPolicyPct: 59,
  demandSignalSharingPct: 48,
  note: "Sequential, not additive: 15.77 -> 13.28 (commercial) -> 5.17 (smoothing) -> 2.60 (sharing)."
};

export const DATA_DEFECT_RATES = {
  missingSecondarySharePct: 33.3,
  skuCaseVariantPct: 2.1,
  fatFingerX10Pct: 0.14,
  negativeStockPct: 0.32,
  duplicateEtlRowPct: 0.4,
  missingGrnPct: 1.9,
  amendedPoPct: 0.6,
  wrongUnitCostPct: 0.8
};
