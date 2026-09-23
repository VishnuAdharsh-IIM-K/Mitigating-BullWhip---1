import { jsPDF } from 'jspdf';
import { CALIBRATION_TARGETS, SKUS, PARTNERS } from '../data/hawkinsConstants';

/**
 * Generates an optimized, beautifully formatted, multi-page, executive-grade PDF Operations Manual.
 * Features:
 * - Proper mathematical vertical rhythm (never splits boxes across page boundaries)
 * - Cohesive professional grid layout with 18mm margins
 * - Structured table with crisp column widths, borders, and alternating rows
 * - High-contrast color styling for pristine physical printing and high-res digital reading
 * - Complete 8-section coverage with comprehensive operational instructions
 */
export function generateManualPDF(): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 18;
  const marginTop = 22;
  const marginBottom = 20;
  const contentWidth = pageWidth - marginX * 2; // 174 mm
  const maxY = pageHeight - marginBottom;

  let y = marginTop;

  // Track pages to render headers & footers uniformly at the end
  const addPageIfNeeded = (neededHeight: number) => {
    if (y + neededHeight > maxY) {
      doc.addPage();
      y = marginTop;
      drawPageFurniture();
    }
  };

  const drawPageFurniture = () => {
    // Top Crimson/Amber Brand Bar
    doc.setFillColor(180, 83, 9); // amber-700
    doc.rect(0, 0, pageWidth, 3.5, 'F');
    doc.setFillColor(200, 16, 46); // Hawkins Crimson accent tick
    doc.rect(0, 0, 32, 3.5, 'F');

    // Running top header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('HAWKINS COOKERS LIMITED', marginX, 12);

    doc.setFont('helvetica', 'normal');
    doc.text('SUPPLY CHAIN OPERATIONS RESEARCH & POLICY SUITE', marginX + 46, 12);
    doc.text('MANUAL v2.5 (OFFICIAL)', pageWidth - marginX, 12, { align: 'right' });

    // Subtle header rule
    doc.setDrawColor(218, 225, 233);
    doc.setLineWidth(0.25);
    doc.line(marginX, 14.5, pageWidth - marginX, 14.5);
  };

  // Draw furniture on page 1
  drawPageFurniture();

  // =========================================================================
  // COVER / HEADER BANNER
  // =========================================================================
  y = 24;

  // Document Badge
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(217, 119, 6); // amber-600
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, y, 48, 6.2, 1.2, 1.2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('OFFICIAL OPERATIONS MANUAL', marginX + 3.2, y + 4.3);
  y += 11;

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Hawkins Bullwhip Command Simulator', marginX, y);
  y += 6.5;

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text('Decision-Support & Policy Simulation Guide for 5-Tier Supply Chain Stabilization', marginX, y);
  y += 8.5;

  // Metadata Card Panel - Clean 4-row tabular specification table
  const metaRowH = 6.8;
  const metaTotalH = metaRowH * 4;
  const labelColW = 32;

  const metadataRows = [
    {
      label: 'Institution:',
      value: 'Hawkins Cookers Limited (Plants: Thane, Hoshiarpur, Jaunpur)',
    },
    {
      label: 'Scope of Study:',
      value: '12-SKU National Subset (39.8% Volume)  |  6 Channel Archetypes  |  104 Weeks',
    },
    {
      label: 'PRNG Seed:',
      value: '31071959 (Mulberry32 Deterministic Seed)',
    },
    {
      label: 'Algorithm:',
      value: 'POUT Damped Replenishment (Proportional Order-Up-To Policy)',
    },
  ];

  // Outer container
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.35);
  doc.roundedRect(marginX, y, contentWidth, metaTotalH, 1.5, 1.5, 'FD');

  // Vertical separator dividing labels from values
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.25);
  doc.line(marginX + labelColW, y, marginX + labelColW, y + metaTotalH);

  // Render each specification row
  metadataRows.forEach((row, idx) => {
    const rowY = y + idx * metaRowH;

    // Horizontal divider between rows
    if (idx > 0) {
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(marginX, rowY, marginX + contentWidth, rowY);
    }

    // Label cell background (subtle slate-100 tint)
    doc.setFillColor(241, 245, 249);
    doc.rect(marginX + 0.2, rowY + (idx === 0 ? 0.8 : 0.1), labelColW - 0.2, metaRowH - (idx === 0 || idx === 3 ? 0.9 : 0.2), 'F');

    // Label text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(row.label, marginX + 3.5, rowY + 4.6);

    // Value text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.text(row.value, marginX + labelColW + 4, rowY + 4.6);
  });

  y += metaTotalH + 7.5;

  // =========================================================================
  // TYPOGRAPHY & LAYOUT HELPERS
  // =========================================================================
  const addSectionHeading = (num: string, title: string) => {
    addPageIfNeeded(18);
    // Left decorative bar
    doc.setFillColor(217, 119, 6); // amber-600
    doc.rect(marginX, y, 3, 6.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(`${num}. ${title.toUpperCase()}`, marginX + 6, y + 5.2);

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(marginX + 6, y + 7.5, pageWidth - marginX, y + 7.5);
    y += 11;
  };

  const addParagraph = (text: string) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85); // slate-700
    const lines = doc.splitTextToSize(text, contentWidth);
    addPageIfNeeded(lines.length * 4.2 + 2);
    doc.text(lines, marginX, y);
    y += lines.length * 4.2 + 2.5;
  };

  const addBullet = (title: string, desc: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);

    const prefix = `•  ${title}: `;
    const fullText = `${prefix}${desc}`;
    const lines = doc.splitTextToSize(fullText, contentWidth - 4);
    addPageIfNeeded(lines.length * 4.2 + 1.5);

    // Draw bullet dot
    doc.circle(marginX + 2, y - 1, 0.9, 'F');

    // Render with formatted title on first line
    const titleWidth = doc.getTextWidth(`  ${title}: `);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`  ${title}:`, marginX + 3.5, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);

    // Split remaining description
    const descLines = doc.splitTextToSize(desc, contentWidth - 6 - titleWidth);
    if (descLines.length > 0) {
      doc.text(descLines[0], marginX + 4.5 + titleWidth, y);
      y += 4.2;
      for (let i = 1; i < descLines.length; i++) {
        addPageIfNeeded(4.2);
        doc.text(descLines[i], marginX + 6, y);
        y += 4.2;
      }
    } else {
      y += 4.2;
    }
  };

  // =========================================================================
  // SECTION 1: EXECUTIVE SUMMARY & THE SMOKING GUN
  // =========================================================================
  addSectionHeading('1', 'Executive Summary & The 173% Quarter-End Smoking Gun');
  addParagraph(
    'Founded in 1959, Hawkins Cookers Limited operates manufacturing facilities at Thane (Maharashtra), Hoshiarpur (Punjab), and Jaunpur (Uttar Pradesh). Over 105 cooker variants are delivered across India via 600+ retail dealers, 29 primary wholesale distributors, and 4 regional finished-goods depots.'
  );

  // Smoking gun callout box (Rendered as unified block)
  addPageIfNeeded(27);
  doc.setFillColor(254, 242, 242); // rose-50
  doc.setDrawColor(244, 63, 94); // rose-500
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, 23, 1.8, 1.8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(159, 18, 57); // rose-900
  doc.text('CRITICAL EMPIRICAL FINDING — THE QUARTER-END COMMERCIAL DISCONNECT:', marginX + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(136, 19, 55); // rose-800
  const smokingGunText =
    'In the final weeks of each financial quarter, distributor primary orders surge by +173% above normal levels, while actual consumer kitchen offtake at retail counters runs 4% below average. This quarterly sales push induces a severe 15.77x Bullwhip Ratio (T2), destabilizing plant production schedules and tying up significant working capital in channel inventory.';
  const sgLines = doc.splitTextToSize(smokingGunText, contentWidth - 10);
  doc.text(sgLines, marginX + 5, y + 10.5);
  y += 28;

  // =========================================================================
  // SECTION 2: THE 5-TIER SUPPLY CHAIN ARCHITECTURE
  // =========================================================================
  addSectionHeading('2', 'The 5-Tier Supply Chain Architecture');
  addParagraph(
    'The simulator tracks weekly physical and information flows across 5 distinct tiers over 104 contiguous calendar weeks (two full fiscal cycles):'
  );

  addBullet('Tier 0 (Consumer Kitchens)', 'Baseline retail offtake across India (~39,000 units/wk subset) featuring strong Diwali seasonality (2.1x peak). Bullwhip index = 1.00x.');
  addBullet('Tier 1 (Secondary Sales)', '600+ authorized retail dealer outlets holding ~2.9 weeks cover and pre-building stock 1.55x prior to the festive season. Bullwhip = ~2.81x.');
  addBullet('Tier 2 (Primary Orders)', 'Epicenter of volatility. 6 Channel Archetypes (representing 29 national distributors) ordering from Hawkins depots. AS-IS Bullwhip = 15.77x.');
  addBullet('Tier 3 (Central Depots)', 'Hawkins distribution warehouses buffering factory shipments with 4.2 weeks target cover and open-order backlog queueing. AS-IS Bullwhip = 46.03x.');
  addBullet('Tier 4 (Factory Production)', 'Assembly plants in Thane, Hoshiarpur, and Jaunpur operating on campaign run sizes (2.0 wks MOQ) with 1.95x surge capacity headroom. AS-IS Bullwhip = 20.17x.');
  y += 3;

  // =========================================================================
  // SECTION 3: MATHEMATICAL DETRENDING METHODOLOGY
  // =========================================================================
  addSectionHeading('3', 'Mathematical Methodology & Centered MA13 Detrending');
  addParagraph(
    'Conventional variance calculations produce false alarms in seasonal industries because authentic consumer holiday surges (e.g., Diwali doubling demand) would mistakenly be flagged as "bullwhip".'
  );

  // Formula Callout Box
  addPageIfNeeded(23);
  doc.setFillColor(240, 249, 255); // sky-50
  doc.setDrawColor(56, 189, 248); // sky-400
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, y, contentWidth, 19, 1.8, 1.8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(12, 74, 110); // sky-900
  doc.text('Centered 13-Week Moving Average Detrending Formula:', marginX + 5, y + 5.5);

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(3, 105, 161); // sky-700
  doc.text('Detrended_t = Y_t / MA13(Y)_t,  where MA13(Y)_t = (1/13) * SUM_{j=-6}^{+6} Y_{t+j}', marginX + 5, y + 10.8);
  doc.text('Bullwhip(Tier_k) = Var(Detrended Tier_k) / Var(Detrended Consumer Tier_0)', marginX + 5, y + 15.2);
  y += 24;

  addParagraph(
    'By dividing each weekly tier series by its centered 13-week moving average, long-term trends and festive seasonality are isolated, ensuring only artificial channel-induced whiplash is quantified.'
  );

  // =========================================================================
  // SECTION 4: POUT REPLENISHMENT LAW & DAMPING
  // =========================================================================
  addSectionHeading('4', 'Proportional Order-Up-To (POUT) Replenishment Law');
  addParagraph(
    'Under legacy order-up-to policies, distributors attempt to replace 100% of their stock deficit in a single week (alpha = 1.0), triggering violent upstream order amplification. The POUT policy applies proportional feedback damping:'
  );

  addPageIfNeeded(19);
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(74, 222, 128); // emerald-400
  doc.setLineWidth(0.3);
  doc.roundedRect(marginX, y, contentWidth, 15, 1.8, 1.8, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(21, 128, 61); // emerald-700
  doc.text('O_t = Forecast_t + alpha * (TargetStock - InventoryPosition_t)', marginX + 5, y + 5.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52); // emerald-800
  doc.text('Where alpha is the damping factor (0.10 to 1.00), spreading inventory adjustment over multiple weeks.', marginX + 5, y + 11);
  y += 20;

  // =========================================================================
  // SECTION 5: THE SERVICE TRAP DISCOVERY & RESOLUTION
  // =========================================================================
  addSectionHeading('5', 'The "Service Trap" Phenomenon & Dual-Lever Resolution');
  addParagraph(
    'A central finding of this research suite is identifying the Service Trap: When distributors apply aggressive order damping (alpha = 0.35) without live retail Point-of-Sale (POS) visibility, bullwhip drops from 15.77x to 5.17x, BUT Consumer Service Level collapses from 97.5% down to 91.36%, causing severe stockouts during festive peaks.'
  );
  addParagraph(
    'Resolution: Order damping MUST be paired with POS Counter Telemetry (pout-35-pos). With shared retail data, Bullwhip drops to an optimal 2.60x while Customer Service Level reaches an exceptional 98.56%.'
  );

  // =========================================================================
  // SECTION 6: CALIBRATION BENCHMARKS MATRIX (CLEAN DATA TABLE)
  // =========================================================================
  addSectionHeading('6', 'Calibration Benchmarks Matrix (6 Canonical Presets)');
  addParagraph(
    'Each operational preset is calibrated against empirical simulation baselines. All values below represent the deterministic benchmark targets:'
  );

  // Ensure table starts cleanly without splitting headers
  addPageIfNeeded(52);

  // Column definitions for 174mm width
  const cols = [
    { name: 'Preset ID', x: marginX, w: 26, align: 'left' as const },
    { name: 'Policy', x: marginX + 26, w: 18, align: 'left' as const },
    { name: 'Alpha', x: marginX + 44, w: 14, align: 'center' as const },
    { name: 'POS %', x: marginX + 58, w: 14, align: 'center' as const },
    { name: 'Target BW (T2)', x: marginX + 72, w: 24, align: 'right' as const },
    { name: 'Service %', x: marginX + 96, w: 20, align: 'right' as const },
    { name: 'Fill Rate %', x: marginX + 116, w: 20, align: 'right' as const },
    { name: 'Operational Significance', x: marginX + 136, w: 38, align: 'left' as const },
  ];

  // Draw Table Header
  doc.setFillColor(226, 232, 240); // slate-200
  doc.rect(marginX, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(30, 41, 59); // slate-800

  cols.forEach((col) => {
    const textX = col.align === 'right' ? col.x + col.w - 1.5 : col.align === 'center' ? col.x + col.w / 2 : col.x + 2;
    doc.text(col.name, textX, y + 4.8, { align: col.align });
  });

  doc.setDrawColor(148, 163, 184); // slate-400
  doc.setLineWidth(0.3);
  doc.line(marginX, y + 7, marginX + contentWidth, y + 7);
  y += 7.2;

  CALIBRATION_TARGETS.forEach((t, idx) => {
    addPageIfNeeded(6.5);

    const isGold = t.id === 'pout-35-pos';
    const isTrap = t.id === 'pout-35';

    // Row Background
    if (isGold) {
      doc.setFillColor(236, 253, 245); // emerald-50
      doc.rect(marginX, y, contentWidth, 6, 'F');
    } else if (isTrap) {
      doc.setFillColor(254, 242, 242); // rose-50
      doc.rect(marginX, y, contentWidth, 6, 'F');
    } else if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(marginX, y, contentWidth, 6, 'F');
    }

    doc.setFont('helvetica', isGold ? 'bold' : 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(isGold ? 6 : isTrap ? 159 : 30, isGold ? 95 : isTrap ? 18 : 41, isGold ? 70 : isTrap ? 57 : 59);

    // Render cells
    doc.text(t.id, cols[0].x + 2, y + 4.2);
    doc.text(t.policy, cols[1].x + 2, y + 4.2);
    doc.text(t.policy === 'ASIS' ? 'N/A' : t.alpha.toFixed(2), cols[2].x + cols[2].w / 2, y + 4.2, { align: 'center' });
    doc.text(t.posSharing > 0 ? '100%' : '0%', cols[3].x + cols[3].w / 2, y + 4.2, { align: 'center' });
    doc.text(t.bullwhipT2.toFixed(2) + 'x', cols[4].x + cols[4].w - 1.5, y + 4.2, { align: 'right' });
    doc.text(t.servicePct.toFixed(1) + '%', cols[5].x + cols[5].w - 1.5, y + 4.2, { align: 'right' });
    doc.text(t.primaryFillPct.toFixed(1) + '%', cols[6].x + cols[6].w - 1.5, y + 4.2, { align: 'right' });

    let profile = 'Intermediate';
    if (t.id === 'as-is') profile = 'Legacy Push (+173% surge)';
    else if (t.id === 'pout-100') profile = 'Undamped POUT (No POS)';
    else if (t.id === 'pout-60') profile = 'Moderate Damping';
    else if (t.id === 'pout-35') profile = 'SERVICE TRAP (Diwali stockout)';
    else if (t.id === 'pout-35-pos') profile = 'GOLD STANDARD (Best balance)';
    else if (t.id === 'pout-20-pos') profile = 'Heavy Damping + POS';

    doc.text(profile, cols[7].x + 2, y + 4.2);

    // Row divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.15);
    doc.line(marginX, y + 6, marginX + contentWidth, y + 6);

    y += 6.2;
  });
  y += 4;

  // =========================================================================
  // SECTION 7: STEP-BY-STEP OPERATOR WORKFLOW GUIDE
  // =========================================================================
  addSectionHeading('7', 'Step-by-Step Operator Workflow Guide');
  addBullet('Step 1: Baseline Audit', 'In Executive Overview, select AS-IS preset. Observe 15.77x Bullwhip and quarterly order surges.');
  addBullet('Step 2: Simulate Damping', 'Switch to pout-35 in Policy Sandbox. Bullwhip drops to 5.17x but warns of service degradation (91.4%).');
  addBullet('Step 3: Activate POS Telemetry', 'Select pout-35-pos. Confirm Bullwhip drops to 2.60x while Consumer Service Level recovers to 98.6%.');
  addBullet('Step 4: Pipeline Inventory Review', 'Review the Inventory Trends chart to observe the ~16% reduction in system inventory.');
  addBullet('Step 5: Verify Acceptance', 'Navigate to Acceptance & Calibration Check to verify all 6 presets pass empirical tests within +/-15% tolerance.');
  y += 3;

  // =========================================================================
  // SECTION 8: HARDWARE, SEEDING & REPRODUCIBILITY
  // =========================================================================
  addSectionHeading('8', 'PRNG Seeding & Verification Protocol');
  addParagraph(
    'The simulator is 100% deterministic, utilizing the Mulberry32 algorithm initialized with seed 31071959 (Hawkins founding date 31-July-1959). Consumer variance models negative binomial noise (r = 8.0). To verify exact calibration, run the built-in Acceptance & Calibration Suite.'
  );

  // =========================================================================
  // FOOTER & PAGE NUMBERING PASS
  // =========================================================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text('Hawkins Cookers Limited — Internal Operations Research & Policy Suite', marginX, pageHeight - 8.5);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - marginX, pageHeight - 8.5, { align: 'right' });
  }

  // Save the generated PDF
  doc.save('Hawkins_Bullwhip_Command_Operations_Manual.pdf');
}
