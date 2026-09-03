const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

// 1. Add state
code = code.replace(
  "const [isModalOpen, setIsModalOpen] = useState(false);",
  "const [isModalOpen, setIsModalOpen] = useState(false);\n  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);"
);

// 2. Change button
code = code.replace(
  "<button onClick={() => openModal('sale', 'PRODUCT_SALE')} className=\"btn-primary\">",
  "<button onClick={() => setIsComingSoonOpen(true)} className=\"btn-primary\">"
);

// 3. Add modal near the end, just before the closing </div> of the component.
const comingSoonModal = `
      {isComingSoonOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center text-center p-8 border border-slate-100">
            <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">قريباً</h3>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              شاشة مبيعات البضائع والمواد جاري العمل عليها وسيتم إتاحتها في التحديث القادم للنظام.
            </p>
            <button 
              onClick={() => setIsComingSoonOpen(false)} 
              className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}
`;

code = code.replace(
  "    </div>\n  );\n}",
  comingSoonModal + "\n    </div>\n  );\n}"
);

fs.writeFileSync('src/pages/Sales.tsx', code);
console.log('Patched Sales.tsx');
