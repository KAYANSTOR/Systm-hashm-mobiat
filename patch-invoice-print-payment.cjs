const fs = require('fs');
let code = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf-8');

const target = `<div className="flex gap-2">
                  <span>التاريخ:</span>
                  <span>{formatDate(invoice.date)}</span>
                </div>`;

const replacement = `<div className="flex gap-2">
                  <span>التاريخ:</span>
                  <span>{formatDate(invoice.date)}</span>
                </div>
                <div className="flex gap-2">
                  <span>نوع الدفع:</span>
                  <span className="font-bold text-[#208480]">
                    {invoice.paymentType === 'cash' ? 'نقدي' : invoice.paymentType === 'deferred' ? 'آجل' : 'دفع جزئي'}
                  </span>
                </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', code);
