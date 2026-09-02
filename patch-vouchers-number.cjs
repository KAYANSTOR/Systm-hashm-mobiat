const fs = require('fs');
let code = fs.readFileSync('src/pages/Vouchers.tsx', 'utf-8');

const target = `    const nextId = vouchers.length > 0 
      ? Math.max(...vouchers.map(v => parseInt(v.voucherNumber.replace(/\\D/g, '')) || 0)) + 1 
      : 1;
    setVoucherNumber(String(nextId).padStart(3, '0'));`;

const replace = `    const typeVouchers = vouchers.filter(v => v.type === vType);
    const nextId = typeVouchers.length > 0 
      ? Math.max(...typeVouchers.map(v => parseInt(v.voucherNumber.replace(/\\D/g, '')) || 0)) + 1 
      : 1;
    const prefix = vType === 'receipt' ? 'REC' : (vType === 'payment' ? 'PAY' : 'JOU');
    setVoucherNumber(\`\${prefix}-\${String(nextId).padStart(4, '0')}\`);`;

code = code.replace(target, replace);
fs.writeFileSync('src/pages/Vouchers.tsx', code);
