const fs = require('fs');
let dash = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dash = dash.replace(/import\s*\{\s*TrendingUp,\s*Package,\s*Users,\s*CheckCircle2,\s*ChevronLeft,\s*Calculator,\s*PlusCircle,\s*UserPlus,\s*PackagePlus,\s*Receipt\s*\}\s*from\s*'lucide-react';/, 
  "import { TrendingUp, Package, Users, CheckCircle2, ChevronLeft, ShoppingBag, Receipt, UserPlus, Box } from 'lucide-react';");

dash = dash.replace(/<ActionCard onClick=\{\(\) => setActiveTab\('sales'\)\} icon=\{<Calculator className="w-6 h-6 text-teal-600" \/>\} title="فاتورة مبيعات" \/>/,
  `<ActionCard onClick={() => setActiveTab('sales')} icon={<ShoppingBag className="w-6 h-6 text-teal-600" />} title="فاتورة مبيعات" />`);

dash = dash.replace(/<ActionCard onClick=\{\(\) => setActiveTab\('vouchers'\)\} icon=\{<PlusCircle className="w-6 h-6 text-teal-600" \/>\} title="سند قبض" \/>/,
  `<ActionCard onClick={() => setActiveTab('vouchers')} icon={<Receipt className="w-6 h-6 text-teal-600" />} title="سند قبض" />`);

dash = dash.replace(/<ActionCard onClick=\{\(\) => setActiveTab\('inventory'\)\} icon=\{<PackagePlus className="w-6 h-6 text-teal-600" \/>\} title="إضافة صنف" \/>/,
  `<ActionCard onClick={() => setActiveTab('inventory')} icon={<Box className="w-6 h-6 text-teal-600" />} title="إضافة صنف" />`);

fs.writeFileSync('src/pages/Dashboard.tsx', dash, 'utf8');
