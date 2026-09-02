const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

code = code.replace(
  "const [dateFilter, setDateFilter] = useState('all'); // all, today, this_month",
  "const [dateFilter, setDateFilter] = useState('all'); // all, today, this_month\n  const [opFilter, setOpFilter] = useState('all'); // all, in, out"
);

const filterLogic = `    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      if (dateFilter === 'today') {
        filtered = filtered.filter(t => new Date(t.date).toDateString() === today.toDateString());
      } else if (dateFilter === 'this_month') {
        filtered = filtered.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
        });
      }
    }

    // Operation filter
    if (opFilter === 'in') {
      filtered = filtered.filter(t => t.cashIn > 0);
    } else if (opFilter === 'out') {
      filtered = filtered.filter(t => t.cashOut > 0);
    }`;

code = code.replace(
  `    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      if (dateFilter === 'today') {
        filtered = filtered.filter(t => new Date(t.date).toDateString() === today.toDateString());
      } else if (dateFilter === 'this_month') {
        filtered = filtered.filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === today.getMonth() && tDate.getFullYear() === today.getFullYear();
        });
      }
    }`,
  filterLogic
);

const selectHTML = `<select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-bold shrink-0"
            >
              <option value="all">كل الأوقات</option>
              <option value="today">اليوم</option>
              <option value="this_month">هذا الشهر</option>
            </select>`;

const newSelectHTML = `<select 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-bold shrink-0"
            >
              <option value="all">كل الأوقات</option>
              <option value="today">اليوم</option>
              <option value="this_month">هذا الشهر</option>
            </select>
            
            <select 
              value={opFilter} 
              onChange={e => setOpFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/20 font-bold shrink-0"
            >
              <option value="all">كل العمليات</option>
              <option value="in">إيداع / مقبوضات</option>
              <option value="out">سحب / مدفوعات</option>
            </select>`;

code = code.replace(selectHTML, newSelectHTML);
fs.writeFileSync('src/pages/CashBox.tsx', code);
