const fs = require('fs');
let code = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf-8');

const targetToolbar = `<button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">`;

const replaceToolbar = `
            {!invoice.isApproved && (
              <button onClick={async () => {
                if(confirm('هل أنت متأكد من اعتماد هذه الفاتورة؟ سيتم ترحيلها إلى الحسابات والمخزن.')) {
                  // Actually we need to call approveInvoice from StoreContext.
                  // Wait, approveInvoice is not fetched from useStore in this component yet!
                }
              }} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-bold transition-colors">
                <CheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">اعتماد الفاتورة</span>
              </button>
            )}
            <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">`;

// Instead of injecting this, I should add `approveInvoice` to `useStore` destructuring.
const targetStore = `const { customers, suppliers } = useStore();`;
const replaceStore = `const { customers, suppliers, approveInvoice } = useStore();`;

code = code.replace(targetStore, replaceStore);

const replaceToolbarFinal = `
            {!invoice.isApproved && (
              <button onClick={async () => {
                if(confirm('هل أنت متأكد من اعتماد هذه الفاتورة؟ سيتم ترحيلها إلى الحسابات والمخزن.')) {
                  await approveInvoice(invoice.id);
                  onClose();
                }
              }} className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg font-bold transition-colors">
                <CheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">اعتماد الفاتورة</span>
              </button>
            )}
            <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">`;

code = code.replace(targetToolbar, replaceToolbarFinal);

// Add CheckCircle import
const targetImports = `import { Printer, Download, Share2, X } from 'lucide-react';`;
const replaceImports = `import { Printer, Download, Share2, X, CheckCircle } from 'lucide-react';`;
code = code.replace(targetImports, replaceImports);

fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', code);
