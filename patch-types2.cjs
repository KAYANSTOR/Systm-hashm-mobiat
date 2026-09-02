const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');

code = code.replace(
  "paymentMethod?: string;",
  "paymentMethod?: 'cash' | 'remittance' | 'jeeb' | 'e_wallet';"
);

code = code.replace(
  "paymentMethod: string;",
  "paymentMethod: 'cash' | 'remittance' | 'jeeb' | 'e_wallet' | string;" // Keeping string as fallback in case 'other' is used
);

fs.writeFileSync('src/types.ts', code);
