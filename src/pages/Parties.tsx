import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, Search, UserCheck, Factory, Edit, Trash2, X } from 'lucide-react';
import { Customer, Supplier } from '../types';

export default function Parties() {
  const { customers, suppliers, addCustomer, updateCustomer, deleteCustomer, addSupplier, updateSupplier, deleteSupplier } = useStore();
  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>('customers');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <div className="space-y-6">
      <div className="page-header no-print">
        <div>
          <h2 className="page-title">العملاء والموردين</h2>
          <p className="page-subtitle">إدارة بيانات وأرصدة العملاء والموردين لمعمل هاشم الأحمدي.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="w-5 h-5" />
          <span>إضافة {activeTab === 'customers' ? 'عميل' : 'مورد'} جديد</span>
        </button>
      </div>

      <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-wrap shadow-sm gap-1">
        <button 
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'customers' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          العملاء
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'suppliers' ? 'bg-brand-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Factory className="w-5 h-5" />
          الموردين
        </button>
      </div>

      <div className="sm:bg-white sm:rounded-2xl sm:border sm:border-slate-200 sm:shadow-sm sm:overflow-hidden">
        <div className="card-header">
           <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث بالاسم أو رقم الهاتف..." 
              className="input-field pl-4 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          {activeTab === 'customers' ? (
            <table className="table-standard">
              <thead>
                <tr>
                  <th className="px-2 py-3">اسم العميل</th>
                  <th className="px-2 py-3">رقم الهاتف</th>
                  <th className="px-2 py-3">العنوان</th>
                  <th className="px-2 py-3">النوع</th>
                  <th className="px-2 py-3">الرصيد (دين)</th>
                  <th className="px-2 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.filter(c => c.name.includes(searchTerm) || c.phone.includes(searchTerm)).map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td data-label="اسم العميل" className="px-2 py-3 font-bold text-slate-800">{c.name}</td>
                    <td data-label="رقم الهاتف" className="px-2 py-3 font-mono text-slate-600">{c.phone}</td>
                    <td data-label="العنوان" className="px-2 py-3 text-slate-600">{c.address}</td>
                    <td data-label="النوع" className="px-2 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {c.type === 'wholesale' ? 'جملة' : 'مفرد'}
                      </span>
                    </td>
                    <td data-label="الرصيد" className="px-2 py-3 font-black text-rose-600" dir="ltr">{formatCurrency(c.balance)}</td>
                    <td data-label="الإجراءات" className="px-2 py-3 flex items-center gap-2 justify-end">
                      <button onClick={() => openModal(c)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table-standard">
              <thead>
                <tr>
                  <th className="px-2 py-3">اسم المورد</th>
                  <th className="px-2 py-3">الشركة/المعمل</th>
                  <th className="px-2 py-3">رقم الهاتف</th>
                  <th className="px-2 py-3">الرصيد (مطلوبات لنا)</th>
                  <th className="px-2 py-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppliers.filter(s => s.name.includes(searchTerm) || s.phone.includes(searchTerm)).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td data-label="اسم المورد" className="px-2 py-3 font-bold text-slate-800">{s.name}</td>
                    <td data-label="الشركة/المعمل" className="px-2 py-3 text-slate-600">{s.company}</td>
                    <td data-label="رقم الهاتف" className="px-2 py-3 font-mono text-slate-600">{s.phone}</td>
                    <td data-label="الرصيد" className="px-2 py-3 font-black text-emerald-600" dir="ltr">{formatCurrency(s.balance)}</td>
                    <td data-label="الإجراءات" className="px-2 py-3 flex items-center gap-2 justify-end">
                      <button onClick={() => openModal(s)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? 'تعديل بيانات' : 'إضافة'} {activeTab === 'customers' ? 'عميل' : 'مورد'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body space-y-4">
              <div>
                <label className="label">الاسم</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label">رقم الهاتف</label>
                <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="input-field" />
              </div>
              
              {activeTab === 'customers' && (
                <>
                  <div>
                    <label className="label">العنوان</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="label">النوع</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="input-field">
                      <option value="retail">مفرد</option>
                      <option value="wholesale">جملة</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'suppliers' && (
                <div>
                  <label className="label">الشركة/المعمل</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="input-field" />
                </div>
              )}

              <div>
                <label className="label">الرصيد الافتتاحي (ريال يمني)</label>
                <input type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} className="input-field" />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-outline">إلغاء</button>
                <button type="submit" className="btn-primary">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
