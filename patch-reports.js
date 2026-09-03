const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

// 1. Add imports
const imports = `import { CustomerStatementPreview } from '../components/CustomerStatementPreview';
import type { CustomerStatementData, StatementEntry } from '../components/CustomerStatement';`;
if (!code.includes('CustomerStatementPreview')) {
  code = code.replace(/import { (.*) } from 'lucide-react';/, "import { $1 } from 'lucide-react';\n" + imports);
}

// 2. Add 'statement' to state and destructure transactions
code = code.replace(/const { invoices, customers, suppliers } = useStore\(\);/, "const { invoices, customers, suppliers, transactions } = useStore();");
code = code.replace(/useState\<'sales' \| 'customers'\>\('sales'\);/, "useState<'sales' | 'customers' | 'statement'>('sales');");
code = code.replace(/const \[selectedCustomerId, setSelectedCustomerId\] = useState\('all'\);/, "const [selectedCustomerId, setSelectedCustomerId] = useState('all');\n  const [statementCustomerId, setStatementCustomerId] = useState('');");

// 3. Add the 'statement' tab
const tabCode = `
        <button 
          onClick={() => setReportType('statement')}
          className={\`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors \${reportType === 'statement' ? 'bg-brand-50 text-brand-700 border border-brand-200' : 'text-slate-600 hover:bg-slate-50'}\`}
        >
          كشف حساب عميل
        </button>
`;
if (!code.includes("setReportType('statement')")) {
  code = code.replace(/أرصدة العملاء\s*<\/button>\s*<\/div>/, "أرصدة العملاء\n        </button>" + tabCode + "      </div>");
}

fs.writeFileSync('src/pages/Reports.tsx', code);
