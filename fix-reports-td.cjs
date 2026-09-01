const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

// Sales Invoices table
content = content.replace(/<td className="px-3 py-3 font-mono font-bold text-slate-700">\{inv\.invoiceNumber\}<\/td>/, '<td data-label="رقم الفاتورة" className="px-3 py-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>');
content = content.replace(/<td className="px-3 py-3 text-slate-600 whitespace-nowrap">\{formatDate\(inv\.date\)\}<\/td>/, '<td data-label="التاريخ" className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDate(inv.date)}</td>');
content = content.replace(/<td className="px-3 py-3 font-bold text-slate-800">\{customerName\}<\/td>/, '<td data-label="العميل" className="px-3 py-3 font-bold text-slate-800">{customerName}</td>');
content = content.replace(/<td className="px-3 py-3 text-slate-600 max-w-\[150px\] truncate" title=\{summary\.names\}>\s*\{summary\.names\}\s*<\/td>/, '<td data-label="الأصناف/الخدمات" className="px-3 py-3 text-slate-600 max-w-[150px] truncate" title={summary.names}>\n                          {summary.names}\n                        </td>');
content = content.replace(/<td className="px-3 py-3 text-center font-bold text-slate-700">\{summary\.totalQty\}<\/td>/, '<td data-label="الكمية" className="px-3 py-3 text-center font-bold text-slate-700">{summary.totalQty}</td>');
content = content.replace(/<td className="px-3 py-3 font-black text-slate-900" dir="ltr">\{formatCurrency\(inv\.total\)\}<\/td>/, '<td data-label="الإجمالي" className="px-3 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(inv.total)}</td>');
content = content.replace(/<td className="px-3 py-3 font-bold text-emerald-600" dir="ltr">\{formatCurrency\(inv\.paidAmount\)\}<\/td>/, '<td data-label="المدفوع" className="px-3 py-3 font-bold text-emerald-600" dir="ltr">{formatCurrency(inv.paidAmount)}</td>');
content = content.replace(/<td className="px-3 py-3 font-bold text-rose-600 text-left" dir="ltr">\{formatCurrency\(inv\.remainingAmount\)\}<\/td>/, '<td data-label="المتبقي" className="px-3 py-3 font-bold text-rose-600 text-left" dir="ltr">{formatCurrency(inv.remainingAmount)}</td>');

// Customers table
content = content.replace(/<td className="px-4 py-3 font-bold">\{c\.name\}<\/td>/, '<td data-label="اسم العميل" className="px-4 py-3 font-bold">{c.name}</td>');
content = content.replace(/<td className="px-4 py-3 font-mono">\{c\.phone\}<\/td>/, '<td data-label="رقم الهاتف" className="px-4 py-3 font-mono">{c.phone}</td>');
content = content.replace(/<td className="px-4 py-3">\{c\.type === 'wholesale' \? 'جملة' : 'مفرد'\}<\/td>/, '<td data-label="النوع" className="px-4 py-3">{c.type === \'wholesale\' ? \'جملة\' : \'مفرد\'}</td>');
content = content.replace(/<td className="px-4 py-3 font-black text-left text-rose-600" dir="ltr">\s*\{formatCurrency\(c\.balance\)\}\s*<\/td>/, '<td data-label="الرصيد المطلوب" className="px-4 py-3 font-black text-left text-rose-600" dir="ltr">\n                      {formatCurrency(c.balance)}\n                    </td>');

fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
