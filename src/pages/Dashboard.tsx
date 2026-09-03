import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { TrendingUp, Package, Users, ArrowDownRight, ArrowUpRight, Calendar,  CheckCircle2, ChevronLeft, ShoppingBag, Receipt, UserPlus, Box, CreditCard } from 'lucide-react';

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const { customers, suppliers, inventory, invoices, transactions } = useStore();
  
  const totalReceivables = customers.reduce((sum, c) => sum + c.balance, 0);
  
  // Calculate today's and month's sales
  const today = new Date();
  const todaySalesInvoices = invoices.filter(i => {
    if (i.type !== 'sale') return false;
    const invDate = new Date(i.date);
    return invDate.toDateString() === today.toDateString();
  });
  
  const todaySales = todaySalesInvoices.filter(i => i.invoiceType !== 'SERVICE').reduce((sum, i) => sum + i.total, 0);
  const todayServices = todaySalesInvoices.filter(i => i.invoiceType === 'SERVICE').reduce((sum, i) => sum + i.total, 0);


  const monthSalesInvoices = invoices.filter(i => {
    if (i.type !== 'sale') return false;
    const invDate = new Date(i.date);
    return invDate.getMonth() === today.getMonth() && invDate.getFullYear() === today.getFullYear();
  });
  
  const monthSales = monthSalesInvoices.filter(i => i.invoiceType !== 'SERVICE').reduce((sum, i) => sum + i.total, 0);
  const monthServices = monthSalesInvoices.filter(i => i.invoiceType === 'SERVICE').reduce((sum, i) => sum + i.total, 0);


  // Date formatting for the top header
  const dateString = today.toLocaleDateString('ar-YE', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-4 pb-8">
      




      {/* Hero Card */}
      <div 
        onClick={() => setActiveTab('parties')}
        className="bg-gradient-to-l from-accent-500 to-brand-500 rounded-3xl p-6 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden mb-2 cursor-pointer hover:opacity-95 transition-opacity active:scale-[0.98]"
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
            onClick={(e) => { e.stopPropagation(); setActiveTab('parties'); }}
            className="text-center px-2 cursor-pointer hover:bg-white/5 rounded-xl transition-colors py-1"
          >
            <Users className="w-5 h-5 mx-auto mb-2 opacity-70" />
            <div className="text-xl font-bold">{suppliers.length}</div>
            <div className="text-xs opacity-70 mt-1 font-bold">الموردين</div>
          </div>
        </div>
      </div>

      {/* Secondary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <ActionCard onClick={() => setActiveTab('sales')} icon={<ShoppingBag className="w-6 h-6 text-teal-600" />} title="فاتورة مبيعات" />
        <ActionCard onClick={() => setActiveTab('vouchers')} icon={<Receipt className="w-6 h-6 text-teal-600" />} title="سند قبض" />
        <ActionCard onClick={() => setActiveTab('parties')} icon={<UserPlus className="w-6 h-6 text-teal-600" />} title="إضافة عميل" />
        <ActionCard onClick={() => setActiveTab('expenses')} icon={<CreditCard className="w-6 h-6 text-teal-600" />} title="إضافة مصروف" />
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

        <div className="bg-white rounded-3xl p-8 border border-slate-100/60 shadow-sm text-center">
          {transactions.length > 0 ? (
            <div className="flex flex-col gap-3 text-right">
              {[...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map((trx) => (
                <div key={trx.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group">
                  <div className={`absolute top-0 right-0 w-1.5 h-full transition-colors ${trx.debit > 0 ? 'bg-emerald-400 group-hover:bg-emerald-500' : 'bg-rose-400 group-hover:bg-rose-500'}`}></div>
                  
                  <div className="flex justify-between items-start pr-1">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm shrink-0 ${trx.debit > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                         {trx.debit > 0 ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1">{trx.description}</h4>
                        <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                           <span className="flex items-center gap-1">{formatDate(trx.date)}</span>
                           <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                           <span className="font-mono text-slate-600 bg-slate-100 px-1.5 rounded">{trx.documentNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left shrink-0 pl-1">
                      <p className={`text-lg sm:text-xl font-black ${trx.debit > 0 ? 'text-emerald-600' : 'text-rose-600'}`} dir="ltr">
                        {trx.debit > 0 ? '+' : '-'}{formatCurrency(trx.debit > 0 ? trx.debit : trx.credit).replace('ر.ي', '').trim()}
                        <span className="text-xs ml-1 font-bold">ر.ي</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50/80 pr-1">
                     <div className="flex items-center gap-2">
                       <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                         {trx.documentType === 'invoice' ? 'فاتورة' : trx.documentType === 'voucher' ? 'سند' : 'مصروف'}
                       </span>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center opacity-60">
              <Receipt className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-slate-500 font-bold">لا توجد عمليات مسجلة</p>
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
