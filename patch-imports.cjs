const fs = require('fs');

const files = [
  'src/components/ReceiptPrint.tsx',
  'src/components/InvoicePrintTemplate.tsx',
  'src/components/VoucherPrintTemplate.tsx'
];

files.forEach(f => {
  let code = fs.readFileSync(f, 'utf8');
  if (!code.includes('import * as htmlToImage')) {
    code = code.replace(/import React/, "import * as htmlToImage from 'html-to-image';\nimport jsPDF from 'jspdf';\nimport React");
    fs.writeFileSync(f, code);
  }
});
console.log('Fixed imports');
