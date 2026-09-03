const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf-8');

const target = `      {/* Premium Greeting Section */}
      <div className="mb-6 mt-2 bg-gradient-to-r from-brand-600 to-brand-400 rounded-3xl p-6 text-white shadow-lg shadow-brand-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-accent-500/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black mb-1 drop-shadow-sm flex items-center gap-2">
              صباح الخير، هاشم
              <span className="text-2xl">👋</span>
            </h2>
            <p className="text-brand-100 font-medium text-sm drop-shadow-sm opacity-90">{dateString} • الاشتراك صالح</p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20 self-start md:self-auto">
             <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
               <ShoppingBag className="w-5 h-5 text-white" />
             </div>
             <div>
               <p className="text-xs text-brand-100 font-medium">مبيعات اليوم</p>
               <p className="font-bold text-lg leading-none mt-0.5">{todaySalesInvoices.length} <span className="text-xs font-normal">طلب</span></p>
             </div>
          </div>
        </div>
      </div>`;

code = code.replace(target, '');
fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log('Removed greeting section.');
