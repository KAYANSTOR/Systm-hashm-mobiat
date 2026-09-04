import { CustomDatePicker, CustomPartyPicker } from '../components/StatementFilters';
import React, { useState } from 'react';
import { auth } from '../firebase';
import { useStore } from '../context/StoreContext';
import { formatCurrency, formatDate } from '../lib/utils';
import { Plus, Check, Search, FileText, ArrowDownRight, ArrowUpRight, X, Trash2, CheckCircle, Pencil, ShoppingBag } from 'lucide-react';
import { InvoiceItem, Invoice } from '../types';
import InvoicePrintTemplate from '../components/InvoicePrintTemplate';

export default function Sales() {
  const { invoices, customers, suppliers, inventory, addInvoice, updateInvoice, deleteInvoice, approveInvoice } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
  const [invoiceType, setInvoiceType] = useState<'sale' | 'purchase'>('sale');
  const [salesType, setSalesType] = useState<'PRODUCT_SALE' | 'SERVICE'>('PRODUCT_SALE');
  
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedPartyName, setSelectedPartyName] = useState('');
  
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [partyId, setPartyId] = useState('');
  const [date, setDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [discount, setDiscount] = useState('0');
  const [paidAmount, setPaidAmount] = useState('0');
  const [paymentType, setPaymentType] = useState<'cash' | 'deferred' | 'partial'>('cash');
  const [notes, setNotes] = useState('');

  // Item selector state
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemPrice, setItemPrice] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceUnit, setServiceUnit] = useState('وار');

  const openModal = (type: 'sale' | 'purchase', sType: 'PRODUCT_SALE' | 'SERVICE' = 'PRODUCT_SALE') => {
    setSalesType(sType);
    setEditingInvoiceId(null);
    setInvoiceType(type);
    const typeInvoices = invoices.filter(i => i.type === type);
    const nextId = typeInvoices.length > 0 
      ? Math.max(...typeInvoices.map(i => ( (() => { const n = parseInt(i.invoiceNumber.replace(/\D/g, '')); return n < 1000000000 ? (n || 0) : 0; })() ))) + 1 
      : 1;
    const prefix = type === 'sale' ? 'INV' : 'PUR';
    setInvoiceNumber(`${prefix}-${String(nextId).padStart(4, '0')}`);
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
    if (inv.type === 'sale') setSalesType(inv.invoiceType || 'PRODUCT_SALE');
    setInvoiceNumber(inv.invoiceNumber);
    setPartyId(inv.partyId);
    setDate(inv.date);
    setItems(inv.items);
    setDiscount(inv.discount.toString());
    setPaidAmount(inv.paidAmount.toString());
    setPaymentType(inv.paymentType || (inv.remainingAmount <= 0 ? 'cash' : (inv.paidAmount > 0 ? 'partial' : 'deferred')));
    setNotes(inv.notes || '');
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    const qty = parseFloat(itemQuantity) || 1;
    const price = parseFloat(itemPrice) || 0;

    if (invoiceType === 'sale' && salesType === 'SERVICE') {
      if (!serviceName) return;
      setItems(prev => [...prev, {
        id: Math.random().toString(),
        inventoryItemId: 'SERVICE',
        name: serviceName,
        description: serviceDesc,
        unit: serviceUnit,
        quantity: qty,
        unitPrice: price,
        total: qty * price
      }]);
      setServiceName('');
      setServiceDesc('');
      setItemQuantity('1');
      setItemPrice('');
    } else {
      if (!selectedItemId) return;
      const invItem = inventory.find(i => i.id === selectedItemId);
      if (!invItem) return;

      const finalPrice = price || (invoiceType === 'sale' ? invItem.sellingPrice : invItem.costPrice);
      
      setItems(prev => [...prev, {
        id: Math.random().toString(),
        inventoryItemId: invItem.id,
        name: invItem.name,
        quantity: qty,
        unitPrice: finalPrice,
        total: qty * finalPrice
      }]);

      setSelectedItemId('');
      setItemQuantity('1');
      setItemPrice('');
    }
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const subTotal = items.reduce((sum, item) => sum + item.total, 0);
  const total = subTotal - (parseFloat(discount) || 0);
  // Calculate amounts based on payment type
  const actualPaidAmount = paymentType === 'cash' ? total : (paymentType === 'deferred' ? 0 : (parseFloat(paidAmount) || 0));
  const remaining = total - actualPaidAmount;
  const status = remaining <= 0 ? 'paid' : (actualPaidAmount > 0 ? 'partial' : 'unpaid');

  const handleSave = async (isApproved: boolean) => {
    if (items.length === 0) return alert('يجب إضافة مادة واحدة على الأقل');
    if (!partyId) return alert('يجب اختيار الطرف');

    const invoiceData = {
      invoiceNumber,
      type: invoiceType,
      invoiceType: invoiceType === 'sale' ? salesType : undefined,
      partyId,
      date,
      items,
      subTotal,
      discount: parseFloat(discount) || 0,
      total,
      paidAmount: actualPaidAmount,
      paymentType,
      remainingAmount: remaining,
      status: status as Invoice["status"],
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
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setIsComingSoonOpen(true)} className="btn-primary">
            <Plus className="w-5 h-5" />
            <span>بيع بضاعة جديدة</span>
          </button>
          <button onClick={() => openModal('sale', 'SERVICE')} className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-[16px] font-bold transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>خدمة تطريز جديدة</span>
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
          <div className="p-4 sm:p-6 bg-[#f8fafc] grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredInvoices.map((inv) => {
              const partyName = inv.type === 'sale' 
                 ? customers.find(c => c.id === inv.partyId)?.name 
                 : suppliers.find(s => s.id === inv.partyId)?.name;
              return (
                 <div key={inv.id} className="bg-white rounded-[24px] p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 relative overflow-hidden group">
                   <div className={`absolute top-0 right-0 w-1.5 h-full transition-colors ${inv.type === 'sale' ? 'bg-blue-400 group-hover:bg-blue-500' : 'bg-purple-400 group-hover:bg-purple-500'}`}></div>
                   
                   <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center gap-2 flex-wrap">
                           <span className="font-mono font-bold text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl text-xs">{inv.invoiceNumber}</span>
                           <span className="text-xs font-bold text-slate-400">{formatDate(inv.date)}</span>
                         </div>
                         <h3 className="font-black text-lg sm:text-xl text-slate-800 mt-1">{partyName || '<غير معروف>'}</h3>
                         <div className="flex gap-2 mt-1 flex-wrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                              inv.type === 'sale' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                            }`}>
                              {inv.type === 'sale' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                              {inv.type === 'sale' ? 'مبيعات' : 'مشتريات'}
                            </span>
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                               inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                               inv.status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {inv.status === 'paid' ? 'مدفوع' : inv.status === 'partial' ? 'مدفوع جزئياً' : 'غير مدفوع'}
                            </span>
                            {!inv.isApproved && (
                              <span className="inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600">مسودة</span>
                            )}
                         </div>
                      </div>
                      <div className="text-left shrink-0 pl-1">
                         <p className="text-2xl sm:text-3xl font-black text-slate-900" dir="ltr">{formatCurrency(inv.total).replace('ر.ي','').trim()} <span className="text-sm font-bold text-slate-500">ر.ي</span></p>
                         <div className="text-[11px] sm:text-xs font-bold mt-2 flex flex-col gap-1 items-end">
                            {inv.paidAmount > 0 && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md" dir="ltr">مدفوع: {formatCurrency(inv.paidAmount)}</span>}
                            {inv.remainingAmount > 0 && <span className="text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md" dir="ltr">متبقي: {formatCurrency(inv.remainingAmount)}</span>}
                         </div>
                      </div>
                   </div>
                   
                   <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-slate-50/80">
                      {!inv.isApproved && (
                        <>
                          <button onClick={async () => { if(confirm('هل أنت متأكد من اعتماد هذه الفاتورة؟ سيتم ترحيلها إلى الحسابات.')) await approveInvoice(inv.id); }} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-colors font-bold text-xs shadow-sm" title="اعتماد الفاتورة وترحيلها">
                            <CheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">اعتماد</span>
                          </button>
                          <button onClick={() => openEditModal(inv)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-500 hover:text-white rounded-xl transition-colors font-bold text-xs shadow-sm" title="تعديل الفاتورة">
                            <Pencil className="w-4 h-4" /> <span className="hidden sm:inline">تعديل</span>
                          </button>
                        </>
                      )}
                      <button onClick={() => {
                        const party = inv.type === 'sale' ? customers.find(c => c.id === inv.partyId) : suppliers.find(s => s.id === inv.partyId);
                        setSelectedInvoice(inv);
                        setSelectedPartyName(party ? party.name : '');
                      }} className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white rounded-xl transition-colors font-bold text-xs shadow-sm" title="طباعة">
                        <FileText className="w-4 h-4" /> <span className="hidden sm:inline">طباعة</span>
                      </button>
                      <button onClick={async () => { if(confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) await deleteInvoice(inv.id); }} className="flex items-center justify-center p-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors shadow-sm" title="حذف">
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
              );
            })}
            {filteredInvoices.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 font-medium bg-white rounded-3xl border border-slate-100">
                <FileText className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                لا يوجد فواتير مطابقة للبحث
              </div>
            )}
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
                  <CustomDatePicker value={date} onChange={setDate} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 flex justify-between items-center" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{invoiceType === 'sale' ? 'العميل' : 'المورد'}</label>
                  <div className="relative">
                    <CustomPartyPicker 
    value={partyId} 
    onChange={setPartyId} 
    customers={customers} 
    suppliers={suppliers} 
    type={invoiceType === 'sale' ? 'customer' : 'supplier'} 
    label={invoiceType === 'sale' ? 'اختر العميل' : 'اختر المورد'}
    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 flex justify-between items-center" 
  />
                    {partyId && (() => {
                      const party = invoiceType === 'sale' 
                        ? customers.find(c => c.id === partyId) 
                        : suppliers.find(s => s.id === partyId);
                      if (party && party.balance !== 0) {
                        return (
                          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md pointer-events-none" dir="ltr">
                            الرصيد السابق: {formatCurrency(party.balance)}
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-50/50 p-4 border-b border-slate-200 flex flex-wrap items-end gap-3">
                  {invoiceType === 'sale' && salesType === 'SERVICE' ? (
                    <>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-700 mb-2">اسم الخدمة (مثل: نقشة وردة)</label>
                        <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-700 mb-2">وصف العمل (اختياري)</label>
                        <input type="text" value={serviceDesc} onChange={e => setServiceDesc(e.target.value)} placeholder="تفاصيل إضافية..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-bold text-slate-700 mb-2">الوحدة</label>
                        <select value={serviceUnit} onChange={e => setServiceUnit(e.target.value)} className="w-full px-2 py-2 bg-white border border-slate-200 rounded-[12px]">
                          <option value="وار">وار</option>
                          <option value="قطعة">قطعة</option>
                          <option value="متر">متر</option>
                          <option value="خدمة">خدمة</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold text-slate-700 mb-2">المادة / الصنف</label>
                      <select value={selectedItemId} onChange={e => {
                          setSelectedItemId(e.target.value);
                          const item = inventory.find(i => i.id === e.target.value);
                          if (item) setItemPrice(invoiceType === 'sale' ? item.sellingPrice.toString() : item.costPrice.toString());
                        }} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                        <option value="">اختر مادة...</option>
                        {inventory.map(i => <option key={i.id} value={i.id}>{i.name} ({i.code}) - متوفر: {i.quantity}</option>)}
                      </select>
                    </div>
                  )}
                  <div className="w-24">
                    <label className="block text-xs font-bold text-slate-700 mb-2">الكمية</label>
                    <input type="number" min="0.1" step="0.1" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-slate-700 mb-2">السعر (الإفرادي)</label>
                    <input type="number" step="0.01" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                  </div>
                  <button type="button" onClick={handleAddItem} disabled={invoiceType === 'sale' && salesType === 'SERVICE' ? !serviceName : !selectedItemId} className="px-6 py-2 bg-brand-500/10 text-brand-500 hover:bg-brand-500/20 font-bold rounded-[12px] disabled:opacity-50 transition-colors">إضافة</button>
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
                          <td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">
                            <div>{item.name} {item.unit ? <span className="text-xs text-slate-400">({item.unit})</span> : ''}</div>
                            {item.description && <div className="text-xs font-normal text-slate-500 mt-1">{item.description}</div>}
                          </td>
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
                    <span>طريقة الدفع:</span>
                    <select value={paymentType} onChange={e => setPaymentType(e.target.value as any)} className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500">
                      <option value="cash">نقدي</option>
                      <option value="deferred">آجل</option>
                      <option value="partial">دفع جزئي</option>
                    </select>
                  </div>
                  <div className="pt-2 flex justify-between items-center text-sm font-bold text-slate-700">
                    <span>المبلغ المدفوع:</span>
                    <input type="number" step="0.01" value={paymentType === 'cash' ? total : (paymentType === 'deferred' ? 0 : paidAmount)} onChange={e => setPaidAmount(e.target.value)} disabled={paymentType !== 'partial'} className="w-32 px-3 py-2 border border-brand-500/30 bg-brand-500/5 rounded-[12px] text-left focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-brand-500 font-bold disabled:opacity-50 disabled:bg-slate-100 disabled:border-slate-200 disabled:text-slate-500" dir="ltr" />
                  </div>
                  <div className="pt-2 flex justify-between items-center text-sm font-bold text-rose-600">
                    <span>المتبقي (آجل):</span>
                    <span dir="ltr" className="font-black">{formatCurrency(remaining)}</span>
                  </div>
                </div>
              </div>
            </form>
            <div className="p-4 sm:p-6 mt-auto border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0 bg-slate-50/30">
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-2xl transition-colors order-3 sm:order-1">إلغاء</button>
              <button type="button" onClick={() => handleSave(false)} className="w-full sm:w-auto justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all order-2">
                <span>حفظ كمسودة</span>
              </button>
              <button type="button" onClick={() => handleSave(true)} className="w-full sm:w-auto justify-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all order-1 sm:order-3">
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

      {isComingSoonOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center text-center p-8 border border-slate-100">
            <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">قريباً</h3>
            <p className="text-slate-500 mb-8 font-medium leading-relaxed">
              شاشة مبيعات البضائع والمواد جاري العمل عليها وسيتم إتاحتها في التحديث القادم للنظام.
            </p>
            <button 
              onClick={() => setIsComingSoonOpen(false)} 
              className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-brand-500/20 active:scale-95"
            >
              حسناً، فهمت
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
