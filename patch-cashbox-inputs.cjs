const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf8');

if (!code.includes('CustomDatePicker')) {
  code = code.replace("import { StoreContextType }", "import { StoreContextType }\nimport { CustomDatePicker } from '../components/StatementFilters';");
}

code = code.replace(/<input \s*type="date" \s*value=\{dateFrom\}\s*onChange=\{\(e\) => setDateFrom\(e\.target\.value\)\}\s*className="input-field bg-white"\s*\/>/g, 
  `<CustomDatePicker value={dateFrom} onChange={setDateFrom} className="input-field bg-white flex justify-between items-center min-w-[140px]" />`);

code = code.replace(/<input \s*type="date" \s*value=\{dateTo\}\s*onChange=\{\(e\) => setDateTo\(e\.target\.value\)\}\s*className="input-field bg-white"\s*\/>/g, 
  `<CustomDatePicker value={dateTo} onChange={setDateTo} className="input-field bg-white flex justify-between items-center min-w-[140px]" />`);

fs.writeFileSync('src/pages/CashBox.tsx', code);
