const fs = require('fs');
let code = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

if (!code.includes('CustomDatePicker')) {
  code = code.replace("import { StoreContextType }", "import { StoreContextType }\nimport { CustomDatePicker, CustomPartyPicker } from '../components/StatementFilters';");
}

code = code.replace(/<input required type="date" value=\{date\} onChange=\{e => setDate\(e\.target\.value\)\} className="input-field" \/>/g, 
  `<CustomDatePicker value={date} onChange={setDate} className="input-field flex justify-between items-center" />`);

code = code.replace(/<input \s*type="date"\s*value=\{startDate\}\s*onChange=\{\(e\) => setStartDate\(e\.target\.value\)\}\s*className="input-field !py-2"\s*\/>/g,
  `<CustomDatePicker value={startDate} onChange={setStartDate} className="input-field flex justify-between items-center min-w-[150px]" />`);

code = code.replace(/<input \s*type="date"\s*value=\{endDate\}\s*onChange=\{\(e\) => setEndDate\(e\.target\.value\)\}\s*className="input-field !py-2"\s*\/>/g,
  `<CustomDatePicker value={endDate} onChange={setEndDate} className="input-field flex justify-between items-center min-w-[150px]" />`);

code = code.replace(/<select required value=\{partyId\} onChange=\{e => setPartyId\(e\.target\.value\)\} className="input-field">[\s\S]*?<\/select>/,
  `<CustomPartyPicker 
    value={partyId} 
    onChange={setPartyId} 
    customers={customers} 
    suppliers={suppliers} 
    type="both"
    className="input-field flex justify-between items-center" 
  />`);

fs.writeFileSync('src/pages/Vouchers.tsx', code);
