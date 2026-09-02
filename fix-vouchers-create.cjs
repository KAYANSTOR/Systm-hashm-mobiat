const fs = require('fs');

let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

// Update openModal signature and defaults
content = content.replace(/const openModal = \(vType: 'receipt' \| 'payment'\) => \{/,
  "const openModal = (vType: 'receipt' | 'payment' | 'journal') => {");
content = content.replace(/setPartyType\(vType === 'receipt' \? 'customer' : 'supplier'\);/,
  "setPartyType(vType === 'receipt' ? 'customer' : vType === 'payment' ? 'supplier' : 'other');");

// Add button for journal
const newButton = `          <button onClick={() => openModal('journal')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>سند قيد</span>
          </button>`;
content = content.replace(/<button onClick=\{\(\) => openModal\('payment'\)\} className="[^"]*">\s*<ArrowUpRight className="w-5 h-5" \/>\s*<span>سند صرف<\/span>\s*<\/button>/,
  `<button onClick={() => openModal('payment')} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
            <ArrowUpRight className="w-5 h-5" />
            <span>سند صرف</span>
          </button>\n${newButton}`);

// Update the select options for Type in modal
const typeSelectRegex = /<select value=\{type\} onChange=\{e => setType\(e\.target\.value as any\)\} className="input-field">\s*<option value="receipt">سند قبض<\/option>\s*<option value="payment">سند صرف<\/option>\s*<\/select>/;
const newTypeSelect = `<select value={type} onChange={e => setType(e.target.value as any)} className="input-field">
                    <option value="receipt">سند قبض</option>
                    <option value="payment">سند صرف</option>
                    <option value="journal">سند قيد</option>
                    <option value="deferred">آجل</option>
                  </select>`;
if (typeSelectRegex.test(content)) {
    content = content.replace(typeSelectRegex, newTypeSelect);
} else {
    // maybe "deferred" was already there
    const typeSelectFallback = /<select value=\{type\} onChange=\{e => setType\(e\.target\.value as any\)\} className="input-field">[\s\S]*?<\/select>/;
    content = content.replace(typeSelectFallback, newTypeSelect);
}

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');

