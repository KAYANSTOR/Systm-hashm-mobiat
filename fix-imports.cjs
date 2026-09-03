const fs = require('fs');

function addImports(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes("import { CustomDatePicker")) {
    // find the first import line
    code = code.replace(/^import/, "import { CustomDatePicker, CustomPartyPicker } from '../components/StatementFilters';\nimport");
    fs.writeFileSync(file, code);
  }
}

['src/pages/Sales.tsx', 'src/pages/Vouchers.tsx', 'src/pages/Expenses.tsx', 'src/pages/CashBox.tsx'].forEach(addImports);

