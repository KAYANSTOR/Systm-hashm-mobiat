const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const regex = /<div className="table-container">\s*<table className="table-standard">[\s\S]*?<\/table>\s*<\/div>/;

if (regex.test(code)) {
    console.log("Regex matched!");
    const newCardsSection = `<div className="p-4 sm:p-6 bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredInvoices.map((inv) => {
              const partyName = inv.type === 'sale' 
                 ? customers.find(c => c.id === inv.partyId)?.name 
                 : suppliers.find(s => s.id === inv.partyId)?.name;
              return (
                 <div key={inv.id} className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden group">
                   <div className={\`absolute top-0 right-0 w-1.5 h-full transition-colors \${inv.type === 'sale' ? 'bg-blue-400 group-hover:bg-blue-500' : 'bg-purple-400 group-hover:bg-purple-500'}\`}></div>
                   
                   <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center gap-2 flex-wrap">
                           <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs">{inv.invoiceNumber}</span>
                           <span className="text-xs font-bold text-slate-400">{formatDate(inv.date)}</span>
                         </div>
                         <h3 className="font-black text-lg sm:text-xl text-slate-800 mt-1">{partyName || '<غير معروف>'}</h3>
                         <div className="flex gap-2 mt-1 flex-wrap">
                            <span className={\`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold \${
                              inv.type === 'sale' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                            }\`}>
                              {inv.type === 'sale' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {inv.type === 'sale' ? 'مبيعات' : 'مشتريات'}
                            </span>
                            <span className={\`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold \${
                               inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                               inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }\`}>
                              {inv.status === 'paid' ? 'مدفوع' : inv.status === 'partial' ? 'مدفوع جزئياً' : 'غير مدفوع'}
                            </span>
                            {!inv.isApproved && (
                              <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">مسودة</span>
                            )}
                         </div>
                      </div>
                      <div className="text-left shrink-0 pl-1">
                         <p className="text-2xl sm:text-3xl font-black text-slate-900" dir="ltr">{formatCurrency(inv.total).replace('ر.ي','').trim()} <span className="text-sm font-bold text-slate-500">ر.ي</span></p>
                         <div className="text-[11px] sm:text-xs font-bold mt-2 flex flex-col gap-1 items-end">
                            {inv.paidAmount > 0 && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md" dir="ltr">مدفوع: {formatCurrency(inv.paidAmount)}</span>}
                            {inv.remainingAmount > 0 && <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md" dir="ltr">متبقي: {formatCurrency(inv.remainingAmount)}</span>}
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-slate-50/80">
                      {!inv.isApproved && (
                        <>
                          <button onClick={async () => { if(confirm('هل أنت متأكد من اعتماد هذه الفاتورة؟ سيتم ترحيلها إلى الحسابات.')) await approveInvoice(inv.id); }} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors font-bold text-xs shadow-sm" title="اعتماد الفاتورة وترحيلها">
                            <CheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">اعتماد</span>
                          </button>
                          <button onClick={() => openEditModal(inv)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors font-bold text-xs shadow-sm" title="تعديل الفاتورة">
                            <Pencil className="w-4 h-4" /> <span className="hidden sm:inline">تعديل</span>
                          </button>
                        </>
                      )}
                      <button onClick={() => {
                        const party = inv.type === 'sale' ? customers.find(c => c.id === inv.partyId) : suppliers.find(s => s.id === inv.partyId);
                        setSelectedInvoice(inv);
                        setSelectedPartyName(party ? party.name : '');
                      }} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white rounded-xl transition-colors font-bold text-xs shadow-sm" title="طباعة">
                        <FileText className="w-4 h-4" /> <span className="hidden sm:inline">طباعة</span>
                      </button>
                      <button onClick={async () => { if(confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) await deleteInvoice(inv.id); }} className="flex items-center justify-center p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors shadow-sm" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
              );
            })}
            {filteredInvoices.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-100">
                <FileText className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                لا يوجد فواتير مطابقة للبحث
              </div>
            )}
          </div>`;
    
    // Note: there are TWO table-containers in this file. The regex without global flag replaces the FIRST one, which is the main invoices table. This is exactly what we want!
    code = code.replace(regex, newCardsSection);
    fs.writeFileSync('src/pages/Sales.tsx', code);
    console.log('Replaced first table with cards.');
} else {
    console.log('Regex did not match.');
}
