const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

const target = `    await addVoucher({
      voucherNumber: \`DIR-\${Date.now()}\`,`;

const replace = `    const dirVouchers = transactions.filter(t => t.documentNumber?.startsWith('DIR-'));
    const nextId = dirVouchers.length > 0 
      ? Math.max(...dirVouchers.map(v => parseInt(v.documentNumber.replace(/\\D/g, '')) || 0)) + 1 
      : 1;

    await addVoucher({
      voucherNumber: \`DIR-\${String(nextId).padStart(4, '0')}\`,`;

code = code.replace(target, replace);
fs.writeFileSync('src/pages/CashBox.tsx', code);
