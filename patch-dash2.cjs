const fs = require('fs');
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dash = dash.replace(/\{invoices\.length > 0 \? \([\s\S]*?<\/table>[\s\S]*?<\/div>[\s\S]*?\) : \([\s\S]*?<\/div>\s*\)}/, `{transactions.length > 0 ? (
            <div>
              <table className="table-standard">
                <tbody className="divide-y divide-slate-50">
                  {[...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((trx) => (
                    <tr key={trx.id} className="transition-colors">
                      <td data-label="التاريخ" className="py-4 text-slate-500 text-xs">{formatDate(trx.date)}</td>
                      <td data-label="المبلغ" className="py-4 font-bold text-slate-800 text-left" dir="ltr">{formatCurrency(trx.debit > 0 ? trx.debit : trx.credit)}</td>
                      <td data-label="البيان" className="py-4 text-right">
                        <div className="font-bold text-sm text-slate-800">
                          {trx.description}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{trx.documentNumber}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center opacity-60">
              <Receipt className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold">لا توجد عمليات مسجلة</p>
            </div>
          )}`);

fs.writeFileSync('src/pages/Dashboard.tsx', dash);
console.log('Dashboard patched 2');
