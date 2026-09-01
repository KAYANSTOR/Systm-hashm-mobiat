import React, { useState } from 'react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, Check, Search, FileText, ArrowDownRight, ArrowUpRight, X, Trash2, CheckCircle, Pencil } from 'lucide-react';
import { InvoiceItem, Invoice } from '../types';
import InvoicePrintTemplate from '../components/InvoicePrintTemplate';

export default function Sales() {
  const { invoices, customers, suppliers, inventory, addInvoice, updateInvoice, deleteInvoice, approveInvoice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [invoiceType, setInvoiceType] = useState<'sale' | 'purchase'>('sale');
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPartyName, setSelectedPartyName] = useState('');
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [partyId, setPartyId] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [paidAmount, setPaidAmount] = useState('0');
  const [notes, setNotes] = useState('');

  // Item selector state
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemPrice, setItemPrice] = useState('');

  const openModal = (type: 'sale' | 'purchase') => {
    setEditingInvoiceId(null);
    setInvoiceType(type);
    const nextId = invoices.length > 0 
      ? Math.max(...invoices.map(i => parseInt(i.invoiceNumber.replace(/\D/g, '')) || 0)) + 1 
      : 1;
    setInvoiceNumber(String(nextId).padStart(3, '0'));
    setPartyId('');
    setDate(new Date().toISOString().split('T')[0]);
    setItems([]);
    setDiscount('0');
    setPaidAmount('0');
    setNotes('');
    setIsModalOpen(true);
  };

  const openEditModal = (inv: Invoice) => {
    if (inv.isApproved) {
      alert('لا يمكن تعديل الفاتورة بعد اعتمادها.');
      return;
    }
    setEditingInvoiceId(inv.id);
    setInvoiceType(inv.type);
    setInvoiceNumber(inv.invoiceNumber);
    setPartyId(inv.partyId);
    setDate(inv.date);
    setItems(inv.items);
    setDiscount(inv.discount.toString());
    setPaidAmount(inv.paidAmount.toString());
    setNotes(inv.notes || '');
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const invItem = inventory.find(i => i.id === selectedItemId);
    if (!invItem) return;

    const qty = parseFloat(itemQuantity) || 1;
    const price = parseFloat(itemPrice) || (invoiceType === 'sale' ? invItem.sellingPrice : invItem.costPrice);
    
    setItems(prev => [...prev, {
      id: Math.random().toString(),
      inventoryItemId: invItem.id,
      name: invItem.name,
      quantity: qty,
      unitPrice: price,
      total: qty * price
    }]);

    setSelectedItemId('');
    setItemQuantity('1');
    setItemPrice('');
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subTotal - (parseFloat(discount) || 0);
  const remaining = total - (parseFloat(paidAmount) || 0);
  const status = remaining <= 0 ? 'paid' : (parseFloat(paidAmount) > 0 ? 'partial' : 'unpaid');

  const handleSave = async (isApproved: boolean) => {
    if (items.length === 0) return alert('يجب إضافة مادة واحدة على الأقل');
    if (!partyId) return alert('يجب اختيار الطرف');

    const invoiceData = {
      invoiceNumber,
      type: invoiceType,
      partyId,
      date,
      items,
      subTotal,
      discount: parseFloat(discount) || 0,
      total,
      paidAmount: parseFloat(paidAmount) || 0,
      remainingAmount: remaining,
      status,
      isApproved,
      notes
    };

    if (editingInvoiceId) {
      await updateInvoice(editingInvoiceId, invoiceData);
    } else {
      const newId = await addInvoice({
        ...invoiceData,
        createdBy: auth.currentUser?.uid || 'user',
      });
      
      const party = invoiceData.type === 'sale' ? customers.find(c => c.id === invoiceData.partyId) : suppliers.find(s => s.id === invoiceData.partyId);
      
      setSelectedInvoice({
        id: newId,
        ...invoiceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as any);
      setSelectedPartyName(party ? party.name : '');
    }
    setIsModalOpen(false);
    setEditingInvoiceId(null);
  };
  const filteredInvoices = invoices.filter(inv => inv.invoiceNumber.includes(searchTerm));

  return (
    <div className="space-y-6">
      <div className="page-header no-print">
        <div>
          <h2 className="page-title">المبيعات والمشتريات (الفواتير)</h2>
          <p className="page-subtitle">إنشاء فواتير بيع أو شراء واستعراض الحركات السابقة.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal('sale')} className="btn-primary">
            <Plus className="w-5 h-5" />
            <span>فاتورة مبيعات جديدة</span>
          </button>
          <button onClick={() => openModal('purchase')} className="btn-secondary">
            <Plus className="w-5 h-5" />
            <span>فاتورة مشتريات جديدة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100/60 shadow-sm overflow-hidden">
          <div className="card-header">
             <div className="relative max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="بحث برقم الفاتورة..." 
                className="input-field pl-4 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="table-container">
<table className="table-standard">
              <thead>
                <tr>
                  <th className="px-2 py-3">رقم الفاتورة</th>
                  <th className="px-2 py-3">التاريخ</th>
                  <th className="px-2 py-3">النوع</th>
                  <th className="px-2 py-3">الطرف (عميل/مورد)</th>
                  <th className="px-2 py-3">الإجمالي</th>
                  <th className="px-2 py-3">المدفوع</th>
                  <th className="px-2 py-3">المتبقي</th>
                  <th className="px-2 py-3">الحالة</th>
                  <th className="px-2 py-3 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const partyName = inv.type === 'sale' 
                    ? customers.find(c => c.id === inv.partyId)?.name 
                    : suppliers.find(s => s.id === inv.partyId)?.name;

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td data-label="رقم الفاتورة" className="px-2 py-3 font-mono font-bold text-slate-700">{inv.invoiceNumber}</td>
                      <td data-label="التاريخ" className="px-2 py-3 text-slate-600">{formatDate(inv.date)}</td>
                      <td data-label="النوع" className="px-2 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          inv.type === 'sale' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {inv.type === 'sale' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {inv.type === 'sale' ? 'مبيعات' : 'مشتريات'}
                        </span>
                      </td>
                      <td data-label="الطرف" className="px-2 py-3 font-bold text-slate-800">{partyName || '<غير معروف>'}</td>
                      <td data-label="الإجمالي" className="px-2 py-3 font-black text-slate-900" dir="ltr">{formatCurrency(inv.total)}</td>
                      <td data-label="المدفوع" className="px-2 py-3 text-emerald-600 font-bold" dir="ltr">{formatCurrency(inv.paidAmount)}</td>
                      <td data-label="المتبقي" className="px-2 py-3 text-rose-600 font-bold" dir="ltr">{formatCurrency(inv.remainingAmount)}</td>
                      <td data-label="الحالة" className="px-2 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                           inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                           inv.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status === 'paid' ? 'مدفوع' : inv.status === 'partial' ? 'مدفوع جزئياً' : 'غير مدفوع'}
                        </span>
                        {!inv.isApproved && (
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 mr-2">
                            مسودة
                          </span>
                        )}
                      </td>
                      <td data-label="إجراءات" className="px-2 py-3 text-center">
                        {!inv.isApproved && (
                          <>
                            <button 
                              onClick={async () => {
                                if(confirm('هل أنت متأكد من اعتماد هذه الفاتورة؟ سيتم ترحيلها إلى الحسابات والمخزن.')) await approveInvoice(inv.id);
                              }} 
                              className="text-amber-500 hover:text-emerald-600 p-1.5 transition-colors mr-1 bg-amber-50 hover:bg-emerald-50 rounded-lg" 
                              title="اعتماد الفاتورة وترحيلها"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => openEditModal(inv)}
                              className="text-slate-400 hover:text-blue-600 p-1.5 transition-colors mr-2 bg-slate-50 hover:bg-blue-50 rounded-lg" 
                              title="تعديل الفاتورة"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => {
                            const party = inv.type === 'sale' ? customers.find(c => c.id === inv.partyId) : suppliers.find(s => s.id === inv.partyId);
                            setSelectedPartyName(party?.name || 'غير محدد');
                            setSelectedInvoice(inv);
                          }}
                          className="text-slate-400 hover:text-brand-500 p-1.5 transition-colors mr-2 bg-slate-50 hover:bg-teal-50 rounded-lg" 
                          title="عرض وطباعة الفاتورة"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                        <button onClick={async () => {
                          if(confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) await deleteInvoice(inv.id);
                        }} className="text-red-400 hover:text-red-600 p-1.5 transition-colors bg-red-50 hover:bg-red-100 rounded-lg" title="حذف الفاتورة">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-slate-500 sm:!justify-center !justify-center">لا توجد فواتير مطابقة للبحث.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center sm:p-4 backdrop-blur-sm">
          <div className="bg-white sm:rounded-3xl w-full h-full sm:h-[90vh] sm:max-h-[800px] max-w-4xl overflow-hidden shadow-2xl flex flex-col border border-slate-100">
            <div className="modal-header">
              <h3 className="font-bold text-xl text-slate-800">
                إنشاء فاتورة {invoiceType === 'sale' ? 'مبيعات' : 'مشتريات'} جديدة
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">رقم الفاتورة</label>
                  <input required type="text" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">التاريخ</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{invoiceType === 'sale' ? 'العميل' : 'المورد'}</label>
                  <select required value={partyId} onChange={e => setPartyId(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                    <option value="">اختر {invoiceType === 'sale' ? 'العميل' : 'المورد'}...</option>
                    {invoiceType === 'sale' ? (
                      customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                    ) : (
                      suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)
                    )}
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50/50 p-4 border-b border-slate-200 flex flex-wrap items-end gap-3">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-slate-700 mb-2">المادة / الصنف</label>
                    <select value={selectedItemId} onChange={e => {
                        setSelectedItemId(e.target.value);
                        const item = inventory.find(i => i.id === e.target.value);
                        if (item) setItemPrice(invoiceType === 'sale' ? item.sellingPrice.toString() : item.costPrice.toString());
                      }} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option value="">اختر مادة...</option>
                      {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.code})</option>)}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-bold text-slate-700 mb-2">الكمية</label>
                    <input type="number" min="0.1" step="0.1" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-slate-700 mb-2">السعر (الإفرادي)</label>
                    <input type="number" step="0.01" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                  <button type="button" onClick={handleAddItem} disabled={!selectedItemId} className="px-6 py-2 bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 font-bold rounded-[12px] disabled:opacity-50 transition-colors">إضافة</button>
                </div>
                <div className="table-container">
<table className="table-standard">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 font-bold">المادة</th>
                        <th className="px-4 py-3 font-bold text-center">الكمية</th>
                        <th className="px-4 py-3 font-bold">السعر</th>
                        <th className="px-4 py-3 font-bold">الإجمالي</th>
                        <th className="px-4 py-3 font-bold w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">{item.name}</td>
                          <td data-label="الكمية" className="px-4 py-3 text-center">{item.quantity}</td>
                          <td data-label="السعر" className="px-4 py-3 text-slate-600" dir="ltr">{formatCurrency(item.unitPrice)}</td>
                          <td data-label="الإجمالي" className="px-4 py-3 font-bold text-brand-500" dir="ltr">{formatCurrency(item.total)}</td>
                          <td data-label="إجراءات" className="px-4 py-3">
                            <button type="button" onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4"/></button>
                          </td>
                        </tr>
                      ))}
                      {items.length === 0 && (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">لم يتم إضافة مواد للفاتورة بعد</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات الفاتورة</label>
                  <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"></textarea>
                </div>
                
                <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                    <span>المجموع الفرعي:</span>
                    <span dir="ltr" className="text-slate-800">{formatCurrency(subTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-600">
                    <span>الخصم:</span>
                    <input type="number" step="0.01" value={discount} onChange={e => setDiscount(e.target.value)} className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-[12px] text-left focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" dir="ltr" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-lg font-black text-slate-900">
                    <span>الإجمالي الصافي:</span>
                    <span dir="ltr" className="text-brand-500">{formatCurrency(total)}</span>
                  </div>
                  
                  <div className="pt-4 flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>المبلغ المدفوع (مقبوض):</span>
                    <input type="number" step="0.01" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} className="w-32 px-3 py-2 border border-brand-500/30 bg-brand-500/5 rounded-[12px] text-left focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-brand-500 font-bold" dir="ltr" />
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-rose-600">
                    <span>المتبقي (آجل):</span>
                    <span dir="ltr" className="font-black">{formatCurrency(remaining)}</span>
                  </div>
                </div>
              </div>
            </form>
            <div className="p-6 mt-auto border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/30">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-2xl transition-colors">إلغاء</button>
              <button type="button" onClick={() => handleSave(false)} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                <span>حفظ كمسودة</span>
              </button>
              <button type="button" onClick={() => handleSave(true)} className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
                <Check className="w-5 h-5" />
                <span>حفظ واعتماد</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedInvoice && (
        <InvoicePrintTemplate
          invoice={selectedInvoice}
          partyName={selectedPartyName}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
}
