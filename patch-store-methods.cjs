const fs = require('fs');

let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// 1. Add where, getDocs to imports if not present
if (!content.includes('getDocs')) {
  content = content.replace(
    /import \{ collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, increment, writeBatch, getDoc \} from 'firebase\/firestore';/,
    "import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, increment, writeBatch, getDoc, getDocs, where } from 'firebase/firestore';"
  );
}

// 2. We will slice the content up to `const addInvoice` and after `deleteVoucher`, then insert our new block.
const startIndex = content.indexOf('const addInvoice = async (i:');
const endString = 'deleteVoucher = async (id: string) => {';
const searchIndex = content.indexOf(endString);
// Find the end of deleteVoucher function block
let endIndex = -1;
let openBraces = 0;
let started = false;
for (let i = searchIndex; i < content.length; i++) {
  if (content[i] === '{') { openBraces++; started = true; }
  if (content[i] === '}') { openBraces--; }
  if (started && openBraces === 0) {
    endIndex = i + 1;
    // skip the semicolon if it exists
    if (content[endIndex] === ';') endIndex++;
    break;
  }
}

if (startIndex > -1 && endIndex > -1) {
  const newFunctions = `  const addInvoice = async (i: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const batch = writeBatch(db);
      const invoiceRef = doc(collection(db, 'invoices'));
      
      batch.set(invoiceRef, {
        ...i,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (i.isApproved) {
        let debit = 0; let credit = 0; let cashIn = 0; let cashOut = 0;
        if (i.type === 'sale') {
           debit = i.total; credit = i.paidAmount; cashIn = i.paidAmount;
        } else {
           credit = i.total; debit = i.paidAmount; cashOut = i.paidAmount;
        }
        
        batch.set(doc(collection(db, 'transactions')), {
          date: i.date, documentId: invoiceRef.id, documentNumber: i.invoiceNumber, documentType: 'invoice',
          partyId: i.partyId, partyType: i.type === 'sale' ? 'customer' : 'supplier',
          debit, credit, cashIn, cashOut,
          description: i.invoiceType === 'SERVICE' ? 'فاتورة خدمة تطريز' : (i.type === 'sale' ? 'فاتورة مبيعات' : 'فاتورة مشتريات'),
          createdAt: serverTimestamp()
        });

        const partyBalanceChange = i.type === 'sale' ? (debit - credit) : (credit - debit);
        if (partyBalanceChange !== 0) {
           const partyRef = doc(db, i.type === 'sale' ? 'customers' : 'suppliers', i.partyId);
           batch.update(partyRef, { balance: increment(partyBalanceChange) });
        }

        if (i.invoiceType !== 'SERVICE') {
          i.items.forEach(item => {
            if (item.inventoryItemId) {
              const qtyChange = i.type === 'sale' ? -item.quantity : item.quantity;
              batch.update(doc(db, 'inventory', item.inventoryItemId), { quantity: increment(qtyChange) });
            }
          });
        }
      }
      await batch.commit(); return invoiceRef.id;
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'invoices'); throw e; }
  };

  const updateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      const docSnap = await getDoc(doc(db, 'invoices', id));
      if (!docSnap.exists()) return;
      const oldInvoice = docSnap.data() as Invoice;
      
      const transQuery = await getDocs(query(collection(db, 'transactions'), where('documentId', '==', id)));
      const batch = writeBatch(db);
      
      if (oldInvoice.isApproved) {
        let oldDebit = oldInvoice.type === 'sale' ? oldInvoice.total : oldInvoice.paidAmount;
        let oldCredit = oldInvoice.type === 'sale' ? oldInvoice.paidAmount : oldInvoice.total;
        let oldBalanceChange = oldInvoice.type === 'sale' ? (oldDebit - oldCredit) : (oldCredit - oldDebit);
        
        if (oldBalanceChange !== 0) {
          batch.update(doc(db, oldInvoice.type === 'sale' ? 'customers' : 'suppliers', oldInvoice.partyId), { balance: increment(-oldBalanceChange) });
        }

        if (oldInvoice.invoiceType !== 'SERVICE') {
          oldInvoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const qtyChange = oldInvoice.type === 'sale' ? item.quantity : -item.quantity;
              batch.update(doc(db, 'inventory', item.inventoryItemId), { quantity: increment(qtyChange) });
            }
          });
        }
        transQuery.docs.forEach(d => batch.delete(d.ref));
      }

      batch.update(doc(db, 'invoices', id), { ...data, updatedAt: serverTimestamp() });
      const isNowApproved = data.isApproved !== undefined ? data.isApproved : oldInvoice.isApproved;
      
      if (isNowApproved) {
        const newInvoice = { ...oldInvoice, ...data } as Invoice;
        let debit = newInvoice.type === 'sale' ? newInvoice.total : newInvoice.paidAmount;
        let credit = newInvoice.type === 'sale' ? newInvoice.paidAmount : newInvoice.total;
        let cashIn = newInvoice.type === 'sale' ? newInvoice.paidAmount : 0;
        let cashOut = newInvoice.type === 'sale' ? 0 : newInvoice.paidAmount;

        batch.set(doc(collection(db, 'transactions')), {
          date: newInvoice.date, documentId: id, documentNumber: newInvoice.invoiceNumber, documentType: 'invoice',
          partyId: newInvoice.partyId, partyType: newInvoice.type === 'sale' ? 'customer' : 'supplier',
          debit, credit, cashIn, cashOut,
          description: newInvoice.invoiceType === 'SERVICE' ? 'تعديل فاتورة خدمة تطريز' : (newInvoice.type === 'sale' ? 'تعديل فاتورة مبيعات' : 'تعديل فاتورة مشتريات'),
          createdAt: serverTimestamp()
        });

        let newBalanceChange = newInvoice.type === 'sale' ? (debit - credit) : (credit - debit);
        if (newBalanceChange !== 0) {
          batch.update(doc(db, newInvoice.type === 'sale' ? 'customers' : 'suppliers', newInvoice.partyId), { balance: increment(newBalanceChange) });
        }

        if (newInvoice.invoiceType !== 'SERVICE') {
          newInvoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const qtyChange = newInvoice.type === 'sale' ? -item.quantity : item.quantity;
              batch.update(doc(db, 'inventory', item.inventoryItemId), { quantity: increment(qtyChange) });
            }
          });
        }
      }
      await batch.commit(); return id;
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'invoices'); throw e; }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'invoices', id));
      if (!docSnap.exists()) return;
      const invoice = docSnap.data() as Invoice;
      
      const transQuery = await getDocs(query(collection(db, 'transactions'), where('documentId', '==', id)));
      const batch = writeBatch(db);
      batch.delete(doc(db, 'invoices', id));

      if (invoice.isApproved) {
        let oldDebit = invoice.type === 'sale' ? invoice.total : invoice.paidAmount;
        let oldCredit = invoice.type === 'sale' ? invoice.paidAmount : invoice.total;
        let oldBalanceChange = invoice.type === 'sale' ? (oldDebit - oldCredit) : (oldCredit - oldDebit);
        
        if (oldBalanceChange !== 0) {
          batch.update(doc(db, invoice.type === 'sale' ? 'customers' : 'suppliers', invoice.partyId), { balance: increment(-oldBalanceChange) });
        }

        if (invoice.invoiceType !== 'SERVICE') {
          invoice.items.forEach(item => {
            if (item.inventoryItemId) {
              const qtyChange = invoice.type === 'sale' ? item.quantity : -item.quantity;
              batch.update(doc(db, 'inventory', item.inventoryItemId), { quantity: increment(qtyChange) });
            }
          });
        }
      }
      transQuery.docs.forEach(d => batch.delete(d.ref));
      await batch.commit(); return id;
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'invoices'); throw e; }
  };

  const approveInvoice = async (id: string) => {
    return updateInvoice(id, { isApproved: true });
  };

  const addVoucher = async (v: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const batch = writeBatch(db);
      const voucherRef = doc(collection(db, 'vouchers'));
      
      batch.set(voucherRef, { ...v, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });

      let debit = 0; let credit = 0; let cashIn = 0; let cashOut = 0;
      if (v.partyType === 'customer') {
        if (v.type === 'receipt') { credit = v.amount; cashIn = v.amount; }
        else { debit = v.amount; cashOut = v.amount; }
      } else if (v.partyType === 'supplier') {
        if (v.type === 'payment') { debit = v.amount; cashOut = v.amount; }
        else { credit = v.amount; cashIn = v.amount; }
      }

      batch.set(doc(collection(db, 'transactions')), {
        date: v.date, documentId: voucherRef.id, documentNumber: v.voucherNumber, documentType: 'voucher',
        partyId: v.partyId || null, partyType: v.partyType,
        debit, credit, cashIn, cashOut, paymentMethod: v.paymentMethod || 'cash',
        description: v.description || (v.type === 'receipt' ? 'سند قبض' : 'سند صرف'),
        createdAt: serverTimestamp()
      });

      if (v.partyId && v.partyType !== 'other') {
        const balanceChange = v.partyType === 'customer' ? (debit - credit) : (credit - debit);
        if (balanceChange !== 0) {
          batch.update(doc(db, v.partyType === 'customer' ? 'customers' : 'suppliers', v.partyId), { balance: increment(balanceChange) });
        }
      }
      await batch.commit(); return voucherRef.id;
    } catch (e) { handleFirestoreError(e, OperationType.CREATE, 'vouchers'); throw e; }
  };

  const updateVoucher = async (id: string, data: Partial<Voucher>) => {
    try {
      const docSnap = await getDoc(doc(db, 'vouchers', id));
      if (!docSnap.exists()) return;
      const oldVoucher = docSnap.data() as Voucher;
      const newVoucher = { ...oldVoucher, ...data } as Voucher;

      const transQuery = await getDocs(query(collection(db, 'transactions'), where('documentId', '==', id)));
      const batch = writeBatch(db);
      
      // Revert old
      if (oldVoucher.partyId && oldVoucher.partyType !== 'other') {
        let oldDebit = 0; let oldCredit = 0;
        if (oldVoucher.partyType === 'customer') {
          if (oldVoucher.type === 'receipt') oldCredit = oldVoucher.amount; else oldDebit = oldVoucher.amount;
        } else {
          if (oldVoucher.type === 'payment') oldDebit = oldVoucher.amount; else oldCredit = oldVoucher.amount;
        }
        let oldBalanceChange = oldVoucher.partyType === 'customer' ? (oldDebit - oldCredit) : (oldCredit - oldDebit);
        if (oldBalanceChange !== 0) {
          batch.update(doc(db, oldVoucher.partyType === 'customer' ? 'customers' : 'suppliers', oldVoucher.partyId), { balance: increment(-oldBalanceChange) });
        }
      }
      transQuery.docs.forEach(d => batch.delete(d.ref));

      // Apply new
      batch.update(doc(db, 'vouchers', id), { ...data, updatedAt: serverTimestamp() });
      
      let debit = 0; let credit = 0; let cashIn = 0; let cashOut = 0;
      if (newVoucher.partyType === 'customer') {
        if (newVoucher.type === 'receipt') { credit = newVoucher.amount; cashIn = newVoucher.amount; }
        else { debit = newVoucher.amount; cashOut = newVoucher.amount; }
      } else if (newVoucher.partyType === 'supplier') {
        if (newVoucher.type === 'payment') { debit = newVoucher.amount; cashOut = newVoucher.amount; }
        else { credit = newVoucher.amount; cashIn = newVoucher.amount; }
      }

      batch.set(doc(collection(db, 'transactions')), {
        date: newVoucher.date, documentId: id, documentNumber: newVoucher.voucherNumber, documentType: 'voucher',
        partyId: newVoucher.partyId || null, partyType: newVoucher.partyType,
        debit, credit, cashIn, cashOut, paymentMethod: newVoucher.paymentMethod || 'cash',
        description: newVoucher.description || (newVoucher.type === 'receipt' ? 'سند قبض' : 'سند صرف'),
        createdAt: serverTimestamp()
      });

      if (newVoucher.partyId && newVoucher.partyType !== 'other') {
        const balanceChange = newVoucher.partyType === 'customer' ? (debit - credit) : (credit - debit);
        if (balanceChange !== 0) {
          batch.update(doc(db, newVoucher.partyType === 'customer' ? 'customers' : 'suppliers', newVoucher.partyId), { balance: increment(balanceChange) });
        }
      }

      await batch.commit(); return id;
    } catch (e) { handleFirestoreError(e, OperationType.UPDATE, 'vouchers'); throw e; }
  };

  const deleteVoucher = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'vouchers', id));
      if (!docSnap.exists()) return;
      const voucher = docSnap.data() as Voucher;

      const transQuery = await getDocs(query(collection(db, 'transactions'), where('documentId', '==', id)));
      const batch = writeBatch(db);
      
      if (voucher.partyId && voucher.partyType !== 'other') {
        let oldDebit = 0; let oldCredit = 0;
        if (voucher.partyType === 'customer') {
          if (voucher.type === 'receipt') oldCredit = voucher.amount; else oldDebit = voucher.amount;
        } else {
          if (voucher.type === 'payment') oldDebit = voucher.amount; else oldCredit = voucher.amount;
        }
        let oldBalanceChange = voucher.partyType === 'customer' ? (oldDebit - oldCredit) : (oldCredit - oldDebit);
        if (oldBalanceChange !== 0) {
          batch.update(doc(db, voucher.partyType === 'customer' ? 'customers' : 'suppliers', voucher.partyId), { balance: increment(-oldBalanceChange) });
        }
      }
      transQuery.docs.forEach(d => batch.delete(d.ref));
      batch.delete(doc(db, 'vouchers', id));
      await batch.commit(); return id;
    } catch (e) { handleFirestoreError(e, OperationType.DELETE, 'vouchers'); throw e; }
  };

  const addExpense = async (e: Omit<Expense, 'id' | 'createdAt'>) => {
    try {
      const batch = writeBatch(db);
      const expRef = doc(collection(db, 'expenses'));
      batch.set(expRef, { ...e, createdAt: serverTimestamp() });

      batch.set(doc(collection(db, 'transactions')), {
        date: e.date, documentId: expRef.id, documentNumber: \`EXP-\${Date.now()}\`, documentType: 'expense',
        debit: 0, credit: 0, cashIn: 0, cashOut: e.amount,
        paymentMethod: e.paymentMethod, description: e.description || (e.type === 'work' ? 'مصروف عمل' : 'مصروف شخصي'),
        createdAt: serverTimestamp()
      });
      await batch.commit(); return expRef.id;
    } catch (err) { handleFirestoreError(err, OperationType.CREATE, 'expenses'); throw err; }
  };

  const deleteExpense = async (id: string) => {
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'expenses', id));
      const transQuery = await getDocs(query(collection(db, 'transactions'), where('documentId', '==', id)));
      transQuery.docs.forEach(d => batch.delete(d.ref));
      await batch.commit(); return id;
    } catch (err) { handleFirestoreError(err, OperationType.DELETE, 'expenses'); throw err; }
  };
`;

  const finalContent = content.substring(0, startIndex) + newFunctions + content.substring(endIndex);
  fs.writeFileSync('src/context/StoreContext.tsx', finalContent, 'utf8');
  console.log("Functions patched successfully.");
} else {
  console.error("Could not find start or end index", startIndex, endIndex);
}

