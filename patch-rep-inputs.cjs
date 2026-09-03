const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

if (!code.includes('CustomDatePicker')) {
  // It probably already imports StatementFilters. Let's just add CustomDatePicker
  code = code.replace("import { StatementFilters, dateLabel }", "import { StatementFilters, dateLabel, CustomDatePicker }");
}

code = code.replace(/<input \s*type="date" \s*className="input-field py-2" \s*value=\{startDate\}\s*onChange=\{e => setStartDate\(e\.target\.value\)\}\s*\/>/g, 
  `<CustomDatePicker value={startDate} onChange={setStartDate} className="input-field py-2 flex justify-between items-center" />`);

code = code.replace(/<input \s*type="date" \s*className="input-field py-2" \s*value=\{endDate\}\s*onChange=\{e => setEndDate\(e\.target\.value\)\}\s*\/>/g, 
  `<CustomDatePicker value={endDate} onChange={setEndDate} className="input-field py-2 flex justify-between items-center" />`);

fs.writeFileSync('src/pages/Reports.tsx', code);
