const fs = require('fs');
let content = fs.readFileSync('./src/pages/Sales.tsx', 'utf8');

content = content.replace(/await addInvoice\(\{\n\s*\.\.\.invoiceData,\n\s*createdBy: auth\.currentUser\?\.uid \|\| 'user',\n\s*\}\);/g, "const newId = await addInvoice({\n        ...invoiceData,\n        createdBy: auth.currentUser?.uid || 'user',\n      });\n      \n      const party = invoiceData.type === 'sale' ? customers.find(c => c.id === invoiceData.partyId) : suppliers.find(s => s.id === invoiceData.partyId);\n      \n      setSelectedInvoice({\n        id: newId,\n        ...invoiceData,\n        createdAt: new Date().toISOString(),\n        updatedAt: new Date().toISOString()\n      } as any);\n      setSelectedPartyName(party ? party.name : '');");

fs.writeFileSync('./src/pages/Sales.tsx', content, 'utf8');

// For Vouchers.tsx
let contentV = fs.readFileSync('./src/pages/Vouchers.tsx', 'utf8');
contentV = contentV.replace(/await addVoucher\(\{\n\s*\.\.\.voucherData,\n\s*createdBy: auth\.currentUser\?\.uid \|\| 'user',\n\s*\}\);/g, "const newId = await addVoucher({\n        ...voucherData,\n        createdBy: auth.currentUser?.uid || 'user',\n      });\n      \n      const partyName = type === 'receipt' ? customers.find(c => c.id === partyId)?.name : type === 'payment' ? suppliers.find(s => s.id === partyId)?.name : partyId;\n      \n      setPrintingVoucher({\n        voucher: { id: newId, ...voucherData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any,\n        partyName: partyName || ''\n      });");

fs.writeFileSync('./src/pages/Vouchers.tsx', contentV, 'utf8');
console.log('Fixed Sales and Vouchers');
