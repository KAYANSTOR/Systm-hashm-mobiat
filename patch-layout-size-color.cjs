const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// 1. Update FAB size and color
const oldFab = `          {/* Quick Actions FAB - Centered and Elevated */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-50">
            <button 
              className={cn(
                "w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg transition-all text-white border-4 border-[#f4f6f9]",
                isFabOpen 
                  ? "bg-slate-800 rotate-45 shadow-slate-900/30" 
                  : "bg-slate-800 shadow-slate-900/30 hover:bg-slate-900"
              )}`;

const newFab = `          {/* Quick Actions FAB - Centered and Elevated */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-50">
            <button 
              className={cn(
                "w-[68px] h-[68px] rounded-full flex items-center justify-center shadow-lg transition-all text-white border-4 border-[#f4f6f9]",
                isFabOpen 
                  ? "bg-brand-600 rotate-45 shadow-brand-500/30" 
                  : "bg-brand-500 shadow-brand-500/30 hover:bg-brand-600"
              )}`;
              
code = code.replace(oldFab, newFab);

// 2. Increase ArrowUp size inside FAB
code = code.replace(/<ArrowUp className="w-6 h-6 stroke-\[3\]" \/>/, '<ArrowUp className="w-7 h-7 stroke-[3]" />');
code = code.replace(/<Plus className="w-8 h-8 transition-transform" \/>/, '<Plus className="w-9 h-9 transition-transform" />');

// 3. Update Bottom Nav Icons size
const oldIcons = `                {isActive && (
                  <div className="absolute top-2 w-12 h-12 bg-teal-50 rounded-2xl -z-10"></div>
                )}
                <Icon className={cn("w-[22px] h-[22px] mb-0.5", isActive && "text-teal-700")} strokeWidth={isActive ? 2.5 : 2} />`;

const newIcons = `                {isActive && (
                  <div className="absolute top-1 w-14 h-14 bg-teal-50 rounded-2xl -z-10"></div>
                )}
                <Icon className={cn("w-[26px] h-[26px] mb-0.5", isActive && "text-teal-700")} strokeWidth={isActive ? 2.5 : 2} />`;

code = code.replace(oldIcons, newIcons);

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('patched Layout size and color');
