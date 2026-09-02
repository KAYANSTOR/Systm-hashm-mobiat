const fs = require('fs');
const content = `import React, { useMemo, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Wallet, ArrowDownRight, ArrowUpRight, Filter, Search, Calendar, CreditCard, Banknote, Landmark } from 'lucide-react';

export default function CashBox() {
  const { transactions } = useStore();
  const [filterType, setFilterType] = useState('all'); // all, cash, jeeb, remittance, e_wallet
  const [dateFilter, setDateFilter] = useState('all'); // all, today, this_month
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Filter out purely deferred transactions (0 cash movement)
    filtered = filtered.filter(t => (t.cashIn > 0 || t.cashOut > 0));

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => (t.paymentMethod || 'cash') === filterType);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      if (dateFilter === 'today') {
        filtered = filtered.filter(t => new Date(t.date).toDateString() === today.toDateString());
      } else if (dateFilter === 'this_month') {
        filtered = filtered.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
        });
      }
    }

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        (t.description || '').toLowerCase().includes(lower) ||
        (t.documentNumber || '').toLowerCase().includes(lower) ||
        (t.paymentMethod === 'cash' ? 'نقدي' : t.paymentMethod === 'remittance' ? 'حوالة' : t.paymentMethod === 'jeeb' ? 'جيب' : 'محفظة').includes(lower)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, dateFilter, searchTerm]);

  // Calculations based on filtered items
  const cashInTotal = useMemo(() => filteredTransactions.reduce((sum, t) => sum + (t.cashIn || 0), 0), [filteredTransactions]);
  const cashOutTotal = useMemo(() => filteredTransactions.reduce((sum, t) => sum + (t.cashOut || 0), 0), [filteredTransactions]);
  const balance = cashInTotal - cashOutTotal;

  // Real overall balance calculation per method (no date/search filters)
  const getOverallBalance = (method: string) => {
    const ts = transactions.filter(t => (t.paymentMethod || 'cash') === method && (t.cashIn > 0 || t.cashOut > 0));
    const ins = ts.reduce((sum, t) => sum + (t.cashIn || 0), 0);
    const outs = ts.reduce((sum, t) => sum + (t.cashOut || 0), 0);
    return ins - outs;
  };

  const cashBalance = getOverallBalance('cash');
  const jeebBalance = getOverallBalance('jeeb');
  const remittanceBalance = getOverallBalance('remittance');
  const walletBalance = getOverallBalance('e_wallet');

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="page-title">إدارة الصندوق والمحافظ</h2>
        <p className="page-subtitle">استعراض حركة الأموال النقدية والتحويلات والمحافظ الإلكترونية</p>
      </div>

      {/* Main Balances */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">الصندوق (نقدي)</p>
            <p className="text-xl font-black text-slate-800" dir="ltr">{formatCurrency(cashBalance)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">التحويلات (حوالة)</p>
            <p className="text-xl font-black text-slate-800" dir="ltr">{formatCurrency(remittanceBalance)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">محفظة جيب</p>
            <p className="text-xl font-black text-slate-800" dir="ltr">{formatCurrency(jeebBalance)}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">محافظ أخرى</p>
            <p className="text-xl font-black text-slate-800" dir="ltr">{formatCurrency(walletBalance)}</p>
          </div>
        </div>
      </div>

      {/* Movement Table */}
      <div className="bg-white rounded-3xl border border-slate-100/60 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-bold shrink-0"
            >
              <option value="all">جميع الطرق</option>
              <option value="cash">نقدي</option>
              <option value="remittance">حوالة</option>
              <option value="jeeb">جيب</option>
              <option value="e_wallet">محفظة أخرى</option>
            </select>
            
            <select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-bold shrink-0"
            >
              <option value="all">كل الأوقات</option>
              <option value="today">اليوم</option>
              <option value="this_month">هذا الشهر</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="بحث في الحركات..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Filtered Totals Header */}
        <div className="grid grid-cols-3 divide-x divide-x-reverse border-b border-slate-100 bg-slate-50/30">
          <div className="p-4 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">مجموع المقبوضات (للفلتر)</p>
            <p className="text-lg font-black text-emerald-600" dir="ltr">{formatCurrency(cashInTotal)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">مجموع المدفوعات (للفلتر)</p>
            <p className="text-lg font-black text-rose-600" dir="ltr">{formatCurrency(cashOutTotal)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-xs font-bold text-slate-500 mb-1">صافي الحركة (للفلتر)</p>
            <p className="text-lg font-black text-slate-800" dir="ltr">{formatCurrency(balance)}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="table-standard relative">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr>
                <th className="px-4 py-3">التاريخ</th>
                <th className="px-4 py-3">المستند</th>
                <th className="px-4 py-3">البيان</th>
                <th className="px-4 py-3 text-center">مقبوض (دخل)</th>
                <th className="px-4 py-3 text-center">مدفوع (خرج)</th>
                <th className="px-4 py-3">طريقة الدفع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(t.date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-slate-700 text-xs">{t.documentNumber}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {t.documentType === 'invoice' ? 'فاتورة' : t.documentType === 'voucher' ? 'سند' : 'مصروف'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800 text-sm max-w-xs truncate" title={t.description}>{t.description}</td>
                  <td className="px-4 py-3 text-center">
                    {t.cashIn > 0 ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg" dir="ltr">
                        {formatCurrency(t.cashIn)} <ArrowDownRight className="w-3 h-3" />
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {t.cashOut > 0 ? (
                      <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg" dir="ltr">
                        {formatCurrency(t.cashOut)} <ArrowUpRight className="w-3 h-3" />
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {(!t.paymentMethod || t.paymentMethod === 'cash') && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">نقدي</span>}
                      {t.paymentMethod === 'remittance' && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">حوالة</span>}
                      {t.paymentMethod === 'jeeb' && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">جيب</span>}
                      {t.paymentMethod === 'e_wallet' && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">محفظة</span>}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-medium">
                    <Wallet className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    لا يوجد حركات مالية مطابقة للبحث أو التصفية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/pages/CashBox.tsx', content);
