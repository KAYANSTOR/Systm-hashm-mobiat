const fs = require('fs');
let content = fs.readFileSync('src/pages/Sales.tsx', 'utf8');

// Invoices Table
content = content.replace(/<td className="px-2 py-3 font-mono font-bold text-slate-700">\{inv\.invoiceNumber\}<\/td>/, '<td data-label="رقم الفاتورة" className="px-2 py-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>');
content = content.replace(/<td className="px-2 py-3 text-slate-600">\{formatDate\(inv\.date\)\}<\/td>/, '<td data-label="التاريخ" className="px-2 py-3 text-slate-600">{formatDate(inv.date)}</td>');
content = content.replace(/<td className="px-2 py-3">\s*<span className=\{`inline-flex items-center gap-1\.5/g, '<td data-label="النوع" className="px-2 py-3">\n                        <span className={`inline-flex items-center gap-1.5');
content = content.replace(/<td className="px-2 py-3 font-bold text-slate-800">\{partyName \|\| '-'\}<\/td>/, '<td data-label="الطرف" className="px-2 py-3 font-bold text-slate-800">{partyName || \'<غير معروف>\'}</td>');
content = content.replace(/<td className="px-2 py-3 font-black text-slate-900" dir="ltr">\{formatCurrency\(inv\.total\)\}<\/td>/, '<td data-label="الإجمالي" className="px-2 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(inv.total)}</td>');
content = content.replace(/<td className="px-2 py-3 text-emerald-600 font-bold" dir="ltr">\{formatCurrency\(inv\.paidAmount\)\}<\/td>/, '<td data-label="المدفوع" className="px-2 py-3 text-emerald-600 font-bold" dir="ltr">{formatCurrency(inv.paidAmount)}</td>');
content = content.replace(/<td className="px-2 py-3 text-rose-600 font-bold" dir="ltr">\{formatCurrency\(inv\.remainingAmount\)\}<\/td>/, '<td data-label="المتبقي" className="px-2 py-3 text-rose-600 font-bold" dir="ltr">{formatCurrency(inv.remainingAmount)}</td>');
content = content.replace(/<td className="px-2 py-3">\s*<span className=\{`inline-flex px-2\.5/g, '<td data-label="الحالة" className="px-2 py-3">\n                        <span className={`inline-flex px-2.5');
content = content.replace(/<td className="px-2 py-3 text-center">\s*\{!inv\.isApproved && \(/g, '<td data-label="إجراءات" className="px-2 py-3 text-center">\n                        {!inv.isApproved && (');

// Items Modal Table
content = content.replace(/<td className="px-4 py-3 font-bold text-slate-800">\{item\.name\}<\/td>/g, '<td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">{item.name}</td>');
content = content.replace(/<td className="px-4 py-3 text-center">\{item\.quantity\}<\/td>/g, '<td data-label="الكمية" className="px-4 py-3 text-center">{item.quantity}</td>');
content = content.replace(/<td className="px-4 py-3 text-slate-600" dir="ltr">\{formatCurrency\(item\.unitPrice\)\}<\/td>/g, '<td data-label="السعر" className="px-4 py-3 text-slate-600" dir="ltr">{formatCurrency(item.unitPrice)}</td>');
content = content.replace(/<td className="px-4 py-3 font-bold text-brand-500" dir="ltr">\{formatCurrency\(item\.total\)\}<\/td>/g, '<td data-label="الإجمالي" className="px-4 py-3 font-bold text-brand-500" dir="ltr">{formatCurrency(item.total)}</td>');
content = content.replace(/<td className="px-4 py-3">\s*<button type="button" onClick=\{\(\) => removeItem\(idx\)\}/g, '<td data-label="إجراءات" className="px-4 py-3">\n                            <button type="button" onClick={() => removeItem(idx)}');

fs.writeFileSync('src/pages/Sales.tsx', content, 'utf8');
