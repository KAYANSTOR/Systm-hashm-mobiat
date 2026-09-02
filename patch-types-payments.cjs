const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  "paymentMethod: 'cash' | 'bank' | 'check';",
  "paymentMethod: 'cash' | 'remittance' | 'jeeb' | 'e_wallet';"
);

// Verify if there are other paymentMethod definitions in types.ts (e.g., for Expense, Transaction, etc.)
fs.writeFileSync('src/types.ts', code);
