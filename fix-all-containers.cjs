const fs = require('fs');

const files = [
  'src/pages/Inventory.tsx',
  'src/pages/Parties.tsx',
  'src/pages/Sales.tsx',
  'src/pages/Vouchers.tsx',
  'src/pages/Reports.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/table-container overflow-x-auto sm:overflow-visible/g, 'table-container');
  // For Vouchers.tsx tab container specifically:
  content = content.replace(/inline-flex shadow-sm gap-1 table-container max-w-full/g, 'inline-flex shadow-sm gap-1 overflow-x-auto max-w-full');
  fs.writeFileSync(file, content, 'utf8');
}
