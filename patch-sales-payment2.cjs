const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

code = code.replace(
  "const status = remaining <= 0 ? 'paid' : (parseFloat(paidAmount) > 0 ? 'partial' : 'unpaid');",
  "const status = remaining <= 0 ? 'paid' : (actualPaidAmount > 0 ? 'partial' : 'unpaid');"
);

code = code.replace(
  "paidAmount: parseFloat(paidAmount) || 0,",
  "paidAmount: actualPaidAmount,"
);

fs.writeFileSync('src/pages/Sales.tsx', code);
