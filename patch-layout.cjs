const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// 1. Update TabType
code = code.replace(/export type TabType = 'dashboard' \| 'sales' \| 'inventory' \| 'vouchers' \| 'parties' \| 'reports' \| 'cashbox' \| 'expenses';/, 
"export type TabType = 'dashboard' | 'sales' | 'inventory' | 'vouchers' | 'parties' | 'reports' | 'cashbox' | 'expenses' | 'settings';");

// 2. Add Settings icon import
code = code.replace(/import \{ Home, /, "import { Home, Settings, ArrowUp, Zap, ");

// 3. Update navItems
const oldNavItems = `  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'reports', label: 'التقارير', icon: PieChart },
    { id: 'vouchers', label: 'السندات', icon: Receipt },
    { id: 'cashbox', label: 'الصندوق', icon: Wallet },
    { id: 'expenses', label: 'المصروفات', icon: CreditCard },
    { id: 'parties', label: 'العملاء', icon: Users },
    { id: 'sales', label: 'المبيعات', icon: ShoppingBag },
  ];`;
  
const newNavItems = `  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home },
    { id: 'cashbox', label: 'الصندوق', icon: Wallet },
    { id: 'reports', label: 'التقارير', icon: PieChart },
    { id: 'parties', label: 'العملاء', icon: Users },
  ];`;
code = code.replace(oldNavItems, newNavItems);

// 4. Top Header Settings icon
const topHeaderRegex = /<button \s*onClick=\{\(\) => setIsNotificationsOpen\(!isNotificationsOpen\)\}\s*className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"\s*title="التنبيهات"\s*>/;
const newTopHeaderSettings = `<button 
              onClick={() => setActiveTab('settings')} 
              className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
              title="الإعدادات"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
              className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
              title="التنبيهات"
            >`;
code = code.replace(topHeaderRegex, newTopHeaderSettings);

// 5. FAB and Bottom Nav Restructuring
const oldBottomSectionRegex = /\{\/\* Floating Action Button \(FAB\) \*\/\}.*?<\/div>.*?<\/main>.*?\{\/\* Bottom Navigation \*\/\}.*?<\/nav>/s;
const newBottomSection = `{/* Quick Actions Menu remains in main, but FAB is moved */}
          {/* We will place FAB in the nav instead */}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 inset-x-0 bg-white z-50 no-print shadow-[0_-4px_25px_rgba(0,0,0,0.03)] border-t border-slate-100 pb-safe rounded-t-3xl">
        <div className="flex justify-around items-center h-20 max-w-5xl mx-auto px-2 relative">
          
          {/* Quick Actions FAB - Centered and Elevated */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50">
            <button 
              className={cn(
                "w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg transition-all text-white border-4 border-[#f4f6f9]",
                isFabOpen 
                  ? "bg-slate-800 rotate-45 shadow-slate-900/30" 
                  : "bg-slate-800 shadow-slate-900/30 hover:bg-slate-900"
              )}
              onClick={() => setIsFabOpen(!isFabOpen)}
            >
              {isFabOpen ? (
                <Plus className="w-8 h-8 transition-transform" />
              ) : (
                <div className="flex flex-col items-center justify-center -space-y-1">
                  <ArrowUp className="w-6 h-6 stroke-[3]" />
                  <div className="w-2 h-2 rounded-full bg-white mt-1"></div>
                </div>
              )}
            </button>
          </div>

          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Add margin to make room for central FAB
            const isMiddleRight = index === 1;
            const isMiddleLeft = index === 2;
            const marginClass = isMiddleRight ? "ml-8" : isMiddleLeft ? "mr-8" : "";

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full space-y-1.5 transition-all duration-300 relative",
                  marginClass,
                  isActive ? "text-teal-700" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {isActive && (
                  <div className="absolute top-2 w-12 h-12 bg-teal-50 rounded-2xl -z-10"></div>
                )}
                <Icon className={cn("w-[22px] h-[22px] mb-0.5", isActive && "text-teal-700")} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[11px] font-bold", isActive ? "text-teal-700" : "text-slate-500")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>`;

code = code.replace(oldBottomSectionRegex, newBottomSection);

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('patched Layout.tsx');
