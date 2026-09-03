import React, { useState, useRef, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { FileText, Download, Printer, Filter, Share2, Search, Calendar, UserCheck } from 'lucide-react';
import { CustomerStatementPreview } from '../components/CustomerStatementPreview';
import { StatementFilters, CustomDatePicker } from '../components/StatementFilters';
import type { CustomerStatementData, StatementEntry, StatementCompany } from '../components/CustomerStatement';

import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';

export default function Reports() {
  const { invoices, customers, suppliers, transactions } = useStore();
  const [reportType, setReportType] = useState<'sales' | 'customers' | 'statement'>('sales');
  const reportRef = useRef<HTMLDivElement>(null);

  // Sales Filters State
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('all');
  const [statementCustomerId, setStatementCustomerId] = useState('');
  const [statementStartDate, setStatementStartDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [statementEndDate, setStatementEndDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState('');
  const [transactionType, setTransactionType] = useState('all');

  

  const statementData = useMemo(() => {
    if (!statementCustomerId) return null;
    const customer = customers.find(c => c.id === statementCustomerId);
    if (!customer) return null;

    let filteredTransactions = transactions.filter(t => t.partyId === statementCustomerId);
    
    // Sort oldest to newest for chronological statement
    filteredTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let openingBalance = 0; // In a real system, calculate opening balance up to start date
    
    if (statementStartDate) {
      // Calculate opening balance based on earlier transactions
      openingBalance = filteredTransactions
        .filter(t => new Date(t.date) < new Date(statementStartDate))
        .reduce((sum, t) => sum + (t.debit || 0) - (t.credit || 0), 0);
      
      // Filter the actual displayed entries
      filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(statementStartDate));
    }

    if (statementEndDate) {
       // Add one day to include the whole end date
       const nextDay = new Date(statementEndDate);
       nextDay.setDate(nextDay.getDate() + 1);
       filteredTransactions = filteredTransactions.filter(t => new Date(t.date) < nextDay);
    }

    const entries: StatementEntry[] = filteredTransactions.map(t => ({
      id: t.id,
      date: new Date(t.date).toLocaleDateString('ar-YE'),
      transactionType: t.documentType === 'invoice' ? 'فاتورة' : (t.documentType === 'voucher' ? (t.debit ? 'سند صرف' : 'سند قبض') : 'حركة مباشرة'),
      documentNumber: t.documentNumber,
      description: t.description,
      debit: t.debit || 0,
      credit: t.credit || 0,
      documentType: t.documentType === 'invoice' ? 'آجل' : 'نقدي'
    }));

    const data: CustomerStatementData = {
      statementNumber: 'ST-' + new Date().getTime().toString().slice(-6),
      date: new Date().toLocaleDateString('ar-YE'),
      customerName: customer.name,
      customerNumber: customer.id.substring(0, 6).toUpperCase(),
      phone: customer.phone,
      accountType: customer.type === 'wholesale' ? 'جملة' : 'مفرد',
      periodFrom: statementStartDate ? new Date(statementStartDate).toLocaleDateString('ar-YE') : 'بداية التعامل',
      periodTo: statementEndDate ? new Date(statementEndDate).toLocaleDateString('ar-YE') : new Date().toLocaleDateString('ar-YE'),
      openingBalance,
      entries
    };

    return data;
  }, [statementCustomerId, statementStartDate, statementEndDate, transactions, customers]);

  const companyData: StatementCompany = {
    name: 'معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني',
    location: 'صنعاء - شارع الزبيري - مقابل وزارة الدفاع',
    phone1: '770 447 441',
    phone2: '730 447 441',
    logoSrc: '/logo.svg'
  };


  const printReport = () => {
    window.print();
  };

  const shareReportPDF = async (action: 'share' | 'download' = 'share') => {
    if (!reportRef.current) return;
    try {
      const filter = (node: HTMLElement) => {
        if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) return false;
        return true;
      };
      
      const dataUrl = await htmlToImage.toJpeg(reportRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const filename = `تقرير_${reportType === 'sales' ? 'المبيعات' : 'العملاء'}_${new Date().getTime()}.pdf`;
      
      if (action === 'download') {
        pdf.save(filename);
        return;
      }

      const pdfBlob = pdf.output('blob');
      
      if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], 'test.pdf', { type: 'application/pdf' })] })) {
        try {
           const file = new File([pdfBlob], filename, { type: 'application/pdf' });
           await navigator.share({
             title: 'تقرير معامل هاشم الأحمدي',
             text: `تقرير ${reportType === 'sales' ? 'المبيعات' : 'العملاء'}`,
             files: [file],
           });
        } catch(e: any) {
           if (e.name !== 'AbortError') {
             pdf.save(filename);
           }
        }
      } else {
        pdf.save(filename);
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('تعذرت العملية. حاول الطباعة بدلاً من ذلك.');
    }
  };

  // Process Sales Report Data
  const filteredSalesInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (inv.type !== 'sale') return false;
      if (selectedCustomerId !== 'all' && inv.partyId !== selectedCustomerId) return false;
      if (paymentStatus !== 'all' && inv.status !== paymentStatus) return false;
      if (transactionType !== 'all' && inv.invoiceType !== transactionType) return false;
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
      if (inv.invoiceType === 'SERVICE') {
        acc.servicesTotal += inv.total;
      } else {
        acc.productsTotal += inv.total;
      }
      return acc;
    }, { total: 0, paid: 0, remaining: 0, productsTotal: 0, servicesTotal: 0 });
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
          <button onClick={() => shareReportPDF("share")} className="btn-primary">
            <Share2 className="w-5 h-5" />
            <span>مشاركة PDF</span>
          </button>
          <button onClick={() => shareReportPDF('download')} className="btn-primary bg-blue-600 hover:bg-blue-700">
            <Download className="w-5 h-5" />
            <span>تنزيل PDF</span>
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
        <button 
          onClick={() => setReportType('statement')}
          className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${reportType === 'statement' ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-slate-600 hover:bg-slate-50'}`}
        >
          كشف حساب عميل
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
                <label className="label text-xs">نوع العملية</label>
                <select 
                  className="input-field py-2" 
                  value={transactionType}
                  onChange={e => setTransactionType(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="PRODUCT">بضاعة</option>
                  <option value="SERVICE">خدمة تطريز</option>
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
                <CustomDatePicker value={startDate} onChange={setStartDate} className="input-field py-2 flex justify-between items-center" />
              </div>
              <div>
                <label className="label text-xs">إلى تاريخ</label>
                <CustomDatePicker value={endDate} onChange={setEndDate} className="input-field py-2 flex justify-between items-center" />
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
          <div className="w-48 ml-4 shrink-0 flex justify-end">
            <img src="/logo.svg" className="max-h-24 object-contain" alt="شعار الاحمدي هاشم" />
          </div>
        </div>

        <div className={`mb-8 flex justify-between items-end print:mt-4 ${reportType === 'statement' ? 'print:hidden' : ''}`}>
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
<th className="px-3 py-3 font-bold text-center">نوع العملية</th>
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
                        <td data-label="نوع العملية" className="px-3 py-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full font-bold ${inv.invoiceType === 'PRODUCT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {inv.invoiceType === 'PRODUCT' ? 'بضاعة' : 'خدمة تطريز'}
                          </span>
                        </td>
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col print:border-slate-300">
                  <span className="text-slate-500 text-sm font-bold mb-1">إجمالي المبيعات (بضاعة)</span>
                  <span className="text-2xl font-black text-slate-900" dir="ltr">{formatCurrency(salesTotals.productsTotal)}</span>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col print:border-purple-300">
                  <span className="text-purple-700 text-sm font-bold mb-1">إجمالي خدمات التطريز</span>
                  <span className="text-2xl font-black text-purple-900" dir="ltr">{formatCurrency(salesTotals.servicesTotal)}</span>
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

        
        {reportType === 'statement' && (
          <div className="space-y-6">
            <div className="no-print mb-6">
              <StatementFilters 
                customers={customers.map(c => ({...c, type: 'CUSTOMER'}))}
                suppliers={suppliers.map(s => ({...s, type: 'SUPPLIER'}))}
                initialPartyId={statementCustomerId || undefined}
                initialFrom={statementStartDate ? new Date(statementStartDate) : new Date()}
                initialTo={statementEndDate ? new Date(statementEndDate) : new Date()}
                onContinue={({ from, to, party }) => {
                  // Keep timezone offset into account to avoid off-by-one day issues
                  const fromDate = new Date(from.getTime() - (from.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                  const toDate = new Date(to.getTime() - (to.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                  setStatementStartDate(fromDate);
                  setStatementEndDate(toDate);
                  setStatementCustomerId(party?.id || '');
                }}
              />
            </div>
            
            {statementData ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
                <CustomerStatementPreview statement={statementData} company={companyData} />
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 font-bold">الرجاء اختيار العميل لعرض كشف الحساب</p>
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
        <div className={`mt-16 pt-8 border-t-2 border-brand-500 justify-between items-center text-slate-500 font-bold hidden ${reportType === 'statement' ? '' : 'print:flex'}`}>
          <p>توقيع الإدارة: ________________</p>          <p>النظام مقدم من: معامل هاشم الأحمدي للتطريز الإلكتروني</p>
        </div>
      </div>
    </div>
  );
}
