const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

if (!code.includes('StatementFilters')) {
  code = code.replace(
    /import { CustomerStatementPreview } from '\.\.\/components\/CustomerStatementPreview';/,
    "import { CustomerStatementPreview } from '../components/CustomerStatementPreview';\nimport { StatementFilters } from '../components/StatementFilters';"
  );
}

const oldFilterBlock = `<div className="card no-print">
              <div className="card-header border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-500" />
                  إعداد كشف الحساب
                </h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="label text-xs">العميل</label>
                    <select 
                      className="input-field py-2" 
                      value={statementCustomerId} 
                      onChange={e => setStatementCustomerId(e.target.value)}
                    >
                      <option value="">اختر العميل...</option>
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs">من تاريخ</label>
                    <input 
                      type="date" 
                      className="input-field py-2"
                      value={statementStartDate}
                      onChange={e => setStatementStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label text-xs">إلى تاريخ</label>
                    <input 
                      type="date" 
                      className="input-field py-2"
                      value={statementEndDate}
                      onChange={e => setStatementEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>`;

const newFilterBlock = `<div className="no-print mb-6">
              <StatementFilters 
                customers={customers.map(c => ({...c, type: 'CUSTOMER'}))}
                suppliers={suppliers.map(s => ({...s, type: 'SUPPLIER'}))}
                initialPartyId={statementCustomerId || undefined}
                initialFrom={statementStartDate ? new Date(statementStartDate) : new Date()}
                initialTo={statementEndDate ? new Date(statementEndDate) : new Date()}
                onContinue={({ from, to, party }) => {
                  // Keep timezone offset into account to avoid off-by-one day issues
                  const fromDate = new Date(from.getTime() - (from.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                  const toDate = new Date(to.getTime() - (to.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                  setStatementStartDate(fromDate);
                  setStatementEndDate(toDate);
                  setStatementCustomerId(party?.id || '');
                }}
              />
            </div>`;

code = code.replace(oldFilterBlock, newFilterBlock);

fs.writeFileSync('src/pages/Reports.tsx', code);
console.log('Filters patched');
