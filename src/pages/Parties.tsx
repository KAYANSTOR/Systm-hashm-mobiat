import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, Search, UserCheck, Factory, Edit, Trash2, X, FileText, Users, TrendingUp, TrendingDown, Phone, MapPin, Building2 } from 'lucide-react';
import { Customer, Supplier, Transaction } from '../types';
import StatementPrintTemplate from '../components/StatementPrintTemplate';

export default function Parties() {
  const { customers, suppliers, addCustomer, updateCustomer, deleteCustomer, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statementParty, setStatementParty] = useState<Customer | Supplier | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<'retail' | 'wholesale'>('retail');
  const [company, setCompany] = useState('');
  const [balance, setBalance] = useState('');

  const openModal = (item?: Customer | Supplier) => {
    if (item) {
      setEditingId(item.id);
      setName(item.name);
      setPhone(item.phone);
      setBalance(item.balance.toString());
      if (activeTab === 'customers') {
        setAddress((item as Customer).address || '');
        setType((item as Customer).type || 'retail');
      } else {
        setCompany((item as Supplier).company || '');
      }
    } else {
      setEditingId(null);
      setName('');
      setPhone('');
      setAddress('');
      setCompany('');
      setBalance('0');
      setType('retail');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBalance = parseFloat(balance) || 0;
    
    if (activeTab === 'customers') {
      if (editingId) {
        await updateCustomer(editingId, { name, phone, address, balance: parsedBalance, type });
      } else {
        await addCustomer({ name, phone, address, balance: parsedBalance, type });
      }
    } else {
      if (editingId) {
        await updateSupplier(editingId, { name, phone, company, balance: parsedBalance });
      } else {
        await addSupplier({ name, phone, company, balance: parsedBalance });
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      if (activeTab === 'customers') await deleteCustomer(id);
      else await deleteSupplier(id);
    }
  };

  // Stats Calculations
  const filteredCustomers = customers.filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm));
  const filteredSuppliers = suppliers.filter(s => s.name.includes(searchTerm) || s.phone.includes(searchTerm));

  const totalCustomerDebt = customers.reduce((sum, c) => sum + (c.balance > 0 ? c.balance : 0), 0);
  const totalSupplierCredit = suppliers.reduce((sum, s) => sum + (s.balance > 0 ? s.balance : 0), 0);

  const getInitials = (n: string) => {
    return n.substring(0, 2);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">العملاء والموردين</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">إدارة بيانات وأرصدة العملاء والموردين لمعمل هاشم الأحمدي.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span>إضافة {activeTab === 'customers' ? 'عميل' : 'مورد'} جديد</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 no-print">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">إجمالي العملاء</p>
            <p className="text-2xl font-black text-slate-800">{customers.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">إجمالي المديونية (لنا)</p>
            <p className="text-2xl font-black text-rose-600" dir="ltr">{formatCurrency(totalCustomerDebt)}</p>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">إجمالي المطلوبات (علينا)</p>
            <p className="text-2xl font-black text-emerald-600" dir="ltr">{formatCurrency(totalSupplierCredit)}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col no-print">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => setActiveTab('customers')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'customers' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              العملاء
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'suppliers' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Factory className="w-5 h-5" />
              الموردين
            </button>
          </div>
          
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث بالاسم أو رقم الهاتف..." 
              className="input-field pl-4 pr-10 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content Table / Grid */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          {activeTab === 'customers' ? (
            <table className="table-standard w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-right">العميل</th>
                  <th className="px-6 py-4 text-right">معلومات التواصل</th>
                  <th className="px-6 py-4 text-right">النوع</th>
                  <th className="px-6 py-4 text-left">الرصيد (دين)</th>
                  <th className="px-6 py-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.length > 0 ? filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4" data-label="العميل">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-sm shrink-0">
                          {getInitials(c.name)}
                        </div>
                        <div className="font-bold text-slate-800">{c.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="معلومات التواصل">
                      <div className="flex flex-col gap-1 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5 font-mono"><Phone className="w-3.5 h-3.5 text-slate-400"/> {c.phone}</div>
                        {c.address && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400"/> {c.address}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4" data-label="النوع">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${c.type === 'wholesale' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {c.type === 'wholesale' ? 'جملة' : 'مفرد'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left font-black text-rose-600 text-lg tracking-tight" dir="ltr" data-label="الرصيد">
                      {formatCurrency(c.balance)}
                    </td>
                    <td className="px-6 py-4" data-label="الإجراءات">
                      <div className="flex items-center gap-2 justify-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setStatementParty(c)} className="btn-icon bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="كشف حساب"><FileText className="w-4 h-4"/></button>
                        <button onClick={() => openModal(c)} className="btn-icon bg-blue-50 text-blue-600 hover:bg-blue-100" title="تعديل"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(c.id)} className="btn-icon bg-rose-50 text-rose-600 hover:bg-rose-100" title="حذف"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      لا يوجد عملاء مطابقين للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="table-standard w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-right">المورد</th>
                  <th className="px-6 py-4 text-right">الشركة / المعمل</th>
                  <th className="px-6 py-4 text-right">معلومات التواصل</th>
                  <th className="px-6 py-4 text-left">الرصيد (مطلوبات لنا)</th>
                  <th className="px-6 py-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.length > 0 ? filteredSuppliers.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-4" data-label="المورد">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                          {getInitials(s.name)}
                        </div>
                        <div className="font-bold text-slate-800">{s.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700" data-label="الشركة">
                      {s.company ? (
                        <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4 text-slate-400"/> {s.company}</div>
                      ) : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-slate-600" data-label="معلومات التواصل">
                      <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400"/> {s.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-left font-black text-emerald-600 text-lg tracking-tight" dir="ltr" data-label="الرصيد">
                      {formatCurrency(s.balance)}
                    </td>
                    <td className="px-6 py-4" data-label="الإجراءات">
                      <div className="flex items-center gap-2 justify-end opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setStatementParty(s)} className="btn-icon bg-emerald-50 text-emerald-600 hover:bg-emerald-100" title="كشف حساب"><FileText className="w-4 h-4"/></button>
                        <button onClick={() => openModal(s)} className="btn-icon bg-blue-50 text-blue-600 hover:bg-blue-100" title="تعديل"><Edit className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(s.id)} className="btn-icon bg-rose-50 text-rose-600 hover:bg-rose-100" title="حذف"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      لا يوجد موردين مطابقين للبحث
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="font-black text-xl text-slate-800">
                {editingId ? 'تعديل بيانات' : 'إضافة'} {activeTab === 'customers' ? 'عميل' : 'مورد'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-span-1 md:col-span-2">
                  <label className="label">اسم {activeTab === 'customers' ? 'العميل' : 'المورد'}</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="الاسم الكامل" />
                </div>
                
                <div>
                  <label className="label">رقم الهاتف</label>
                  <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" placeholder="05XXXXXXXX" dir="ltr" />
                </div>
                
                {activeTab === 'customers' ? (
                  <>
                    <div>
                      <label className="label">النوع</label>
                      <select value={type} onChange={e => setType(e.target.value as any)} className="input-field">
                        <option value="retail">مفرد</option>
                        <option value="wholesale">جملة</option>
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="label">العنوان</label>
                      <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="input-field" placeholder="اسم المنطقة أو الشارع" />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="label">الشركة/المعمل</label>
                    <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input-field" placeholder="اسم الشركة (اختياري)" />
                  </div>
                )}

                <div className="col-span-1 md:col-span-2 p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <label className="label">الرصيد الافتتاحي (ريال يمني)</label>
                  <div className="flex gap-2 items-center">
                    <input type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} className="input-field font-mono text-xl py-3" dir="ltr" placeholder="0.00" />
                    <span className="font-bold text-slate-500 whitespace-nowrap">ر.ي</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    {activeTab === 'customers' 
                      ? 'الرصيد الموجب يعني أن العميل مدين لنا.'
                      : 'الرصيد الموجب يعني أننا مدينون للمورد.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">إلغاء</button>
                <button type="submit" className="btn-primary px-8">حفظ البيانات</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {statementParty && (
        <StatementModal party={statementParty} onClose={() => setStatementParty(null)} />
      )}
    </div>
  );
}

function StatementModal({ party, onClose }: { party: Customer | Supplier, onClose: () => void }) {
  const { transactions } = useStore();
  const [printMode, setPrintMode] = useState(false);
  
  const partyTransactions = transactions
    .filter(t => t.partyId === party.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  if (printMode) {
    return <StatementPrintTemplate party={party} transactions={partyTransactions} onClose={() => setPrintMode(false)} />;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center font-black text-xl shrink-0">
              {party.name.substring(0, 2)}
            </div>
            <div>
              <h3 className="font-black text-2xl text-slate-800 tracking-tight">
                كشف حساب
              </h3>
              <p className="text-slate-500 font-medium flex items-center gap-2">
                <span className="font-bold text-slate-700">{party.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                <span dir="ltr" className="font-mono">{party.phone}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex flex-col items-end flex-1 sm:flex-none">
              <span className="text-[11px] font-bold text-slate-400">الرصيد الحالي</span>
              <span dir="ltr" className={`font-black text-lg tracking-tight ${party.balance > 0 ? (('type' in party) ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-800'}`}>
                {formatCurrency(party.balance)}
              </span>
            </div>
            
            <button onClick={() => setPrintMode(true)} className="btn-primary h-full py-2.5 shadow-brand-500/30 shadow-lg">
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">طباعة الكشف</span>
            </button>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="p-0 overflow-y-auto flex-1 bg-slate-50/50">
          <table className="table-standard w-full w-full">
            <thead className="sticky top-0 bg-white/95 backdrop-blur shadow-sm z-10">
              <tr>
                <th className="px-6 py-4 text-right font-bold text-slate-600">التاريخ</th>
                <th className="px-6 py-4 text-right font-bold text-slate-600">رقم المستند</th>
                <th className="px-6 py-4 text-right font-bold text-slate-600">البيان</th>
                <th className="px-6 py-4 text-left font-bold text-slate-600">مدين (له)</th>
                <th className="px-6 py-4 text-left font-bold text-slate-600">دائن (عليه)</th>
                <th className="px-6 py-4 text-left font-bold text-slate-600">الرصيد المتراكم</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(() => {
                let runningBalance = 0;
                return partyTransactions.map((t, idx) => {
                  runningBalance += (t.partyType === 'supplier' ? (t.credit - t.debit) : (t.debit - t.credit));
                  return (
                    <tr key={t.id || idx} className="hover:bg-white transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-600" data-label="التاريخ">{formatDate(t.date)}</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700 text-sm" data-label="رقم المستند">
                        <span className="bg-slate-100 px-2 py-1 rounded-md">{t.documentNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-800" data-label="البيان">{t.description}</td>
                      <td className="px-6 py-4 text-left font-bold text-rose-600 font-mono" dir="ltr" data-label="مدين (له)">{t.debit > 0 ? formatCurrency(t.debit) : '-'}</td>
                      <td className="px-6 py-4 text-left font-bold text-emerald-600 font-mono" dir="ltr" data-label="دائن (عليه)">{t.credit > 0 ? formatCurrency(t.credit) : '-'}</td>
                      <td className="px-6 py-4 text-left font-black text-brand-700 font-mono bg-brand-50/30" dir="ltr" data-label="الرصيد">{formatCurrency(runningBalance)}</td>
                    </tr>
                  );
                });
              })()}
              {partyTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center text-slate-400">
                      <FileText className="w-12 h-12 mb-3 text-slate-300" />
                      <span className="font-bold">لا توجد حركات مالية مسجلة في كشف الحساب حتى الآن</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
