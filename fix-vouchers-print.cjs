const fs = require('fs');

let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

if (!content.includes('import VoucherPrintTemplate')) {
    content = content.replace(/import ReceiptPrint, \{ ReceiptData \} from '\.\.\/components\/ReceiptPrint';/,
    "import ReceiptPrint, { ReceiptData } from '../components/ReceiptPrint';\nimport VoucherPrintTemplate from '../components/VoucherPrintTemplate';");
}

if (!content.includes('printingA5Voucher')) {
    content = content.replace(/const \[printingVoucher, setPrintingVoucher\] = useState/,
    "const [printingA5Voucher, setPrintingA5Voucher] = useState<{voucher: Voucher, partyName: string} | null>(null);\n  const [printingVoucher, setPrintingVoucher] = useState");
}

const buttonsRegex = /<button onClick=\{\(\) => setPrintingVoucher\(\{voucher: v, partyName\}\)\} className="text-teal-600 hover:text-teal-800 p-1 transition-colors">\s*<Printer className="w-4 h-4" \/>\s*<\/button>/;
const newButtons = `<button onClick={() => setPrintingA5Voucher({voucher: v, partyName})} className="text-indigo-600 hover:text-indigo-800 p-1 transition-colors" title="معاينة طباعة A5">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setPrintingVoucher({voucher: v, partyName})} className="text-teal-600 hover:text-teal-800 p-1 transition-colors" title="طباعة حرارية">
                            <Printer className="w-4 h-4" />
                          </button>`;

if (buttonsRegex.test(content)) {
    content = content.replace(buttonsRegex, newButtons);
}

const renderRegex = /\{printingVoucher && \([\s\S]*?onClose=\{\(\) => setPrintingVoucher\(null\)\} \/>\s*\)\}/;
const newRender = `{printingVoucher && (
        <ReceiptPrint 
            data={{
            receiptNumber: printingVoucher.voucher.voucherNumber,
            date: formatDate(printingVoucher.voucher.date),
            receivedFrom: printingVoucher.partyName,
            amount: formatCurrency(printingVoucher.voucher.amount),
            transferNumber: printingVoucher.voucher.paymentMethod === 'bank' ? 'حوالة بنكية' : printingVoucher.voucher.paymentMethod === 'check' ? 'شيك' : 'نقداً',
            network: printingVoucher.voucher.paymentMethod !== 'cash' ? 'تحويل' : 'صندوق المعمل',
            transferDate: formatDate(printingVoucher.voucher.date),
            paymentFor: printingVoucher.voucher.description,
            type: printingVoucher.voucher.type as any,
            remaining: '0',
            receiver: printingVoucher.voucher.createdBy || 'النظام',
            cashier: printingVoucher.voucher.createdBy || 'النظام'
            }}
          onClose={() => setPrintingVoucher(null)} 
        />
      )}
      
      {printingA5Voucher && (
        <VoucherPrintTemplate 
          voucher={printingA5Voucher.voucher} 
          partyName={printingA5Voucher.partyName} 
          onClose={() => setPrintingA5Voucher(null)} 
        />
      )}`;

if (renderRegex.test(content)) {
    content = content.replace(renderRegex, newRender);
} else {
    // try to match the ReceiptPrint part differently
    const altRegex = /\{printingVoucher && \([\s\S]*?<\/ReceiptPrint>[\s\S]*?\)\}/;
    if (altRegex.test(content)) {
        content = content.replace(altRegex, newRender);
    }
}

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');

