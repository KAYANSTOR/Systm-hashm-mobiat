import { CustomDatePicker, CustomPartyPicker } from '../components/StatementFilters';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, CheckCircle2, Search, ArrowDownRight, ArrowUpRight, Clock, X, Trash2, Printer, Eye } from 'lucide-react';
import { Voucher } from '../types';
import ReceiptPrint, { ReceiptData } from '../components/ReceiptPrint';
import VoucherPrintTemplate from '../components/VoucherPrintTemplate';
import SignaturePad from '../components/SignaturePad';

export default function Vouchers() {
  const { vouchers, customers, suppliers, addVoucher, deleteVoucher } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'receipt' | 'payment' | 'deferred' | 'journal'>('all');

  
  const getPartyName = (v: Voucher) => {
    if (v.partyType === 'customer') return customers.find(c => c.id === v.partyId)?.name || '-';
    if (v.partyType === 'supplier') return suppliers.find(s => s.id === v.partyId)?.name || '-';
    return '-';
  };

  const filteredVouchers = vouchers.filter(v => activeFilter === 'all' || v.type === activeFilter)
    .filter(v => {
      const matchSearch = v.voucherNumber.includes(searchTerm) || 
                          v.description.includes(searchTerm) ||
                          getPartyName(v).includes(searchTerm) ||
                          v.amount.toString().includes(searchTerm) ||
                          v.date.includes(searchTerm);
      
      const matchStart = startDate ? v.date >= startDate : true;
      const matchEnd = endDate ? v.date <= endDate : true;
      
      return matchSearch && matchStart && matchEnd;
    });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printingA5Voucher, setPrintingA5Voucher] = useState<{voucher: Voucher, partyName: string} | null>(null);
  const [printingVoucher, setPrintingVoucher] = useState<{voucher: Voucher, partyName: string} | null>(null);
  
  // Form State
  const [voucherNumber, setVoucherNumber] = useState('');
  const [type, setType] = useState<'receipt' | 'payment' | 'deferred' | 'journal'>('receipt');
  const [partyType, setPartyType] = useState<'customer' | 'supplier' | 'other'>('customer');
  const [partyId, setPartyId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'remittance' | 'jeeb' | 'e_wallet'>('cash');
  const [description, setDescription] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  const openModal = (vType: 'receipt' | 'payment' | 'journal') => {
    const typeVouchers = vouchers.filter(v => v.type === vType);
    const nextId = typeVouchers.length > 0 
      ? Math.max(...typeVouchers.map(v => ( (() => { const n = parseInt(v.voucherNumber.replace(/\D/g, '')); return n < 1000000000 ? (n || 0) : 0; })() ))) + 1 
      : 1;
    const prefix = vType === 'receipt' ? 'REC' : (vType === 'payment' ? 'PAY' : 'JOU');
    setVoucherNumber(`${prefix}-${String(nextId).padStart(4, '0')}`);
    setType(vType);
    setPartyType(vType === 'receipt' ? 'customer' : vType === 'payment' ? 'supplier' : 'other');
    setPartyId('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
    setDescription('');
    setSignature(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addVoucher({
      voucherNumber,
      type,
      partyType,
      partyId,
      amount: parseFloat(amount) || 0,
      date,
      paymentMethod,
      description,
      createdBy: auth.currentUser?.uid || 'user',
      referenceNumber: '',
      signature
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header no-print">
        <div>
          <h2 className="page-title">السندات والمالية</h2>
          <p className="page-subtitle">إدارة سندات القبض والدفع والآجل.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal('receipt')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
            <ArrowDownRight className="w-5 h-5" />
            <span>سند قبض</span>
          </button>
          <button onClick={() => openModal('payment')} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
            <ArrowUpRight className="w-5 h-5" />
            <span>سند صرف</span>
          </button>
          <button onClick={() => openModal('journal')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold transition-colors shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>سند قيد</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center shadow-sm gap-4 max-w-full">
        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-700">تصفية حسب النوع:</label>
          <select 
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as any)}
            className="input-field !py-2 !w-auto"
          >
            <option value="all">عرض الكل</option>
            <option value="receipt">سند قبض</option>
            <option value="payment">سند صرف</option>
            <option value="deferred">آجل</option>
            <option value="journal">سند قيد</option>
          </select>
        </div>
      </div>

      <div className="sm:bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-sm sm:overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث بالرقم، الوصف، الاسم، التاريخ، المبلغ..." 
              className="input-field pl-4 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-bold text-slate-600 shrink-0">من:</label>
            <CustomDatePicker value={startDate} onChange={setStartDate} className="input-field flex justify-between items-center min-w-[150px]" />
            <label className="text-sm font-bold text-slate-600 shrink-0">إلى:</label>
            <CustomDatePicker value={endDate} onChange={setEndDate} className="input-field flex justify-between items-center min-w-[150px]" />
          </div>
        </div>
        <div className="table-container">
<table className="table-standard">
            <thead>
              <tr>
                <th className="px-2 py-3">رقم السند</th>
                <th className="px-2 py-3">التاريخ</th>
                <th className="px-2 py-3">النوع</th>
                <th className="px-2 py-3">الطرف</th>
                <th className="px-2 py-3">المبلغ</th>
                <th className="px-2 py-3">طريقة الدفع</th>
                <th className="px-2 py-3">البيان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVouchers.map((v) => {
                const partyName = getPartyName(v);

                return (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td data-label="رقم السند" className="px-2 py-3 font-mono font-bold text-slate-700">{v.voucherNumber}</td>
                    <td data-label="التاريخ" className="px-2 py-3 text-slate-600">{formatDate(v.date)}</td>
                    <td data-label="النوع" className="px-2 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        v.type === 'receipt' ? 'bg-emerald-100 text-emerald-800' :
                        v.type === 'payment' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {v.type === 'receipt' && <ArrowDownRight className="w-3 h-3" />}
                        {v.type === 'payment' && <ArrowUpRight className="w-3 h-3" />}
                        {v.type === 'deferred' && <Clock className="w-3 h-3" />}
                        {v.type === 'receipt' ? 'سند قبض' : v.type === 'payment' ? 'سند صرف' : 'آجل'}
                      </span>
                    </td>
                    <td data-label="الطرف" className="px-2 py-3">
                      <div className="font-bold text-slate-800">{partyName}</div>
                      <div className="text-xs text-slate-500">
                        {v.partyType === 'customer' ? 'عميل' : v.partyType === 'supplier' ? 'مورد' : 'أخرى'}
                      </div>
                    </td>
                    <td data-label="المبلغ" className="px-2 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(v.amount)}</td>
                    <td data-label="طريقة الدفع" className="px-2 py-3 text-slate-600">
                      {v.paymentMethod === 'cash' ? 'نقدي' : v.paymentMethod === 'remittance' ? 'حوالة' : v.paymentMethod === 'jeeb' ? 'جيب' : 'محفظة أخرى'}
                    </td>
                    <td data-label="البيان" className="px-2 py-3 text-slate-500 max-w-[200px] truncate" title={v.description}>
                      <div className="flex justify-between items-center">
                        <span className="truncate">{v.description}</span>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setPrintingA5Voucher({voucher: v, partyName})} className="text-indigo-600 hover:text-indigo-800 p-1 transition-colors" title="معاينة طباعة A5">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => setPrintingVoucher({voucher: v, partyName})} className="text-teal-600 hover:text-teal-800 p-1 transition-colors" title="طباعة حرارية">
                            <Printer className="w-4 h-4" />
                          </button>
                          <button onClick={async () => {
                              if(confirm('هل أنت متأكد من حذف هذا السند؟')) await deleteVoucher(v.id);
                            }} className="text-red-400 hover:text-red-600 p-1 transition-colors mr-2">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredVouchers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 sm:!justify-center !justify-center">
                    لا توجد سندات مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {printingVoucher && (
        <ReceiptPrint 
          data={{
            receiptNumber: printingVoucher.voucher.voucherNumber,
            date: formatDate(printingVoucher.voucher.date),
            receivedFrom: printingVoucher.partyName,
            amount: formatCurrency(printingVoucher.voucher.amount),
            amountInWords: "",
            transferNumber: printingVoucher.voucher.paymentMethod === 'cash' ? 'نقداً' : printingVoucher.voucher.paymentMethod === 'remittance' ? 'حوالة' : printingVoucher.voucher.paymentMethod === 'jeeb' ? 'جيب' : 'محفظة إلكترونية',
            network: printingVoucher.voucher.paymentMethod !== 'cash' ? 'حوالة / محفظة' : 'صندوق المعمل',
            transferDate: formatDate(printingVoucher.voucher.date),
            paymentFor: printingVoucher.voucher.description,
            remaining: "",
            receiver: "",
            cashier: "",
            type: printingVoucher.voucher.type === "journal" ? "payment" : printingVoucher.voucher.type,
            signature: printingVoucher.voucher.signature
          }}
          onClose={() => setPrintingVoucher(null)} 
        />
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="font-bold text-lg text-slate-800">
                إضافة سند {type === 'receipt' ? 'قبض' : 'صرف'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">رقم السند</label>
                  <input required type="text" value={voucherNumber} onChange={e => setVoucherNumber(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="label">التاريخ</label>
                  <CustomDatePicker value={date} onChange={setDate} className="input-field flex justify-between items-center" />
                </div>
              </div>

              <div>
                <label className="label">جهة {type === 'receipt' ? 'القبض (استلام من)' : 'الصرف (دفع إلى)'}</label>
                <div className="flex gap-2 mb-2">
                   <select value={partyType} onChange={e => setPartyType(e.target.value as any)} className="w-1/3 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20">
                    <option value="customer">عميل</option>
                    <option value="supplier">مورد</option>
                    <option value="other">أخرى</option>
                  </select>
                  {partyType === 'customer' && (
                    <select required value={partyId} onChange={e => setPartyId(e.target.value)} className="w-2/3 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20">
                      <option value="">اختر العميل...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  )}
                  {partyType === 'supplier' && (
                    <select required value={partyId} onChange={e => setPartyId(e.target.value)} className="w-2/3 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20">
                      <option value="">اختر المورد...</option>
                      {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  )}
                  {partyType === 'other' && (
                    <input type="text" placeholder="اسم الجهة..." className="w-2/3 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">المبلغ (ريال يمني)</label>
                  <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="label">طريقة الدفع</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="input-field">
                    <option value="cash">نقدي</option>
                    <option value="remittance">حوالة</option>
                    <option value="jeeb">جيب</option>
                    <option value="e_wallet">محفظة إلكترونية أخرى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">البيان / التفاصيل</label>
                <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="input-field"></textarea>
              </div>

              
              <div className="col-span-1 md:col-span-2 mb-4">
                <SignaturePad onChange={setSignature} initialValue={signature} />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">إلغاء</button>
                <button type="submit" className="btn-primary">حفظ السند</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
