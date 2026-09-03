const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf8');

// Import Pickers
if (!code.includes('CustomDatePicker')) {
  code = code.replace("import { Customer, InventoryItem, Invoice, StoreContextType }", "import { Customer, InventoryItem, Invoice, StoreContextType }\nimport { CustomDatePicker, CustomPartyPicker } from '../components/StatementFilters';");
}

// Replace Date input
code = code.replace(/<input required type="date" value=\{date\} onChange=\{e => setDate\(e\.target\.value\)\} className="[^"]*" \/>/, 
  `<CustomDatePicker value={date} onChange={setDate} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 flex justify-between items-center" />`);

// Replace Party input
code = code.replace(/<select required value=\{partyId\} onChange=\{e => setPartyId\(e\.target\.value\)\} className="[^"]*">[\s\S]*?<\/select>/,
  `<CustomPartyPicker 
    value={partyId} 
    onChange={setPartyId} 
    customers={customers} 
    suppliers={suppliers} 
    type={invoiceType === 'sale' ? 'customer' : 'supplier'} 
    label={invoiceType === 'sale' ? 'اختر العميل' : 'اختر المورد'}
    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 flex justify-between items-center" 
  />`);

fs.writeFileSync('src/pages/Sales.tsx', code);
