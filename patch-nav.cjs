const fs = require('fs');

// Patch App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
if (!appContent.includes('CashBox')) {
  appContent = appContent.replace("import Layout from './components/Layout';", "import Layout from './components/Layout';\\nimport CashBox from './pages/CashBox';\\nimport Expenses from './pages/Expenses';");
  
  appContent = appContent.replace(
    "{activeTab === 'sales' && <Sales />}",
    "{activeTab === 'sales' && <Sales />}\\n        {activeTab === 'cashbox' && <CashBox />}\\n        {activeTab === 'expenses' && <Expenses />}"
  );
  fs.writeFileSync('src/App.tsx', appContent, 'utf8');
}

// Patch Layout.tsx
let layoutContent = fs.readFileSync('src/components/Layout.tsx', 'utf8');
if (!layoutContent.includes("id: 'cashbox'")) {
  layoutContent = layoutContent.replace(
    "import { Home, Users, Boxes, Receipt, ShoppingBag, PieChart, Menu, LogOut, Plus, FileText, Download } from 'lucide-react';",
    "import { Home, Users, Boxes, Receipt, ShoppingBag, PieChart, Menu, LogOut, Plus, FileText, Download, Wallet, CreditCard } from 'lucide-react';"
  );
  
  layoutContent = layoutContent.replace(
    "{ id: 'vouchers', label: 'السندات', icon: Receipt },",
    "{ id: 'vouchers', label: 'السندات', icon: Receipt },\\n    { id: 'cashbox', label: 'الصندوق', icon: Wallet },\\n    { id: 'expenses', label: 'المصروفات', icon: CreditCard },"
  );
  fs.writeFileSync('src/components/Layout.tsx', layoutContent, 'utf8');
}

// Patch types.ts TabType
let typesContent = fs.readFileSync('src/types.ts', 'utf8');
typesContent = typesContent.replace(
  "export type TabType = 'dashboard' | 'parties' | 'inventory' | 'sales' | 'vouchers' | 'reports';",
  "export type TabType = 'dashboard' | 'parties' | 'inventory' | 'sales' | 'vouchers' | 'reports' | 'cashbox' | 'expenses';"
);
fs.writeFileSync('src/types.ts', typesContent, 'utf8');
console.log("Navigation patched.");
