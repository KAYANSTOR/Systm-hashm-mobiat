import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { FileText, Download, Printer, Filter, Share2, Search, Calendar, UserCheck } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export default function Reports() {
  const { invoices, customers, suppliers } = useStore();
  const [reportType, setReportType] = useState<'sales' | 'customers'>('sales');
  const reportRef = useRef<HTMLDivElement>(null);

  // Sales Filters State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState('');

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
      alert('تعذر إنشاء أو مشاركة ملف PDF. يمكنك استخدام زر الطباعة وحفظ التقرير كـ PDF.');
    }
  };

  // Process Sales Report Data
  const filteredSalesInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (inv.type !== 'sale') return false;
      if (selectedCustomerId !== 'all' && inv.partyId !== selectedCustomerId) return false;
      if (paymentStatus !== 'all' && inv.status !== paymentStatus) return false;
      if (searchInvoiceNumber && !inv.invoiceNumber.toLowerCase().includes(searchInvoiceNumber.toLowerCase())) return false;
      
      if (startDate) {
        if (new Date(inv.date) < new Date(startDate)) return false;
      }
      if (endDate) {
        // Add one day to end date to include the whole day
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        if (new Date(inv.date) >= nextDay) return false;
      }
      
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices, selectedCustomerId, paymentStatus, searchInvoiceNumber, startDate, endDate]);

  const salesTotals = useMemo(() => {
    return filteredSalesInvoices.reduce((acc, inv) => {
      acc.total += inv.total;
      acc.paid += inv.paidAmount;
      acc.remaining += inv.remainingAmount;
      return acc;
    }, { total: 0, paid: 0, remaining: 0 });
  }, [filteredSalesInvoices]);

  const getItemsSummary = (items: any[]) => {
    if (!items || items.length === 0) return { names: '-', totalQty: 0 };
    const names = items.map(i => i.name).join('، ');
    const totalQty = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    return { names, totalQty };
  };

  return (
    <div className="space-y-6">
      <div className="page-header no-print">
        <div>
          <h2 className="page-title">التقارير الاحترافية</h2>
          <p className="page-subtitle">استخراج وطباعة تقارير المبيعات وحسابات العملاء.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={shareReportPDF} className="btn-primary">
            <Share2 className="w-5 h-5" />
            <span>مشاركة PDF</span>
          </button>
          <button onClick={printReport} className="btn-secondary">
            <Printer className="w-5 h-5" />
            <span>طباعة التقرير</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2 sm:gap-4 no-print">
        <button 
          onClick={() => setReportType('sales')}
          className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${reportType === 'sales' ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          تقرير المبيعات الشامل
        </button>
        <button 
          onClick={() => setReportType('customers')}
          className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${reportType === 'customers' ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          أرصدة العملاء
        </button>
      </div>

      {/* Sales Report Filters */}
      {reportType === 'sales' && (
        <div className="card no-print">
          <div className="card-header border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-500" />
              فلاتر تقرير المبيعات
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label text-xs">العميل</label>
                <select 
                  className="input-field py-2" 
                  value={selectedCustomerId} 
                  onChange={e => setSelectedCustomerId(e.target.value)}
                >
                  <option value="all">جميع العملاء</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label text-xs">حالة الدفع</label>
                <select 
                  className="input-field py-2" 
                  value={paymentStatus} 
                  onChange={e => setPaymentStatus(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="paid">مدفوع</option>
                  <option value="partial">مدفوع جزئياً</option>
                  <option value="unpaid">غير مدفوع</option>
                </select>
              </div>
              <div>
                <label className="label text-xs">رقم الفاتورة</label>
                <input 
                  type="text" 
                  className="input-field py-2" 
                  placeholder="ابحث برقم الفاتورة..."
                  value={searchInvoiceNumber}
                  onChange={e => setSearchInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="label text-xs">من تاريخ</label>
                <input 
                  type="date" 
                  className="input-field py-2" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label className="label text-xs">إلى تاريخ</label>
                <input 
                  type="date" 
                  className="input-field py-2" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Printable Area */}
      <div ref={reportRef} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 print:p-4 print:border-none print:shadow-none mx-auto max-w-5xl">
        
        {/* Report Header for Print */}
        <div className="hidden print:flex justify-between items-center mb-8 border-b-2 border-brand-500 pb-4">
          <div className="flex-1 text-right">
            <h1 className="font-extrabold text-2xl text-slate-900 mb-1 font-tajawal">معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني</h1>
            <h2 className="font-bold text-lg text-slate-700 mb-2 font-tajawal">صنعاء - شارع الزبيري - مقابل وزارة الدفاع</h2>
            <p className="font-bold text-lg font-sans" dir="ltr">770 447 441 - 730 447 441</p>
          </div>
          <div className="w-40 ml-4 shrink-0 flex flex-col items-center">
             <div className="text-brand-500 font-extrabold text-5xl font-tajawal leading-none relative">
               <span className="absolute -top-4 right-0 text-sm">الأحمدي</span>
               هاشم
             </div>
             <div className="text-brand-500 font-bold text-sm mt-1 whitespace-nowrap">للتطريز الإلكتروني</div>
          </div>
        </div>

        <div className="mb-8 flex justify-between items-end print:mt-4">
          <div className="print:hidden">
            <h1 className="text-3xl font-black text-slate-900 mb-2">معامل هاشم الأحمدي</h1>
            <p className="text-slate-600 font-medium">للتطريز الإلكتروني</p>
          </div>
          <div className="text-left print:text-right print:w-full print:flex print:justify-between print:items-center">
            <h2 className="text-2xl font-bold text-brand-500 mb-2 print:mb-0 font-tajawal">
              {reportType === 'sales' ? 'تقرير المبيعات الشامل' : 'كشف حسابات العملاء'}
            </h2>
            <p className="text-slate-600 font-bold">تاريخ الإصدار: {formatDate(new Date())}</p>
          </div>
        </div>

        {/* Report Content */}
        {reportType === 'sales' && (
          <div className="space-y-6">
            <div className="table-container">
<table className="table-standard w-full">
                <thead>
                  <tr className="bg-slate-800 text-white print:bg-slate-200 print:text-slate-900">
                    <th className="px-3 py-3 font-bold rounded-tr-lg">رقم الفاتورة</th>
                    <th className="px-3 py-3 font-bold">التاريخ</th>
                    <th className="px-3 py-3 font-bold">العميل</th>
                    <th className="px-3 py-3 font-bold">الأصناف/الخدمات</th>
                    <th className="px-3 py-3 font-bold text-center">الكمية</th>
                    <th className="px-3 py-3 font-bold">الإجمالي</th>
                    <th className="px-3 py-3 font-bold">المدفوع</th>
                    <th className="px-3 py-3 font-bold text-left rounded-tl-lg">المتبقي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredSalesInvoices.map((inv) => {
                    const summary = getItemsSummary(inv.items || []);
                    const customerName = customers.find(c => c.id === inv.partyId)?.name || 'غير محدد';
                    return (
                      <tr key={inv.id} className="text-slate-800 hover:bg-slate-50/50">
                        <td data-label="رقم الفاتورة" className="px-3 py-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                        <td data-label="التاريخ" className="px-3 py-3 text-slate-600 whitespace-nowrap">{formatDate(inv.date)}</td>
                        <td data-label="العميل" className="px-3 py-3 font-bold">{customerName}</td>
                        <td data-label="الأصناف" className="px-3 py-3 text-sm text-slate-600 max-w-xs truncate" title={summary.names !== '-' ? summary.names : ''}>
                          {summary.names}
                        </td>
                        <td data-label="الكمية" className="px-3 py-3 text-center font-bold">{summary.totalQty}</td>
                        <td data-label="الإجمالي" className="px-3 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(inv.total)}</td>
                        <td data-label="المدفوع" className="px-3 py-3 font-bold text-emerald-600" dir="ltr">{formatCurrency(inv.paidAmount)}</td>
                        <td data-label="المتبقي" className="px-3 py-3 font-bold text-rose-600 text-left" dir="ltr">{formatCurrency(inv.remainingAmount)}</td>
                      </tr>
                    );
                  })}
                  {filteredSalesInvoices.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium sm:!justify-center !justify-center">
                        لا توجد مبيعات مطابقة للبحث
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Totals Summary Card */}
            {filteredSalesInvoices.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col print:border-slate-300">
                  <span className="text-slate-500 text-sm font-bold mb-1">إجمالي المبيعات</span>
                  <span className="text-2xl font-black text-slate-900" dir="ltr">{formatCurrency(salesTotals.total)}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex flex-col print:border-emerald-200">
                  <span className="text-emerald-700 text-sm font-bold mb-1">إجمالي المقبوضات (المدفوع)</span>
                  <span className="text-2xl font-black text-emerald-700" dir="ltr">{formatCurrency(salesTotals.paid)}</span>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex flex-col print:border-rose-200">
                  <span className="text-rose-700 text-sm font-bold mb-1">إجمالي المتبقي (الديون)</span>
                  <span className="text-2xl font-black text-rose-700" dir="ltr">{formatCurrency(salesTotals.remaining)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {reportType === 'customers' && (
          <div className="space-y-6">
             <table className="table-standard w-full">
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
                    <td data-label="اسم العميل" className="px-4 py-3 font-bold">{c.name}</td>
                    <td data-label="رقم الهاتف" className="px-4 py-3 font-mono">{c.phone}</td>
                    <td data-label="النوع" className="px-4 py-3">{c.type === 'wholesale' ? 'جملة' : 'مفرد'}</td>
                    <td data-label="الرصيد المطلوب" className="px-4 py-3 font-black text-left text-rose-600" dir="ltr">
                      {formatCurrency(c.balance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer for Print */}
        <div className="mt-16 pt-8 border-t-2 border-brand-500 flex justify-between items-center text-slate-500 font-bold hidden print:flex">
          <p>توقيع الإدارة: ________________</p>          <p>النظام مقدم من: معامل هاشم الأحمدي للتطريز الإلكتروني</p>
        </div>
      </div>
    </div>
  );
}
