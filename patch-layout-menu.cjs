const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Update Quick Actions Menu position
const oldMenu = `              <div className="fixed bottom-40 left-6 flex flex-col gap-3 z-40 no-print">`;
const newMenu = `              <div className="fixed bottom-24 left-1/2 -translate-x-1/2 flex flex-col gap-3 z-40 no-print w-48 items-center">`;
code = code.replace(oldMenu, newMenu);

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('patched Layout menu');
