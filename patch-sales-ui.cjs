const fs = require('fs');
let content = fs.readFileSync('src/pages/Sales.tsx', 'utf8');

// Update main buttons
const mainButtonsMatch = /<div className="flex gap-2">\s*<button onClick=\{\(\) => openModal\('sale'\)\} className="btn-primary">\s*<Plus className="w-5 h-5" \/>\s*<span>فاتورة مبيعات جديدة<\/span>\s*<\/button>\s*<button onClick=\{\(\) => openModal\('purchase'\)\} className="btn-secondary">\s*<Plus className="w-5 h-5" \/>\s*<span>فاتورة مشتريات جديدة<\/span>\s*<\/button>\s*<\/div>/m;
const newMainButtons = `<div className="flex gap-2 flex-wrap">
          <button onClick={() => openModal('sale', 'PRODUCT_SALE')} className="btn-primary">
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
        </div>`;
content = content.replace(mainButtonsMatch, newMainButtons);

// Table Type column
const tableTypeMatch = /<td data-label="النوع" className="px-2 py-3">\s*<span className=\{\`px-2 py-1 rounded-lg text-xs font-bold \$\{inv\.type === 'sale' \? 'bg-blue-50 text-blue-700' : 'bg-fuchsia-50 text-fuchsia-700'\}\`\}>\s*\{inv\.type === 'sale' \? 'مبيعات' : 'مشتريات'\}\s*<\/span>\s*<\/td>/;
const newTableType = `<td data-label="النوع" className="px-2 py-3">
                      {inv.type === 'sale' ? (
                        inv.invoiceType === 'SERVICE' ? (
                          <span className="px-2 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700">خدمة تطريز</span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700">بيع بضاعة</span>
                        )
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-bold bg-fuchsia-50 text-fuchsia-700">مشتريات</span>
                      )}
                    </td>`;
content = content.replace(tableTypeMatch, newTableType);

// Modal title
const modalTitleMatch = /<h3 className="font-black text-xl text-slate-800">\s*\{editingInvoiceId \? 'تعديل فاتورة' : 'إنشاء فاتورة'\}\s*\{invoiceType === 'sale' \? 'مبيعات' : 'مشتريات'\}\s*<\/h3>/;
const newModalTitle = `<h3 className="font-black text-xl text-slate-800">
            {editingInvoiceId ? 'تعديل ' : 'إنشاء '}
            {invoiceType === 'sale' ? (salesType === 'SERVICE' ? 'خدمة تطريز' : 'فاتورة مبيعات') : 'فاتورة مشتريات'}
          </h3>`;
content = content.replace(modalTitleMatch, newModalTitle);

// Input section in Modal
const inputSectionMatch = /<div className="bg-slate-50\/50 p-4 border-b border-slate-200 flex flex-wrap items-end gap-3">[\s\S]*?<\/div>\s*<div className="table-container">/m;
const newInputSection = `<div className="bg-slate-50/50 p-4 border-b border-slate-200 flex flex-wrap items-end gap-3">
                  {invoiceType === 'sale' && salesType === 'SERVICE' ? (
                    <>
                      <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-slate-700 mb-2">اسم الخدمة (مثل: نقشة وردة)</label>
                        <input type="text" value={serviceName} onChange={e => setServiceName(e.target.value)} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-[12px] focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
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
                <div className="table-container">`;
content = content.replace(inputSectionMatch, newInputSection);

// Update table rows in modal
const modalTableTrMatch = /<td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">\{item\.name\}<\/td>\s*<td data-label="الكمية" className="px-4 py-3 text-center">\{item\.quantity\}<\/td>/m;
const newModalTableTr = `<td data-label="المادة" className="px-4 py-3 font-bold text-slate-800">{item.name} {item.unit ? <span className="text-xs text-slate-400">({item.unit})</span> : ''}</td>
                          <td data-label="الكمية" className="px-4 py-3 text-center">{item.quantity}</td>`;
content = content.replace(modalTableTrMatch, newModalTableTr);

fs.writeFileSync('src/pages/Sales.tsx', content, 'utf8');
console.log("Phase 2 of Sales patch done.");
