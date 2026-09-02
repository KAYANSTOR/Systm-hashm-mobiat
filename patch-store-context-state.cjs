const fs = require('fs');
let content = fs.readFileSync('src/context/StoreContext.tsx', 'utf8');

// Imports
content = content.replace(
  "import { Customer, InventoryItem, Invoice, Supplier, Voucher } from '../types';",
  "import { Customer, InventoryItem, Invoice, Supplier, Voucher, Transaction, Expense } from '../types';"
);

// Types
content = content.replace(
  "vouchers: Voucher[];",
  "vouchers: Voucher[];\\n  transactions: Transaction[];\\n  expenses: Expense[];"
);

content = content.replace(
  "deleteVoucher: (id: string) => Promise<string | void>;\\n}",
  "deleteVoucher: (id: string) => Promise<string | void>;\\n  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => Promise<string | void>;\\n  deleteExpense: (id: string) => Promise<string | void>;\\n}"
);

// State
content = content.replace(
  "const [vouchers, setVouchers] = useState<Voucher[]>([]);",
  "const [vouchers, setVouchers] = useState<Voucher[]>([]);\\n  const [transactions, setTransactions] = useState<Transaction[]>([]);\\n  const [expenses, setExpenses] = useState<Expense[]>([]);"
);

// Subscriptions
const unsubVouchersCode = `const unsubVouchers = onSnapshot(query(collection(db, 'vouchers'), orderBy('createdAt', 'desc')), (snap) => {
      setVouchers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voucher)));
    });`;
const newUnsubs = `const unsubVouchers = onSnapshot(query(collection(db, 'vouchers'), orderBy('createdAt', 'desc')), (snap) => {
      setVouchers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Voucher)));
    });
    const unsubTransactions = onSnapshot(query(collection(db, 'transactions'), orderBy('createdAt', 'desc')), (snap) => {
      setTransactions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction)));
    });
    const unsubExpenses = onSnapshot(query(collection(db, 'expenses'), orderBy('createdAt', 'desc')), (snap) => {
      setExpenses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense)));
    });`;
content = content.replace(unsubVouchersCode, newUnsubs);

// Cleanup
content = content.replace(
  "unsubVouchers();\\n    };",
  "unsubVouchers();\\n      unsubTransactions();\\n      unsubExpenses();\\n    };"
);

// Context Provider Value
content = content.replace(
  "customers, suppliers, inventory, invoices, vouchers,",
  "customers, suppliers, inventory, invoices, vouchers, transactions, expenses,"
);
content = content.replace(
  "addVoucher, updateVoucher, deleteVoucher\\n    }}>",
  "addVoucher, updateVoucher, deleteVoucher,\\n      addExpense, deleteExpense\\n    }}>"
);

fs.writeFileSync('src/context/StoreContext.tsx', content, 'utf8');
console.log("State and Types patched in StoreContext");
