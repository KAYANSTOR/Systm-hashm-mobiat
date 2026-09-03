import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate, adaptiveValueClass, cn } from '../lib/utils';
import {
  TrendingUp, Users, ArrowDownRight, ArrowUpRight,
  ShoppingBag, Receipt, UserPlus, CreditCard,
} from 'lucide-react';
import { StatCard, ActionCard, EmptyState, Badge } from '../components/ui';

export default function Dashboard({ setActiveTab }: { setActiveTab: (tab: any) => void }) {
  const { customers, suppliers, invoices, transactions } = useStore();

  const totalReceivables = customers.reduce((sum, c) => sum + c.balance, 0);

  // Calculate today's and month's sales
  const today = new Date();
  const todaySalesInvoices = invoices.filter(i => {
    if (i.type !== 'sale') return false;
    const invDate = new Date(i.date);
    return invDate.toDateString() === today.toDateString();
  });

  const todaySales = todaySalesInvoices
    .filter(i => i.invoiceType !== 'SERVICE')
    .reduce((sum, i) => sum + i.total, 0);

  const monthSalesInvoices = invoices.filter(i => {
    if (i.type !== 'sale') return false;
    const invDate = new Date(i.date);
    return invDate.getMonth() === today.getMonth() && invDate.getFullYear() === today.getFullYear();
  });

  const monthSales = monthSalesInvoices
    .filter(i => i.invoiceType !== 'SERVICE')
    .reduce((sum, i) => sum + i.total, 0);

  // نص القيمة الإجمالية للديون — مُنسّق بفواصل الآلاف بدل رقم خام كما كان سابقًا،
  // وبحجم خط متكيّف مع عدد الخانات لمنع فيضان الأرقام الكبيرة خارج البطاقة.
  const totalReceivablesStr = formatCurrency(totalReceivables).replace('ر.ي', '').trim() || '0';
  const heroValueSizeClass = adaptiveValueClass(totalReceivablesStr, ['text-3xl', 'text-4xl', 'text-5xl']);

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

        <div className="text-right mb-8 min-w-0">
          <div className="flex items-end justify-end gap-2 flex-wrap">
            <span className="text-3xl font-bold mb-1 shrink-0">ر.ي</span>
            <span className={cn('font-black tracking-tight tabular-nums break-all', heroValueSizeClass)}>
              {totalReceivablesStr}
            </span>
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

      {/* Secondary Cards Row — الآن عبر StatCard الموحّد بدل تكرار نفس التركيبة مرتين */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          onClick={() => setActiveTab('reports')}
          label="مبيعات الشهر"
          value={formatCurrency(monthSales).replace('ر.ي', '').trim() || '0'}
          currencySuffix="ر.ي"
          icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          badgeLabel={`${monthSalesInvoices.length} فاتورة`}
        />
        <StatCard
          onClick={() => setActiveTab('sales')}
          label="مبيعات اليوم"
          value={formatCurrency(todaySales).replace('ر.ي', '').trim() || '0'}
          currencySuffix="ر.ي"
          icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          badgeLabel={`${todaySalesInvoices.length} فاتورة`}
        />
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

        <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-100/60 shadow-sm">
          {transactions.length > 0 ? (
            <div className="flex flex-col gap-3 text-right">
              {[...transactions]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((trx) => (
                  <div key={trx.id} className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group min-w-0">
                    <div className={cn(
                      'absolute top-0 right-0 w-1.5 h-full transition-colors',
                      trx.debit > 0 ? 'bg-emerald-400 group-hover:bg-emerald-500' : 'bg-rose-400 group-hover:bg-rose-500'
                    )}></div>

                    <div className="flex justify-between items-start pr-1 gap-2 min-w-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          'w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm shrink-0',
                          trx.debit > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        )}>
                          {trx.debit > 0 ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1 truncate">{trx.description}</h4>
                          <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                            <span className="flex items-center gap-1">{formatDate(trx.date)}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="font-mono text-slate-600 bg-slate-100 px-1.5 rounded">{trx.documentNumber}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left shrink-0 pl-1">
                        <p className={cn('text-lg sm:text-xl font-black tabular-nums', trx.debit > 0 ? 'text-emerald-600' : 'text-rose-600')} dir="ltr">
                          {trx.debit > 0 ? '+' : '-'}{formatCurrency(trx.debit > 0 ? trx.debit : trx.credit).replace('ر.ي', '').trim()}
                          <span className="text-xs ml-1 font-bold">ر.ي</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50/80 pr-1">
                      <Badge variant="neutral">
                        {trx.documentType === 'invoice' ? 'فاتورة' : trx.documentType === 'voucher' ? 'سند' : 'مصروف'}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <EmptyState
              icon={<Receipt className="w-8 h-8" />}
              title="لا توجد عمليات مسجلة بعد"
              description="ستظهر هنا آخر الفواتير والسندات والمصروفات فور إضافتها."
            />
          )}
        </div>
      </div>
    </div>
  );
}
