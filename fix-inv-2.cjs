const fs = require('fs');
let inv = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf8');

inv = inv.replace(/<div className="w-56 flex flex-col items-center shrink-0">\n  <img src="\/logo\.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" \/>\n<\/div>\n<\/div>\n<\/div>/, `<div className="w-56 flex flex-col items-center shrink-0">
  <img src="/logo.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" />
</div>
</div>`);

fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', inv);
