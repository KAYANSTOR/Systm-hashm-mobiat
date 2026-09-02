const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf-8');
code = code.replace(
  '<main className="flex-1 overflow-auto p-4 pb-28">',
  '<main className="flex-1 overflow-auto p-4 pb-36">'
);
fs.writeFileSync('src/components/Layout.tsx', code);
