const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

const targetTableStart = `<div className="flex-1 overflow-auto">`;
const targetTableEnd = `</div>
      </div>

      {/* Direct Transaction Modal */}`;

const startIndex = code.indexOf(targetTableStart);
const endIndex = code.indexOf(targetTableEnd) + 6;

if (startIndex !== -1 && endIndex !== -1) {
    const originalSection = code.substring(startIndex, endIndex);
    const newSection = `<div className="flex-1 overflow-auto p-4 space-y-3 bg-[#f8fafc]">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium border border-slate-100 shadow-sm flex flex-col items-center">
              <Wallet className="w-16 h-16 mx-auto text-slate-200 mb-4" />
              <p className="text-lg">لا يوجد حركات مالية مطابقة للبحث أو التصفية.</p>
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <div key={t.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group">
                {/* Visual Indicator Line on the right */}
                <div className={\`absolute top-0 right-0 w-1 h-full transition-colors \${t.cashIn > 0 ? 'bg-emerald-400 group-hover:bg-emerald-500' : 'bg-rose-400 group-hover:bg-rose-500'}\`}></div>
                
                <div className="flex justify-between items-start mr-1">
                  <div className="flex items-center gap-3">
                    <div className={\`w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm shrink-0 \${t.cashIn > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}\`}>
                       {t.cashIn > 0 ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1">{t.description}</h4>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                         <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(t.date)}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                         <span className="font-mono text-slate-600">{t.documentNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left shrink-0 pl-1">
                    <p className={\`text-lg sm:text-xl font-black \${t.cashIn > 0 ? 'text-emerald-600' : 'text-rose-600'}\`} dir="ltr">
                      {t.cashIn > 0 ? '+' : '-'}{formatCurrency(t.cashIn > 0 ? t.cashIn : t.cashOut).replace('ر.ي', '').trim()}
                      <span className="text-xs ml-1 font-bold">ر.ي</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50/80 mr-1">
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">النوع:</span>
                     <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                       {t.documentType === 'invoice' ? 'فاتورة' : t.documentType === 'voucher' ? 'سند' : 'مصروف'}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">وسيلة الدفع:</span>
                     {(!t.paymentMethod || t.paymentMethod === 'cash') && <span className="bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">نقدي</span>}
                     {t.paymentMethod === 'remittance' && <span className="bg-blue-100/50 text-blue-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">حوالة</span>}
                     {t.paymentMethod === 'jeeb' && <span className="bg-purple-100/50 text-purple-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">جيب</span>}
                     {t.paymentMethod === 'e_wallet' && <span className="bg-orange-100/50 text-orange-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">محفظة</span>}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>`;
    code = code.replace(originalSection, newSection);
    
    // Make sure we have Calendar icon imported
    if (!code.includes('Calendar')) {
       code = code.replace("Wallet, ArrowDownRight, ArrowUpRight, Search, FileText, Download, X", "Wallet, ArrowDownRight, ArrowUpRight, Search, FileText, Download, X, Calendar");
    }
    
    fs.writeFileSync('src/pages/CashBox.tsx', code);
    console.log('Patched CashBox.tsx table to cards.');
} else {
    console.log('Could not find target section in CashBox.tsx');
}
