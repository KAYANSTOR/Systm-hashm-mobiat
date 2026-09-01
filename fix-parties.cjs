const fs = require('fs');
let content = fs.readFileSync('src/pages/Parties.tsx', 'utf8');

// Customers table
content = content.replace(/<td className="px-2 py-3 font-bold text-slate-800">\{c\.name\}<\/td>/, '<td data-label="اسم العميل" className="px-2 py-3 font-bold text-slate-800">{c.name}</td>');
content = content.replace(/<td className="px-2 py-3 font-mono text-slate-600">\{c\.phone\}<\/td>/, '<td data-label="رقم الهاتف" className="px-2 py-3 font-mono text-slate-600">{c.phone}</td>');
content = content.replace(/<td className="px-2 py-3 text-slate-600">\{c\.address\}<\/td>/, '<td data-label="العنوان" className="px-2 py-3 text-slate-600">{c.address}</td>');
content = content.replace(/<td className="px-2 py-3">\s*<span className="px-2\.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">/g, '<td data-label="النوع" className="px-2 py-3">\n                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">');
content = content.replace(/<td className="px-2 py-3 font-black text-rose-600" dir="ltr">\{formatCurrency\(c\.balance\)\}<\/td>/, '<td data-label="الرصيد" className="px-2 py-3 font-black text-rose-600" dir="ltr">{formatCurrency(c.balance)}</td>');

// Suppliers table
content = content.replace(/<td className="px-2 py-3 font-bold text-slate-800">\{s\.name\}<\/td>/, '<td data-label="اسم المورد" className="px-2 py-3 font-bold text-slate-800">{s.name}</td>');
content = content.replace(/<td className="px-2 py-3 text-slate-600">\{s\.company\}<\/td>/, '<td data-label="الشركة/المعمل" className="px-2 py-3 text-slate-600">{s.company}</td>');
content = content.replace(/<td className="px-2 py-3 font-mono text-slate-600">\{s\.phone\}<\/td>/, '<td data-label="رقم الهاتف" className="px-2 py-3 font-mono text-slate-600">{s.phone}</td>');
content = content.replace(/<td className="px-2 py-3 font-black text-emerald-600" dir="ltr">\{formatCurrency\(s\.balance\)\}<\/td>/, '<td data-label="الرصيد" className="px-2 py-3 font-black text-emerald-600" dir="ltr">{formatCurrency(s.balance)}</td>');

// Actions
content = content.replace(/<td className="px-2 py-3 flex items-center gap-2 justify-end">/g, '<td data-label="الإجراءات" className="px-2 py-3 flex items-center gap-2 justify-end">');

fs.writeFileSync('src/pages/Parties.tsx', content, 'utf8');
