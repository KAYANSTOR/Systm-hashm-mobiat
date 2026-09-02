const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

code = code.replace(
  "{t.paymentMethod === 'cash' ? 'نقدي' : t.paymentMethod === 'bank' ? 'بنكي' : t.paymentMethod === 'transfer' ? 'تحويل' : 'أخرى'}",
  "{t.paymentMethod === 'cash' ? 'نقدي' : t.paymentMethod === 'remittance' ? 'حوالة' : t.paymentMethod === 'jeeb' ? 'جيب' : t.paymentMethod === 'e_wallet' ? 'محفظة' : 'أخرى'}"
);

fs.writeFileSync('src/pages/CashBox.tsx', code);
