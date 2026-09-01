const fs = require('fs');
let sales = fs.readFileSync('./src/pages/Sales.tsx', 'utf8');
sales = sales.replace(/\}\s*\} setIsModalOpen/g, "} setIsModalOpen");
sales = sales.replace(/setEditingInvoiceId\(null\);\n\s*\};\n\s*const filteredInvoices/g, "}\n    setIsModalOpen(false);\n    setEditingInvoiceId(null);\n  };\n  const filteredInvoices");
// Actually, let's just make sure there is exactly ONE `} else {` matched with a closing brace.
fs.writeFileSync('./src/pages/Sales.tsx', sales, 'utf8');
