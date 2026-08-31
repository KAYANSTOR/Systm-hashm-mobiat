import React, { useState } from 'react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, CheckCircle2, Search, ArrowDownRight, ArrowUpRight, Clock, X, Trash2, Printer } from 'lucide-react';
import { Voucher } from '../types';
import VoucherPrintTemplate from '../components/VoucherPrintTemplate';

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">السندات والمالية</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة سندات القبض والدفع والآجل.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal('receipt')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-sm">
            <ArrowDownRight className="w-5 h-5" />
            <span>سند قبض</span>
          </button>
          <button onClick={() => openModal('payment')} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors shadow-sm">
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
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث برقم السند أو الوصف..." 
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
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
        <VoucherPrintTemplate 
          voucher={printingVoucher.voucher} 
          partyName={printingVoucher.partyName} 
          onClose={() => setPrintingVoucher(null)} 
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center sm:p-4">
          <div className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-md overflow-hidden shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-lg text-slate-800">
                إضافة سند {type === 'receipt' ? 'قبض' : 'صرف'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">رقم السند</label>
                  <input required type="text" value={voucherNumber} onChange={e => setVoucherNumber(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">التاريخ</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">جهة {type === 'receipt' ? 'القبض (استلام من)' : 'الصرف (دفع إلى)'}</label>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-1">المبلغ (ريال يمني)</label>
                  <input required type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">طريقة الدفع</label>
                  <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20">
                    <option value="cash">نقدي</option>
                    <option value="bank">تحويل بنكي</option>
                    <option value="check">شيك</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">البيان / التفاصيل</label>
                <textarea rows={3} required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20"></textarea>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-[#208480] hover:bg-[#1a6b68] text-white font-medium rounded-xl">حفظ السند</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
