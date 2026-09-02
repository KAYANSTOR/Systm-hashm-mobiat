const fs = require('fs');
let code = fs.readFileSync('src/pages/Vouchers.tsx', 'utf-8');

// Update state
code = code.replace(
  "useState<'cash' | 'bank' | 'check'>('cash');",
  "useState<'cash' | 'remittance' | 'jeeb' | 'e_wallet'>('cash');"
);

// Update table display
code = code.replace(
  "{v.paymentMethod === 'cash' ? 'نقدي' : v.paymentMethod === 'bank' ? 'حوالة بنكية' : 'شيك'}",
  "{v.paymentMethod === 'cash' ? 'نقدي' : v.paymentMethod === 'remittance' ? 'حوالة' : v.paymentMethod === 'jeeb' ? 'جيب' : 'محفظة أخرى'}"
);

// Update print templates inside Vouchers.tsx
code = code.replace(
  "transferNumber: printingVoucher.voucher.paymentMethod === 'bank' ? 'حوالة بنكية' : printingVoucher.voucher.paymentMethod === 'check' ? 'شيك' : 'نقداً',",
  "transferNumber: printingVoucher.voucher.paymentMethod === 'cash' ? 'نقداً' : printingVoucher.voucher.paymentMethod === 'remittance' ? 'حوالة' : printingVoucher.voucher.paymentMethod === 'jeeb' ? 'جيب' : 'محفظة إلكترونية',"
);

// Update network text
code = code.replace(
  "network: printingVoucher.voucher.paymentMethod !== 'cash' ? 'تحويل' : 'صندوق المعمل',",
  "network: printingVoucher.voucher.paymentMethod !== 'cash' ? 'حوالة / محفظة' : 'صندوق المعمل',"
);

// Update the select options
const selectTarget = `<option value="bank">تحويل بنكي</option>
                    <option value="check">شيك</option>`;
const selectReplacement = `<option value="remittance">حوالة</option>
                    <option value="jeeb">جيب</option>
                    <option value="e_wallet">محفظة إلكترونية أخرى</option>`;
code = code.replace(selectTarget, selectReplacement);

fs.writeFileSync('src/pages/Vouchers.tsx', code);
