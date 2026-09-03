const fs = require('fs');
const files = [
  'src/components/CustomerStatementPreview.tsx',
  'src/components/InvoicePrintTemplate.tsx',
  'src/components/VoucherPrintTemplate.tsx',
  'src/components/ReceiptPrint.tsx'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/save: \(name\)/g, 'save: (name: string)');
  fs.writeFileSync(f, code);
});
