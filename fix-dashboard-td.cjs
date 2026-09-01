const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace(/<div className="overflow-x-auto -mx-8 px-8">/g, '<div className="-mx-8 px-8">');
content = content.replace(/<td className="py-4 text-slate-500 text-xs">\{formatDate\(inv\.date\)\}<\/td>/g, '<td data-label="التاريخ" className="py-4 text-slate-500 text-xs">{formatDate(inv.date)}</td>');
content = content.replace(/<td className="py-4">/g, '<td data-label="البيان" className="py-4">');
content = content.replace(/<td className="py-4 text-left">/g, '<td data-label="المبلغ" className="py-4 text-left">');

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
