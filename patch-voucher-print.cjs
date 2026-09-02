const fs = require('fs');
let code = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf-8');

code = code.replace(
  "{voucher.paymentMethod === 'bank' ? 'حوالة بنكية' : voucher.paymentMethod === 'check' ? 'شيك' : 'نقداً'}",
  "{voucher.paymentMethod === 'cash' ? 'نقداً' : voucher.paymentMethod === 'remittance' ? 'حوالة' : voucher.paymentMethod === 'jeeb' ? 'جيب' : 'محفظة إلكترونية'}"
);

code = code.replace(
  "{voucher.paymentMethod !== 'cash' ? 'تحويل' : 'صندوق المعمل'}",
  "{voucher.paymentMethod !== 'cash' ? 'حوالة / محفظة' : 'صندوق المعمل'}"
);

fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', code);
