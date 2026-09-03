const fs = require('fs');

// 1. InvoicePrintTemplate.tsx
let inv = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf8');
inv = inv.replace(/<div className="w-56 flex flex-col items-center shrink-0">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, `<div className="w-56 flex flex-col items-center shrink-0">
                  <img src="/logo.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" />
                </div>
              </div>
            </div>`);
fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', inv);

// 2. VoucherPrintTemplate.tsx
let vou = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');
vou = vou.replace(/<div className="w-40 ml-4 shrink-0 flex flex-col items-center justify-center">[\s\S]*?<\/div>/, `<div className="w-48 ml-4 shrink-0 flex flex-col items-center justify-center">
                   <img src="/logo.png" className="w-full h-auto object-contain max-h-24" alt="شعار الاحمدي هاشم" />
                </div>`);
fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', vou);

// 3. ReceiptPrint.tsx
let rec = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');
rec = rec.replace(/<div className="receipt-logo">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, `<div className="receipt-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <img src="/logo.png" style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '45px' }} alt="شعار الاحمدي هاشم" />
                </div>`);
fs.writeFileSync('src/components/ReceiptPrint.tsx', rec);

// 4. Reports.tsx
let rep = fs.readFileSync('src/pages/Reports.tsx', 'utf8');
rep = rep.replace(/name: 'معامل هاشم الأحمدي',[\s\S]*?phone2: '711000000'\s*\}/, `name: 'معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني',
    location: 'صنعاء - شارع الزبيري - مقابل وزارة الدفاع',
    phone1: '770 447 441 - 730 447 441',
    logoSrc: '/logo.png'
  }`);
fs.writeFileSync('src/pages/Reports.tsx', rep);

// 5. CustomerStatement.tsx - Just in case to ensure logoSrc renders correctly without missing attributes
let stm = fs.readFileSync('src/components/CustomerStatement.tsx', 'utf8');
// Statement has: <img src={company.logoSrc} alt="" /> - let's make it styled properly
stm = stm.replace(/<img src=\{company\.logoSrc\} alt="" \/>/, '<img src={company.logoSrc} className="w-full h-auto object-contain max-h-24" alt="الشعار" />');
fs.writeFileSync('src/components/CustomerStatement.tsx', stm);

console.log('Logos patched');
