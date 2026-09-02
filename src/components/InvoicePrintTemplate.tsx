import React, { useRef } from 'react';
import { Share2, Printer, X, Download } from 'lucide-react';
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
  // Party balance in store is the CURRENT balance.
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
      .join('\n');
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
      link.download = `فاتورة_${invoice.invoiceNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('حدث خطأ أثناء إنشاء الـ PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  // Ensure minimum empty rows for traditional printed invoice structure (15 rows)
  const MIN_ROWS = 15;
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

        {/* Printable Area Wrapper */}
        <div className="overflow-y-auto flex-1 flex items-start justify-center p-4">
          
          <div ref={printRef} className="print-section bg-white w-full max-w-[210mm] min-h-[297mm] shadow-sm relative overflow-hidden flex flex-col p-8" style={{ fontFamily: 'Arial, Tahoma, Sakkal Majalla, serif' }}>
            <style>
              {`
                .invoice-table th, .invoice-table td {
                  border: 1px solid #208480 !important;
                }
                .invoice-table th {
                  background-color: #208480 !important;
                  color: white !important;
                }
              `}
            </style>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b-2 border-[#208480] pb-4">
              <div className="flex-1 text-right">
                <h1 className="font-extrabold text-3xl text-slate-900 mb-2">معامل هاشم الأحمدي</h1>
                <h2 className="font-bold text-xl text-slate-700 mb-1">للتصميم والتطريز الإلكتروني</h2>
                <p className="text-slate-600 mb-1">صنعاء - شارع الزبيري - مقابل وزارة الدفاع</p>
                <p className="font-bold text-lg" dir="ltr">770 447 441 - 730 447 441</p>
              </div>
              <div className="w-40 ml-4 shrink-0 flex flex-col items-center justify-center border-4 border-[#208480] rounded-full p-4 aspect-square">
                 <div className="text-[#208480] font-black text-4xl text-center leading-none">
                   هاشم<br/><span className="text-xl">الأحمدي</span>
                 </div>
              </div>
            </div>

            {/* Title & Info */}
            <div className="text-center mb-6">
               <h3 className="inline-block px-8 py-2 border-2 border-[#208480] text-[#208480] font-black text-2xl rounded-lg">
                 {invoice.type === 'sale' ? (invoice.invoiceType === 'SERVICE' ? 'فاتورة خدمة تطريز' : 'فاتورة مبيعات') : 'فاتورة مشتريات'}
               </h3>
               {!invoice.isApproved && <div className="text-rose-600 font-bold mt-2">نسخة غير معتمدة (مسودة)</div>}
            </div>

            <div className="flex justify-between items-center mb-4 text-lg font-bold">
              <div className="flex items-center gap-2">
                <span>المطلوب من الأخ /</span>
                <span className="border-b-2 border-dotted border-slate-400 min-w-[200px] inline-block px-2">{partyName}</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <span>رقم الفاتورة:</span>
                  <span className="font-mono text-[#208480]">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex gap-2">
                  <span>التاريخ:</span>
                  <span>{formatDate(invoice.date)}</span>
                </div>
                <div className="flex gap-2">
                  <span>نوع الدفع:</span>
                  <span className="font-bold text-[#208480]">
                    {invoice.paymentType === 'cash' ? 'نقدي' : invoice.paymentType === 'deferred' ? 'آجل' : 'دفع جزئي'}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <table className="w-full text-right mb-6 border-collapse invoice-table">
              <thead>
                <tr>
                  <th className="py-2 px-2 text-center w-12">م</th>
                  <th className="py-2 px-4">البيان</th>
                  <th className="py-2 px-3 text-center w-24">الوحدة</th>
                  <th className="py-2 px-3 text-center w-24">الكمية</th>
                  <th className="py-2 px-3 text-center w-32">السعر</th>
                  <th className="py-2 px-3 text-center w-32">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2 text-center font-bold">{idx + 1}</td>
                    <td className="py-2 px-4 font-bold">{item.name} {item.description ? ` - ${item.description}` : ''}</td>
                    <td className="py-2 px-3 text-center">{item.unit || '-'}</td>
                    <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-2 px-3 text-center font-bold" dir="ltr">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-2 px-3 text-center font-black text-[#208480]" dir="ltr">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
                {/* Empty Rows to maintain traditional structure */}
                {emptyRows.map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="py-2 px-2 text-center font-bold text-transparent">.</td>
                    <td className="py-2 px-4"></td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3"></td>
                    <td className="py-2 px-3"></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer Summary Section */}
            <div className="flex justify-between items-stretch mt-auto">
              
              {/* Previous Balance Ledger */}
              <div className="w-64 border-2 border-[#208480] rounded-xl overflow-hidden flex flex-col">
                <div className="bg-[#208480] text-white text-center py-1 font-bold">كشف حساب العميل</div>
                <div className="flex-1 p-3 flex flex-col justify-center gap-2 bg-slate-50 font-bold">
                  <div className="flex justify-between">
                    <span>رصيد سابق:</span>
                    <span dir="ltr">{formatCurrency(previousBalance)}</span>
                  </div>
                  <div className="flex justify-between text-rose-600">
                    <span>قيمة الفاتورة المتبقية:</span>
                    <span dir="ltr">
                      {invoice.type === 'sale' 
                        ? formatCurrency(invoice.remainingAmount)
                        : formatCurrency(-invoice.remainingAmount)}
                    </span>
                  </div>
                  <div className="border-t-2 border-slate-300 my-1"></div>
                  <div className="flex justify-between text-[#208480] text-lg font-black">
                    <span>الرصيد الحالي:</span>
                    <span dir="ltr">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Invoice Totals */}
              <div className="w-72">
                <table className="w-full border-collapse invoice-table font-bold">
                  <tbody>
                    <tr>
                      <td className="py-1 px-3 bg-[#208480]/10">إجمالي الفاتورة:</td>
                      <td className="py-1 px-3 text-left" dir="ltr">{formatCurrency(invoice.subTotal)}</td>
                    </tr>
                    {invoice.discount > 0 && (
                      <tr>
                        <td className="py-1 px-3 bg-[#208480]/10">الخصم:</td>
                        <td className="py-1 px-3 text-left text-rose-600" dir="ltr">{formatCurrency(invoice.discount)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-1 px-3 bg-[#208480]/10">الصافي:</td>
                      <td className="py-1 px-3 text-left text-lg font-black text-[#208480]" dir="ltr">{formatCurrency(invoice.total)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-3 bg-[#208480]/10">المدفوع:</td>
                      <td className="py-1 px-3 text-left text-emerald-600" dir="ltr">{formatCurrency(invoice.paidAmount)}</td>
                    </tr>
                    <tr>
                      <td className="py-1 px-3 bg-[#208480]/10">المتبقي:</td>
                      <td className="py-1 px-3 text-left text-rose-600 font-black" dir="ltr">{formatCurrency(invoice.remainingAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-4 border-2 border-slate-300 p-2 rounded-lg font-bold">
                <span className="text-[#208480]">ملاحظات: </span> {invoice.notes}
              </div>
            )}

            {/* Signatures */}
            <div className="flex justify-between mt-12 px-8 font-bold text-lg pb-4">
              <div className="text-center w-48">
                <div className="mb-8">توقيع المستلم</div>
                <div className="border-t-2 border-dashed border-slate-400 pt-1"></div>
              </div>
              <div className="text-center w-48">
                <div className="mb-8 text-[#208480]">توقيع الإدارة / المحاسب</div>
                <div className="border-t-2 border-dashed border-[#208480] pt-1"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
