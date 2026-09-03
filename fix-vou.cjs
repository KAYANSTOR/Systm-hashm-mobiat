const fs = require('fs');
let vou = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');

const badPart = `<div className="w-48 ml-4 shrink-0 flex flex-col items-center justify-center">
                   <img src="/logo.png" className="w-full h-auto object-contain max-h-24" alt="شعار الاحمدي هاشم" />
                </div>
                   <div className="text-[#199b9e] font-black text-lg leading-none tracking-tight">معامل الأحمدي</div>
                   <div className="text-slate-500 font-bold text-xs mt-1">للتطريز الإلكتروني</div>
                </div>`;

const goodPart = `<div className="w-48 ml-4 shrink-0 flex flex-col items-center justify-center">
                   <img src="/logo.png" className="w-full h-auto object-contain max-h-24" alt="شعار الاحمدي هاشم" />
                </div>`;
                
vou = vou.replace(badPart, goodPart);
fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', vou);
console.log('Fixed Voucher');
