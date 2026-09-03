const fs = require('fs');
let code = fs.readFileSync('src/components/Layout.tsx', 'utf8');

const oldQuickActions = `                <button 
                  onClick={() => handleQuickAction('parties')}
                  className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700"
                >
                  <span className="font-bold text-sm">إضافة عميل</span>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <UserPlus className="w-5 h-5" />
                  </div>
                </button>`;

const newQuickActions = `                <button 
                  onClick={() => handleQuickAction('parties')}
                  className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700 w-full justify-between"
                >
                  <span className="font-bold text-sm">إضافة عميل</span>
                  <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                    <UserPlus className="w-5 h-5" />
                  </div>
                </button>
                <button 
                  onClick={() => handleQuickAction('expenses')}
                  className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700 w-full justify-between"
                >
                  <span className="font-bold text-sm">مصروف جديد</span>
                  <div className="bg-rose-50 text-rose-600 p-2 rounded-xl">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </button>`;

code = code.replace(oldQuickActions, newQuickActions);

// Fix layout of the other two quick actions
code = code.replace(/className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700"/g,
'className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors active:scale-95 text-slate-700 w-full justify-between"');

fs.writeFileSync('src/components/Layout.tsx', code);
console.log('patched Layout Quick Actions');
