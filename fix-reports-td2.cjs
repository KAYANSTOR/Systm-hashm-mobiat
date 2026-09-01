const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

content = content.replace(/<td className="px-3 py-3 font-bold">\{customerName\}<\/td>/, '<td data-label="العميل" className="px-3 py-3 font-bold">{customerName}</td>');
content = content.replace(/<td className="px-3 py-3 text-sm text-slate-600 max-w-xs truncate"/, '<td data-label="الأصناف" className="px-3 py-3 text-sm text-slate-600 max-w-xs truncate"');
content = content.replace(/<td className="px-3 py-3 text-center font-bold">\{summary\.totalQty\}<\/td>/, '<td data-label="الكمية" className="px-3 py-3 text-center font-bold">{summary.totalQty}</td>');

fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
