const fs = require('fs');
['src/pages/Sales.tsx', 'src/pages/Vouchers.tsx', 'src/pages/CashBox.tsx', 'src/context/StoreContext.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf-8');
  code = code.replace(/parseInt\(([a-zA-Z0-9_.]+)\.replace\(\/\\\\D\/g, ''\)\) \|\| 0/g, "(() => { const n = parseInt($1.replace(/\\D/g, '')); return n < 1000000000 ? (n || 0) : 0; })()");
  fs.writeFileSync(file, code);
});
