const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

if (!content.includes('export interface Transaction')) {
  const transactionCode = `
export interface Transaction {
  id: string;
  date: string;
  documentId: string;
  documentNumber: string;
  documentType: 'invoice' | 'voucher' | 'expense';
  
  partyId?: string;
  partyType?: 'customer' | 'supplier';
  
  debit: number;
  credit: number;
  
  cashIn: number;
  cashOut: number;
  
  paymentMethod?: string;
  description: string;
  createdAt: any;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  type: 'work' | 'personal';
  description: string;
  amount: number;
  paymentMethod: string;
  reference?: string;
  createdAt: any;
}
`;
  content = content.replace('export interface StoreState {', transactionCode + '\\nexport interface StoreState {');
  
  // Add to StoreState
  content = content.replace(/invoices: Invoice\[\];\s*vouchers: Voucher\[\];/g, 'invoices: Invoice[];\\n  vouchers: Voucher[];\\n  transactions: Transaction[];\\n  expenses: Expense[];');
  fs.writeFileSync('src/types.ts', content, 'utf8');
  console.log("types patched");
}
