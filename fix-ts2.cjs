const fs = require('fs');
const files = [
  'src/components/CustomerStatementPreview.tsx',
  'src/components/InvoicePrintTemplate.tsx',
  'src/components/VoucherPrintTemplate.tsx',
  'src/components/ReceiptPrint.tsx'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/output: \(\) => blob/g, 'output: (type?: string) => blob');
  fs.writeFileSync(f, code);
});
