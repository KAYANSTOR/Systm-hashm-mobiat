const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "import Reports from './pages/Reports';",
  "import Reports from './pages/Reports';\nimport CashBox from './pages/CashBox';\nimport Expenses from './pages/Expenses';"
);

code = code.replace(
  "case 'reports': return <Reports />;",
  "case 'reports': return <Reports />;\n      case 'cashbox': return <CashBox />;\n      case 'expenses': return <Expenses />;"
);

fs.writeFileSync('src/App.tsx', code);
