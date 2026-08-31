import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  CreditCard,
  LogOut,
  Settings,
  HelpCircle,
  Plus,
  Download,
  Calculator,
  UserPlus,
  Bell,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { User } from 'firebase/auth';
import { useStore } from '../context/StoreContext';

export type TabType = 'dashboard' | 'sales' | 'inventory' | 'vouchers' | 'parties' | 'reports';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onSignOut: () => void;
  user: User;
}

export default function Layout({ children, activeTab, setActiveTab, onSignOut, user }: LayoutProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { inventory } = useStore();

  const lowStockItems = inventory.filter(item => item.quantity <= (item.limit || 0));

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'reports', label: 'التقارير', icon: FileText },
    { id: 'vouchers', label: 'السندات', icon: CreditCard },
    { id: 'parties', label: 'العملاء', icon: Users },
    { id: 'inventory', label: 'المخزن', icon: Package },
    { id: 'sales', label: 'المبيعات', icon: ShoppingCart },
  ];

  const handleQuickAction = (tab: TabType) => {
    setActiveTab(tab);
    setIsFabOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f4f6f9] overflow-hidden font-tajawal" dir="rtl">
      {/* Top Header */}
      <header className="h-20 px-5 flex items-center justify-between no-print z-10 shrink-0">
        <div className="flex items-center gap-3">
          {activeTab !== 'dashboard' && (
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
              title="رجوع للرئيسية"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
              className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
              title="التنبيهات"
            >
              <Bell className="w-5 h-5" />
              {lowStockItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {lowStockItems.length}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-sm text-slate-800">التنبيهات</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {lowStockItems.length > 0 ? (
                      lowStockItems.map(item => (
                        <div key={item.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors text-right">
                          <p className="text-sm font-bold text-slate-700">{item.name}</p>
                          <p className="text-xs text-rose-500 mt-1">الكمية المتبقية: {item.quantity}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-slate-500 font-medium">لا توجد تنبيهات</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          <button onClick={onSignOut} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="تسجيل الخروج">
            <LogOut className="w-5 h-5 ml-0.5" />
          </button>
          {deferredPrompt && (
            <button onClick={handleInstallClick} className="w-10 h-10 bg-[#208480] rounded-2xl flex items-center justify-center shadow-lg shadow-[#208480]/30 text-white hover:bg-[#1a6b68] transition-colors" title="تثبيت التطبيق">
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <h1 className="font-bold text-[15px] text-teal-800 tracking-tight leading-tight">معمل هاشم</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center shadow-sm">
            <div className="text-teal-600 font-extrabold text-xl relative top-1">هـ</div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto p-4 pb-28">
        <div className="max-w-md mx-auto h-full relative">
          {children}

          {/* Quick Actions Menu */}
          {isFabOpen && (
            <>
              <div 
                className="fixed inset-0 bg-slate-900/20 z-30 no-print" 
                onClick={() => setIsFabOpen(false)}
              ></div>
              <div className="fixed bottom-40 left-6 flex flex-col gap-3 z-40 no-print">
                <button 
                  onClick={() => handleQuickAction('sales')}
                  className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700"
                >
                  <span className="font-bold text-sm">فاتورة جديدة</span>
                  <div className="bg-teal-50 text-teal-600 p-2 rounded-xl">
                    <Calculator className="w-5 h-5" />
                  </div>
                </button>
                <button 
                  onClick={() => handleQuickAction('vouchers')}
                  className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700"
                >
                  <span className="font-bold text-sm">سند جديد</span>
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </button>
                <button 
                  onClick={() => handleQuickAction('parties')}
                  className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700"
                >
                  <span className="font-bold text-sm">إضافة عميل</span>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <UserPlus className="w-5 h-5" />
                  </div>
                </button>
              </div>
            </>
          )}

          {/* Floating Action Button (FAB) */}
          <button 
            className={cn(
              "fixed bottom-24 left-6 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all z-40 text-white no-print",
              isFabOpen 
                ? "bg-slate-700 hover:bg-slate-800 shadow-slate-900/30 rotate-45" 
                : "bg-[#bd5e8e] hover:bg-[#a64e7a] shadow-[#bd5e8e]/40"
            )}
            onClick={() => setIsFabOpen(!isFabOpen)}
          >
            <Plus className="w-6 h-6 transition-transform" />
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white z-50 no-print rounded-t-3xl shadow-[0_-4px_25px_rgba(0,0,0,0.03)] border-t border-slate-100">
        <div className="flex justify-around items-center h-20 max-w-md mx-auto px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full space-y-1.5 transition-all duration-300 relative",
                  isActive ? "text-teal-700" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {isActive && (
                  <div className="absolute top-2 w-12 h-12 bg-teal-50 rounded-2xl -z-10"></div>
                )}
                <Icon className={cn("w-[22px] h-[22px] mb-0.5", isActive && "text-teal-700")} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[10px] font-bold", isActive ? "text-teal-700" : "text-slate-500")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
