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
  minQuantity?: number;
  color?: string;
  supplierId?: string;
  lastUpdated: string;
}

export interface InvoiceItem {
  id: string;
  inventoryItemId?: string; // اختياري للخدمات
  name: string; // اسم المنتج أو الخدمة
  description?: string; // وصف الخدمة
  quantity: number;
  unit?: string; // وحدة القياس للخدمات (وار، متر، قطعة...)
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: 'sale' | 'purchase';
  paymentType?: 'cash' | 'deferred' | 'partial';
  invoiceType?: 'PRODUCT_SALE' | 'SERVICE'; // التمييز بين بيع البضاعة وخدمة التطريز
  partyId: string; // CustomerId for sale, SupplierId for purchase
  date: string;
  items: InvoiceItem[];
  subTotal: number;
  discount: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'paid' | 'partial' | 'unpaid';
  isApproved?: boolean;
  createdBy: string;
  signature?: string;
  notes?: string;
}

export interface Voucher {
  id: string;
  voucherNumber: string;
  type: 'receipt' | 'payment' | 'deferred' | 'journal'; // سند قبض، سند صرف، آجل
  partyType: 'customer' | 'supplier' | 'other';
  partyId?: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'remittance' | 'jeeb' | 'e_wallet';
  referenceNumber?: string;
  description: string;
  createdBy: string;
  signature?: string;
}


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
  
  paymentMethod?: 'cash' | 'remittance' | 'jeeb' | 'e_wallet';
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
  paymentMethod: 'cash' | 'remittance' | 'jeeb' | 'e_wallet' | string;
  reference?: string;
  createdAt: any;
}

export interface CompanySettings {
  shortName: string;       // الاحمدي
  fullName: string;        // معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني
  address: string;         // صنعاء - شارع الزبيري - مقابل وزارة الدفاع
  phone1: string;
  phone2: string;
  logoUrl: string;         // /logo.svg or remote URL
  footerNote?: string;
  taxNumber?: string;
  currency?: string;       // ريال يمني
}

export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  shortName: 'الاحمدي',
  fullName: 'معامل هاشم الأحمدي للتصميم والتطريز الإلكتروني',
  address: 'صنعاء - شارع الزبيري - مقابل وزارة الدفاع',
  phone1: '770 447 441',
  phone2: '730 447 441',
  logoUrl: '/logo.svg',
  footerNote: '',
  taxNumber: '',
  currency: 'ريال يمني',
};

export interface StoreState {
  customers: Customer[];
  suppliers: Supplier[];
  inventory: InventoryItem[];
  invoices: Invoice[];
  vouchers: Voucher[];
  transactions: Transaction[];
  expenses: Expense[];
  companySettings: CompanySettings;
}
