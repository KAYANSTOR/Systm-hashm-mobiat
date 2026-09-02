const fs = require('fs');

// 1. Update types.ts
let typesContent = fs.readFileSync('src/types.ts', 'utf8');
if (!typesContent.includes('minQuantity?: number;')) {
    typesContent = typesContent.replace(/sellingPrice: number;/, 'sellingPrice: number;\n  minQuantity?: number;');
    fs.writeFileSync('src/types.ts', typesContent, 'utf8');
}

// 2. Update Inventory.tsx
let invContent = fs.readFileSync('src/pages/Inventory.tsx', 'utf8');

// Add AlertTriangle to imports if missing
if (!invContent.includes('AlertTriangle')) {
    invContent = invContent.replace(/import \{ ([^}]+) \} from 'lucide-react';/, "import { $1, AlertTriangle } from 'lucide-react';");
}

// Add state
if (!invContent.includes('minQuantity, setMinQuantity')) {
    invContent = invContent.replace(/const \[color, setColor\] = useState\(''\);/, "const [color, setColor] = useState('');\n  const [minQuantity, setMinQuantity] = useState('0');");
}

// Update openModal
invContent = invContent.replace(/setSellingPrice\(item\.sellingPrice\.toString\(\)\);/, "setSellingPrice(item.sellingPrice.toString());\n      setMinQuantity((item.minQuantity || 0).toString());");
invContent = invContent.replace(/setSellingPrice\('0'\);/, "setSellingPrice('0');\n      setMinQuantity('0');");

// Update handleSubmit
invContent = invContent.replace(/quantity: parseFloat\(quantity\) \|\| 0,/, "quantity: parseFloat(quantity) || 0,\n      minQuantity: parseFloat(minQuantity) || 0,");

// Update Table Row
const oldTd = `<td data-label="الكمية" className="px-2 py-3 text-center">
                    <div className="flex items-center justify-end gap-2"><span className="font-bold text-lg text-slate-800">{item.quantity}</span>
                    <span className="text-xs text-slate-500 mr-1">
                      {item.unit === 'roll' ? 'طاقة/رول' :
                        item.unit === 'meter' ? 'متر' : 'قطعة'}
                    </span></div>
                  </td>`;
                  
const newTd = `<td data-label="الكمية" className="px-2 py-3 text-center">
                    <div className="flex items-center justify-end gap-2">
                      {(item.quantity <= (item.minQuantity || 0)) && (
                         <AlertTriangle className="w-4 h-4 text-rose-500" title="تنبيه: الكمية وصلت للحد الأدنى" />
                      )}
                      <span className={\`font-bold text-lg \${item.quantity <= (item.minQuantity || 0) ? 'text-rose-600' : 'text-slate-800'}\`}>{item.quantity}</span>
                      <span className="text-xs text-slate-500 mr-1">
                        {item.unit === 'roll' ? 'طاقة/رول' :
                          item.unit === 'meter' ? 'متر' : 'قطعة'}
                      </span>
                    </div>
                  </td>`;
                  
if (invContent.includes('<td data-label="الكمية"')) {
    invContent = invContent.replace(/<td data-label="الكمية"[\s\S]*?<\/td>/, newTd);
}

// Update Form to include minQuantity field
const oldFormPart = `                <div>
                  <label className="label">اللون</label>
                  <input type="text" value={color} onChange={e => setColor(e.target.value)} className="input-field" />
                </div>`;
const newFormPart = `                <div>
                  <label className="label">اللون</label>
                  <input type="text" value={color} onChange={e => setColor(e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="label">الحد الأدنى للطلب</label>
                  <input type="number" step="0.01" value={minQuantity} onChange={e => setMinQuantity(e.target.value)} className="input-field" />
                </div>`;
                
if (invContent.includes(oldFormPart) && !invContent.includes('الحد الأدنى للطلب')) {
    invContent = invContent.replace(oldFormPart, newFormPart);
}

fs.writeFileSync('src/pages/Inventory.tsx', invContent, 'utf8');

