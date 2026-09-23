import React, { useState } from 'react';
import {
  Layers,
  Factory,
  Building2,
  Store,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
  Package,
  Wrench,
  Boxes
} from 'lucide-react';
import { SKUS, PARTNERS } from '../data/hawkinsConstants';
import { BOM_DATA } from '../data/bomData';

export const TiersArchitectureTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'tiers' | 'skus' | 'partners' | 'bom'>('tiers');
  const [skuSearch, setSkuSearch] = useState('');
  const [bomFilterSku, setBomFilterSku] = useState('ALL');

  const filteredSkus = SKUS.filter(
    (s) =>
      s.name.toLowerCase().includes(skuSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(skuSearch.toLowerCase()) ||
      s.family.toLowerCase().includes(skuSearch.toLowerCase())
  );

  const filteredBom = bomFilterSku === 'ALL' ? BOM_DATA : BOM_DATA.filter((b) => b.sku === bomFilterSku);

  return (
    <div className="space-y-6 pb-12">
      {/* Sub-navigation bar */}
      <div className="flex border-b border-slate-300 space-x-2">
        <button
          onClick={() => setActiveSubTab('tiers')}
          className={`py-2 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeSubTab === 'tiers'
              ? 'border-amber-600 text-amber-950 font-bold bg-white rounded-t-lg border-t border-x border-slate-300 -mb-px shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-[#e4e7ee] rounded-t-lg'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-amber-600" />
          5-Tier Network Flow
        </button>
        <button
          onClick={() => setActiveSubTab('skus')}
          className={`py-2 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeSubTab === 'skus'
              ? 'border-amber-600 text-amber-950 font-bold bg-white rounded-t-lg border-t border-x border-slate-300 -mb-px shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-[#e4e7ee] rounded-t-lg'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-amber-600" />
          12-SKU National Subset (39.8% Volume)
        </button>
        <button
          onClick={() => setActiveSubTab('partners')}
          className={`py-2 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeSubTab === 'partners'
              ? 'border-amber-600 text-amber-950 font-bold bg-white rounded-t-lg border-t border-x border-slate-300 -mb-px shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-[#e4e7ee] rounded-t-lg'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-amber-600" />
          6 Channel Partner Archetypes
        </button>
        <button
          onClick={() => setActiveSubTab('bom')}
          className={`py-2 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
            activeSubTab === 'bom'
              ? 'border-amber-600 text-amber-950 font-bold bg-white rounded-t-lg border-t border-x border-slate-300 -mb-px shadow-2xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-[#e4e7ee] rounded-t-lg'
          }`}
        >
          <Boxes className="w-3.5 h-3.5 text-amber-600" />
          Bill of Materials (BOM)
        </button>
      </div>

      {/* Subtab 1: 5-Tier Supply Chain Architecture */}
      {activeSubTab === 'tiers' && (
        <div className="space-y-6">
          <div className="bg-[#f8fafc] border border-slate-300 rounded-xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-1">
              Hawkins 5-Tier Supply Chain Demand Transmission Pipeline
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              How true consumer offtake at retail counters translates upstream into factory campaign production runs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* T0 Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-sky-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 font-mono">TIER 0</span>
                    <Users className="w-4 h-4 text-sky-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Consumer Offtake</h4>
                  <div className="text-[11px] text-slate-600 mt-2 space-y-1">
                    <div>
                      <strong className="text-slate-800">Location:</strong> Kitchens & retail counters across India
                    </div>
                    <div>
                      <strong className="text-slate-800">Volume:</strong> ~39,000 units/wk subset
                    </div>
                    <div>
                      <strong className="text-slate-800">Pattern:</strong> High festive seasonality (Diwali 2.1x) + steady 12% annual trend.
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-sky-700 font-bold">
                  Baseline Signal (Bullwhip: 1.00x)
                </div>
              </div>

              {/* T1 Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-teal-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-teal-700 font-mono">TIER 1</span>
                    <Store className="w-4 h-4 text-teal-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Secondary Sales</h4>
                  <div className="text-[11px] text-slate-600 mt-2 space-y-1">
                    <div>
                      <strong className="text-slate-800">Actors:</strong> 600+ Dealers, utensil shops & modern trade
                    </div>
                    <div>
                      <strong className="text-slate-800">Stock Buffer:</strong> 2.9 weeks cover
                    </div>
                    <div>
                      <strong className="text-slate-800">Pre-build:</strong> Dealers stock up 1.5x prior to festival weeks.
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-teal-700 font-bold">
                  Bullwhip: ~1.30x (Buffer lag)
                </div>
              </div>

              {/* T2 Card - Epicenter */}
              <div className="bg-amber-50/70 p-4 rounded-xl border-2 border-amber-400 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-amber-200/50 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 font-mono">TIER 2 (Epicenter)</span>
                    <Building2 className="w-4 h-4 text-amber-700" />
                  </div>
                  <h4 className="text-sm font-bold text-amber-950 mt-1">Primary Orders</h4>
                  <div className="text-[11px] text-slate-700 mt-2 space-y-1">
                    <div>
                      <strong className="text-slate-900">Actors:</strong> 6 Channel Partner Archetypes
                    </div>
                    <div>
                      <strong className="text-slate-900">Target Cover:</strong> 3.5 weeks
                    </div>
                    <div>
                      <strong className="text-amber-900">Distortions:</strong> Quarter-End loading (+173%), Scheme forward buying, MOQ batching.
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-300 text-[10px] text-amber-900 font-extrabold">
                  AS-IS Bullwhip: 15.77x &rarr; POUT: 2.60x
                </div>
              </div>

              {/* T3 Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-indigo-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 font-mono">TIER 3</span>
                    <Layers className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Depot Replenishment</h4>
                  <div className="text-[11px] text-slate-600 mt-2 space-y-1">
                    <div>
                      <strong className="text-slate-800">Facility:</strong> Hawkins Central Distribution Depots
                    </div>
                    <div>
                      <strong className="text-slate-800">Target Cover:</strong> 4.2 weeks
                    </div>
                    <div>
                      <strong className="text-slate-800">Mechanism:</strong> Open order book backlogs & transit buffers.
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-indigo-700 font-bold">
                  Central Buffer Absorption
                </div>
              </div>

              {/* T4 Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-purple-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 font-mono">TIER 4</span>
                    <Factory className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">Factory Production</h4>
                  <div className="text-[11px] text-slate-600 mt-2 space-y-1">
                    <div>
                      <strong className="text-slate-800">Plants:</strong> Thane, Hoshiarpur, Jaunpur
                    </div>
                    <div>
                      <strong className="text-slate-800">Constraints:</strong> Campaign run sizes (2.4 wks MOQ), die changeover setup.
                    </div>
                    <div>
                      <strong className="text-slate-800">Surge Headroom:</strong> 1.95x weekly base
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-[10px] text-purple-700 font-bold">
                  Factory Campaign Volatility
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: 12-SKU National Subset */}
      {activeSubTab === 'skus' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                12 Representative SKUs (39.8% of Hawkins National Volume)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                The core simulation subset capturing pressure cookers across Classic, Contura, Futura, Miss Mary, and Induction lines.
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU code, name..."
                value={skuSearch}
                onChange={(e) => setSkuSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">Code</th>
                  <th className="py-2.5 px-3 font-bold">SKU Name</th>
                  <th className="py-2.5 px-3 font-bold">Family</th>
                  <th className="py-2.5 px-3 font-bold">Plant</th>
                  <th className="py-2.5 px-3 font-bold text-right">MRP (₹)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Dist. Price (₹)</th>
                  <th className="py-2.5 px-3 font-bold text-right">Case Pack</th>
                  <th className="py-2.5 px-3 font-bold text-right">Weekly Base</th>
                  <th className="py-2.5 px-3 font-bold text-center">Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSkus.map((sku) => (
                  <tr key={sku.code} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{sku.code}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{sku.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sku.family}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sku.plant}</td>
                    <td className="py-2.5 px-3 text-right">₹{sku.mrpINR.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">₹{sku.distributorPriceINR.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{sku.casePack}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                      {sku.weeklyBaseUnits.toLocaleString()} u
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          sku.abc === 'A'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                            : sku.abc === 'B'
                            ? 'bg-sky-50 text-sky-700 border border-sky-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {sku.abc}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: 6 Channel Partner Archetypes */}
      {activeSubTab === 'partners' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              6 Channel Partner Archetypes (Simulating 29 National Distributors)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reflecting actual Indian distribution channels: Modern Retail, Regional Wholesalers, CSD Canteens, and Semi-Urban Stockists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PARTNERS.map((p) => (
              <div key={p.code} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-700">{p.code}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-white text-slate-700 rounded font-semibold border border-slate-200 shadow-xs">
                      {p.channel}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1.5">{p.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Represents <strong className="text-slate-800">{p.representsRealPartners} real partners</strong> (
                    {Math.round(p.demandWeight * 100)}% volume share)
                  </div>

                  <div className="space-y-2 mt-3 pt-3 border-t border-slate-200 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Quarter-End Propensity:</span>
                      <span className="font-bold text-rose-600">{Math.round(p.qtrEndLoadingPropensity * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Scheme Responsiveness:</span>
                      <span className="font-bold text-amber-700">{Math.round(p.schemeResponsiveness * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Order Discipline:</span>
                      <span className="font-bold text-slate-800">{Math.round(p.orderDiscipline * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Target Cover Weeks:</span>
                      <span className="font-bold text-sky-700">{p.targetCoverWeeks.toFixed(1)} wks</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500">POS Data Sharing:</span>
                  <span
                    className={`flex items-center gap-1 font-semibold text-[11px] ${
                      p.sharesSecondaryData ? 'text-emerald-700' : 'text-slate-400'
                    }`}
                  >
                    {p.sharesSecondaryData ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                    {p.sharesSecondaryData ? 'EDI Capable' : 'Manual / No EDI'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Bill of Materials (BOM) */}
      {activeSubTab === 'bom' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Bill of Materials (BOM) & Upstream Raw Material Dependencies
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Upstream tier linking finished pressure cooker assembly to raw aluminium ingots, SS 304, bakelite, and gaskets.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-semibold">Filter SKU:</span>
              <select
                value={bomFilterSku}
                onChange={(e) => setBomFilterSku(e.target.value)}
                className="bg-white text-xs font-semibold text-slate-800 rounded px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              >
                <option value="ALL">All SKUs</option>
                {SKUS.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                  <th className="py-2.5 px-3 font-bold">SKU</th>
                  <th className="py-2.5 px-3 font-bold">Sub-Assembly</th>
                  <th className="py-2.5 px-3 font-bold">Component Code</th>
                  <th className="py-2.5 px-3 font-bold">Description</th>
                  <th className="py-2.5 px-3 font-bold text-right">Qty Per Unit</th>
                  <th className="py-2.5 px-3 font-bold text-right">Scrap %</th>
                  <th className="py-2.5 px-3 font-bold text-right">Effective Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBom.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{item.sku}</td>
                    <td className="py-2.5 px-3 text-slate-900 font-semibold">{item.subAssembly}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{item.component}</td>
                    <td className="py-2.5 px-3 text-slate-700">{item.description}</td>
                    <td className="py-2.5 px-3 text-right">
                      {item.qtyPer} {item.uom}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{item.scrapPct}%</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                      {item.effectiveQtyPer.toFixed(3)} {item.uom}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
