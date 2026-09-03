const fs = require('fs');
let code = fs.readFileSync('src/pages/Expenses.tsx', 'utf8');

if (!code.includes('CustomDatePicker')) {
  code = code.replace("import { Expense, StoreContextType }", "import { Expense, StoreContextType }\nimport { CustomDatePicker } from '../components/StatementFilters';");
}

code = code.replace(/<input required type="date" value=\{date\} onChange=\{e => setDate\(e\.target\.value\)\} className="input-field" \/>/g, 
  `<CustomDatePicker value={date} onChange={setDate} className="input-field flex justify-between items-center" />`);

fs.writeFileSync('src/pages/Expenses.tsx', code);
