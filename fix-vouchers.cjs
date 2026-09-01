const fs = require('fs');
let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

content = content.replace(/<td className="px-2 py-3 font-mono font-bold text-slate-700">\{v\.voucherNumber\}<\/td>/, '<td data-label="رقم السند" className="px-2 py-3 font-mono font-bold text-slate-700">{v.voucherNumber}</td>');
content = content.replace(/<td className="px-2 py-3 text-slate-600">\{formatDate\(v\.date\)\}<\/td>/, '<td data-label="التاريخ" className="px-2 py-3 text-slate-600">{formatDate(v.date)}</td>');
content = content.replace(/<td className="px-2 py-3">\s*<span className=\{`inline-flex/g, '<td data-label="النوع" className="px-2 py-3">\n                      <span className={`inline-flex');
content = content.replace(/<td className="px-2 py-3">\s*<div className="font-bold text-slate-800">\{partyName\}<\/div>/, '<td data-label="الطرف" className="px-2 py-3">\n                      <div className="font-bold text-slate-800">{partyName}</div>');
content = content.replace(/<td className="px-2 py-3 font-black text-slate-900" dir="ltr">\{formatCurrency\(v\.amount\)\}<\/td>/, '<td data-label="المبلغ" className="px-2 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(v.amount)}</td>');
content = content.replace(/<td className="px-2 py-3 text-slate-600">\s*\{v\.paymentMethod/g, '<td data-label="طريقة الدفع" className="px-2 py-3 text-slate-600">\n                      {v.paymentMethod');
content = content.replace(/<td className="px-2 py-3 text-slate-500 max-w-\[200px\] truncate" title=\{v\.description\}>/g, '<td data-label="البيان" className="px-2 py-3 text-slate-500 max-w-[200px] truncate" title={v.description}>');

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');
