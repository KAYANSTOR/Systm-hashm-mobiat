import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Customer, InventoryItem, Invoice, Supplier, Voucher, Transaction, Expense } from '../types';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, increment, writeBatch, getDoc, getDocs, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface StoreContextType {
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  vouchers: Voucher[];
  transactions: Transaction[];
  expenses: Expense[];
  
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<string | void>;
  deleteCustomer: (id: string) => Promise<string | void>;

  addSupplier: (s: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string | void>;
  updateSupplier: (id: string, data: Partial<Supplier>) => Promise<string | void>;
  deleteSupplier: (id: string) => Promise<string | void>;

  addInventoryItem: (i: Omit<InventoryItem, 'id' | 'lastUpdated'>) => Promise<string | void>;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => Promise<string | void>;
  deleteInventoryItem: (id: string) => Promise<string | void>;

  addInvoice: (i: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateInvoice: (id: string, data: Partial<Invoice>) => Promise<string | void>;
  deleteInvoice: (id: string) => Promise<string | void>;
  approveInvoice: (id: string) => Promise<string | void>;

  addVoucher: (v: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateVoucher: (id: string, data: Partial<Voucher>) => Promise<string | void>;
  deleteVoucher: (id: string) => Promise<string | void>;
  
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => Promise<string | void>;
  deleteExpense: (id: string) => Promise<string | void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const unsubCustomers = onSnapshot(query(collection(db, 'customers'), orderBy('createdAt', 'desc')), (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Customer)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'customers'));

    const unsubSuppliers = onSnapshot(query(collection(db, 'suppliers'), orderBy('createdAt', 'desc')), (snap) => {
      setSuppliers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Supplier)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'suppliers'));

    const unsubInventory = onSnapshot(query(collection(db, 'inventory'), orderBy('lastUpdated', 'desc')), (snap) => {
      setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() } as InventoryItem)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'inventory'));

    const unsubInvoices = onSnapshot(query(collection(db, 'invoices'), orderBy('createdAt', 'desc')), (snap) => {
      setInvoices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice)));
    }, (error) => handleFirestoreError(error, OperationType.GET, 'invoices'));

    const unsubVouchers = onSnapshot(query(collection(db, 'vouchers'), orderBy('createdAt', 'desc')), (snap) => {
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
  }, []);

  const addCustomer = async (c: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'customers'), {
        ...c,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'customers');
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>) => {
    try {
      await updateDoc(doc(db, 'customers', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'customers');
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'customers', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'customers');
    }
  };

  const addSupplier = async (s: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'suppliers'), {
        ...s,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'suppliers');
    }
  };

  const updateSupplier = async (id: string, data: Partial<Supplier>) => {
    try {
      await updateDoc(doc(db, 'suppliers', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'suppliers');
    }
  };

  const deleteSupplier = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'suppliers', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'suppliers');
    }
  };

  const addInventoryItem = async (i: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      await addDoc(collection(db, 'inventory'), {
        ...i,
        lastUpdated: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'inventory');
    }
  };

  const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => {
    try {
      await updateDoc(doc(db, 'inventory', id), {
        ...data,
        lastUpdated: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'inventory');
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'inventory', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'inventory');
    }
  };

    const addInvoice = async (i: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
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
          paymentMethod: (i as any).paymentMethod || 'cash',
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
      } else if (v.partyType === 'other') {
        if (v.type === 'receipt') { cashIn = v.amount; }
        else if (v.type === 'payment') { cashOut = v.amount; }
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
      } else if (newVoucher.partyType === 'other') {
        if (newVoucher.type === 'receipt') { cashIn = newVoucher.amount; }
        else if (newVoucher.type === 'payment') { cashOut = newVoucher.amount; }
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

      const expTrans = transactions.filter(t => t.documentNumber?.startsWith('EXP-'));
      const nextId = expTrans.length > 0 
        ? Math.max(...expTrans.map(t => ( (() => { const n = parseInt(t.documentNumber.replace(/\D/g, '')); return n < 1000000000 ? (n || 0) : 0; })() ))) + 1 
        : 1;

      batch.set(doc(collection(db, 'transactions')), {
        date: e.date, documentId: expRef.id, documentNumber: `EXP-${String(nextId).padStart(4, '0')}`, documentType: 'expense',
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


  return (
    <StoreContext.Provider value={{
      customers, suppliers, inventory, invoices, vouchers, transactions, expenses,
      addCustomer, updateCustomer, deleteCustomer,
      addSupplier, updateSupplier, deleteSupplier,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
      addInvoice, updateInvoice, deleteInvoice, approveInvoice,
      addVoucher, updateVoucher, deleteVoucher,
      addExpense, deleteExpense
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
