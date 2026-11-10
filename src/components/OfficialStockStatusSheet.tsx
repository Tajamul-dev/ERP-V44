import React, { useState, useEffect } from 'react';
import {
  StockStatusData,
  INITIAL_STOCK_STATUS_11_10_2026,
  OilCategory,
  HoneyCategory,
} from '../utils/stockStatusData';
import {
  Printer,
  FileDown,
  Search,
  Edit3,
  Save,
  RotateCcw,
  CheckCircle2,
  PackageCheck,
  FileText,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';
import { GLOBAL_FUTURA_LOGO_PATH } from '../utils/constants';
import { SoundEngine } from '../utils/audio';

interface OfficialStockStatusSheetProps {
  onNotify?: (msg: string) => void;
}

export const OfficialStockStatusSheet: React.FC<OfficialStockStatusSheetProps> = ({
  onNotify,
}) => {
  const [data, setData] = useState<StockStatusData>(() => {
    try {
      const saved = localStorage.getItem('gfi_stock_status_11_10_2026');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STOCK_STATUS_11_10_2026;
  });

  const [activePage, setActivePage] = useState<'all' | '1' | '2' | '3'>('all');
  const [isEditable, setIsEditable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveData = () => {
    try {
      localStorage.setItem('gfi_stock_status_11_10_2026', JSON.stringify(data));
      SoundEngine.play('success');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      onNotify?.('✅ Stock Status sheet updated and saved to storage.');
    } catch {
      onNotify?.('Error saving stock status.');
    }
  };

  const handleResetToDefault = () => {
    if (confirm('Reset Stock Status to original 11/10/2026 PDF values?')) {
      setData(INITIAL_STOCK_STATUS_11_10_2026);
      localStorage.removeItem('gfi_stock_status_11_10_2026');
      SoundEngine.play('pop');
      onNotify?.('Stock Status reset to authentic PDF records.');
    }
  };

  const handleUpdateOilItem = (
    column: 'left' | 'right',
    catIdx: number,
    itemIdx: number,
    patch: { pallets?: number; cases?: number }
  ) => {
    setData(prev => {
      const colKey = column === 'left' ? 'page1Left' : 'page1Right';
      const newCols = [...prev[colKey]];
      const newCat = { ...newCols[catIdx] };
      const newItems = [...newCat.items];
      newItems[itemIdx] = { ...newItems[itemIdx], ...patch };
      newCat.items = newItems;
      newCols[catIdx] = newCat;
      return { ...prev, [colKey]: newCols };
    });
  };

  const handleUpdateHoneyItem = (
    catIdx: number,
    itemIdx: number,
    patch: { pallets?: number; cases?: number; remarks?: string }
  ) => {
    setData(prev => {
      const newHoney = [...prev.page2Honey];
      const newCat = { ...newHoney[catIdx] };
      const newItems = [...newCat.items];
      newItems[itemIdx] = { ...newItems[itemIdx], ...patch };
      newCat.items = newItems;
      newHoney[catIdx] = newCat;
      return { ...prev, page2Honey: newHoney };
    });
  };

  const handleAddOilItem = (column: 'left' | 'right', catIdx: number) => {
    setData(prev => {
      const colKey = column === 'left' ? 'page1Left' : 'page1Right';
      const newCols = [...prev[colKey]];
      const newCat = { ...newCols[catIdx] };
      const newItem = {
        id: `oil-${Date.now()}`,
        name: `${newCat.items.length + 1}) New Pack Size`,
        packSize: '1 Ltr x 12',
        palletsPerUnit: 60,
        pallets: 0,
        cases: 0,
      };
      newCat.items = [...newCat.items, newItem];
      newCols[catIdx] = newCat;
      return { ...prev, [colKey]: newCols };
    });
    SoundEngine.play('pop');
  };

  const handleDeleteOilItem = (column: 'left' | 'right', catIdx: number, itemIdx: number) => {
    setData(prev => {
      const colKey = column === 'left' ? 'page1Left' : 'page1Right';
      const newCols = [...prev[colKey]];
      const newCat = { ...newCols[catIdx] };
      newCat.items = newCat.items.filter((_, i) => i !== itemIdx);
      newCols[catIdx] = newCat;
      return { ...prev, [colKey]: newCols };
    });
    SoundEngine.play('thud');
  };

  const handleAddHoneyItem = (catIdx: number) => {
    setData(prev => {
      const newHoney = [...prev.page2Honey];
      const newCat = { ...newHoney[catIdx] };
      const newItem = {
        id: `h-item-${Date.now()}`,
        srNo: newCat.items.length + 1,
        packDescription: 'NEW PACKING DESCRIPTION',
        unitsPerPallet: 100,
        pallets: 0,
        cases: 0,
        brand: 'AL SIHA',
        expiryDate: '12/2028',
        remarks: 'New Lot',
      };
      newCat.items = [...newCat.items, newItem];
      newHoney[catIdx] = newCat;
      return { ...prev, page2Honey: newHoney };
    });
    SoundEngine.play('pop');
  };

  const handleDeleteHoneyItem = (catIdx: number, itemIdx: number) => {
    setData(prev => {
      const newHoney = [...prev.page2Honey];
      const newCat = { ...newHoney[catIdx] };
      newCat.items = newCat.items.filter((_, i) => i !== itemIdx);
      newHoney[catIdx] = newCat;
      return { ...prev, page2Honey: newHoney };
    });
    SoundEngine.play('thud');
  };

  const calculateTotalCasesForOil = (palletsPerUnit: number, pallets: number, cases: number) => {
    return palletsPerUnit * (pallets || 0) + (cases || 0);
  };

  return (
    <div className="space-y-4 font-sans select-text">
      {/* Top Toolbar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
            <PackageCheck className="w-4 h-4" />
            <span>Official Warehouse Stock Format</span>
          </div>

          {/* Page navigation */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActivePage('all')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activePage === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All 3 Pages
            </button>
            <button
              type="button"
              onClick={() => setActivePage('1')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activePage === '1'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Page 1: Edible Oils
            </button>
            <button
              type="button"
              onClick={() => setActivePage('2')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activePage === '2'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Page 2: Honey Stock
            </button>
            <button
              type="button"
              onClick={() => setActivePage('3')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activePage === '3'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Page 3: Sauces & Rice
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter item or SKU..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 w-44 focus:w-60 transition-all focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Edit mode toggle */}
          <button
            type="button"
            onClick={() => {
              setIsEditable(!isEditable);
              SoundEngine.play('pop');
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isEditable
                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs'
                : 'border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditable ? 'Editing Mode Active' : 'Edit Pallets/Cases'}</span>
          </button>

          {isEditable && (
            <button
              type="button"
              onClick={handleSaveData}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedSuccess ? 'Saved!' : 'Save Changes'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <a
            href="/assets/aistudio/Stock_Status_-_11.10.2026_bb314144.pdf"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5"
            title="Download or view authentic PDF in new tab"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View PDF</span>
          </a>
        </div>
      </div>

      {/* DOCUMENT CONTAINER - 100% REPLICA OF ATTACHED PDF */}
      <div className="bg-white text-black p-4 sm:p-8 max-w-[960px] mx-auto border border-slate-300 shadow-md print:shadow-none print:border-none print:p-0 print:max-w-none text-xs">
        {/* ================= PAGE 1 ================= */}
        {(activePage === 'all' || activePage === '1') && (
          <div className="mb-12 print:mb-0 print:break-after-page">
            {/* Header: Logo and Yellow Title Banner */}
            <div className="flex flex-col items-center justify-center mb-4">
              <img
                src={GLOBAL_FUTURA_LOGO_PATH}
                alt="Global Futura Inc"
                className="h-16 w-auto object-contain mb-2"
              />
              <div className="w-full bg-[#FFFF00] border border-black text-center py-1.5 px-3">
                {isEditable ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-black">
                    <span>INVENTORY STATUS Up to Invoice</span>
                    <input
                      type="text"
                      value={data.invoiceCutoff}
                      onChange={e => setData(d => ({ ...d, invoiceCutoff: e.target.value }))}
                      className="px-1.5 py-0.5 border border-black bg-white w-24 text-center font-bold"
                    />
                    <span>as on dated</span>
                    <input
                      type="text"
                      value={data.asOnDate}
                      onChange={e => setData(d => ({ ...d, asOnDate: e.target.value }))}
                      className="px-1.5 py-0.5 border border-black bg-white w-28 text-center font-bold"
                    />
                  </div>
                ) : (
                  <h1 className="font-bold text-[13px] sm:text-[14px] text-black tracking-tight uppercase">
                    INVENTORY STATUS Up to Invoice {data.invoiceCutoff} as on dated {data.asOnDate}
                  </h1>
                )}
              </div>
            </div>

            {/* Page 1 Grid (2 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border border-black p-2">
              {/* Left Column */}
              <div className="space-y-3">
                {data.page1Left.map((cat, catIdx) => (
                  <div key={cat.id} className="border border-black overflow-hidden">
                    <div className="bg-[#FFFF00] border-b border-black font-bold px-2 py-0.5 text-[11px] text-black">
                      {cat.title}
                    </div>
                    <table className="w-full text-[10.5px] border-collapse">
                      <tbody>
                        {cat.items.map((it, itemIdx) => {
                          const isMatch = !searchTerm || it.name.toLowerCase().includes(searchTerm.toLowerCase());
                          if (!isMatch) return null;
                          return (
                            <tr
                              key={it.id}
                              className={`border-b border-slate-300 last:border-b-0 ${
                                it.isPlain ? 'italic text-slate-700' : 'text-black'
                              }`}
                            >
                              <td className="py-1 px-2 font-medium w-1/2">
                                {it.name}
                              </td>
                              <td className="py-1 px-2 font-mono text-right tabular-nums">
                                {isEditable ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <span>{it.palletsPerUnit} x</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={it.pallets}
                                      onChange={e =>
                                        handleUpdateOilItem('left', catIdx, itemIdx, {
                                          pallets: parseInt(e.target.value, 10) || 0,
                                        })
                                      }
                                      className="w-12 px-1 py-0.5 border border-slate-400 font-bold text-center bg-yellow-50"
                                    />
                                    <span>Pallets &</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={it.cases}
                                      onChange={e =>
                                        handleUpdateOilItem('left', catIdx, itemIdx, {
                                          cases: parseInt(e.target.value, 10) || 0,
                                        })
                                      }
                                      className="w-12 px-1 py-0.5 border border-slate-400 font-bold text-center bg-yellow-50"
                                    />
                                    <span>Cases</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteOilItem('left', catIdx, itemIdx)}
                                      className="p-1 text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                                      title="Delete row"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <span>
                                    {it.palletsPerUnit} x {it.pallets} Pallets &amp; {it.cases} Cases
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {isEditable && (
                      <div className="p-1 bg-yellow-50/70 border-t border-black text-center">
                        <button
                          type="button"
                          onClick={() => handleAddOilItem('left', catIdx)}
                          className="text-[10px] font-bold text-blue-700 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Row to {cat.title}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {data.page1Right.map((cat, catIdx) => (
                  <div key={cat.id} className="border border-black overflow-hidden">
                    <div className="bg-[#FFFF00] border-b border-black font-bold px-2 py-0.5 text-[11px] text-black">
                      {cat.title}
                    </div>
                    <table className="w-full text-[10.5px] border-collapse">
                      <tbody>
                        {cat.items.map((it, itemIdx) => {
                          const isMatch = !searchTerm || it.name.toLowerCase().includes(searchTerm.toLowerCase());
                          if (!isMatch) return null;
                          return (
                            <tr
                              key={it.id}
                              className={`border-b border-slate-300 last:border-b-0 ${
                                it.isPlain ? 'italic text-slate-700' : 'text-black'
                              }`}
                            >
                              <td className="py-1 px-2 font-medium w-1/2">
                                {it.name}
                              </td>
                              <td className="py-1 px-2 font-mono text-right tabular-nums">
                                {isEditable ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <span>{it.palletsPerUnit} x</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={it.pallets}
                                      onChange={e =>
                                        handleUpdateOilItem('right', catIdx, itemIdx, {
                                          pallets: parseInt(e.target.value, 10) || 0,
                                        })
                                      }
                                      className="w-12 px-1 py-0.5 border border-slate-400 font-bold text-center bg-yellow-50"
                                    />
                                    <span>Pallets &</span>
                                    <input
                                      type="number"
                                      min={0}
                                      value={it.cases}
                                      onChange={e =>
                                        handleUpdateOilItem('right', catIdx, itemIdx, {
                                          cases: parseInt(e.target.value, 10) || 0,
                                        })
                                      }
                                      className="w-12 px-1 py-0.5 border border-slate-400 font-bold text-center bg-yellow-50"
                                    />
                                    <span>Cases</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteOilItem('right', catIdx, itemIdx)}
                                      className="p-1 text-rose-500 hover:text-rose-700 ml-1 cursor-pointer"
                                      title="Delete row"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <span>
                                    {it.palletsPerUnit} x {it.pallets} Pallets &amp; {it.cases} Cases
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {isEditable && (
                      <div className="p-1 bg-yellow-50/70 border-t border-black text-center">
                        <button
                          type="button"
                          onClick={() => handleAddOilItem('right', catIdx)}
                          className="text-[10px] font-bold text-blue-700 hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>+ Add Row to {cat.title}</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= PAGE 2: HONEY INVENTORY ================= */}
        {(activePage === 'all' || activePage === '2') && (
          <div className="mb-12 print:mb-0 print:break-after-page">
            {/* Header: Logo and Yellow Title Banner */}
            <div className="flex flex-col items-center justify-center mb-4">
              <img
                src={GLOBAL_FUTURA_LOGO_PATH}
                alt="Global Futura Inc"
                className="h-16 w-auto object-contain mb-2"
              />
              <div className="w-full bg-[#FFFF00] border border-black text-center py-1.5 px-3">
                {isEditable ? (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-black">
                    <span>INVENTORY STATUS Up to Invoice</span>
                    <input
                      type="text"
                      value={data.invoiceCutoff}
                      onChange={e => setData(d => ({ ...d, invoiceCutoff: e.target.value }))}
                      className="px-1.5 py-0.5 border border-black bg-white w-24 text-center font-bold"
                    />
                    <span>as on dated</span>
                    <input
                      type="text"
                      value={data.asOnDate}
                      onChange={e => setData(d => ({ ...d, asOnDate: e.target.value }))}
                      className="px-1.5 py-0.5 border border-black bg-white w-28 text-center font-bold"
                    />
                  </div>
                ) : (
                  <h2 className="font-bold text-[13px] sm:text-[14px] text-black tracking-tight uppercase">
                    INVENTORY STATUS Up to Invoice {data.invoiceCutoff} as on dated {data.asOnDate}
                  </h2>
                )}
              </div>
            </div>

            {/* Honey Sections Table */}
            <div className="border border-black space-y-2 p-2">
              {data.page2Honey.map((cat, catIdx) => (
                <div key={cat.id} className="border border-slate-400 overflow-hidden">
                  <div className="grid grid-cols-12 bg-[#FFFF00] border-b border-slate-400 font-bold px-2 py-0.5 text-[11px] text-black">
                    <div className="col-span-5">{cat.title}</div>
                    <div className="col-span-3 text-center">Brand</div>
                    <div className="col-span-2 text-center">Expiry Date</div>
                    <div className="col-span-2 text-right">Remarks</div>
                  </div>

                  <table className="w-full text-[10.5px] border-collapse">
                    <tbody>
                      {cat.items.map((it, itemIdx) => {
                        const isMatch =
                          !searchTerm ||
                          it.packDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          it.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (it.remarks || '').toLowerCase().includes(searchTerm.toLowerCase());
                        if (!isMatch) return null;

                        return (
                          <tr key={it.id} className="border-b border-slate-200 last:border-b-0 hover:bg-yellow-50/40">
                            <td className="py-1 px-2 w-[42%]">
                              <span className="font-bold mr-2">{it.srNo}</span>
                              <span>{it.packDescription}</span>
                            </td>
                            <td className="py-1 px-2 font-mono tabular-nums text-right w-[25%]">
                              {isEditable ? (
                                <div className="flex items-center justify-end gap-1">
                                  {it.unitsPerPallet && <span>{it.unitsPerPallet} X</span>}
                                  {it.pallets !== undefined && (
                                    <>
                                      <input
                                        type="number"
                                        min={0}
                                        value={it.pallets}
                                        onChange={e =>
                                          handleUpdateHoneyItem(catIdx, itemIdx, {
                                            pallets: parseInt(e.target.value, 10) || 0,
                                          })
                                        }
                                        className="w-10 px-1 py-0.5 border border-slate-400 text-center font-bold"
                                      />
                                      <span>Pallets &amp;</span>
                                    </>
                                  )}
                                  <input
                                    type="number"
                                    min={0}
                                    value={it.cases}
                                    onChange={e =>
                                      handleUpdateHoneyItem(catIdx, itemIdx, {
                                        cases: parseInt(e.target.value, 10) || 0,
                                      })
                                    }
                                    className="w-12 px-1 py-0.5 border border-slate-400 text-center font-bold"
                                  />
                                  <span>Cases</span>
                                </div>
                              ) : (
                                <span>
                                  {it.unitsPerPallet ? `${it.unitsPerPallet} X ` : ''}
                                  {it.pallets !== undefined ? `${it.pallets} Pallets & ` : '& '}
                                  {it.cases} Cases
                                </span>
                              )}
                            </td>
                            <td className="py-1 px-2 text-center font-semibold w-[13%]">
                              {it.brand}
                            </td>
                            <td className="py-1 px-2 text-center text-slate-700 w-[10%]">
                              {it.expiryDate || '-'}
                            </td>
                            <td className="py-1 px-2 text-right font-medium text-rose-700 w-[10%]">
                              {it.remarks || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PAGE 3: MAYONNAISE, TOMATO KETCHUP & OTHER STOCK ================= */}
        {(activePage === 'all' || activePage === '3') && (
          <div className="space-y-4">
            {/* Header for Page 3 */}
            <div className="flex flex-col items-center justify-center mb-2">
              <img
                src={GLOBAL_FUTURA_LOGO_PATH}
                alt="Global Futura Inc"
                className="h-14 w-auto object-contain mb-1"
              />
              <div className="w-full bg-[#FFFF00] border border-black text-center py-1 px-3">
                <h3 className="font-bold text-[12.5px] text-black tracking-tight uppercase">
                  INVENTORY STATUS — Sauces, Condiments &amp; Partner Warehouse Stock
                </h3>
              </div>
            </div>

            {/* Mayonnaise Section */}
            <div className="border border-black overflow-hidden">
              <div className="bg-[#FFFF00] border-b border-black font-bold px-2.5 py-0.5 text-[11px] text-black">
                MAYONNAISE
              </div>
              <div className="p-2 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold mr-2">1)</span>
                  <span className="font-bold">VITAL MAYONNAISE GALLON 3.78 LTR</span>
                  <span className="text-slate-600 ml-2 font-mono">(3.78 LTR X 4 PCS PER CARTON)</span>
                </div>
                <div className="font-bold font-mono">34 Cases</div>
              </div>
            </div>

            {/* Tomato Ketchup Section */}
            <div className="border border-black overflow-hidden">
              <div className="bg-[#FFFF00] border-b border-black font-bold px-2.5 py-0.5 text-[11px] text-black">
                TOMATO KETCHUP
              </div>
              <div className="p-2 flex items-center justify-between text-[11px]">
                <div>
                  <span className="font-bold mr-2">1)</span>
                  <span className="font-bold">VITAL - TOMATO KETCHUP 5 KG</span>
                  <span className="text-slate-600 ml-2 font-mono">(5 KG X 4 PCS PER CARTON)</span>
                </div>
                <div className="font-bold font-mono">89 Cases</div>
              </div>
            </div>

            {/* Other Stock - Akal Supermarket */}
            <div className="border border-black overflow-hidden">
              <div className="bg-[#FFFF00] border-b border-black font-bold px-2.5 py-0.5 text-[11px] text-black">
                Other Stock - Akal Supermarket
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black p-2 gap-4">
                {/* Left side: Bags */}
                <table className="w-full text-[10.5px]">
                  <tbody>
                    {data.akalSupermarketLeft.map(item => (
                      <tr key={item.id} className="border-b border-slate-200 last:border-b-0">
                        <td className="py-1 px-1 font-bold w-6">{item.srNo}</td>
                        <td className="py-1 px-1">{item.name}</td>
                        <td className="py-1 px-1 font-mono font-bold text-right tabular-nums whitespace-nowrap">
                          {item.quantity} {item.unitType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Right side: Bottles / Cases */}
                <table className="w-full text-[10.5px]">
                  <tbody>
                    {data.akalSupermarketRight.map(item => (
                      <tr key={item.id} className="border-b border-slate-200 last:border-b-0">
                        <td className="py-1 px-1 font-bold w-6">{item.srNo}</td>
                        <td className="py-1 px-1">{item.name}</td>
                        <td className="py-1 px-1 font-mono font-bold text-right tabular-nums whitespace-nowrap">
                          {item.quantity} {item.unitType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Other Stock - Central Food Market */}
            <div className="border border-black overflow-hidden">
              <div className="bg-[#FFFF00] border-b border-black font-bold px-2.5 py-0.5 text-[11px] text-black">
                Other Stock - Central Food Market
              </div>
              <div className="p-2">
                <table className="w-full text-[10.5px]">
                  <tbody>
                    {data.centralFoodMarket.map(item => (
                      <tr key={item.id} className="border-b border-slate-200 last:border-b-0">
                        <td className="py-1 px-1 font-bold w-6">{item.srNo}</td>
                        <td className="py-1 px-1">{item.name}</td>
                        <td className="py-1 px-1 font-mono font-bold text-right tabular-nums whitespace-nowrap">
                          {item.quantity} {item.unitType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-3 border-t border-slate-300 text-[10px] text-slate-500 flex justify-between items-center">
          <span>Global Futura Inc. • Warehouse Stock Verification • Invoice #1541</span>
          <span>Official Record As of 11/10/2026</span>
        </div>
      </div>
    </div>
  );
};
