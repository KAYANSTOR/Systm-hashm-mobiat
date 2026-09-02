const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

code = code.replace(
  "description: i.invoiceType === 'SERVICE' ? 'فاتورة خدمة تطريز' : (i.type === 'sale' ? 'فاتورة مبيعات' : 'فاتورة مشتريات'),",
  "description: i.invoiceType === 'SERVICE' ? 'فاتورة خدمة تطريز' : (i.type === 'sale' ? 'فاتورة مبيعات' : 'فاتورة مشتريات'),\n          paymentMethod: (i as any).paymentMethod || 'cash',"
);

fs.writeFileSync('src/context/StoreContext.tsx', code);
