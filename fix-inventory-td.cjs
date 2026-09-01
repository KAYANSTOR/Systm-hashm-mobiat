const fs = require('fs');
let content = fs.readFileSync('src/pages/Inventory.tsx', 'utf8');

content = content.replace(/<td className="px-2 py-3 font-mono text-slate-500">\{item\.code\}<\/td>/, '<td data-label="الرمز" className="px-2 py-3 font-mono text-slate-500">{item.code}</td>');
content = content.replace(/<td className="px-2 py-3">\s*<div className="font-bold text-slate-800">\{item\.name\}<\/div>/, '<td data-label="اسم المادة" className="px-2 py-3">\n                    <div className="font-bold text-slate-800">{item.name}</div>');
content = content.replace(/<td className="px-2 py-3">\s*<span className="inline-flex items-center gap-1\.5 px-2\.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">/, '<td data-label="الفئة" className="px-2 py-3">\n                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">');
content = content.replace(/<td className="px-2 py-3 text-center">\s*<span className="font-bold text-lg text-slate-800">\{item\.quantity\}<\/span>/, '<td data-label="الكمية" className="px-2 py-3 text-center">\n                    <div className="flex items-center justify-end gap-2"><span className="font-bold text-lg text-slate-800">{item.quantity}</span>');
content = content.replace(/<span className="text-xs text-slate-500 mr-1">\s*\{item\.unit === 'roll'/g, '<span className="text-xs text-slate-500 mr-1">\n                      {item.unit === \'roll\'');
content = content.replace(/\{item\.unit === 'roll' \? 'طاقة\/رول' :\s*item\.unit === 'meter' \? 'متر' : 'قطعة'\}\s*<\/span>\s*<\/td>/, "{item.unit === 'roll' ? 'طاقة/رول' :\n                        item.unit === 'meter' ? 'متر' : 'قطعة'}\n                    </span></div>\n                  </td>");

content = content.replace(/<td className="px-2 py-3 font-medium text-slate-600">\{formatCurrency\(item\.costPrice\)\}<\/td>/, '<td data-label="سعر التكلفة" className="px-2 py-3 font-medium text-slate-600">{formatCurrency(item.costPrice)}</td>');
content = content.replace(/<td className="px-2 py-3 font-bold text-emerald-600">\{formatCurrency\(item\.sellingPrice\)\}<\/td>/, '<td data-label="سعر البيع" className="px-2 py-3 font-bold text-emerald-600">{formatCurrency(item.sellingPrice)}</td>');
content = content.replace(/<td className="px-2 py-3 flex items-center gap-2">/, '<td data-label="إجراءات" className="px-2 py-3 flex items-center gap-2">');

fs.writeFileSync('src/pages/Inventory.tsx', content, 'utf8');
