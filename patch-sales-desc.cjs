const fs = require('fs');
let content = fs.readFileSync('src/pages/Sales.tsx', 'utf8');

const regex = /<label className="block text-xs font-bold text-slate-700 mb-2">اسم الخدمة \(مثل: نقشة وردة\)<\/label>\s*<input type="text" value=\{serviceName\} onChange=\{e => setServiceName\(e\.target\.value\)\} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-\[12px\] focus:ring-2 focus:ring-brand-500\/20 focus:border-brand-500" \/>\s*<\/div>/;

const newCode = `<label className="block text-xs font-bold text-slate-700 mb-2">اسم الخدمة (مثل: نقشة وردة)</label>
                        <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-700 mb-2">وصف العمل (اختياري)</label>
                        <input type="text" value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} placeholder="تفاصيل إضافية..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                      </div>`;

content = content.replace(regex, newCode);

// Add description to table row
const rowRegex = /<td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">\{item\.name\} \{item\.unit \? <span className="text-xs text-slate-400">\(\{item\.unit\}\)<\/span> : ''\}<\/td>/;
const newRow = `<td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">
                            <div>{item.name} {item.unit ? <span className="text-xs text-slate-400">({item.unit})</span> : ''}</div>
                            {item.description && <div className="text-xs font-normal text-slate-500 mt-1">{item.description}</div>}
                          </td>`;
content = content.replace(rowRegex, newRow);

fs.writeFileSync('src/pages/Sales.tsx', content, 'utf8');
