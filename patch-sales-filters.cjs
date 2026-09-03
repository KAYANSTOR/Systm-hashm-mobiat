const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

const oldState = `  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState('');`;

const newState = `  const [paymentStatus, setPaymentStatus] = useState('all');
  const [searchInvoiceNumber, setSearchInvoiceNumber] = useState('');
  const [transactionType, setTransactionType] = useState('all');`;
  
code = code.replace(oldState, newState);

const oldFilterLogic = `      if (selectedCustomerId !== 'all' && inv.partyId !== selectedCustomerId) return false;
      if (paymentStatus !== 'all' && inv.status !== paymentStatus) return false;`;

const newFilterLogic = `      if (selectedCustomerId !== 'all' && inv.partyId !== selectedCustomerId) return false;
      if (paymentStatus !== 'all' && inv.status !== paymentStatus) return false;
      if (transactionType !== 'all' && inv.invoiceType !== transactionType) return false;`;

code = code.replace(oldFilterLogic, newFilterLogic);

const oldFiltersUI = `              <div>
                <label className="label text-xs">رقم الفاتورة</label>
                <input 
                  type="text" 
                  className="input-field py-2" 
                  placeholder="ابحث برقم الفاتورة..."
                  value={searchInvoiceNumber}
                  onChange={e => setSearchInvoiceNumber(e.target.value)}
                />
              </div>`;

const newFiltersUI = `              <div>
                <label className="label text-xs">نوع العملية</label>
                <select 
                  className="input-field py-2" 
                  value={transactionType}
                  onChange={e => setTransactionType(e.target.value)}
                >
                  <option value="all">الكل</option>
                  <option value="PRODUCT">بضاعة</option>
                  <option value="SERVICE">خدمة تطريز</option>
                </select>
              </div>
              <div>
                <label className="label text-xs">رقم الفاتورة</label>
                <input 
                  type="text" 
                  className="input-field py-2" 
                  placeholder="ابحث برقم الفاتورة..."
                  value={searchInvoiceNumber}
                  onChange={e => setSearchInvoiceNumber(e.target.value)}
                />
              </div>`;

code = code.replace(oldFiltersUI, newFiltersUI);

fs.writeFileSync('src/pages/Reports.tsx', code);
console.log('patched Reports.tsx filters');
