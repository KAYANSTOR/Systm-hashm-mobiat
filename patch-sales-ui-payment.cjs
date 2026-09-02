const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const target = `<div className="pt-4 flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>المبلغ المدفوع (مقبوض):</span>
                    <input type="number" step="0.01" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} className="w-32 px-3 py-2 border border-brand-500/30 bg-brand-500/5 rounded-[12px] text-left focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-brand-500 font-bold" dir="ltr" />
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-rose-600">
                    <span>المتبقي (آجل):</span>
                    <span dir="ltr" className="font-black">{formatCurrency(remaining)}</span>
                  </div>`;

const replacement = `<div className="pt-4 flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>طريقة الدفع:</span>
                    <select value={paymentType} onChange={e => setPaymentType(e.target.value as any)} className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option value="cash">نقدي</option>
                      <option value="deferred">آجل</option>
                      <option value="partial">دفع جزئي</option>
                    </select>
                  </div>
                  <div className="pt-2 flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>المبلغ المدفوع:</span>
                    <input type="number" step="0.01" value={paymentType === 'cash' ? total : (paymentType === 'deferred' ? 0 : paidAmount)} onChange={e => setPaidAmount(e.target.value)} disabled={paymentType !== 'partial'} className="w-32 px-3 py-2 border border-brand-500/30 bg-brand-500/5 rounded-[12px] text-left focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-brand-500 font-bold disabled:opacity-50 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-500" dir="ltr" />
                  </div>
                  <div className="pt-2 flex justify-between items-center text-sm font-bold text-rose-600">
                    <span>المتبقي (آجل):</span>
                    <span dir="ltr" className="font-black">{formatCurrency(remaining)}</span>
                  </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Sales.tsx', code);
