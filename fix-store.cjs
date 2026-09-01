const fs = require('fs');
const file = './src/context/StoreContext.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/addInvoice: \(i: Omit<Invoice, 'id' \| 'createdAt' \| 'updatedAt'>\) => Promise<string \| void>;/g, "addInvoice: (i: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;");
content = content.replace(/addVoucher: \(v: Omit<Voucher, 'id' \| 'createdAt' \| 'updatedAt'>\) => Promise<string \| void>;/g, "addVoucher: (v: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;");

content = content.replace(/await batch\.commit\(\);\s*toast\.success\('تم إضافة الفاتورة'\);\s*\} catch/g, "await batch.commit();\n      toast.success('تم إضافة الفاتورة');\n      return invoiceRef.id;\n    } catch");
content = content.replace(/await batch\.commit\(\);\s*toast\.success\('تم إضافة السند'\);\s*\} catch/g, "await batch.commit();\n      toast.success('تم إضافة السند');\n      return voucherRef.id;\n    } catch");

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed store context');
