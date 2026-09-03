const fs = require('fs');

let inv = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf8');
// Check missing tags. Let's just count open and close divs.
const openDivs = (inv.match(/<div/g) || []).length;
const closeDivs = (inv.match(/<\/div>/g) || []).length;
console.log('Invoice', openDivs, closeDivs);

let vou = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');
const openDivsV = (vou.match(/<div/g) || []).length;
const closeDivsV = (vou.match(/<\/div>/g) || []).length;
console.log('Voucher', openDivsV, closeDivsV);

