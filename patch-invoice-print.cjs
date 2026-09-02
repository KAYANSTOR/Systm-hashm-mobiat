const fs = require('fs');

const content = `import React, { useRef } from 'react';
import { Printer, Download, Share2, X, CheckCircle } from 'lucide-react';
import { Invoice } from '../types';
import { formatCurrency, formatDate } from '../lib/utils';
import { useStore } from '../context/StoreContext';

interface InvoicePrintTemplateProps {
  invoice: Invoice;
  partyName: string;
  onClose: () => void;
}

export default function InvoicePrintTemplate({ invoice, partyName, onClose }: InvoicePrintTemplateProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  
  const { customers, suppliers, approveInvoice } = useStore();
  
  const party = invoice.type === 'sale' 
    ? customers.find(c => c.id === invoice.partyId) 
    : suppliers.find(s => s.id === invoice.partyId);

  // Accounting Ledger Calculations
  const currentBalance = party?.balance || 0;
  let previousBalance = currentBalance;
  
  if (invoice.isApproved) {
    if (invoice.type === 'sale') {
      previousBalance = currentBalance - invoice.remainingAmount;
    } else {
      previousBalance = currentBalance + invoice.remainingAmount;
    }
  }

  const grandTotal = previousBalance + (invoice.type === 'sale' ? invoice.remainingAmount : -invoice.remainingAmount);

  const fetchPdfBlob = async () => {
    if (!printRef.current) return null;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\\n');
    const html = printRef.current.outerHTML;
    
    const response = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, styles, orientation: 'portrait' })
    });
    
    if (!response.ok) throw new Error('PDF Generation Failed');
    return await response.blob();
  };

  const handlePrint = () => { window.print(); };

  const handleShareWhatsApp = async () => {
    try {
      setIsGenerating(true);
      const blob = await fetchPdfBlob();
      if (!blob) return;
      const file = new File([blob], 'فاتورة.pdf', { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'فاتورة', files: [file] });
      } else {
        alert('المتصفح لا يدعم مشاركة الملفات مباشرة. يمكنك تحميل الـ PDF ثم مشاركته.');
      }
    } catch (e) {
      console.error(e);
      alert('خطأ في المشاركة');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const blob = await fetchPdfBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`فاتورة_\${invoice.invoiceNumber}.pdf\`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء إنشاء الـ PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const MIN_ROWS = 12;
  const emptyRowsCount = Math.max(0, MIN_ROWS - invoice.items.length);
  const emptyRows = Array.from({ length: emptyRowsCount }).map((_, i) => i);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex flex-col items-center">
      <div className="w-full max-w-[210mm] mx-auto flex flex-col h-full bg-slate-100 shadow-2xl">
        
        {/* Toolbar (Hidden in print) */}
        <div className="bg-white p-4 shrink-0 flex items-center justify-between border-b print:hidden">
          <h2 className="font-bold text-lg">معاينة الطباعة / PDF</h2>
          <div className="flex gap-2">
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
            <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">
              <Share2 className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">مشاركة</span>}
            </button>
            <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold transition-colors disabled:opacity-50">
              <Download className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">تنزيل PDF</span>}
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-bold transition-colors">
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">طباعة</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="overflow-y-auto flex-1 flex items-start justify-center p-4">
          
          <div ref={printRef} className="print-section bg-white w-full max-w-[210mm] min-h-[297mm] shadow-sm relative overflow-hidden flex flex-col p-6" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
              {\`
                .invoice-print-table th, .invoice-print-table td {
                  border: 2px solid #088c94 !important;
                }
                .invoice-print-table th {
                  background-color: #5dbbc0 !important;
                  color: black !important;
                }
                .invoice-print-table td.empty-row {
                  border-bottom: 2px dashed #94a3b8 !important;
                  border-left: 2px solid #088c94 !important;
                  border-right: 2px solid #088c94 !important;
                }
                .chevron-separator {
                  clip-path: polygon(100% 0, 85% 50%, 100% 100%, 0 100%, 15% 50%, 0 0);
                }
              \`}
            </style>
            
            {/* Header Frame */}
            <div className="border-t-[10px] border-l-[4px] border-r-[4px] border-b-[4px] border-[#088c94] rounded-b-[40px] px-8 pt-4 pb-4 mb-4 mt-2">
              <div className="flex justify-between items-start">
                <div className="text-right flex-1 pt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-2xl text-[#088c94]">الاحمدي</span>
                    <h1 className="font-black text-3xl text-black tracking-tight">معامل هاشم الاحمدي للتصميم والتطريز الالكتروني</h1>
                  </div>
                  <h2 className="font-bold text-2xl text-black mb-1 text-center pr-12">صنعاء - شارع الزبيري - مقابل وزارة الدفاع</h2>
                  <h3 className="font-extrabold text-2xl text-black tracking-widest text-center pr-12 mt-2" dir="ltr">770 447 441 - 730 447 441</h3>
                </div>
                
                {/* Logo */}
                <div className="w-56 flex flex-col items-center shrink-0">
                  <div className="relative w-full h-24 mb-1">
                     <svg viewBox="0 0 200 100" className="w-full h-full fill-[#088c94]">
                       {/* Stylized Hashim Calligraphy Approximation */}
                       <path d="M160 30 C180 30, 190 50, 180 70 C170 90, 140 90, 140 70 C140 50, 150 50, 150 70 C150 80, 160 80, 165 70 C170 60, 160 45, 140 45 L100 45 C100 20, 120 20, 120 40 L90 40 L85 70 C85 85, 75 85, 75 70 L80 45 L50 45 L40 70 C35 85, 20 85, 20 70 C20 50, 40 40, 50 45 M135 15 A8 8 0 1 1 135 16 Z M95 15 A8 8 0 1 1 95 16 Z M80 15 A8 8 0 1 1 80 16 Z M65 15 A8 8 0 1 1 65 16 Z" stroke="#088c94" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                       <text x="100" y="70" fontFamily="Tajawal, sans-serif" fontWeight="900" fontSize="70" textAnchor="middle" letterSpacing="-4">هاشم</text>
                     </svg>
                  </div>
                  <div className="bg-[#088c94] text-white px-3 py-1 rounded-md text-[16px] font-bold w-full text-center tracking-wide">
                    للتطريز الإلكتروني
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-header Bar (Date, Type, Number) */}
            <div className="flex border-[3px] border-[#088c94] rounded-2xl overflow-hidden mb-4 items-stretch h-14">
               <div className="flex-1 flex items-center justify-center font-bold text-xl px-4 text-black">
                 <span className="ml-2">التاريخ:</span>
                 <span className="font-mono text-blue-800 tracking-wider" dir="ltr">{formatDate(invoice.date)}</span>
               </div>
               
               <div className="bg-[#088c94] w-12 chevron-separator -ml-4 z-10"></div>
               
               <div className="flex-[1.5] flex items-center justify-center font-bold text-xl px-8 z-0">
                 <span className="ml-4 font-black text-2xl">فاتورة</span>
                 <div className="flex items-center gap-6">
                   <label className="flex items-center gap-2 cursor-pointer">
                     <div className={\`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center \${invoice.paymentType === 'cash' ? 'bg-black' : 'bg-white'}\`}></div>
                     <span>نقدًا</span>
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer">
                     <div className={\`w-5 h-5 rounded-full border-2 border-black flex items-center justify-center \${invoice.paymentType !== 'cash' ? 'bg-black' : 'bg-white'}\`}></div>
                     <span>آجل</span>
                   </label>
                 </div>
               </div>
               
               <div className="bg-[#088c94] w-12 chevron-separator -mr-4 z-10 transform scale-x-[-1]"></div>
               
               <div className="flex-1 flex items-center justify-center font-bold text-xl px-4 text-black">
                 <span className="ml-2">الرقم:</span>
                 <span className="font-mono text-red-600 text-3xl font-black">{invoice.invoiceNumber}</span>
               </div>
            </div>

            {/* Customer Details */}
            <div className="flex items-end mb-4 px-2 text-xl font-bold">
              <span className="ml-2 whitespace-nowrap">المطلوب من الأخ /</span>
              <div className="flex-1 border-b-[3px] border-dotted border-blue-800 text-center pb-1 text-blue-800 font-black text-2xl">
                {partyName || 'نقدي'}
              </div>
              <span className="mr-2 whitespace-nowrap">المحترمون</span>
            </div>

            {/* Table */}
            <div className="flex-1 border-[3px] border-[#088c94] rounded-2xl overflow-hidden mb-6">
              <table className="w-full text-center border-collapse invoice-print-table h-full">
                <thead>
                  <tr>
                    <th rowSpan={2} className="py-2 w-16 text-lg font-black">رقم<br/>القص</th>
                    <th rowSpan={2} className="py-2 w-auto text-xl font-black">الـبـيـانـات<br/><span className="text-sm font-bold">Description</span></th>
                    <th colSpan={3} className="py-1 text-lg font-black">الكمية</th>
                    <th rowSpan={2} className="py-2 w-28 text-lg font-black">سعر<br/>الوحدة</th>
                    <th rowSpan={2} className="py-2 w-40 text-lg font-black">القيمة الاجمالية<br/><span className="text-sm font-bold">Total Amount</span></th>
                  </tr>
                  <tr>
                    <th className="py-1 w-14 text-sm font-black">سفيفة</th>
                    <th className="py-1 w-14 text-sm font-black">وار</th>
                    <th className="py-1 w-14 text-sm font-black">قطعة</th>
                  </tr>
                </thead>
                <tbody className="text-blue-900 font-bold text-xl font-mono">
                  {invoice.items.map((item, index) => {
                    const isPiece = item.unit === 'قطعة';
                    const isWar = item.unit === 'وار';
                    const isOther = !isPiece && !isWar;
                    
                    return (
                      <tr key={index} className="h-10">
                        <td className="py-1">{index + 1}</td>
                        <td className="py-1 text-right pr-4 font-cairo text-2xl font-black leading-tight">
                          {item.name} {item.description ? \` - \${item.description}\` : ''}
                        </td>
                        <td className="py-1">{isOther ? item.quantity : ''}</td>
                        <td className="py-1">{isWar ? item.quantity : ''}</td>
                        <td className="py-1">{isPiece ? item.quantity : ''}</td>
                        <td className="py-1">{formatCurrency(item.unitPrice).replace('ر.ي', '')}</td>
                        <td className="py-1">{formatCurrency(item.total).replace('ر.ي', '')}</td>
                      </tr>
                    );
                  })}
                  {/* Fill empty rows to make it look like a full page voucher */}
                  {emptyRows.map((_, index) => (
                    <tr key={\`empty-\${index}\`} className="h-10">
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                      <td className="empty-row"></td>
                    </tr>
                  ))}
                  {/* Final row to close the bottom border properly if needed, but table border handles it */}
                </tbody>
              </table>
            </div>

            {/* Totals & Signatures */}
            <div className="flex flex-col mt-auto relative pt-4">
              {/* Massive faded S signature background for aesthetics (like the blue pen mark in image) */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
                 <svg viewBox="0 0 500 200" className="w-full h-full stroke-blue-800" fill="none" strokeWidth="2">
                    <path d="M50 150 C 150 150, 100 50, 250 50 C 400 50, 350 150, 450 150" />
                 </svg>
              </div>
              
              <div className="flex w-full items-end justify-between">
                 {/* Signatures (Right Side) */}
                 <div className="flex-1 text-lg font-bold">
                    <p className="mb-8">
                       سلمت البضاعة الموضحة أعلاه كاملة ومطابقة للتفاصيل مع التزامي بدفع القيمة خلال فترة أقصاها (&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;) من تحرير الفاتورة
                    </p>
                    <div className="flex justify-between w-full max-w-md">
                       <span>توقيع المستلم : ..............................</span>
                       <span>توقيع المبيعات : ..............................</span>
                    </div>
                 </div>

                 {/* Totals (Left Side) */}
                 <div className="flex flex-col gap-3 w-80 mr-auto shrink-0 z-10">
                    <div className="flex items-center justify-end">
                       <span className="font-bold text-xl ml-4">إجمالي الفاتورة</span>
                       <div className="border-[3px] border-black rounded-full px-4 py-1.5 w-48 text-center font-black text-2xl text-blue-800 font-mono tracking-wider">
                          {formatCurrency(invoice.total).replace('ر.ي', '')}
                       </div>
                    </div>
                    <div className="flex items-center justify-end">
                       <span className="font-bold text-xl ml-4">الرصيد السابق</span>
                       <div className="border-[3px] border-black rounded-full px-4 py-1.5 w-48 text-center font-black text-2xl text-blue-800 font-mono tracking-wider">
                          {formatCurrency(previousBalance).replace('ر.ي', '')}
                       </div>
                    </div>
                    <div className="flex items-center justify-end">
                       <span className="font-bold text-xl ml-4">الإجمالي الكلي</span>
                       <div className="border-[3px] border-black rounded-full px-4 py-1.5 w-48 text-center font-black text-2xl text-blue-800 font-mono tracking-wider">
                          {formatCurrency(grandTotal).replace('ر.ي', '')}
                       </div>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', content);
