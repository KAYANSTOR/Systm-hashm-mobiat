import React, { useState, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { FileText, Download, Printer, Filter, Share2 } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export default function Reports() {
  const { invoices, customers, suppliers } = useStore();
  const [reportType, setReportType] = useState('sales');
  const reportRef = useRef<HTMLDivElement>(null);

  const printReport = () => {
    window.print();
  };

  const shareReportPDF = async () => {
    if (!reportRef.current) return;
    try {
      const dataUrl = await htmlToImage.toJpeg(reportRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff' });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      const filename = `تقرير_${reportType === 'sales' ? 'المبيعات' : 'العملاء'}_${new Date().getTime()}.pdf`;
      
      if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], 'test.pdf', { type: 'application/pdf' })] })) {
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });
        await navigator.share({
          title: 'تقرير معامل هاشم الأحمدي',
          text: `تقرير ${reportType === 'sales' ? 'المبيعات' : 'العملاء'}`,
          files: [file],
        });
      } else {
        pdf.save(filename);
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('تعذر إنشاء أو مشاركة ملف PDF.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">التقارير الاحترافية</h2>
          <p className="text-sm text-slate-500 mt-1">استخراج وطباعة تقارير المبيعات وحسابات العملاء.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={shareReportPDF}
            className="flex items-center gap-2 bg-[#208480] hover:bg-[#1a6b68] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Share2 className="w-5 h-5" />
            <span>مشاركة PDF</span>
          </button>
          <button 
            onClick={printReport}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-5 h-5" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4 overflow-x-auto no-print">
        <button 
          onClick={() => setReportType('sales')}
          className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${reportType === 'sales' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          تقرير المبيعات الشامل
        </button>
        <button 
          onClick={() => setReportType('customers')}
          className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-colors ${reportType === 'customers' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          أرصدة العملاء
        </button>
      </div>

      {/* Report Printable Area */}
      <div ref={reportRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 print:p-0 print:border-none print:shadow-none mx-auto max-w-5xl">
        
        {/* Report Header for Print */}
        <div className="hidden print:flex justify-between items-center mb-8 border-b-2 border-[#199b9e] pb-4">
          <div className="flex-1 text-right">
            <h1 className="font-extrabold text-2xl text-slate-900 mb-1 font-tajawal">معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني</h1>
            <h2 className="font-bold text-lg text-slate-700 mb-2 font-tajawal">صنعاء - شارع الزبيري - مقابل وزارة الدفاع</h2>
            <p className="font-bold text-lg font-sans" dir="ltr">770 447 441 - 730 447 441</p>
          </div>
          <div className="w-40 ml-4 shrink-0 flex flex-col items-center">
             <div className="text-[#199b9e] font-extrabold text-5xl font-tajawal leading-none relative">
               <span className="absolute -top-4 right-0 text-sm">الأحمدي</span>
               هاشم
             </div>
             <div className="text-[#199b9e] font-bold text-sm mt-1 whitespace-nowrap">للتطريز الإلكتروني</div>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-end print:mt-4">
          <div className="print:hidden">
            <h1 className="text-3xl font-black text-slate-900 mb-2">معامل هاشم الأحمدي</h1>
            <p className="text-slate-600 font-medium">للتطريز الإلكتروني</p>
          </div>
          <div className="text-left print:text-right print:w-full print:flex print:justify-between print:items-center">
            <h2 className="text-2xl font-bold text-[#199b9e] mb-2 print:mb-0 font-tajawal">
              {reportType === 'sales' ? 'تقرير المبيعات الشامل' : 'كشف حسابات العملاء'}
            </h2>
            <p className="text-slate-600 font-bold">تاريخ الإصدار: {formatDate(new Date())}</p>
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'sales' && (
          <div className="space-y-6">
            <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
              <thead>
                <tr className="bg-slate-800 text-white print:bg-slate-200 print:text-slate-900">
                  <th className="px-4 py-3 font-bold rounded-tr-lg">رقم الفاتورة</th>
                  <th className="px-4 py-3 font-bold">التاريخ</th>
                  <th className="px-4 py-3 font-bold">العميل</th>
                  <th className="px-4 py-3 font-bold">الإجمالي</th>
                  <th className="px-4 py-3 font-bold rounded-tl-lg">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoices.filter(i => i.type === 'sale').map((inv) => (
                  <tr key={inv.id} className="text-slate-800">
                    <td className="px-4 py-3 font-mono">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3">{formatDate(inv.date)}</td>
                    <td className="px-4 py-3 font-bold">{customers.find(c => c.id === inv.partyId)?.name}</td>
                    <td className="px-4 py-3 font-bold">{formatCurrency(inv.total)}</td>
                    <td className="px-4 py-3">{inv.status === 'paid' ? 'مدفوع' : 'غير مدفوع'}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-bold text-slate-900 print:bg-slate-100">
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-left">إجمالي المبيعات:</td>
                  <td colSpan={2} className="px-4 py-4 text-xl text-emerald-700">
                    {formatCurrency(invoices.filter(i => i.type === 'sale').reduce((sum, inv) => sum + inv.total, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {reportType === 'customers' && (
          <div className="space-y-6">
             <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
              <thead>
                <tr className="bg-slate-800 text-white print:bg-slate-200 print:text-slate-900">
                  <th className="px-4 py-3 font-bold rounded-tr-lg">اسم العميل</th>
                  <th className="px-4 py-3 font-bold">رقم الهاتف</th>
                  <th className="px-4 py-3 font-bold">النوع</th>
                  <th className="px-4 py-3 font-bold rounded-tl-lg text-left">الرصيد المطلوب (دين)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {customers.map((c) => (
                  <tr key={c.id} className="text-slate-800">
                    <td className="px-4 py-3 font-bold">{c.name}</td>
                    <td className="px-4 py-3 font-mono">{c.phone}</td>
                    <td className="px-4 py-3">{c.type === 'wholesale' ? 'جملة' : 'مفرد'}</td>
                    <td className="px-4 py-3 font-black text-left text-rose-600" dir="ltr">
                      {formatCurrency(c.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer for Print */}
        <div className="mt-16 pt-8 border-t-2 border-[#199b9e] flex justify-between items-center text-slate-500 font-bold hidden print:flex">
          <p>توقيع الإدارة: ________________</p>
          <p>النظام مقدم من: معامل هاشم الأحمدي للتطريز الإلكتروني</p>
        </div>
      </div>
    </div>
  );
}
