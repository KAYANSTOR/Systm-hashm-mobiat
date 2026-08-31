import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import {
  TrendingUp,
  Package,
  Users,
  CheckCircle2,
  ChevronLeft,
  Calculator,
  PlusCircle,
  UserPlus,
  PackagePlus,
  Receipt
} from 'lucide-react';

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const { customers, inventory, invoices } = useStore();
  
  const totalReceivables = customers.reduce((sum, c) => sum + c.balance, 0);
  
  // Calculate today's and month's sales
  const today = new Date();
  const todaySalesInvoices = invoices.filter(i => {
    if (i.type !== 'sale') return false;
    const invDate = new Date(i.date);
    return invDate.toDateString() === today.toDateString();
  });
  const todaySales = todaySalesInvoices.reduce((sum, i) => sum + i.total, 0);

  const monthSalesInvoices = invoices.filter(i => {
    if (i.type !== 'sale') return false;
    const invDate = new Date(i.date);
    return invDate.getMonth() === today.getMonth() && invDate.getFullYear() === today.getFullYear();
  });
  const monthSales = monthSalesInvoices.reduce((sum, i) => sum + i.total, 0);

  // Date formatting for the top header
  const dateString = today.toLocaleDateString('ar-YE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-4 pb-8">
      
      {/* Greeting & Date */}
      <div className="text-center mb-6 mt-2">
        <h2 className="text-slate-500 font-bold text-sm">صباح الخير — {dateString}</h2>
        <p className="text-slate-400 text-xs mt-1">الاشتراك حتى ٢٤ أكتوبر ٢٠٢٦</p>
      </div>

      {/* Status Banner */}
      <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="bg-white text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> نشطة
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <h4 className="font-bold text-teal-800 text-sm">النظام يعمل بشكل سليم</h4>
            <p className="text-xs text-teal-600 mt-0.5">معالجة مبالغ الفئات المعرفة فقط</p>
          </div>
          <div className="bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <div 
        onClick={() => setActiveTab('parties')}
        className="bg-gradient-to-l from-[#bc5f8f] to-[#208480] rounded-[24px] p-6 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden mb-2 cursor-pointer hover:opacity-95 transition-opacity active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 mb-2 justify-end opacity-90">
          <span className="text-sm font-bold">إجمالي ديون العملاء (المعلق)</span>
          <div className="w-2.5 h-2.5 rounded-full bg-pink-300 opacity-80"></div>
        </div>
        
        <div className="text-right mb-8">
          <div className="flex items-end justify-end gap-2">
            <span className="text-3xl font-bold mb-1">ر.ي</span>
            <span className="text-5xl font-black tracking-tight">{totalReceivables}</span>
          </div>
        </div>
        
        <div className="h-px w-full bg-white/10 mb-4 rounded-full"></div>
        
        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10">
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveTab('parties'); }}
            className="text-center px-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors py-1"
          >
            <Users className="w-5 h-5 mx-auto mb-2 opacity-70" />
            <div className="text-xl font-bold">{customers.length}</div>
            <div className="text-xs opacity-70 mt-1 font-bold">العملاء</div>
          </div>
          <div 
            onClick={(e) => { e.stopPropagation(); setActiveTab('inventory'); }}
            className="text-center px-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors py-1"
          >
            <Package className="w-5 h-5 mx-auto mb-2 opacity-70" />
            <div className="text-xl font-bold">{inventory.length}</div>
            <div className="text-xs opacity-70 mt-1 font-bold">الأصناف المتوفرة</div>
          </div>
        </div>
      </div>

      {/* Secondary Cards Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Month's Sales */}
        <div 
          onClick={() => setActiveTab('reports')}
          className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 flex flex-col items-end cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
        >
          <div className="flex items-center justify-between w-full mb-4 text-slate-500">
            <ChevronLeft className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">مبيعات الشهر</span>
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 mb-2 flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-500">ر.ي</span>
            {formatCurrency(monthSales).replace('ر.ي', '').trim() || '0'}
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-xl text-xs font-bold">
            {monthSalesInvoices.length} فاتورة
          </div>
        </div>

        {/* Today's Sales */}
        <div 
          onClick={() => setActiveTab('sales')}
          className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 flex flex-col items-end cursor-pointer hover:bg-slate-50 transition-colors active:scale-95"
        >
          <div className="flex items-center justify-between w-full mb-4 text-slate-500">
            <ChevronLeft className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-700">مبيعات اليوم</span>
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="text-2xl font-black text-slate-800 mb-2 flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-500">ر.ي</span>
            {formatCurrency(todaySales).replace('ر.ي', '').trim() || '0'}
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-xl text-xs font-bold">
            {todaySalesInvoices.length} فاتورة
          </div>
        </div>
      </div>

      {/* Action Grid (2x2) */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <ActionCard onClick={() => setActiveTab('sales')} icon={<Calculator className="w-6 h-6 text-teal-600" />} title="فاتورة مبيعات" />
        <ActionCard onClick={() => setActiveTab('vouchers')} icon={<PlusCircle className="w-6 h-6 text-teal-600" />} title="سند قبض" />
        <ActionCard onClick={() => setActiveTab('parties')} icon={<UserPlus className="w-6 h-6 text-teal-600" />} title="إضافة عميل" />
        <ActionCard onClick={() => setActiveTab('inventory')} icon={<PackagePlus className="w-6 h-6 text-teal-600" />} title="إضافة صنف" />
      </div>

      {/* Recent Transactions Preview */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={() => setActiveTab('reports')} className="text-teal-600 text-sm font-bold hover:text-teal-700 transition-colors">جميع المعاملات</button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-lg">آخر العمليات</span>
            <div className="w-2 h-2 rounded-full bg-teal-700"></div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-8 border border-slate-100/60 shadow-sm text-center">
          {invoices.length > 0 ? (
            <div className="overflow-x-auto -mx-8 px-8">
              <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
                <tbody className="divide-y divide-slate-50">
                  {invoices.slice(0, 3).map((inv) => (
                    <tr key={inv.id} className="transition-colors">
                      <td className="py-4 text-slate-500 text-xs">{formatDate(inv.date)}</td>
                      <td className="py-4 font-bold text-slate-800 text-left">{formatCurrency(inv.total)}</td>
                      <td className="py-4 text-right">
                        <div className="font-bold text-sm text-slate-800">
                          {inv.type === 'sale' ? 'فاتورة مبيعات' : 'فاتورة مشتريات'}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{inv.invoiceNumber}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 flex flex-col items-center">
              <Receipt className="w-12 h-12 text-slate-700 mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold text-slate-800 mb-2">لا توجد عمليات حديثة</h3>
              <p className="text-sm text-slate-500 max-w-[200px] leading-relaxed">ستظهر العمليات هنا عند استلام التحويلات وصرف الفواتير</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="bg-white rounded-[20px] p-6 shadow-sm border border-slate-100/60 flex flex-col items-center justify-center gap-4 hover:bg-slate-50 transition-colors active:scale-95">
      <div className="w-14 h-14 bg-teal-50/50 rounded-full flex items-center justify-center border border-teal-100/50">
        {icon}
      </div>
      <span className="font-bold text-slate-800 text-sm">{title}</span>
    </button>
  );
}
