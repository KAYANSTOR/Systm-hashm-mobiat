const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Replace imports
layout = layout.replace(/import\s*\{\s*LayoutDashboard,\s*ShoppingCart,\s*Package,\s*Users,\s*FileText,\s*CreditCard,\s*Settings,\s*HelpCircle,\s*Plus,\s*Download,\s*Calculator,\s*UserPlus,\s*Bell,\s*ArrowRight\s*\}\s*from\s*'lucide-react';/, 
  "import { Home, ShoppingBag, Boxes, Users, PieChart, Receipt, Plus, Download, Calculator, UserPlus, Bell, ArrowRight } from 'lucide-react';");

// Replace navItems definitions
layout = layout.replace(/\{ id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard \}/, "{ id: 'dashboard', label: 'الرئيسية', icon: Home }");
layout = layout.replace(/\{ id: 'reports', label: 'التقارير', icon: FileText \}/, "{ id: 'reports', label: 'التقارير', icon: PieChart }");
layout = layout.replace(/\{ id: 'vouchers', label: 'السندات', icon: CreditCard \}/, "{ id: 'vouchers', label: 'السندات', icon: Receipt }");
layout = layout.replace(/\{ id: 'inventory', label: 'المخزن', icon: Package \}/, "{ id: 'inventory', label: 'المخزن', icon: Boxes }");
layout = layout.replace(/\{ id: 'sales', label: 'المبيعات', icon: ShoppingCart \}/, "{ id: 'sales', label: 'المبيعات', icon: ShoppingBag }");

// Also update the voucher quick action icon if it uses CreditCard
layout = layout.replace(/<CreditCard className="w-5 h-5" \/>/g, '<Receipt className="w-5 h-5" />');

fs.writeFileSync('src/components/Layout.tsx', layout, 'utf8');
