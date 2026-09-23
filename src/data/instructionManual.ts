/**
 * Comprehensive Instruction Manual & Operations Guide for Hawkins Bullwhip Command
 * Supply Chain Policy Simulation & Research Suite
 */

export const INSTRUCTION_MANUAL_MARKDOWN = `# HAWKINS COOKERS LIMITED
## Multi-Tier Supply Chain Simulation & POUT Policy Command Suite
### Comprehensive Instruction Manual & Operations Guide

---

## 1. EXECUTIVE SUMMARY & CORPORATE CONTEXT

Founded in 1959, **Hawkins Cookers Limited** is one of India's most respected household manufacturing institutions, operating manufacturing plants at **Thane (Maharashtra)**, **Hoshiarpur (Punjab)**, and **Jaunpur (Uttar Pradesh)**. 

Hawkins supplies over 105 cataloged pressure cooker, cookware, and spare parts variants through an extensive pan-Indian distribution network consisting of:
- **600+ Authorized Dealer Outlets & Retail Counters**
- **29 Primary Wholesale & Regional Distributors** (represented by 6 key channel archetypes)
- **Central Regional Finished Goods Depots**
- **3 Dedicated Assembly & Fabrication Plants**

### The Core Problem: The 173% "Smoking Gun" Disconnect
Historical empirical data revealed an extreme supply chain distortion:
- In the final 2-3 weeks of each financial quarter (March, June, September, December), **distributor primary orders surged by +173% above normal levels**.
- Simultaneously, actual **consumer kitchen offtake at retail counters was 4% below average**.
- This commercial quarter-end push resulted in an artificial **15.77x primary order bullwhip ratio ($T_2$)**, followed by post-quarter demand droughts, factory schedule turbulence, emergency overtime shifts, and high pipeline inventory carrying costs.

This simulation suite provides executive leadership with a mathematical sandbox to test alternative policies—specifically the **Proportional Order-Up-To (POUT)** replenishment mechanism and **Point-of-Sale (POS) data sharing**—to dismantle the bullwhip effect while safeguarding customer service levels.

---

## 2. SUPPLY CHAIN ARCHITECTURE: THE 5-TIER PIPELINE

The simulation models 104 contiguous calendar weeks across 5 distinct supply chain tiers:

\`\`\`
[ Tier 0: Consumer Kitchens ]
           │  (Offtake: ~39,000 units/wk across 12-SKU subset; Diwali 2.1x peak)
           ▼
[ Tier 1: Retail Dealers & Counters ]
           │  (Buffer: ~2.9 weeks cover; festive pre-building 1.5x)
           ▼
[ Tier 2: Primary Distributors ] ───▶ [ EPICENTRE OF BULLWHIP: 15.77x AS-IS ]
           │  (Quarter-end loading push + Trade quantity discount schemes)
           ▼
[ Tier 3: Central Distribution Depots ]
           │  (Buffer: 4.2 weeks cover; open-order book smoothing)
           ▼
[ Tier 4: Manufacturing Plants ]
              (Thane, Hoshiarpur, Jaunpur; Campaign batch sizes, 1.95x surge headroom)
\`\`\`

1. **Tier 0 (Consumer Offtake)**: True demand generated at retail kitchen counters across India. Exhibits strong seasonal festive surge (Diwali index of 2.11x) and long-term 12% annual compounding growth.
2. **Tier 1 (Secondary Sales)**: Sales made by distributors to 600+ retail dealers. Dealers hold ~2.9 weeks of stock and pre-build inventory prior to festive peaks.
3. **Tier 2 (Primary Orders)**: Purchase orders submitted by distributors to Hawkins central depots. This is the **primary epicenter** where commercial targets, quarter-end loading (+173%), trade schemes, and order batching distort the signal.
4. **Tier 3 (Central Depots)**: Central stockholding hubs buffering factory shipments. Operates on an open-order book backlog.
5. **Tier 4 (Factory Production)**: Finished goods manufacturing campaigns at plants subject to capacity surge headroom limits (1.95x baseline).

---

## 3. MATHEMATICAL METHODOLOGY & THE DETRENDING FORMULA

### Why Standard Variance Fails
In consumer durable supply chains with high seasonality (e.g. Diwali festive peaks where demand doubles), standard variance calculations mistakenly treat genuine seasonal peaks as "bullwhip". 

### Centered 13-Week Moving Average Detrending
To isolate artificial channel whiplash from true festive surges, the engine detrends each tier's national weekly volume series by dividing by a **centred 13-week moving average ($MA_{13}$)**:

$$\\text{Detrended}_t = \\frac{Y_t}{MA_{13}(Y)_t}$$

Where:
$$MA_{13}(Y)_t = \\frac{1}{13} \\sum_{j = -6}^{+6} Y_{t+j}$$

The **Bullwhip Ratio** for any Tier $k$ is rigorously defined as:

$$\\text{Bullwhip}(T_k) = \\frac{\\text{Var}\\left( \\text{Detrended}(T_k) \\right)}{\\text{Var}\\left( \\text{Detrended}(T_0) \\right)}$$

---

## 4. THE PROPORTIONAL ORDER-UP-TO (POUT) REPLENISHMENT LAW

Under legacy order-up-to policies, distributors attempt to correct 100% of their inventory gap in every cycle ($\alpha = 1.0$), causing extreme whiplash.

The **POUT algorithm** replaces this with proportional feedback:

$$O_t = \\hat{D}_t + \\alpha \\cdot \\left( S^* - I_t - R_t \\right)$$

Where:
- $O_t$: Order placed in week $t$
- $\\hat{D}_t$: Smoothed demand forecast for week $t$
- $\\alpha$: **POUT Damping Factor** ($0.10 \\le \\alpha \\le 1.00$)
- $S^*$: Target inventory level (Weeks of cover $\\times \\hat{D}_t$)
- $I_t$: Current on-hand inventory
- $R_t$: Pipeline inventory in transit

**Key Insight**: At $\\alpha = 0.35$, inventory deficit correction is gracefully amortized over ~3 weeks. High-frequency ordering noise is filtered out, dramatically smoothing orders upstream to factories.

---

## 5. BEHAVIORAL ANOMALY: "THE SERVICE TRAP"

A critical discovery of this simulation is the **Service Trap**:

> **The Phenomenon**: When order smoothing is applied aggressively ($\\alpha = 0.35$) without shared Point-of-Sale (POS) telemetry ($POS = 0\\%$), the Bullwhip Ratio falls from **15.77x down to 5.17x**. 
> However, **Consumer Service Level plummets from 97.5% down to 91.36%**, causing widespread stockouts during the critical Diwali festive surge!

### Root Cause
Because distributors only observe lagging secondary orders rather than live retail sell-through, their dampened orders cannot respond fast enough to sudden pre-Diwali demand surges.

### The Resolution
To break the Service Trap, order damping **must be coupled with POS data sharing** (\`pout-35-pos\`):
- Bullwhip drops to **2.60x** (an 83.5% reduction)
- Consumer Service Level rises to **98.56%**
- Primary Fill Rate reaches **96.14%**
- Pipeline inventory cover drops from **9.3 weeks down to 8.8 weeks**

---

## 6. GUIDE TO THE 6 CALIBRATION PRESETS

The tool provides 6 pre-configured, empirically calibrated policy configurations:

| Preset ID | Policy | $\\alpha$ | POS Share | Target BW ($T_2$) | Target Service | Status & Operational Profile |
|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **as-is** | AS-IS | N/A | 0% | **15.77x** | 85.58% | Legacy push, 173% quarter-end whiplash |
| **pout-100** | POUT | 1.00 | 0% | **13.28x** | 98.34% | Classical Order-Up-To without damping |
| **pout-60** | POUT | 0.60 | 0% | **8.18x** | 97.54% | Moderate damping, stable operations |
| **pout-35** | POUT | 0.35 | 0% | **5.17x** | **91.36%** | **SERVICE TRAP**: Festive stockouts occur |
| **pout-60-pos** | POUT | 0.60 | 100% | **4.79x** | 98.20% | Moderate damping + Shared retail counter POS |
| **pout-35-pos** | POUT | 0.35 | 100% | **2.60x** | **98.56%** | **GOLD STANDARD**: Minimal bullwhip + maximum service |

---

## 7. HOW TO NAVIGATE & USE THE WORKSPACES

### Tab 1: Executive Overview & Bullwhip
- **Smoking Gun Banner**: Real-time display of the quarter-end primary order surge vs true consumer offtake.
- **KPI Summary Cards**: Live metrics for Bullwhip Ratio ($T_2$), Consumer Service Level, Pipeline Inventory Cover, and Plant Volatility ($T_4$).
- **Multi-Tier 104-Week Order Series Chart**: Interactive time-series showing demand transmission across Tiers 0 to 4, with clean quarterly milestones and fiscal year-end boundaries.
- **Pipeline Inventory Level Trends Chart**: Direct 104-week comparison of total inventory and individual tier stocks (Distributor, Depot, Plant Finished Goods) between the current policy and AS-IS baseline.

### Tab 2: 2-Month Forward Order Range & Dispatch Forecast
- **Forward Horizon Engine**: Projects 8 to 9 weeks (~2 calendar months) into the operational future.
- **Empirical Prediction Intervals (P10 to P90)**: Quantifies statistical dispersion using negative binomial kitchen demand variance combined with centered MA13 seasonal decomposition.
- **Comparative Whiplash vs. Stabilized Dispatch**: Compares legacy AS-IS push behavior against POUT-damped replenishment with live POS telemetry.
- **SKU-Level Production Batch Recommendations**: Outlines specific weekly batch lot sizes across the 12 representative SKUs for Thane, Hoshiarpur, and Jaunpur plants.
- **Direct CSV Schedule Export**: Downloads detailed weekly dispatch plans for supply chain dispatch officers.

### Tab 3: Policy Sandbox & POUT Levers
- **Core Replenishment Policy Toggle**: Switch seamlessly between AS-IS (Legacy Push) and POUT (Order Damping).
- **Interactive Levers**:
  1. *POUT Damping Factor ($\\alpha$)*: Control smoothing aggressiveness ($0.10 - 1.00$).
  2. *POS Data Sharing Coverage*: Toggle counter visibility ($0\\% - 100\\%$).
  3. *Target Distributor Cover Weeks*: Set safety buffers ($1.5w - 6.0w$).
  4. *Quarter-End Push Intensity*: Eliminate or intensify quota push ($0\\% - 150\\%$).
  5. *Trade Scheme Depth & Frequency*: Adjust promotional discounts ($0\\% - 150\\%$).
  6. *Order Batching & MOQ Rounding*: Control case-pack constraints ($0\\% - 100\\%$).
  7. *Plant Surge Headroom*: Model factory capacity flexibility ($1.2x - 2.5x$).
- **Safety Valve Breach Monitor**: Alerts when weekly primary orders shift by $>45\\%$ week-on-week, requiring managerial interventions.

### Tab 3: 5-Tier Supply Chain Architecture & BOM
- **5-Tier Network Flow**: Detailed physical flow from retail counters to factory die-casting lines.
- **12-SKU National Subset**: Explore the representative subset comprising 39.8% of Hawkins national volume (Classic 5L, Contura Black, Tri-Ply SS, etc.).
- **6 Channel Partner Archetypes**: Review distributor profiles, ordering discipline, and scheme propensities.
- **Bill of Materials (BOM)**: Upstream breakdown linking finished cookers to aluminium ingots, SS 304 coils, bakelite handles, and silicone gaskets.

### Tab 4: Acceptance & Calibration Engine
- Automated verification matrix validating simulated outputs against verified empirical targets within $\\pm 15\\%$ tolerance.
- PRNG Seed Verification: Mulberry32 seed \`31071959\`.

---

## 8. STEP-BY-STEP WORKFLOW RECOMMENDATIONS

1. **Step 1: Baseline Review**
   - In **Executive Overview**, observe the \`as-is\` preset. Note the 15.77x Bullwhip and massive quarterly spikes on the chart.
2. **Step 2: Observe the Service Trap**
   - Click the **pout-35** preset. Note that Bullwhip falls to ~5.17x, but Service Level drops into the danger zone (~91.4%). Look at the warning callout in Policy Sandbox.
3. **Step 3: Resolve with POS Telemetry**
   - Select **pout-35-pos**. Observe how the inventory pipeline stabilizes, service level recovers to >98%, and working capital is freed.
4. **Step 4: Inspect Inventory Savings**
   - Review the **Pipeline Inventory Level Trends** chart in Executive Overview to see how total inventory is reduced by ~16% while completely eliminating post-spike inventory starvation.
5. **Step 5: Custom Stress Testing**
   - In Policy Sandbox, adjust Trade Schemes to 0% (Everyday Low Price - EDLP) and observe how factory schedules smooth out.

---
*Hawkins Cookers Limited — Supply Chain Operations Research & Analytics*
*Deterministic PRNG Mulberry32 Engine (Seed: 31071959)*
`;
