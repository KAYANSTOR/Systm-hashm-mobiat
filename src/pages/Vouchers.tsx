import React, { useState } from 'react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, CheckCircle2, Search, ArrowDownRight, ArrowUpRight, Clock, X, Trash2, Printer } from 'lucide-react';
import { Voucher } from '../types';
import ReceiptPrint, { ReceiptData } from '../components/ReceiptPrint';

export default function Vouchers() {
  const { vouchers, customers, suppliers, addVoucher, deleteVoucher } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'receipt' | 'payment' | 'deferred'>('all');

  const filteredVouchers = vouchers.filter(v => activeFilter === 'all' || v.type === activeFilter)
    .filter(v => v.voucherNumber.includes(searchTerm) || v.description.includes(searchTerm));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [printingVoucher, setPrintingVoucher] = useState<{voucher: Voucher, partyName: string} | null>(null);
  
  // Form State
  const [voucherNumber, setVoucherNumber] = useState('');
  const [type, setType] = useState<'receipt' | 'payment' | 'deferred'>('receipt');
  const [partyType, setPartyType] = useState<'customer' | 'supplier' | 'other'>('customer');
  const [partyId, setPartyId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'check'>('cash');
  const [description, setDescription] = useState('');

  const openModal = (vType: 'receipt' | 'payment') => {
    const nextId = vouchers.length > 0 
      ? Math.max(...vouchers.map(v => parseInt(v.voucherNumber.replace(/\D/g, '')) || 0)) + 1 
      : 1;
    setVoucherNumber(String(nextId).padStart(3, '0'));
    setType(vType);
    setPartyType(vType === 'receipt' ? 'customer' : 'supplier');
    setPartyId('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('cash');
    setDescription('');
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
      createdBy: auth.currentUser?.uid || 'user', // Handled by backend/auth usually
      referenceNumber: ''
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
        </div>
      </div>

      <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex shadow-sm gap-1 overflow-x-auto max-w-full">
        <button onClick={() => setActiveFilter('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${activeFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>الكل</button>
        <button onClick={() => setActiveFilter('receipt')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeFilter === 'receipt' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'}`}><ArrowDownRight className="w-4 h-4" /> قبض</button>
        <button onClick={() => setActiveFilter('payment')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeFilter === 'payment' ? 'bg-rose-100 text-rose-800' : 'text-slate-600 hover:bg-slate-50'}`}><ArrowUpRight className="w-4 h-4" /> صرف</button>
        <button onClick={() => setActiveFilter('deferred')} className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${activeFilter === 'deferred' ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-slate-50'}`}><Clock className="w-4 h-4" /> آجل</button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="card-header">
           <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث برقم السند أو الوصف..." 
              className="input-field pl-4 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
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
                let partyName = '-';
                if (v.partyType === 'customer') partyName = customers.find(c => c.id === v.partyId)?.name || '-';
                if (v.partyType === 'supplier') partyName = suppliers.find(s => s.id === v.partyId)?.name || '-';

                return (
                  <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 py-3 font-mono font-bold text-slate-700">{v.voucherNumber}</td>
                    <td className="px-2 py-3 text-slate-600">{formatDate(v.date)}</td>
                    <td className="px-2 py-3">
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
                    <td className="px-2 py-3">
                      <div className="font-bold text-slate-800">{partyName}</div>
                      <div className="text-xs text-slate-500">
                        {v.partyType === 'customer' ? 'عميل' : v.partyType === 'supplier' ? 'مورد' : 'أخرى'}
                      </div>
                    </td>
                    <td className="px-2 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(v.amount)}</td>
                    <td className="px-2 py-3 text-slate-600">
                      {v.paymentMethod === 'cash' ? 'نقدي' : v.paymentMethod === 'bank' ? 'حوالة بنكية' : 'شيك'}
                    </td>
                    <td className="px-2 py-3 text-slate-500 max-w-[200px] truncate" title={v.description}>
                      <div className="flex justify-between items-center">
                        <span className="truncate">{v.description}</span>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setPrintingVoucher({voucher: v, partyName})} className="text-teal-600 hover:text-teal-800 p-1 transition-colors">
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
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
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
            transferNumber: printingVoucher.voucher.paymentMethod === 'bank' ? 'حوالة بنكية' : printingVoucher.voucher.paymentMethod === 'check' ? 'شيك' : 'نقداً',
            network: printingVoucher.voucher.paymentMethod !== 'cash' ? 'تحويل' : 'صندوق المعمل',
            transferDate: formatDate(printingVoucher.voucher.date),
            paymentFor: printingVoucher.voucher.description,
            remaining: "",
            receiver: "",
            cashier: "",
            type: printingVoucher.voucher.type
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
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
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
                    <option value="bank">تحويل بنكي</option>
                    <option value="check">شيك</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">البيان / التفاصيل</label>
                <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="input-field"></textarea>
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
