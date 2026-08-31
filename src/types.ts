export type Role = 'admin' | 'manager' | 'accountant' | 'sales';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  balance: number; // Positive means they owe us, negative means we owe them
  type: 'retail' | 'wholesale';
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  balance: number; // Positive means we owe them
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'fabric' | 'thread' | 'accessory' | 'machine_part';
  unit: 'meter' | 'roll' | 'piece' | 'kg';
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  color?: string;
  supplierId?: string;
  lastUpdated: string;
}

export interface InvoiceItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'sale' | 'purchase';
  partyId: string; // CustomerId for sale, SupplierId for purchase
  date: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  createdBy: string;
  notes?: string;
}

export interface Voucher {
  id: string;
  voucherNumber: string;
  type: 'receipt' | 'payment' | 'deferred'; // سند قبض، سند صرف، آجل
  partyType: 'customer' | 'supplier' | 'other';
  partyId?: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'bank' | 'check';
  referenceNumber?: string;
  description: string;
  createdBy: string;
}

export interface StoreState {
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  vouchers: Voucher[];
}
