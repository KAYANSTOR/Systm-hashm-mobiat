const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

const targetActions = `<td data-label="إجراءات" className="px-2 py-3 text-center">
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
                      </td>`;

const replaceActions = `<td data-label="الإجراءات" className="px-4 py-3">
                        <div className="flex items-center justify-end sm:justify-center gap-2">
                          {!inv.isApproved && (
                            <>
                              <button 
                                onClick={async () => {
                                  if(confirm('هل أنت متأكد من اعتماد هذه الفاتورة؟ سيتم ترحيلها إلى الحسابات والمخزن.')) await approveInvoice(inv.id);
                                }} 
                                className="flex items-center justify-center bg-amber-50 text-amber-500 hover:bg-emerald-50 hover:text-emerald-600 p-2 rounded-xl transition-colors shadow-sm" 
                                title="اعتماد الفاتورة وترحيلها"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => openEditModal(inv)}
                                className="flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 p-2 rounded-xl transition-colors shadow-sm" 
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
                            className="flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-teal-50 hover:text-brand-500 p-2 rounded-xl transition-colors shadow-sm" 
                            title="عرض وطباعة الفاتورة"
                          >
                            <FileText className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={async () => {
                              if(confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) await deleteInvoice(inv.id);
                            }} 
                            className="flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 p-2 rounded-xl transition-colors shadow-sm" 
                            title="حذف الفاتورة"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>`;

code = code.replace(targetActions, replaceActions);

const targetModalFooter = `<div className="p-6 mt-auto border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/30">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-2xl transition-colors">إلغاء</button>
              <button type="button" onClick={() => handleSave(false)} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all">
                <span>حفظ كمسودة</span>
              </button>
              <button type="button" onClick={() => handleSave(true)} className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all">
                <Check className="w-5 h-5" />
                <span>حفظ واعتماد</span>
              </button>
            </div>`;

const replaceModalFooter = `<div className="p-4 sm:p-6 mt-auto border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0 bg-slate-50/30">
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-6 py-3 font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-2xl transition-colors order-3 sm:order-1">إلغاء</button>
              <button type="button" onClick={() => handleSave(false)} className="w-full sm:w-auto justify-center px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all order-2">
                <span>حفظ كمسودة</span>
              </button>
              <button type="button" onClick={() => handleSave(true)} className="w-full sm:w-auto justify-center px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-brand-500/20 transition-all order-1 sm:order-3">
                <Check className="w-5 h-5" />
                <span>حفظ واعتماد</span>
              </button>
            </div>`;

code = code.replace(targetModalFooter, replaceModalFooter);

// Let's add data labels to the main table just in case it doesn't have them yet.
// Wait, looking closely at Sales.tsx line 224
// it already has `data-label="التاريخ"` ... Oh wait, I don't know if it does. Let me check first.

fs.writeFileSync('src/pages/Sales.tsx', code);
