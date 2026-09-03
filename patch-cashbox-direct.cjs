const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

const targetStr = `await addCashTransaction({
      documentType: 'voucher',
      documentId: 'direct',
      documentNumber: 'DIR-' + Math.floor(Math.random() * 10000),
      description: directDesc,
      cashIn: directType === 'receipt' ? amount : 0,
      cashOut: directType === 'payment' ? amount : 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: directMethod,
      createdBy: auth.currentUser?.uid || 'user'
    });`;

const replaceStr = `await addVoucher({
      voucherNumber: 'DIR-' + Math.floor(Math.random() * 10000),
      type: directType === 'receipt' ? 'receipt' : 'payment',
      partyType: 'other',
      amount: amount,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: directMethod,
      description: directDesc,
      createdBy: auth.currentUser?.uid || 'user'
    });`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, replaceStr);
    fs.writeFileSync('src/pages/CashBox.tsx', code);
    console.log('Patched CashBox direct transaction.');
} else {
    console.log('Target string not found.');
}
