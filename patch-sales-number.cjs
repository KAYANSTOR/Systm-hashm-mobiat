const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const target = `    const nextId = invoices.length > 0 
      ? Math.max(...invoices.map(i => parseInt(i.invoiceNumber.replace(/\\D/g, '')) || 0)) + 1 
      : 1;
    setInvoiceNumber(String(nextId).padStart(3, '0'));`;

const replace = `    const typeInvoices = invoices.filter(i => i.type === type);
    const nextId = typeInvoices.length > 0 
      ? Math.max(...typeInvoices.map(i => parseInt(i.invoiceNumber.replace(/\\D/g, '')) || 0)) + 1 
      : 1;
    const prefix = type === 'sale' ? 'INV' : 'PUR';
    setInvoiceNumber(\`\${prefix}-\${String(nextId).padStart(4, '0')}\`);`;

code = code.replace(target, replace);
fs.writeFileSync('src/pages/Sales.tsx', code);
