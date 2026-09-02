import React, { useRef } from "react";
import "./ReceiptPrint.css";
import { Share2, Printer, X, Download } from 'lucide-react';

export interface ReceiptData {
  receiptNumber: string;
  date: string;
  receivedFrom: string;
  amount: string;
  amountInWords?: string;
  transferNumber: string;
  network: string;
  transferDate: string;
  paymentFor: string;
  remaining: string;
  receiver: string;
  cashier: string;
  type: 'receipt' | 'payment' | 'deferred';
  signature?: string;
}

interface ReceiptPrintProps {
  data: ReceiptData;
  onClose: () => void;
}

export default function ReceiptPrint({ data, onClose }: ReceiptPrintProps) {
  
  const [isGenerating, setIsGenerating] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchPdfBlob = async () => {
    if (!printRef.current) return null;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\n');
    const html = printRef.current.outerHTML;
    
    const response = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, styles, orientation: 'receipt' }) // receipt uses 80mm width
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
      const file = new File([blob], 'مستند.pdf', { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'مستند', files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'مستند.pdf';
        link.click();
        URL.revokeObjectURL(url);
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
      link.download = `فاتورة_${data.receiptNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إنشاء الـ PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  


  return (
    <div className="fixed inset-0 bg-slate-900/80 z-[100] flex flex-col items-center justify-center p-2 sm:p-4 no-print overflow-y-auto" dir="rtl">
      
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-full">
        {/* Controls */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 shrink-0">
          <h3 className="font-bold text-lg text-slate-800">معاينة السند</h3>
          <div className="flex gap-2">
            <button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">
              <Share2 className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">واتساب</span>}
            </button>
            <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold transition-colors disabled:opacity-50">
              <Download className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">تنزيل PDF</span>}
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
        <div className="overflow-y-auto p-4 flex-1 bg-[#eeeeee] flex justify-center items-start">
          
          <div className="print-section">
            <div className="receipt" ref={printRef}>

              {/* ================= HEADER ================= */}
              <header className="receipt-header">

                <div className="receipt-company">
                  <div className="receipt-company-name">
                    معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني
                  </div>

                  <div className="receipt-company-address">
                    صنعاء - شارع الزبيري - مقابل وزارة الدفاع
                  </div>

                  <div className="receipt-company-phone" dir="ltr">
                    770 447 441 - 730 447 441
                  </div>
                </div>

                <div className="receipt-logo">
                  {/* Mimicking logo with CSS to match original style */}
                  <div className="flex flex-col items-center justify-center h-full w-full">
                     <div className="text-[#208480] font-extrabold text-4xl leading-none relative">
                       <span className="absolute -top-3 right-0 text-[10px]">الأحمدي</span>
                       هاشم
                     </div>
                     <div className="text-[#208480] font-bold text-[10px] mt-1 whitespace-nowrap">للتطريز الإلكتروني</div>
                  </div>
                </div>
              </header>

              {/* ================= TITLE BAR ================= */}
              <section className="receipt-title-bar">

                <div className="receipt-meta receipt-meta-number">
                  <span>الرقم:</span>
                  <strong className="font-mono">{data.receiptNumber}</strong>
                </div>

                <div className="receipt-title">
                  سند {data.type === 'receipt' ? 'قبض' : data.type === 'payment' ? 'صرف' : 'آجل'}
                </div>

                <div className="receipt-meta receipt-meta-date">
                  <span>التاريخ:</span>
                  <strong>{data.date}</strong>
                </div>

              </section>

              {/* ================= BODY ================= */}
              <main className="receipt-body">

                <div className="receipt-line">
                  <span className="receipt-label">
                    {data.type === 'receipt' ? 'استلمت من الأخ:' : 'يصرف للأخ:'}
                  </span>

                  <span className="receipt-dotted-value text-[#208480]">
                    {data.receivedFrom}
                  </span>
                  <span className="receipt-label ml-2 mr-2">
                    المحترم
                  </span>
                </div>

                <div className="receipt-line">
                  <span className="receipt-label">
                    مبلغ وقدره:
                  </span>

                  <span className="receipt-dotted-value receipt-amount text-[#208480]">
                    {data.amount}
                  </span>

                  <span className="receipt-label receipt-currency">
                    ريال
                  </span>
                  
                  <span className="receipt-label">
                    فقط لا غير
                  </span>

                  {data.amountInWords && (
                    <span className="receipt-amount-words" aria-hidden="true">
                      {data.amountInWords}
                    </span>
                  )}
                </div>

                <div className="receipt-transfer-line">
                  <span className="receipt-label receipt-small-label">
                    نقداً / حوالة رقم:
                  </span>

                  <span className="receipt-small-field text-[#208480]">
                    {data.transferNumber}
                  </span>

                  <span className="receipt-label receipt-small-label">
                    عبر شبكة:
                  </span>

                  <span className="receipt-small-field receipt-network text-[#208480]">
                    {data.network}
                  </span>

                  <span className="receipt-label receipt-small-label">
                    فقط لا غير بتاريخ:
                  </span>

                  <span className="receipt-small-field receipt-transfer-date text-[#208480]" dir="ltr">
                    {data.transferDate}
                  </span>

                  <span className="receipt-label receipt-money-mark">
                    م
                  </span>
                </div>

                <div className="receipt-line receipt-last-line">
                  <span className="receipt-label">
                    وذلك مقابل /
                  </span>

                  <span className="receipt-dotted-value receipt-purpose text-[#208480]">
                    {data.paymentFor}
                  </span>

                  <span className="receipt-label receipt-remaining-label">
                    . الباقي عليكم /
                  </span>

                  <span className="receipt-dotted-value receipt-remaining">
                    {data.remaining}
                  </span>
                </div>

              </main>

              {/* ================= FOOTER / SIGNATURES ================= */}
              <footer className="receipt-footer">

                <div className="receipt-signature receipt-cashier">
                  <div className="receipt-signature-title">
                    امين الصندوق
                  </div>

                  <div className="receipt-signature-line">
                    {data.cashier}
                  </div>
                </div>

                <div className="receipt-signature receipt-receiver">
                  <div className="receipt-signature-title">
                    المستلم
                  </div>
                  <div className="receipt-signature-line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {data.signature ? (
                       <img src={data.signature} alt="Signature" style={{ maxHeight: '40px', mixBlendMode: 'multiply', marginBottom: '4px' }} />
                    ) : null}
                    <span>{data.receiver}</span>
                  </div>
                </div>

              </footer>

            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
            display: flex;
            justify-content: center;
            align-items: flex-start;
          }
          .no-print { display: none !important; }
          
          /* Override body styles safely */
          html, body {
            background: #fff !important;
          }
        }
      `}} />
    </div>
  );
}
