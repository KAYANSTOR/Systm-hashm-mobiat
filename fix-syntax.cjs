const fs = require('fs');
const files = [
  'src/components/CustomerStatementPreview.tsx',
  'src/components/InvoicePrintTemplate.tsx',
  'src/components/VoucherPrintTemplate.tsx',
  'src/components/ReceiptPrint.tsx'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/\}; catch \(err\) \{[\s\S]*?finally \{[\s\S]*?\}\n  \};/, '};\n');
  code = code.replace(/\}; catch \(err\) \{[\s\S]*?finally \{[\s\S]*?\}\n  \};/g, '};\n');
  fs.writeFileSync(f, code);
  console.log('Fixed', f);
});
