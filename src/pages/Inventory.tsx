import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatCurrency } from '../lib/utils';
import { Search, Plus, Filter, Scissors, Edit, Trash2, X } from 'lucide-react';
import { InventoryItem } from '../types';

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fabric' | 'thread' | 'accessory' | 'machine_part'>('fabric');
  const [unit, setUnit] = useState<'meter' | 'roll' | 'piece' | 'kg'>('roll');
  const [quantity, setQuantity] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [color, setColor] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.name.includes(searchTerm) || item.code.includes(searchTerm)
  );

  const openModal = (item?: InventoryItem) => {
    if (item) {
      setEditingId(item.id);
      setCode(item.code);
      setName(item.name);
      setCategory(item.category);
      setUnit(item.unit);
      setQuantity(item.quantity.toString());
      setCostPrice(item.costPrice.toString());
      setSellingPrice(item.sellingPrice.toString());
      setColor(item.color || '');
    } else {
      setEditingId(null);
      setCode(`ITM-${Math.floor(Math.random() * 10000)}`);
      setName('');
      setCategory('fabric');
      setUnit('roll');
      setQuantity('1');
      setCostPrice('0');
      setSellingPrice('0');
      setColor('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      code, name, category, unit, 
      quantity: parseFloat(quantity) || 0,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      color,
      supplierId: ''
    };

    if (editingId) {
      await updateInventoryItem(editingId, data);
    } else {
      await addInventoryItem(data);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      await deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">المخزن والأقمشة</h2>
          <p className="text-sm text-slate-500 mt-1">إدارة المواد الأولية، الأقمشة، ومستلزمات الخياطة.</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#208480] hover:bg-[#1a6b68] text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>إضافة مادة جديدة</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="بحث برمز المادة أو الاسم..." 
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] sm:text-xs md:text-sm text-right">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-2 py-3">الرمز</th>
                <th className="px-2 py-3">اسم المادة</th>
                <th className="px-2 py-3">الفئة</th>
                <th className="px-2 py-3 text-center">الكمية المتوفرة</th>
                <th className="px-2 py-3">سعر التكلفة</th>
                <th className="px-2 py-3">سعر البيع</th>
                <th className="px-2 py-3">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-2 py-3 font-mono text-slate-500">{item.code}</td>
                  <td className="px-2 py-3">
                    <div className="font-bold text-slate-800">{item.name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">اللون: {item.color || 'غير محدد'}</div>
                  </td>
                  <td className="px-2 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                      {item.category === 'fabric' && <Scissors className="w-3.5 h-3.5" />}
                      {item.category === 'fabric' ? 'أقمشة' : 
                       item.category === 'thread' ? 'خيوط' : 
                       item.category === 'accessory' ? 'إكسسوارات' : 'قطع غيار'}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <span className="font-bold text-lg text-slate-800">{item.quantity}</span>
                    <span className="text-xs text-slate-500 mr-1">
                      {item.unit === 'roll' ? 'طاقة/رول' : 
                       item.unit === 'meter' ? 'متر' : 'قطعة'}
                    </span>
                  </td>
                  <td className="px-2 py-3 font-medium text-slate-600">{formatCurrency(item.costPrice)}</td>
                  <td className="px-2 py-3 font-bold text-emerald-600">{formatCurrency(item.sellingPrice)}</td>
                  <td className="px-2 py-3 flex items-center gap-2">
                    <button onClick={() => openModal(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                  </td>
                </tr>
              ))}
              
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    لم يتم العثور على أي مواد مطابقة للبحث.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center sm:p-4">
          <div className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-lg overflow-hidden shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-lg text-slate-800">
                {editingId ? 'تعديل المادة' : 'إضافة مادة جديدة'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">رمز المادة</label>
                  <input required type="text" value={code} onChange={e => setCode(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">اسم المادة</label>
                  <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">الفئة</label>
                  <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20">
                    <option value="fabric">أقمشة</option>
                    <option value="thread">خيوط</option>
                    <option value="accessory">إكسسوارات</option>
                    <option value="machine_part">قطع غيار</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">الوحدة</label>
                  <select value={unit} onChange={e => setUnit(e.target.value as any)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20">
                    <option value="roll">طاقة/رول</option>
                    <option value="meter">متر</option>
                    <option value="piece">قطعة</option>
                    <option value="kg">كيلو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">الكمية</label>
                  <input required type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">اللون</label>
                  <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">سعر التكلفة</label>
                  <input required type="number" step="0.01" value={costPrice} onChange={e => setCostPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">سعر البيع</label>
                  <input required type="number" step="0.01" value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500/20" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white">
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
