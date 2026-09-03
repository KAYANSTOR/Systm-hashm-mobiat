const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

const oldTr = `                      <tr key={inv.id} className="text-slate-800 hover:bg-slate-50/50">
                        <td data-label="رقم الفاتورة" className="px-3 py-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                        <td data-label="التاريخ" className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDate(inv.date)}</td>
                        <td data-label="العميل" className="px-3 py-3 font-bold">{customerName}</td>
                        <td data-label="الأصناف" className="px-3 py-3 text-sm text-slate-600 max-w-xs truncate" title={summary.names !== '-' ? summary.names : ''}>`;

const newTr = `                      <tr key={inv.id} className="text-slate-800 hover:bg-slate-50/50">
                        <td data-label="رقم الفاتورة" className="px-3 py-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                        <td data-label="التاريخ" className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDate(inv.date)}</td>
                        <td data-label="العميل" className="px-3 py-3 font-bold">{customerName}</td>
                        <td data-label="نوع العملية" className="px-3 py-3 text-center">
                          <span className={\`text-xs px-2 py-1 rounded-full font-bold \${inv.invoiceType === 'PRODUCT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}\`}>
                            {inv.invoiceType === 'PRODUCT' ? 'بضاعة' : 'خدمة تطريز'}
                          </span>
                        </td>
                        <td data-label="الأصناف" className="px-3 py-3 text-sm text-slate-600 max-w-xs truncate" title={summary.names !== '-' ? summary.names : ''}>`;

if(code.includes(oldTr)) {
  code = code.replace(oldTr, newTr);
  fs.writeFileSync('src/pages/Reports.tsx', code);
  console.log('patched Reports.tsx');
} else {
  console.log('could not find target in Reports.tsx');
}
