const fs = require('fs');
let content = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');

content = content.replace(/@media print\s*\{\s*@page\s*\{\s*size: A5 landscape;\s*margin: 0;\s*\}/, 
"@page { size: A5 landscape; margin: 0; }\n        @media print {");

fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', content, 'utf8');
