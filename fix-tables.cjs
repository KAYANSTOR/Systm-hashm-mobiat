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
  // Remove overflow-x-auto classes that wrap tables
  content = content.replace(/<div className="overflow-x-auto[^"]*">\s*(<table)/g, '<div className="table-container">\n$1');
  // Handle reports specifically if it has it in the same line
  content = content.replace(/overflow-x-auto/g, 'table-container overflow-x-auto sm:overflow-visible');
  
  fs.writeFileSync(file, content, 'utf8');
}
