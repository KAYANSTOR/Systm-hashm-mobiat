const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

content = content.replace(/<td className="py-4 font-bold text-slate-800 text-left">/g, '<td data-label="المبلغ" className="py-4 font-bold text-slate-800 text-left">');
content = content.replace(/<td className="py-4 text-right">/g, '<td data-label="البيان" className="py-4 text-right">');

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
