const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');
content = content.replace(/table-container overflow-x-auto sm:overflow-visible/g, 'overflow-x-auto');
fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
