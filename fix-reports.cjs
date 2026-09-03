const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

const target = `<div className="w-48 ml-4 shrink-0 flex justify-end">
            <img src="/logo.svg" className="max-h-24 object-contain" alt="شعار الاحمدي هاشم" />
          </div>
        </div>
          </div>
        </div>`;

const fixed = `<div className="w-48 ml-4 shrink-0 flex justify-end">
            <img src="/logo.svg" className="max-h-24 object-contain" alt="شعار الاحمدي هاشم" />
          </div>
        </div>`;

code = code.replace(target, fixed);
fs.writeFileSync('src/pages/Reports.tsx', code);
console.log('Fixed syntax error');
