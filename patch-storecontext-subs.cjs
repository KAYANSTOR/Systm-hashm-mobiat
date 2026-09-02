const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

const targetUseEffect = `    const unsubVouchers = onSnapshot(query(collection(db, 'vouchers'), orderBy('createdAt', 'desc')), (snap) => {
      setVouchers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Voucher)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'vouchers'));

    return () => {
      unsubCustomers(); unsubSuppliers(); unsubInventory(); unsubInvoices(); unsubVouchers();
    };
  }, []);`;

const replacement = `    const unsubVouchers = onSnapshot(query(collection(db, 'vouchers'), orderBy('createdAt', 'desc')), (snap) => {
      setVouchers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Voucher)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'vouchers'));

    const unsubTransactions = onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc')), (snap) => {
      setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() } as Transaction)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'transactions'));

    const unsubExpenses = onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), (snap) => {
      setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() } as Expense)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'expenses'));

    return () => {
      unsubCustomers(); unsubSuppliers(); unsubInventory(); unsubInvoices(); unsubVouchers(); unsubTransactions(); unsubExpenses();
    };
  }, []);`;

code = code.replace(targetUseEffect, replacement);
fs.writeFileSync('src/context/StoreContext.tsx', code);
