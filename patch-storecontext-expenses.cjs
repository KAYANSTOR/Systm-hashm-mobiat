const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

const interfaceTarget = `  addVoucher: (v: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateVoucher: (id: string, data: Partial<Voucher>) => Promise<string | void>;
  deleteVoucher: (id: string) => Promise<string | void>;
}`;

const interfaceReplacement = `  addVoucher: (v: Omit<Voucher, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateVoucher: (id: string, data: Partial<Voucher>) => Promise<string | void>;
  deleteVoucher: (id: string) => Promise<string | void>;
  
  addExpense: (e: Omit<Expense, 'id' | 'createdAt'>) => Promise<string | void>;
  deleteExpense: (id: string) => Promise<string | void>;
}`;

code = code.replace(interfaceTarget, interfaceReplacement);

const providerTarget = `      addInvoice, updateInvoice, deleteInvoice, approveInvoice,
      addVoucher, updateVoucher, deleteVoucher
    }}>`;

const providerReplacement = `      addInvoice, updateInvoice, deleteInvoice, approveInvoice,
      addVoucher, updateVoucher, deleteVoucher,
      addExpense, deleteExpense
    }}>`;

code = code.replace(providerTarget, providerReplacement);

fs.writeFileSync('src/context/StoreContext.tsx', code);
