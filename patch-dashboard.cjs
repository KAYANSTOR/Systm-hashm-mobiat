const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const tableBlockStart = '<div>\\s*<table className="table-standard">';
const tableBlockEnd = '</table>\\s*</div>';
const tableRegex = new RegExp(`${tableBlockStart}[\\s\\S]*?${tableBlockEnd}`);

const newList = `<div className="flex flex-col gap-3 text-right">
              {[...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((trx) => (
                <div key={trx.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group">
                  <div className={\`absolute top-0 right-0 w-1.5 h-full transition-colors \${trx.debit > 0 ? 'bg-emerald-400 group-hover:bg-emerald-500' : 'bg-rose-400 group-hover:bg-rose-500'}\`}></div>
                  
                  <div className="flex justify-between items-start pr-1">
                    <div className="flex items-center gap-3">
                      <div className={\`w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm shrink-0 \${trx.debit > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}\`}>
                         {trx.debit > 0 ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1">{trx.description}</h4>
                        <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                           <span className="flex items-center gap-1">{formatDate(trx.date)}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                           <span className="font-mono text-slate-600 bg-slate-100 px-1.5 rounded">{trx.documentNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left shrink-0 pl-1">
                      <p className={\`text-lg sm:text-xl font-black \${trx.debit > 0 ? 'text-emerald-600' : 'text-rose-600'}\`} dir="ltr">
                        {trx.debit > 0 ? '+' : '-'}{formatCurrency(trx.debit > 0 ? trx.debit : trx.credit).replace('ر.ي', '').trim()}
                        <span className="text-xs ml-1 font-bold">ر.ي</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50/80 pr-1">
                     <div className="flex items-center gap-2">
                       <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                         {trx.documentType === 'invoice' ? 'فاتورة' : trx.documentType === 'voucher' ? 'سند' : 'مصروف'}
                       </span>
                     </div>
                  </div>
                </div>
              ))}
            </div>`;

code = code.replace(tableRegex, newList);

// make sure ArrowDownRight and ArrowUpRight are imported if they are not
if (!code.includes('ArrowDownRight')) {
  code = code.replace("import { TrendingUp, Package, Users", "import { TrendingUp, Package, Users, ArrowDownRight, ArrowUpRight");
}

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Dashboard recent transactions patched');
