import React, { useRef } from 'react';
import { formatCurrency, formatDate } from '../lib/utils';
import { Invoice } from '../types';
import * as htmlToImage from 'html-to-image';
import { Share2, Printer, X } from 'lucide-react';

interface InvoicePrintTemplateProps {
  invoice: Invoice;
  partyName: string;
  onClose: () => void;
}

export default function InvoicePrintTemplate({ invoice, partyName, onClose }: InvoicePrintTemplateProps) {
  const [cachedBlob, setCachedBlob] = React.useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const generateBlob = async () => {
      if (!printRef.current) return;
      try {
        const filter = (node: HTMLElement) => {
          if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) return false;
          return true;
        };
        // small delay to ensure fonts/render is ready
        await new Promise(r => setTimeout(r, 800));
        const blob = await htmlToImage.toBlob(printRef.current, { quality: 0.9, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });
        setCachedBlob(blob);
      } catch (err) {
        console.error('Pre-generation error:', err);
      } finally {
        setIsGenerating(false);
      }
    };
    generateBlob();
  }, [invoice, partyName]);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = async () => {
    if (!printRef.current) return;
    try {
      const filter = (node: HTMLElement) => {
        if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) {
          return false;
        }
        return true;
      };

      const imageBlob = await htmlToImage.toBlob(printRef.current, { 
        quality: 0.9, 
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        filter: filter as any
      });
      
      if (imageBlob && navigator.canShare && navigator.canShare({ files: [new File([imageBlob], 'test.png', { type: 'image/png' })] })) {
        const file = new File([imageBlob], `فاتورة_${invoice.invoiceNumber}.png`, { type: 'image/png' });
        await navigator.share({
          title: 'فاتورة ' + (invoice.type === 'sale' ? 'مبيعات' : 'مشتريات'),
          text: `فاتورة رقم: ${invoice.invoiceNumber}\nالمبلغ الإجمالي: ${formatCurrency(invoice.total)}`,
          files: [file],
        });
      } else {
        const text = `*معامل هاشم الأحمدي للتطريز الإلكتروني*\n\nفاتورة ${invoice.type === 'sale' ? 'مبيعات' : 'مشتريات'}\nرقم: ${invoice.invoiceNumber}\nالتاريخ: ${formatDate(invoice.date)}\n\nالطرف: ${partyName}\nالإجمالي: ${formatCurrency(invoice.total)}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      if (error.name === 'AbortError') return; // User canceled the share
      const text = `*معامل هاشم الأحمدي للتطريز الإلكتروني*\n\nفاتورة ${invoice.type === 'sale' ? 'مبيعات' : 'مشتريات'}\nرقم: ${invoice.invoiceNumber}\nالتاريخ: ${formatDate(invoice.date)}\n\nالطرف: ${partyName}\nالإجمالي: ${formatCurrency(invoice.total)}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex flex-col items-center justify-center p-2 sm:p-4 no-print overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-full">
        {/* Controls */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-lg text-slate-800">معاينة الفاتورة</h3>
          <div className="flex gap-2">
            <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">
              <Share2 className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">واتساب</span>}
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg font-bold transition-colors">
              <Printer className="w-4 h-4" /> <span className="hidden sm:inline">طباعة / PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area Wrapper */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1 bg-slate-100 flex items-start justify-center">
          
          {/* Actual Print Content */}
          <div ref={printRef} className="print-section bg-white w-full max-w-[210mm] rounded-3xl border-2 border-[#208480] p-6 shadow-sm relative overflow-hidden" style={{ minHeight: '297mm', fontFamily: 'Arial, Tahoma, Sakkal Majalla, serif' }}>
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b-2 border-[#208480] pb-6">
              <div className="flex-1 text-right">
                <h1 className="font-extrabold text-2xl text-slate-900 mb-1">معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني</h1>
                <h2 className="font-bold text-lg text-slate-700 mb-2">صنعاء - شارع الزبيري - مقابل وزارة الدفاع</h2>
                <p className="font-bold text-lg" dir="ltr">770 447 441 - 730 447 441</p>
              </div>
              <div className="w-40 ml-4 shrink-0 flex flex-col items-center">
                 {/* Mimicking logo with CSS */}
                 <div className="text-[#208480] font-extrabold text-5xl leading-none relative">
                   <span className="absolute -top-4 right-0 text-sm">الأحمدي</span>
                   هاشم
                 </div>
                 <div className="text-[#208480] font-bold text-sm mt-1 whitespace-nowrap">للتطريز الإلكتروني</div>
              </div>
            </div>

            {/* Title Bar & Info */}
            <div className="flex justify-between items-center mb-8 bg-[#208480]/5 p-4 rounded-2xl border border-[#208480]/20">
              <div>
                <h3 className="text-[#208480] font-black text-2xl mb-2">
                  فاتورة {invoice.type === 'sale' ? 'مبيعات' : 'مشتريات'}
                  {!invoice.isApproved && <span className="text-sm bg-rose-100 text-rose-600 px-2 py-1 rounded-full mr-3 align-middle">مسودة</span>}
                </h3>
                <div className="text-lg font-bold text-slate-800">
                  الطرف: <span className="text-[#208480]">{partyName}</span>
                </div>
              </div>
              <div className="text-left font-bold text-lg">
                <div>رقم الفاتورة: <span className="font-mono text-xl">{invoice.invoiceNumber}</span></div>
                <div>التاريخ: <span>{formatDate(invoice.date)}</span></div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-right mb-8 border-collapse">
              <thead>
                <tr className="bg-[#208480] text-white">
                  <th className="py-3 px-4 border border-[#208480] rounded-tr-lg">م</th>
                  <th className="py-3 px-4 border border-[#208480]">البيان / الصنف</th>
                  <th className="py-3 px-4 border border-[#208480] text-center">الكمية</th>
                  <th className="py-3 px-4 border border-[#208480] text-center">السعر</th>
                  <th className="py-3 px-4 border border-[#208480] rounded-tl-lg text-center">الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="py-3 px-4 border-r border-l border-slate-200 text-center font-bold">{idx + 1}</td>
                    <td className="py-3 px-4 border-l border-slate-200 font-bold">{item.name}</td>
                    <td className="py-3 px-4 border-l border-slate-200 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 px-4 border-l border-slate-200 text-center font-bold" dir="ltr">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 px-4 border-l border-slate-200 text-center font-black text-[#208480]" dir="ltr">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Summary */}
            <div className="flex justify-end">
              <div className="w-80 bg-slate-50 p-4 rounded-xl border border-slate-200 text-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-slate-600">الإجمالي:</span>
                  <span className="font-bold" dir="ltr">{formatCurrency(invoice.subTotal)}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between mb-2 text-rose-600">
                    <span className="font-bold">الخصم:</span>
                    <span className="font-bold" dir="ltr">{formatCurrency(invoice.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between mb-4 border-b border-slate-200 pb-3 mt-3">
                  <span className="font-black text-slate-800">الصافي:</span>
                  <span className="font-black text-[#208480] text-xl" dir="ltr">{formatCurrency(invoice.total)}</span>
                </div>
                <div className="flex justify-between mb-2 text-emerald-600">
                  <span className="font-bold">المدفوع:</span>
                  <span className="font-bold" dir="ltr">{formatCurrency(invoice.paidAmount)}</span>
                </div>
                <div className="flex justify-between text-rose-600 mt-2">
                  <span className="font-bold">المتبقي:</span>
                  <span className="font-black" dir="ltr">{formatCurrency(invoice.remainingAmount)}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-700 mb-2">ملاحظات:</h4>
                <p className="text-slate-600">{invoice.notes}</p>
              </div>
            )}

            {/* Signatures */}
            <div className="flex justify-between mt-16 px-12 font-bold text-xl">
              <div className="text-center w-48">
                <div className="mb-8 text-slate-600">توقيع المستلم</div>
                <div className="border-t-2 border-dotted border-slate-400 pt-2"></div>
              </div>
              <div className="text-center w-48">
                <div className="mb-8 text-slate-600">إدارة المعمل</div>
                <div className="border-t-2 border-dotted border-slate-400 pt-2"></div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
