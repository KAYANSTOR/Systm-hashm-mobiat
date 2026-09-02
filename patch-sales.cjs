const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const selectBlock = `<select required value={partyId} onChange={e => setPartyId(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                    <option value="">اختر {invoiceType === 'sale' ? 'العميل' : 'المورد'}...</option>
                    {invoiceType === 'sale' ? (
                      customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    ) : (
                      suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                    )}
                  </select>`;

const newSelectBlock = `<div className="relative">
                    <select required value={partyId} onChange={e => setPartyId(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option value="">اختر {invoiceType === 'sale' ? 'العميل' : 'المورد'}...</option>
                      {invoiceType === 'sale' ? (
                        customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                      ) : (
                        suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                      )}
                    </select>
                    {partyId && (() => {
                      const party = invoiceType === 'sale' 
                        ? customers.find(c => c.id === partyId) 
                        : suppliers.find(s => s.id === partyId);
                      if (party && party.balance !== 0) {
                        return (
                          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md pointer-events-none" dir="ltr">
                            الرصيد السابق: {formatCurrency(party.balance)}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>`;

code = code.replace(selectBlock, newSelectBlock);
fs.writeFileSync('src/pages/Sales.tsx', code);
