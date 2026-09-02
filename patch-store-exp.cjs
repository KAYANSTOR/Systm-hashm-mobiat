const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

const target = `      batch.set(doc(collection(db, 'transactions')), {
        date: e.date, documentId: expRef.id, documentNumber: \`EXP-\${Date.now()}\`, documentType: 'expense',`;

const replace = `      const expTrans = transactions.filter(t => t.documentNumber?.startsWith('EXP-'));
      const nextId = expTrans.length > 0 
        ? Math.max(...expTrans.map(t => parseInt(t.documentNumber.replace(/\\D/g, '')) || 0)) + 1 
        : 1;

      batch.set(doc(collection(db, 'transactions')), {
        date: e.date, documentId: expRef.id, documentNumber: \`EXP-\${String(nextId).padStart(4, '0')}\`, documentType: 'expense',`;

code = code.replace(target, replace);
fs.writeFileSync('src/context/StoreContext.tsx', code);
