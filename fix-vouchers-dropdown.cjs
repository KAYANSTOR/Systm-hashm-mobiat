const fs = require('fs');

let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

// Update useState for activeFilter
content = content.replace(/const \[activeFilter, setActiveFilter\] = useState<'all' \| 'receipt' \| 'payment' \| 'deferred'>\('all'\);/,
  "const [activeFilter, setActiveFilter] = useState<'all' | 'receipt' | 'payment' | 'deferred' | 'journal'>('all');");

// Update useState for type
content = content.replace(/const \[type, setType\] = useState<'receipt' \| 'payment' \| 'deferred'>\('receipt'\);/,
  "const [type, setType] = useState<'receipt' | 'payment' | 'deferred' | 'journal'>('receipt');");

const filterButtonsRegex = /<div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-wrap shadow-sm gap-1 max-w-full">[\s\S]*?<\/div>/;

const dropdownHtml = `<div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center shadow-sm gap-4 max-w-full">
        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-700">تصفية حسب النوع:</label>
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="input-field !py-2 !w-auto"
          >
            <option value="all">عرض الكل</option>
            <option value="receipt">سند قبض</option>
            <option value="payment">سند صرف</option>
            <option value="deferred">آجل</option>
            <option value="journal">سند قيد</option>
          </select>
        </div>
      </div>`;

content = content.replace(filterButtonsRegex, dropdownHtml);

// Also need to allow creating "journal" vouchers in openModal, but the prompt just says "filter", it didn't explicitly say "add journal voucher creation", but the prompt says "حسب النوع (قبض، صرف، قيد)". I'll make sure "قيد" can be filtered. Maybe it's enough. If they want to create "قيد" they might need a button.
const typeCheckRegex = /v\.type === 'receipt' \? 'سند قبض' : v\.type === 'payment' \? 'سند صرف' : 'سند آجل'/g;
content = content.replace(typeCheckRegex, "v.type === 'receipt' ? 'سند قبض' : v.type === 'payment' ? 'سند صرف' : v.type === 'journal' ? 'سند قيد' : 'سند آجل'");

const colorRegex = /v\.type === 'receipt' \? 'bg-emerald-100 text-emerald-800' : v\.type === 'payment' \? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'/g;
content = content.replace(colorRegex, "v.type === 'receipt' ? 'bg-emerald-100 text-emerald-800' : v.type === 'payment' ? 'bg-rose-100 text-rose-800' : v.type === 'journal' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'");

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');

