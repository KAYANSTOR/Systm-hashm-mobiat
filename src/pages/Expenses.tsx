import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { CreditCard, Plus, Trash2, Search, Filter, AlertCircle, X, Banknote, Landmark, Wallet } from 'lucide-react';

export default function Expenses() {
  const { expenses, transactions, addExpense, deleteExpense } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState<'work' | 'personal'>('work');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Filters
  const [activeTab, setActiveTab] = useState<'work' | 'personal'>('work');
  const [dateFilter, setDateFilter] = useState('all'); // all, today, this_month
  const [searchTerm, setSearchTerm] = useState('');
  
  // Error state for insufficient funds
  const [errorMsg, setErrorMsg] = useState('');

  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter(e => e.type === activeTab);
    
    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      if (dateFilter === 'today') {
        filtered = filtered.filter(e => new Date(e.date).toDateString() === today.toDateString());
      } else if (dateFilter === 'this_month') {
        filtered = filtered.filter(e => {
          const eDate = new Date(e.date);
          return eDate.getMonth() === today.getMonth() && eDate.getFullYear() === today.getFullYear();
        });
      }
    }
    
    // Search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        (e.description || '').toLowerCase().includes(lower) ||
        (e.category || '').toLowerCase().includes(lower)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, activeTab, dateFilter, searchTerm]);
  
  const totalExpensesAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // Balance calculation
  const getOverallBalance = (method: string) => {
    const ts = transactions.filter(t => (t.paymentMethod || 'cash') === method && (t.cashIn > 0 || t.cashOut > 0));
    const ins = ts.reduce((sum, t) => sum + (t.cashIn || 0), 0);
    const outs = ts.reduce((sum, t) => sum + (t.cashOut || 0), 0);
    return ins - outs;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!amount || !category) return;
    
    const parsedAmount = parseFloat(amount);
    
    // Balance Check
    const currentBalance = getOverallBalance(paymentMethod);
    if (parsedAmount > currentBalance) {
      setErrorMsg(`رصيد الصندوق/المحفظة غير كافٍ. الرصيد الحالي: ${formatCurrency(currentBalance)}`);
      return;
    }

    await addExpense({
      date,
      type,
      amount: parsedAmount,
      category,
      description,
      paymentMethod
    });
    
    setIsModalOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="page-title">إدارة المصروفات</h2>
          <p className="page-subtitle">تسجيل ومتابعة مصروفات العمل والمصروفات الشخصية المخصومة من الأرصدة</p>
        </div>
        <button onClick={() => { setType(activeTab); setIsModalOpen(true); setErrorMsg(''); }} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">إضافة مصروف {activeTab === 'work' ? 'عمل' : 'شخصي'}</span>
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('work')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'work' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          مصروفات العمل
        </button>
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'personal' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          المصروفات الشخصية
        </button>
      </div>

      {/* Advanced UI Container */}
      <div className="bg-white rounded-3xl border border-slate-100/60 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
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
              placeholder="بحث بالتصنيف أو البيان..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Totals Header */}
        <div className="border-b border-slate-100 bg-slate-50/30 p-4 text-center">
          <p className="text-sm font-bold text-slate-500 mb-1">إجمالي {activeTab === 'work' ? 'مصروفات العمل' : 'المصروفات الشخصية'} (للفلتر)</p>
          <p className="text-2xl font-black text-rose-600" dir="ltr">{formatCurrency(totalExpensesAmount)}</p>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="table-standard relative">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr>
                <th className="px-4 py-3">التاريخ</th>
                <th className="px-4 py-3">التصنيف</th>
                <th className="px-4 py-3">البيان</th>
                <th className="px-4 py-3 text-center">المبلغ</th>
                <th className="px-4 py-3">تم الخصم من</th>
                <th className="px-4 py-3 text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600">{formatDate(exp.date)}</td>
                  <td className="px-4 py-3 font-bold text-slate-700">{exp.category}</td>
                  <td className="px-4 py-3 font-medium text-slate-800 text-sm">{exp.description || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg" dir="ltr">
                      {formatCurrency(exp.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {(!exp.paymentMethod || exp.paymentMethod === 'cash') && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">الصندوق النقدي</span>}
                      {exp.paymentMethod === 'remittance' && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">التحويلات</span>}
                      {exp.paymentMethod === 'jeeb' && <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">جيب</span>}
                      {exp.paymentMethod === 'e_wallet' && <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold">محفظة</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => deleteExpense(exp.id)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400 font-medium">
                    <CreditCard className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                    لا يوجد مصروفات مطابقة للبحث أو التصفية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">
                تسجيل مصروف {type === 'work' ? 'عمل' : 'شخصي'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {errorMsg && (
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl flex items-start gap-2 text-sm font-bold border border-rose-100">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}
            
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">التصنيف</label>
                <input required type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="مثال: كهرباء، إيجار، رواتب..." className="input-field" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">البيان والتفاصيل (اختياري)</label>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="input-field" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">المبلغ</label>
                  <input required type="number" step="0.01" min="0.01" value={amount} onChange={e => {setAmount(e.target.value); setErrorMsg('');}} className="input-field font-bold text-lg" dir="ltr" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">التاريخ</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
                  <span>طريقة الدفع (الخصم من)</span>
                  <span className="text-xs text-brand-600">الرصيد: <span dir="ltr">{formatCurrency(getOverallBalance(paymentMethod))}</span></span>
                </label>
                <select value={paymentMethod} onChange={e => {setPaymentMethod(e.target.value); setErrorMsg('');}} className="input-field font-bold">
                  <option value="cash">الصندوق النقدي</option>
                  <option value="remittance">التحويلات (حوالة)</option>
                  <option value="jeeb">محفظة جيب</option>
                  <option value="e_wallet">محفظة إلكترونية أخرى</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 btn-outline">إلغاء</button>
                <button type="submit" className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95">
                  تأكيد وخصم المصروف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
