import { CustomDatePicker, CustomPartyPicker } from '../components/StatementFilters';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Wallet, ArrowDownRight, ArrowUpRight, Search, FileText, Download, X, Calendar } from 'lucide-react';

export default function CashBox() {
  const { transactions, addVoucher } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [directType, setDirectType] = useState<'receipt' | 'payment'>('receipt');
  const [directAmount, setDirectAmount] = useState('');
  const [directDesc, setDirectDesc] = useState('');
  const [directMethod, setDirectMethod] = useState<'cash' | 'remittance' | 'jeeb' | 'e_wallet'>('cash');

  const filteredTransactions = transactions.filter(t => {
    const matchSearch = t.description.includes(searchTerm) || t.documentNumber.includes(searchTerm);
    const matchDateFrom = !dateFrom || t.date >= dateFrom;
    const matchDateTo = !dateTo || t.date <= dateTo;
    return matchSearch && matchDateFrom && matchDateTo;
  });

  const cashInTotal = filteredTransactions.reduce((sum, t) => sum + t.cashIn, 0);
  const cashOutTotal = filteredTransactions.reduce((sum, t) => sum + t.cashOut, 0);
  const balance = cashInTotal - cashOutTotal;

  const handleDirectTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(directAmount) || 0;
    if (amount <= 0 || !directDesc) return;
    
    await addVoucher({
      voucherNumber: 'DIR-' + Math.floor(Math.random() * 10000),
      type: directType === 'receipt' ? 'receipt' : 'payment',
      partyType: 'other',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: directMethod,
      description: directDesc,
      createdBy: auth.currentUser?.uid || 'user'
    });
    
    setIsDirectModalOpen(false);
    setDirectAmount('');
    setDirectDesc('');
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="page-header no-print shrink-0">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">صندوق الماليات</h2>
          <p className="text-sm font-medium text-slate-500 mt-2">سجل حركات القبض والصرف والرصيد الفعلي.</p>
        </div>
        <button onClick={() => setIsDirectModalOpen(true)} className="btn-primary">
          <Wallet className="w-5 h-5" />
          <span>حركة صندوق مباشرة</span>
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">
          <div className="relative w-full md:w-auto flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث بالبيان أو رقم المستند..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-4 pr-10 bg-white"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <CustomDatePicker value={dateFrom} onChange={setDateFrom} className="input-field bg-white flex justify-between items-center min-w-[140px]" />
            <span className="text-slate-400 font-medium text-sm">إلى</span>
            <CustomDatePicker value={dateTo} onChange={setDateTo} className="input-field bg-white flex justify-between items-center min-w-[140px]" />
          </div>
        </div>

        {/* Filtered Totals Header */}
        <div className="grid grid-cols-3 divide-x divide-x-reverse border-b border-slate-100 bg-slate-50/80">
          <div className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm font-bold text-slate-500 mb-1">مجموع المقبوضات (للفلتر)</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600" dir="ltr">{formatCurrency(cashInTotal)}</p>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm font-bold text-slate-500 mb-1">مجموع المدفوعات (للفلتر)</p>
            <p className="text-xl sm:text-2xl font-black text-rose-600" dir="ltr">{formatCurrency(cashOutTotal)}</p>
          </div>
          <div className="p-4 sm:p-6 text-center">
            <p className="text-xs sm:text-sm font-bold text-slate-500 mb-1">صافي الحركة (للفلتر)</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800" dir="ltr">{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3 bg-[#f8fafc]">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-slate-400 font-medium border border-slate-100 shadow-sm flex flex-col items-center">
              <Wallet className="w-16 h-16 mx-auto text-slate-200 mb-4" />
              <p className="text-lg">لا يوجد حركات مالية مطابقة للبحث أو التصفية.</p>
            </div>
          ) : (
            filteredTransactions.map((t) => (
              <div key={t.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group">
                {/* Visual Indicator Line on the right */}
                <div className={`absolute top-0 right-0 w-1.5 h-full transition-colors ${t.cashIn > 0 ? 'bg-emerald-400 group-hover:bg-emerald-500' : 'bg-rose-400 group-hover:bg-rose-500'}`}></div>
                
                <div className="flex justify-between items-start pr-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm shrink-0 ${t.cashIn > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                       {t.cashIn > 0 ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1">{t.description}</h4>
                      <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                         <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {formatDate(t.date)}</span>
                         <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                         <span className="font-mono text-slate-600 bg-slate-100 px-1.5 rounded">{t.documentNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left shrink-0 pl-1">
                    <p className={`text-lg sm:text-xl font-black ${t.cashIn > 0 ? 'text-emerald-600' : 'text-rose-600'}`} dir="ltr">
                      {t.cashIn > 0 ? '+' : '-'}{formatCurrency(t.cashIn > 0 ? t.cashIn : t.cashOut).replace('ر.ي', '').trim()}
                      <span className="text-xs ml-1 font-bold">ر.ي</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50/80 pr-1">
                   <div className="flex items-center gap-2">
                     <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                       {t.documentType === 'invoice' ? 'فاتورة' : t.documentType === 'voucher' ? 'سند' : 'مصروف'}
                     </span>
                   </div>
                   <div className="flex items-center gap-2">
                     {(!t.paymentMethod || t.paymentMethod === 'cash') && <span className="bg-emerald-100/50 text-emerald-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">نقدي</span>}
                     {t.paymentMethod === 'remittance' && <span className="bg-blue-100/50 text-blue-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">حوالة</span>}
                     {t.paymentMethod === 'jeeb' && <span className="bg-purple-100/50 text-purple-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">جيب</span>}
                     {t.paymentMethod === 'e_wallet' && <span className="bg-orange-100/50 text-orange-700 px-2 py-0.5 rounded-lg text-[11px] font-bold">محفظة</span>}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Direct Transaction Modal */}
      {isDirectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">تسجيل حركة صندوق مباشرة</h3>
              <button onClick={() => setIsDirectModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDirectTransaction} className="p-5 space-y-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button type="button" onClick={() => setDirectType('receipt')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${directType === 'receipt' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>إيداع (قبض)</button>
                <button type="button" onClick={() => setDirectType('payment')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${directType === 'payment' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>سحب (صرف)</button>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">المبلغ</label>
                <input type="number" step="0.01" required value={directAmount} onChange={e => setDirectAmount(e.target.value)} className="input-field font-bold text-lg text-left" dir="ltr" placeholder="0.00" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">طريقة الدفع / المحفظة</label>
                <select value={directMethod} onChange={e => setDirectMethod(e.target.value as any)} className="input-field">
                  <option value="cash">الصندوق النقدي</option>
                  <option value="remittance">حوالة بنكية</option>
                  <option value="jeeb">محفظة جيب</option>
                  <option value="e_wallet">محفظة إلكترونية أخرى</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">البيان / التفاصيل</label>
                <input type="text" required value={directDesc} onChange={e => setDirectDesc(e.target.value)} className="input-field" placeholder="مثال: تغذية الصندوق، سحب شخصي..." />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsDirectModalOpen(false)} className="flex-1 btn-outline">إلغاء</button>
                <button type="submit" className={`flex-1 ${directType === 'receipt' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white rounded-xl font-bold transition-all shadow-lg active:scale-95`}>
                  تأكيد {directType === 'receipt' ? 'الإيداع' : 'السحب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
