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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">العملاء والموردين</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة بيانات وأرصدة العملاء والموردين لمعمل هاشم الأحمدي.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#208480] hover:bg-[#1a6b68] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>إضافة {activeTab === 'customers' ? 'عميل' : 'مورد'} جديد</span>
        </button>
      </div>

      <div className="bg-white p-2 rounded-xl border border-slate-200 inline-flex shadow-sm">
        <button 
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'customers' ? 'bg-[#208480] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-5 h-5" />
          العملاء
        </button>
        <button 
          onClick={() => setActiveTab('suppliers')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'suppliers' ? 'bg-[#208480] text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Factory className="w-5 h-5" />
          الموردين
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
           <div className="relative max-w-md">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث بالاسم أو رقم الهاتف..." 
              className="w-full pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeTab === 'customers' ? (
            <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
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
                    <td className="px-2 py-3 font-bold text-slate-800">{c.name}</td>
                    <td className="px-2 py-3 font-mono text-slate-600">{c.phone}</td>
                    <td className="px-2 py-3 text-slate-600">{c.address}</td>
                    <td className="px-2 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {c.type === 'wholesale' ? 'جملة' : 'مفرد'}
                      </span>
                    </td>
                    <td className="px-2 py-3 font-black text-rose-600" dir="ltr">{formatCurrency(c.balance)}</td>
                    <td className="px-2 py-3 flex items-center gap-2 justify-end">
                      <button onClick={() => openModal(c)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
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
                    <td className="px-2 py-3 font-bold text-slate-800">{s.name}</td>
                    <td className="px-2 py-3 text-slate-600">{s.company}</td>
                    <td className="px-2 py-3 font-mono text-slate-600">{s.phone}</td>
                    <td className="px-2 py-3 font-black text-emerald-600" dir="ltr">{formatCurrency(s.balance)}</td>
                    <td className="px-2 py-3 flex items-center gap-2 justify-end">
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
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center sm:p-4">
          <div className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-md overflow-hidden shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? 'تعديل بيانات' : 'إضافة'} {activeTab === 'customers' ? 'عميل' : 'مورد'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">الاسم</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">رقم الهاتف</label>
                <input required type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              </div>
              
              {activeTab === 'customers' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">العنوان</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">النوع</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option value="retail">مفرد</option>
                      <option value="wholesale">جملة</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'suppliers' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">الشركة/المعمل</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">الرصيد الافتتاحي (ريال يمني)</label>
                <input type="number" step="0.01" value={balance} onChange={e => setBalance(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-[#208480] hover:bg-[#1a6b68] text-white font-medium rounded-xl">حفظ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
