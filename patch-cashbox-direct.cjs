const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

const imports = "import { Wallet, ArrowDownRight, ArrowUpRight, Filter, Search, Calendar, CreditCard, Banknote, Landmark, Plus, X } from 'lucide-react';";
code = code.replace("import { Wallet, ArrowDownRight, ArrowUpRight, Filter, Search, Calendar, CreditCard, Banknote, Landmark } from 'lucide-react';", imports);

const storeHooks = `  const { transactions, addVoucher } = useStore();
  const [filterType, setFilterType] = useState('all'); // all, cash, jeeb, remittance, e_wallet`;
code = code.replace(
  "const { transactions } = useStore();\n  const [filterType, setFilterType] = useState('all'); // all, cash, jeeb, remittance, e_wallet",
  storeHooks
);

const stateAndHandlers = `  const [searchTerm, setSearchTerm] = useState('');

  // Direct Transaction Modal State
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [directType, setDirectType] = useState<'receipt' | 'payment'>('receipt');
  const [directAmount, setDirectAmount] = useState('');
  const [directMethod, setDirectMethod] = useState<'cash' | 'remittance' | 'jeeb' | 'e_wallet'>('cash');
  const [directDesc, setDirectDesc] = useState('');

  const handleDirectTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!directAmount || parseFloat(directAmount) <= 0) return;
    
    await addVoucher({
      voucherNumber: \`DIR-\${Date.now()}\`,
      type: directType,
      partyType: 'other',
      amount: parseFloat(directAmount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: directMethod,
      description: directDesc || (directType === 'receipt' ? 'إيداع مباشر' : 'سحب مباشر'),
      createdBy: 'user', // We can get this from auth context if available
    });
    
    setIsDirectModalOpen(false);
    setDirectAmount('');
    setDirectDesc('');
  };`;
code = code.replace("const [searchTerm, setSearchTerm] = useState('');", stateAndHandlers);

const headerTitle = `      <div className="flex justify-between items-center">
        <div>
          <h2 className="page-title">إدارة الصندوق والمحافظ</h2>
          <p className="page-subtitle">استعراض حركة الأموال النقدية والتحويلات والمحافظ الإلكترونية</p>
        </div>
        <button 
          onClick={() => setIsDirectModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">حركة صندوق مباشرة</span>
        </button>
      </div>`;
code = code.replace(`      <div>
        <h2 className="page-title">إدارة الصندوق والمحافظ</h2>
        <p className="page-subtitle">استعراض حركة الأموال النقدية والتحويلات والمحافظ الإلكترونية</p>
      </div>`, headerTitle);

const modalContent = `      {/* Direct Transaction Modal */}
      {isDirectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">تسجيل حركة صندوق مباشرة</h3>
              <button onClick={() => setIsDirectModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors p-2 rounded-full hover:bg-rose-50">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDirectTransaction} className="p-5 space-y-4">
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                <button type="button" onClick={() => setDirectType('receipt')} className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-all \${directType === 'receipt' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>إيداع (قبض)</button>
                <button type="button" onClick={() => setDirectType('payment')} className={\`flex-1 py-2 text-sm font-bold rounded-lg transition-all \${directType === 'payment' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}>سحب (صرف)</button>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">المبلغ</label>
                <input type="number" step="0.01" required value={directAmount} onChange={e => setDirectAmount(e.target.value)} className="input-field font-bold text-lg text-left" dir="ltr" placeholder="0.00" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">طريقة الدفع / المحفظة</label>
                <select value={directMethod} onChange={e => setDirectMethod(e.target.value as any)} className="input-field">
                  <option value="cash">الصندوق النقدي</option>
                  <option value="remittance">حوالة بنكية</option>
                  <option value="jeeb">محفظة جيب</option>
                  <option value="e_wallet">محفظة إلكترونية أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">البيان / التفاصيل</label>
                <input type="text" required value={directDesc} onChange={e => setDirectDesc(e.target.value)} className="input-field" placeholder="مثال: تغذية الصندوق، سحب شخصي..." />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsDirectModalOpen(false)} className="flex-1 btn-outline">إلغاء</button>
                <button type="submit" className={\`flex-1 \${directType === 'receipt' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white rounded-xl font-bold transition-all shadow-lg active:scale-95\`}>
                  تأكيد {directType === 'receipt' ? 'الإيداع' : 'السحب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}`;
code = code.replace(`    </div>
  );
}`, modalContent);

fs.writeFileSync('src/pages/CashBox.tsx', code);
