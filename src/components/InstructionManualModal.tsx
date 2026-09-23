import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  X,
  Printer,
  Copy,
  Check,
  FileText,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Zap,
  Layers,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { INSTRUCTION_MANUAL_MARKDOWN } from '../data/instructionManual';
import { generateManualPDF } from '../utils/pdfGenerator';

interface InstructionManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionManualModal: React.FC<InstructionManualModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('sec-1');

  if (!isOpen) return null;

  // Handle downloading executive-grade PDF document
  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    try {
      generateManualPDF();
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setTimeout(() => setIsGeneratingPdf(false), 800);
    }
  };

  // Handle downloading as a clean markdown file as secondary backup
  const handleDownloadMarkdown = () => {
    const blob = new Blob([INSTRUCTION_MANUAL_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Hawkins_Supply_Chain_Command_Instruction_Manual.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy full text to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(INSTRUCTION_MANUAL_MARKDOWN);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print manual
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#1f2937]/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Hawkins Bullwhip Command — Operations Manual</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                  Version 2.5
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official guide to the 5-Tier Supply Chain Simulation, POUT Damping Levers & Acceptance Tests
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-[#1f2937] hover:bg-slate-100 dark:hover:bg-[#374151] text-slate-700 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
              title="Copy markdown text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-[#1f2937] hover:bg-slate-100 dark:hover:bg-[#374151] text-slate-700 dark:text-slate-200 rounded-lg border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
              title="Download markdown source file"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Export .MD</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#374151] rounded-lg transition-colors border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1f2937]"
              title="Print operations guide"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center space-x-2 px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 rounded-lg shadow-sm transition-all border border-amber-600/30 disabled:opacity-60"
              title="Download complete operations manual in PDF format"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Guide'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#374151] rounded-lg transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two-column layout (Table of Contents + Content) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Quick Navigation Sidebar */}
          <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#111827]/90 p-4 hidden md:block overflow-y-auto shrink-0 text-xs">
            <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] mb-3">
              Table of Contents
            </div>
            <nav className="space-y-1">
              {[
                { id: 'sec-1', label: '1. Executive Summary & Context' },
                { id: 'sec-2', label: '2. The 5-Tier Supply Pipeline' },
                { id: 'sec-3', label: '3. Detrending & Bullwhip Formula' },
                { id: 'sec-4', label: '4. POUT Replenishment Law' },
                { id: 'sec-5', label: '5. The Service Trap Anomaly' },
                { id: 'sec-6', label: '6. The 6 Calibration Presets' },
                { id: 'sec-7', label: '7. Navigating the Workspaces' },
                { id: 'sec-8', label: '8. Recommended Step-by-Step' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                    activeSection === item.id
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  <ChevronRight className="w-3 h-3 shrink-0 opacity-40" />
                </button>
              ))}
            </nav>

            <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-800/60">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-[11px]">
                <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                Key Benchmark Rule
              </div>
              <p className="text-[11px] text-amber-800/90 dark:text-amber-300/80 mt-1 leading-relaxed">
                AS-IS Bullwhip is <strong>15.77x</strong>. The optimal target policy (<code>pout-35-pos</code>) cuts this to <strong>2.60x</strong> while preserving <strong>&gt;98%</strong> customer service.
              </p>
            </div>
          </aside>

          {/* Rendered Document Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {/* Section 1 */}
            <section id="sec-1" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Section 1
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                Executive Summary & Corporate Context
              </h3>
              <p>
                Founded in 1959, <strong>Hawkins Cookers Limited</strong> is one of India's flagship kitchenware manufacturers, with main fabrication plants in <strong>Thane (Maharashtra)</strong>, <strong>Hoshiarpur (Punjab)</strong>, and <strong>Jaunpur (Uttar Pradesh)</strong>.
              </p>
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl my-4 text-rose-950">
                <div className="font-bold flex items-center gap-2 text-rose-900">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  The 173% "Smoking Gun" Quarter-End Disconnect
                </div>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Empirical analysis reveals that in the closing 2-3 weeks of each financial quarter (March, June, September, December), <strong>distributor primary orders surge by +173%</strong> above normal, whereas <strong>true consumer offtake at retail counters is actually 4% below normal</strong>. This commercial volume push creates a massive <strong>15.77x Bullwhip Ratio ($T_2$)</strong>, causing plant schedule turbulence, post-quarter ordering slumps, and bloated pipeline inventory.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="sec-2" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Section 2
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                The 5-Tier Supply Chain Demand Pipeline
              </h3>
              <p>
                The simulation models 104 contiguous calendar weeks across the complete demand transmission pipeline:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 my-4">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-sky-600 text-xs">TIER 0</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">Consumer Offtake</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    True kitchen demand at dealer counters. Exhibits Diwali 2.1x festive surge and 12% trend.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-teal-600 text-xs">TIER 1</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">Secondary Sales</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Distributor sales to 600+ dealers. Dealers hold ~2.9 weeks cover and pre-build inventory.
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-300 p-3 rounded-xl shadow-sm">
                  <div className="font-bold text-amber-700 text-xs">TIER 2 (EPICENTER)</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">Primary Orders</div>
                  <p className="text-[11px] text-slate-700 mt-1 leading-snug">
                    Distributor orders to Hawkins depots. Driven by quarter loading (+173%) and trade schemes.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-indigo-600 text-xs">TIER 3</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">Depot Orders</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Hawkins central distribution depots. Operates open-order book and transit stock buffers.
                  </p>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="font-bold text-purple-600 text-xs">TIER 4</div>
                  <div className="font-bold text-slate-900 text-xs mt-0.5">Factory Production</div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    Campaign manufacturing at Thane & Hoshiarpur plants. Bound by 1.95x surge headroom.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="sec-3" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Section 3
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                Centered 13-Week Moving Average Detrending
              </h3>
              <p>
                To avoid mistaking genuine seasonal Diwali surges (where national demand doubles) for artificial channel whiplash, the engine detrends every tier's weekly volume series:
              </p>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-3">
                <code>
                  Detrended(t) = Volume(t) / MA13(Volume)(t)<br />
                  Bullwhip(Tier) = Variance(Detrended Tier) / Variance(Detrended Consumer Offtake)
                </code>
              </div>
              <p className="text-xs text-slate-600">
                This mathematical standard ensures that seasonal festive patterns pass through fairly, while artificial quarter-end pushes and scheme forward-buying are precisely quantified.
              </p>
            </section>

            {/* Section 4 */}
            <section id="sec-4" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Section 4
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                The Proportional Order-Up-To (POUT) Replenishment Law
              </h3>
              <p>
                Instead of attempting to replenish 100% of an inventory deficit in a single weekly cycle, POUT introduces a proportional feedback damping factor (&alpha;):
              </p>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs my-3">
                <code>
                  Order(t) = Forecast(t) + &alpha; &times; [TargetStock - InventoryPosition(t)]
                </code>
              </div>
              <p className="text-xs text-slate-600">
                At &alpha; = 0.35, deficit correction is spread gracefully over ~3 weeks. Order whiplash is filtered out, stabilizing depot order streams and factory production schedules.
              </p>
            </section>

            {/* Section 5 */}
            <section id="sec-5" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Section 5
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                Behavioral Discovery: The "Service Trap"
              </h3>
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl my-2">
                <div className="font-bold text-amber-900">Why Damping Alone Fails During Festive Surges:</div>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  When POUT damping is applied without POS data sharing (<code>pout-35</code>), Bullwhip plummets from 15.77x down to 5.17x. <strong>However, Consumer Service Level crashes from 97.5% to 91.36%</strong>, causing stockouts during Diwali! Distributors relying on lagging secondary orders cannot react quickly enough without live retail counter visibility.
                </p>
                <div className="mt-2 text-xs font-bold text-emerald-800 bg-emerald-100 p-2 rounded border border-emerald-300">
                  Resolution: Enable POS Data Sharing (<code>pout-35-pos</code>) &rarr; Bullwhip drops to 2.60x and Service Level rises to 98.56%!
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="sec-6" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Section 6
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                The 6 Calibration Presets
              </h3>
              <div className="overflow-x-auto my-3 border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-3 font-bold">Preset ID</th>
                      <th className="py-2.5 px-3 font-bold">Policy</th>
                      <th className="py-2.5 px-3 font-bold">&alpha;</th>
                      <th className="py-2.5 px-3 font-bold">POS Sharing</th>
                      <th className="py-2.5 px-3 font-bold">Bullwhip ($T_2$)</th>
                      <th className="py-2.5 px-3 font-bold">Service Level</th>
                      <th className="py-2.5 px-3 font-bold">Operational Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-rose-700">as-is</td>
                      <td className="py-2 px-3 font-semibold">AS-IS</td>
                      <td className="py-2 px-3 font-mono">-</td>
                      <td className="py-2 px-3 font-mono">0%</td>
                      <td className="py-2 px-3 font-mono font-bold text-rose-600">15.77x</td>
                      <td className="py-2 px-3 font-mono">85.58%</td>
                      <td className="py-2 px-3 text-[11px]">Legacy quarter push (+173%)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">pout-100</td>
                      <td className="py-2 px-3 font-semibold">POUT</td>
                      <td className="py-2 px-3 font-mono">1.00</td>
                      <td className="py-2 px-3 font-mono">0%</td>
                      <td className="py-2 px-3 font-mono font-bold">13.28x</td>
                      <td className="py-2 px-3 font-mono">98.34%</td>
                      <td className="py-2 px-3 text-[11px]">Classical Order-Up-To</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">pout-60</td>
                      <td className="py-2 px-3 font-semibold">POUT</td>
                      <td className="py-2 px-3 font-mono">0.60</td>
                      <td className="py-2 px-3 font-mono">0%</td>
                      <td className="py-2 px-3 font-mono font-bold">8.18x</td>
                      <td className="py-2 px-3 font-mono">97.54%</td>
                      <td className="py-2 px-3 text-[11px]">Moderate Damping</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-amber-50/50">
                      <td className="py-2 px-3 font-mono font-bold text-amber-800">pout-35</td>
                      <td className="py-2 px-3 font-semibold">POUT</td>
                      <td className="py-2 px-3 font-mono">0.35</td>
                      <td className="py-2 px-3 font-mono">0%</td>
                      <td className="py-2 px-3 font-mono font-bold">5.17x</td>
                      <td className="py-2 px-3 font-mono font-bold text-rose-600">91.36%</td>
                      <td className="py-2 px-3 text-[11px] font-bold text-amber-800">The Service Trap Anomaly</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-mono font-bold text-slate-800">pout-60-pos</td>
                      <td className="py-2 px-3 font-semibold">POUT</td>
                      <td className="py-2 px-3 font-mono">0.60</td>
                      <td className="py-2 px-3 font-mono">100%</td>
                      <td className="py-2 px-3 font-mono font-bold">4.79x</td>
                      <td className="py-2 px-3 font-mono">98.20%</td>
                      <td className="py-2 px-3 text-[11px]">Damping + Counter POS</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/60">
                      <td className="py-2 px-3 font-mono font-bold text-emerald-800">pout-35-pos</td>
                      <td className="py-2 px-3 font-semibold">POUT</td>
                      <td className="py-2 px-3 font-mono">0.35</td>
                      <td className="py-2 px-3 font-mono">100%</td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-700">2.60x</td>
                      <td className="py-2 px-3 font-mono font-bold text-emerald-700">98.56%</td>
                      <td className="py-2 px-3 text-[11px] font-bold text-emerald-800">GOLD STANDARD BENCHMARK</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 7 */}
            <section id="sec-7" className="scroll-mt-6 border-b border-slate-100 pb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                Section 7
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                Navigating the Workspaces
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 list-disc pl-5">
                <li>
                  <strong>Executive Overview & Bullwhip:</strong> View the primary Smoking Gun banner, the 4 high-level KPI cards, the 104-week multi-tier order transmission chart, and the 104-week pipeline inventory comparison line chart.
                </li>
                <li>
                  <strong>Policy Sandbox & POUT Levers:</strong> Fine-tune the POUT damping factor (&alpha;), POS sharing coverage, target cover weeks, trade scheme depths, and monitor the Safety Valve (&gt;45% WoW order swing guardrail).
                </li>
                <li>
                  <strong>5-Tier Supply Chain & BOM:</strong> Detailed structural diagrams, the 12 representative SKUs (39.8% national volume), 6 channel partner archetypes, and raw materials Bill of Materials.
                </li>
                <li>
                  <strong>Acceptance & Calibration Engine:</strong> Rigorous validation matrix verifying every preset against historical benchmarks within &plusmn;15% error bounds.
                </li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="sec-8" className="scroll-mt-6 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Section 8
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1.5 mb-3">
                Recommended Step-by-Step Walkthrough
              </h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <strong className="text-slate-800">Review Baseline (AS-IS):</strong> Inspect the 15.77x Bullwhip Ratio and the massive spike at quarter-ends. Note how factory production swings wildly.
                  </div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <strong className="text-slate-800">Trigger the Service Trap:</strong> Click preset <code>pout-35</code>. Notice Bullwhip drops to 5.17x, but Service Level drops to 91.36% with an explicit warning banner.
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <strong className="text-slate-800">Activate Optimal Benchmark:</strong> Click preset <code>pout-35-pos</code>. Bullwhip plunges to 2.60x while Service Level reaches 98.56%.
                  </div>
                </div>
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-sky-200 text-sky-900 font-bold flex items-center justify-center shrink-0">4</div>
                  <div>
                    <strong className="text-slate-800">Inspect Pipeline Inventory Savings:</strong> In Executive Overview, scroll to the new Pipeline Inventory Level Trends line chart to see working capital freed (~16% inventory reduction) and stock volatility eliminated.
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            PRNG Engine: Mulberry32 (Seed 31071959) &bull; Hawkins Cookers Limited Supply Chain OR
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
