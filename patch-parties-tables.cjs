const fs = require('fs');
let code = fs.readFileSync('src/pages/Parties.tsx', 'utf-8');

// Remove min-widths
code = code.replace(/min-w-\[800px\]/g, 'w-full');
code = code.replace(/min-w-\[700px\]/g, 'w-full');

// Add data-labels for Customers
code = code.replace(/<td className="px-6 py-4">(\s*<div className="flex items-center gap-3">\s*<div className="w-10 h-10 rounded-full bg-blue-100)/g, '<td className="px-6 py-4" data-label="العميل">$1');
code = code.replace(/<td className="px-6 py-4">(\s*<div className="flex flex-col gap-1 text-sm text-slate-600">)/g, '<td className="px-6 py-4" data-label="معلومات التواصل">$1');
code = code.replace(/<td className="px-6 py-4">(\s*<span className={`px-2.5 py-1 rounded-lg text-xs font-bold border)/g, '<td className="px-6 py-4" data-label="النوع">$1');
code = code.replace(/<td className="px-6 py-4 text-left font-black text-rose-600 text-lg tracking-tight" dir="ltr">/g, '<td className="px-6 py-4 text-left font-black text-rose-600 text-lg tracking-tight" dir="ltr" data-label="الرصيد">');
code = code.replace(/<td className="px-6 py-4">(\s*<div className="flex items-center gap-2 justify-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">)/g, '<td className="px-6 py-4" data-label="الإجراءات">$1');

// Add data-labels for Suppliers
code = code.replace(/<td className="px-6 py-4">(\s*<div className="flex items-center gap-3">\s*<div className="w-10 h-10 rounded-full bg-emerald-100)/g, '<td className="px-6 py-4" data-label="المورد">$1');
code = code.replace(/<td className="px-6 py-4 text-sm font-medium text-slate-700">/g, '<td className="px-6 py-4 text-sm font-medium text-slate-700" data-label="الشركة">');
code = code.replace(/<td className="px-6 py-4 font-mono text-sm text-slate-600">/g, '<td className="px-6 py-4 font-mono text-sm text-slate-600" data-label="معلومات التواصل">');
code = code.replace(/<td className="px-6 py-4 text-left font-black text-emerald-600 text-lg tracking-tight" dir="ltr">/g, '<td className="px-6 py-4 text-left font-black text-emerald-600 text-lg tracking-tight" dir="ltr" data-label="الرصيد">');

// Add data-labels for Statement Table
code = code.replace(/<td className="px-6 py-4 text-sm font-medium text-slate-600">\{formatDate/g, '<td className="px-6 py-4 text-sm font-medium text-slate-600" data-label="التاريخ">{formatDate');
code = code.replace(/<td className="px-6 py-4 font-mono font-bold text-slate-700 text-sm">/g, '<td className="px-6 py-4 font-mono font-bold text-slate-700 text-sm" data-label="رقم المستند">');
code = code.replace(/<td className="px-6 py-4 text-sm font-bold text-slate-800">\{t.description\}/g, '<td className="px-6 py-4 text-sm font-bold text-slate-800" data-label="البيان">{t.description}');
code = code.replace(/<td className="px-6 py-4 text-left font-bold text-rose-600 font-mono" dir="ltr">/g, '<td className="px-6 py-4 text-left font-bold text-rose-600 font-mono" dir="ltr" data-label="مدين (له)">');
code = code.replace(/<td className="px-6 py-4 text-left font-bold text-emerald-600 font-mono" dir="ltr">/g, '<td className="px-6 py-4 text-left font-bold text-emerald-600 font-mono" dir="ltr" data-label="دائن (عليه)">');
code = code.replace(/<td className="px-6 py-4 text-left font-black text-brand-700 font-mono bg-brand-50\/30" dir="ltr">/g, '<td className="px-6 py-4 text-left font-black text-brand-700 font-mono bg-brand-50/30" dir="ltr" data-label="الرصيد">');

fs.writeFileSync('src/pages/Parties.tsx', code);
