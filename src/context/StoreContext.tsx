import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Customer, InventoryItem, Invoice, Supplier, Voucher } from '../types';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, orderBy, increment, writeBatch, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface StoreContextType {
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  vouchers: Voucher[];
  
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

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

    return () => {
      unsubCustomers(); unsubSuppliers(); unsubInventory(); unsubInvoices(); unsubVouchers();
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
        if (i.remainingAmount > 0) {
          if (i.type === 'sale') {
            const partyRef = doc(db, 'customers', i.partyId);
            batch.update(partyRef, { balance: increment(i.remainingAmount) });
          } else {
            const partyRef = doc(db, 'suppliers', i.partyId);
            batch.update(partyRef, { balance: increment(i.remainingAmount) });
          }
        }

        i.items.forEach(item => {
          const invRef = doc(db, 'inventory', item.inventoryItemId);
          const qtyChange = i.type === 'sale' ? -item.quantity : item.quantity;
          batch.update(invRef, { quantity: increment(qtyChange) });
        });
      }

      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'invoices');
    }
  };

  const updateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      const docSnap = await getDoc(doc(db, 'invoices', id));
      if (!docSnap.exists()) return;
      const oldInvoice = docSnap.data() as Invoice;

      const batch = writeBatch(db);
      const invoiceRef = doc(db, 'invoices', id);

      // Revert old invoice if it was approved
      if (oldInvoice.isApproved) {
        if (oldInvoice.remainingAmount > 0) {
          const partyRef = doc(db, oldInvoice.type === 'sale' ? 'customers' : 'suppliers', oldInvoice.partyId);
          batch.update(partyRef, { balance: increment(-oldInvoice.remainingAmount) });
        }
        oldInvoice.items.forEach(item => {
          const invRef = doc(db, 'inventory', item.inventoryItemId);
          const qtyChange = oldInvoice.type === 'sale' ? item.quantity : -item.quantity;
          batch.update(invRef, { quantity: increment(qtyChange) });
        });
      }

      batch.update(invoiceRef, { ...data, updatedAt: serverTimestamp() });

      // Apply new invoice if it is approved now
      const isNowApproved = data.isApproved !== undefined ? data.isApproved : oldInvoice.isApproved;
      
      if (isNowApproved) {
        const newInvoice = { ...oldInvoice, ...data } as Invoice;
        
        if (newInvoice.remainingAmount > 0) {
          const partyRef = doc(db, newInvoice.type === 'sale' ? 'customers' : 'suppliers', newInvoice.partyId);
          batch.update(partyRef, { balance: increment(newInvoice.remainingAmount) });
        }
        newInvoice.items.forEach(item => {
          const invRef = doc(db, 'inventory', item.inventoryItemId);
          const qtyChange = newInvoice.type === 'sale' ? -item.quantity : item.quantity;
          batch.update(invRef, { quantity: increment(qtyChange) });
        });
      }

      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'invoices');
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'invoices', id));
      if (!docSnap.exists()) return;
      const invoice = docSnap.data() as Invoice;

      const batch = writeBatch(db);
      const invoiceRef = doc(db, 'invoices', id);
      batch.delete(invoiceRef);

      if (invoice.isApproved) {
        if (invoice.remainingAmount > 0) {
          if (invoice.type === 'sale') {
            const partyRef = doc(db, 'customers', invoice.partyId);
            batch.update(partyRef, { balance: increment(-invoice.remainingAmount) });
          } else {
            const partyRef = doc(db, 'suppliers', invoice.partyId);
            batch.update(partyRef, { balance: increment(-invoice.remainingAmount) });
          }
        }

        invoice.items.forEach(item => {
          const invRef = doc(db, 'inventory', item.inventoryItemId);
          const qtyChange = invoice.type === 'sale' ? item.quantity : -item.quantity;
          batch.update(invRef, { quantity: increment(qtyChange) });
        });
      }

      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'invoices');
    }
  };

  const approveInvoice = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'invoices', id));
      if (!docSnap.exists()) return;
      const invoice = docSnap.data() as Invoice;

      if (invoice.isApproved) return; // Already approved

      const batch = writeBatch(db);
      const invoiceRef = doc(db, 'invoices', id);
      batch.update(invoiceRef, { isApproved: true, updatedAt: serverTimestamp() });

      if (invoice.remainingAmount > 0) {
        if (invoice.type === 'sale') {
          const partyRef = doc(db, 'customers', invoice.partyId);
          batch.update(partyRef, { balance: increment(invoice.remainingAmount) });
        } else {
          const partyRef = doc(db, 'suppliers', invoice.partyId);
          batch.update(partyRef, { balance: increment(invoice.remainingAmount) });
        }
      }

      invoice.items.forEach(item => {
        const invRef = doc(db, 'inventory', item.inventoryItemId);
        const qtyChange = invoice.type === 'sale' ? -item.quantity : item.quantity;
        batch.update(invRef, { quantity: increment(qtyChange) });
      });

      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'invoices');
    }
  };

  const addVoucher = async (v: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const batch = writeBatch(db);
      const voucherRef = doc(collection(db, 'vouchers'));
      
      batch.set(voucherRef, {
        ...v,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      if (v.partyId) {
        if (v.partyType === 'customer') {
          const amountChange = v.type === 'receipt' ? -v.amount : v.amount;
          const partyRef = doc(db, 'customers', v.partyId);
          batch.update(partyRef, { balance: increment(amountChange) });
        } else if (v.partyType === 'supplier') {
          const amountChange = v.type === 'payment' ? -v.amount : v.amount;
          const partyRef = doc(db, 'suppliers', v.partyId);
          batch.update(partyRef, { balance: increment(amountChange) });
        }
      }

      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'vouchers');
    }
  };

  const updateVoucher = async (id: string, data: Partial<Voucher>) => {
    try {
      await updateDoc(doc(db, 'vouchers', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'vouchers');
    }
  };

  const deleteVoucher = async (id: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'vouchers', id));
      if (!docSnap.exists()) return;
      const voucher = docSnap.data() as Voucher;

      const batch = writeBatch(db);
      const voucherRef = doc(db, 'vouchers', id);
      batch.delete(voucherRef);

      if (voucher.partyId) {
        if (voucher.partyType === 'customer') {
          const amountChange = voucher.type === 'receipt' ? voucher.amount : -voucher.amount;
          const partyRef = doc(db, 'customers', voucher.partyId);
          batch.update(partyRef, { balance: increment(amountChange) });
        } else if (voucher.partyType === 'supplier') {
          const amountChange = voucher.type === 'payment' ? voucher.amount : -voucher.amount;
          const partyRef = doc(db, 'suppliers', voucher.partyId);
          batch.update(partyRef, { balance: increment(amountChange) });
        }
      }

      await batch.commit();
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'vouchers');
    }
  };

  return (
    <StoreContext.Provider value={{
      customers, suppliers, inventory, invoices, vouchers,
      addCustomer, updateCustomer, deleteCustomer,
      addSupplier, updateSupplier, deleteSupplier,
      addInventoryItem, updateInventoryItem, deleteInventoryItem,
      addInvoice, updateInvoice, deleteInvoice, approveInvoice,
      addVoucher, updateVoucher, deleteVoucher
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
