const fs = require('fs');

const files = [
  'src/pages/Inventory.tsx',
  'src/pages/Parties.tsx',
  'src/pages/Sales.tsx',
  'src/pages/Vouchers.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"/g, 'className="sm:bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-sm sm:overflow-hidden"');
  fs.writeFileSync(file, content, 'utf8');
}
