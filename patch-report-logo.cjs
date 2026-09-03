const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

const reportHeaderRegex = /<div className="w-40 ml-4 shrink-0 flex flex-col items-center">.*?<\/div>.*?<\/div>/s;

const newHeader = `<div className="w-48 ml-4 shrink-0 flex justify-end">
            <img src="/logo.svg" className="max-h-24 object-contain" alt="شعار الاحمدي هاشم" />
          </div>
        </div>`;

code = code.replace(reportHeaderRegex, newHeader);
fs.writeFileSync('src/pages/Reports.tsx', code);
console.log('patched report header logo');
