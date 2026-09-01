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
  content = content.replace(/className="([^"]*text-center[^"]*text-slate-500[^"]*)"/g, 'className="$1 sm:!justify-center !justify-center"');
  fs.writeFileSync(file, content, 'utf8');
}
