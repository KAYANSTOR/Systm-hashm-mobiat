const fs = require('fs');

function fix(file, varName) {
  let code = fs.readFileSync(file, 'utf-8');
  const target = `parseInt(${varName}.replace(/\\D/g, '')) || 0`;
  const replace = `( (() => { const n = parseInt(${varName}.replace(/\\D/g, '')); return n < 1000000000 ? (n || 0) : 0; })() )`;
  code = code.split(target).join(replace);
  fs.writeFileSync(file, code);
}
fix('src/pages/Sales.tsx', 'i.invoiceNumber');
fix('src/pages/Vouchers.tsx', 'v.voucherNumber');
fix('src/pages/CashBox.tsx', 'v.documentNumber');
fix('src/context/StoreContext.tsx', 't.documentNumber');
