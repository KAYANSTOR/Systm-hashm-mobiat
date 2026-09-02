const fs = require('fs');
let content = fs.readFileSync('src/pages/Parties.tsx', 'utf8');

const modalCode = `
      {statementParty && (
        <StatementModal party={statementParty} onClose={() => setStatementParty(null)} />
      )}
    </div>
  );
}

function StatementModal({ party, onClose }: { party: Customer | Supplier, onClose: () => void }) {
  const { transactions } = useStore();
  const [printMode, setPrintMode] = useState(false);
  
  const partyTransactions = transactions
    .filter(t => t.partyId === party.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  if (printMode) {
    return <StatementPrintTemplate party={party} transactions={partyTransactions} onClose={() => setPrintMode(false)} />;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-black text-xl text-slate-800">
              كشف حساب - {party.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">الرصيد الحالي: <span dir="ltr" className="font-bold text-slate-700">{formatCurrency(party.balance)}</span></p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setPrintMode(true)} className="btn-primary py-2 px-4 text-sm">طباعة كشف الحساب</button>
             <button onClick={onClose} className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">إغلاق</button>
          </div>
        </div>
        <div className="p-0 overflow-y-auto flex-1">
          <table className="table-standard">
            <thead className="sticky top-0 bg-white shadow-sm">
              <tr>
                <th className="px-4 py-3">التاريخ</th>
                <th className="px-4 py-3">رقم المستند</th>
                <th className="px-4 py-3">البيان</th>
                <th className="px-4 py-3 text-center">مدين (له)</th>
                <th className="px-4 py-3 text-center">دائن (عليه)</th>
                <th className="px-4 py-3 text-center">الرصيد المتراكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(() => {
                let runningBalance = 0;
                return partyTransactions.map((t, idx) => {
                  runningBalance += (t.debit - t.credit);
                  return (
                    <tr key={t.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-slate-600">{formatDate(t.date)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-700 text-sm">{t.documentNumber}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800">{t.description}</td>
                      <td className="px-4 py-3 text-center font-bold text-rose-600" dir="ltr">{t.debit > 0 ? formatCurrency(t.debit) : '-'}</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-600" dir="ltr">{t.credit > 0 ? formatCurrency(t.credit) : '-'}</td>
                      <td className="px-4 py-3 text-center font-black text-brand-700" dir="ltr">{formatCurrency(runningBalance)}</td>
                    </tr>
                  );
                });
              })()}
              {partyTransactions.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">لا يوجد حركات لهذا الحساب</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace(/    <\/div>\s*  \);\s*}\s*$/, modalCode);
fs.writeFileSync('src/pages/Parties.tsx', content, 'utf8');
