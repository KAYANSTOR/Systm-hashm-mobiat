import React from "react";
import { useStore } from "../context/StoreContext";
import {
  formatDate,
  formatNumber,
  adaptiveValueClass,
} from "../lib/utils";
import {
  TrendingUp,
  Users,
  ArrowDownRight,
  ArrowUpRight,
  ShoppingBag,
  Receipt,
  UserPlus,
  CreditCard,
} from "lucide-react";
import { ActionCard, EmptyState, StatCard, Badge } from "../components/ui";

export default function Dashboard({
  setActiveTab,
}: {
  setActiveTab: (tab: any) => void;
}) {
  const { customers, suppliers, invoices, transactions } = useStore();

  const totalReceivables = customers.reduce((sum, c) => sum + c.balance, 0);

  const today = new Date();

  const todaySalesInvoices = invoices.filter((i) => {
    if (i.type !== "sale") return false;
    const invDate = new Date(i.date);
    return invDate.toDateString() === today.toDateString();
  });

  const todaySales = todaySalesInvoices
    .filter((i) => i.invoiceType !== "SERVICE")
    .reduce((sum, i) => sum + i.total, 0);

  const monthSalesInvoices = invoices.filter((i) => {
    if (i.type !== "sale") return false;
    const invDate = new Date(i.date);
    return (
      invDate.getMonth() === today.getMonth() &&
      invDate.getFullYear() === today.getFullYear()
    );
  });

  const monthSales = monthSalesInvoices
    .filter((i) => i.invoiceType !== "SERVICE")
    .reduce((sum, i) => sum + i.total, 0);

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4 pb-8">
      {/* Hero — total receivables */}
      <button
        type="button"
        onClick={() => setActiveTab("parties")}
        className="w-full bg-gradient-to-l from-accent-500 to-brand-500 rounded-3xl p-6 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden mb-2 cursor-pointer hover:opacity-95 transition-opacity active:scale-[0.98] text-right"
      >
        <div className="flex items-center gap-2 mb-2 justify-end opacity-90">
          <span className="text-sm font-bold">إجمالي ديون العملاء (المعلق)</span>
          <div className="w-2.5 h-2.5 rounded-full bg-pink-300 opacity-80" />
        </div>

        <div className="mb-8">
          <div className="flex items-end justify-end gap-2">
            <span className="text-3xl font-bold mb-1">ر.ي</span>
            <span
              className={`font-black tracking-tight tabular-nums ${adaptiveValueClass(
                totalReceivables,
                "text-5xl"
              )}`}
            >
              {formatNumber(totalReceivables)}
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-white/10 mb-4 rounded-full" />

        <div className="grid grid-cols-2 divide-x divide-x-reverse divide-white/10">
          <div className="text-center px-2 py-1">
            <Users className="w-5 h-5 mx-auto mb-2 opacity-70" />
            <div className="text-xl font-bold">{customers.length}</div>
            <div className="text-xs opacity-70 mt-1 font-bold">العملاء</div>
          </div>
          <div className="text-center px-2 py-1">
            <Users className="w-5 h-5 mx-auto mb-2 opacity-70" />
            <div className="text-xl font-bold">{suppliers.length}</div>
            <div className="text-xs opacity-70 mt-1 font-bold">الموردين</div>
          </div>
        </div>
      </button>

      {/* KPI row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="مبيعات الشهر"
          value={monthSales}
          subtitle={`${monthSalesInvoices.length} فاتورة`}
          icon={<TrendingUp className="w-4 h-4" />}
          onClick={() => setActiveTab("reports")}
        />
        <StatCard
          title="مبيعات اليوم"
          value={todaySales}
          subtitle={`${todaySalesInvoices.length} فاتورة`}
          icon={<TrendingUp className="w-4 h-4" />}
          onClick={() => setActiveTab("sales")}
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <ActionCard
          onClick={() => setActiveTab("sales")}
          icon={<ShoppingBag className="w-6 h-6" />}
          title="فاتورة مبيعات"
        />
        <ActionCard
          onClick={() => setActiveTab("vouchers")}
          icon={<Receipt className="w-6 h-6" />}
          title="سند قبض"
        />
        <ActionCard
          onClick={() => setActiveTab("parties")}
          icon={<UserPlus className="w-6 h-6" />}
          title="إضافة عميل"
        />
        <ActionCard
          onClick={() => setActiveTab("expenses")}
          icon={<CreditCard className="w-6 h-6" />}
          title="إضافة مصروف"
        />
      </div>

      {/* Recent transactions */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4 px-2">
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className="text-teal-600 text-sm font-bold hover:text-teal-700 transition-colors"
          >
            جميع المعاملات
          </button>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 text-lg">آخر العمليات</span>
            <div className="w-2 h-2 rounded-full bg-teal-700" />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100/60 shadow-sm overflow-hidden">
          {recent.length > 0 ? (
            <div className="flex flex-col gap-3 p-4">
              {recent.map((trx) => {
                const isIn = trx.debit > 0;
                return (
                  <div
                    key={trx.id}
                    className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-100/60 hover:shadow-md transition-shadow flex flex-col gap-3 relative overflow-hidden group"
                  >
                    <div
                      className={`absolute top-0 right-0 w-1.5 h-full transition-colors ${
                        isIn
                          ? "bg-emerald-400 group-hover:bg-emerald-500"
                          : "bg-rose-400 group-hover:bg-rose-500"
                      }`}
                    />

                    <div className="flex justify-between items-start pr-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-[14px] flex items-center justify-center shadow-sm shrink-0 ${
                            isIn
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          {isIn ? (
                            <ArrowDownRight className="w-6 h-6" />
                          ) : (
                            <ArrowUpRight className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight mb-1">
                            {trx.description}
                          </h4>
                          <div className="text-[11px] sm:text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                            <span>{formatDate(trx.date)}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="font-mono text-slate-600 bg-slate-100 px-1.5 rounded">
                              {trx.documentNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left shrink-0 pl-1">
                        <p
                          className={`text-lg sm:text-xl font-black tabular-nums ${
                            isIn ? "text-emerald-600" : "text-rose-600"
                          }`}
                          dir="ltr"
                        >
                          {isIn ? "+" : "-"}
                          {formatNumber(isIn ? trx.debit : trx.credit)}
                          <span className="text-xs ml-1 font-bold">ر.ي</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-50/80 pr-1">
                      <Badge tone="neutral">
                        {trx.documentType === "invoice"
                          ? "فاتورة"
                          : trx.documentType === "voucher"
                            ? "سند"
                            : "مصروف"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Receipt className="w-7 h-7" />}
              title="لا توجد عمليات مسجلة"
              description="ستظهر هنا آخر الفواتير والسندات والمصروفات"
            />
          )}
        </div>
      </div>
    </div>
  );
}
