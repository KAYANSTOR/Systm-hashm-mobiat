const fs = require('fs');

let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

// Add state for date ranges
content = content.replace(
  /const \[searchTerm, setSearchTerm\] = useState\(''\);/,
  "const [searchTerm, setSearchTerm] = useState('');\n  const [startDate, setStartDate] = useState('');\n  const [endDate, setEndDate] = useState('');"
);

// Helper function to get party name
const partyNameHelper = `
  const getPartyName = (v: Voucher) => {
    if (v.partyType === 'customer') return customers.find(c => c.id === v.partyId)?.name || '-';
    if (v.partyType === 'supplier') return suppliers.find(s => s.id === v.partyId)?.name || '-';
    return '-';
  };
`;

content = content.replace(/const filteredVouchers = /, partyNameHelper + '\n  const filteredVouchers = ');

// Update filteredVouchers logic
const oldFilterRegex = /const filteredVouchers = vouchers\.filter\(v => activeFilter === 'all' \|\| v\.type === activeFilter\)\s*\.filter\(v => v\.voucherNumber\.includes\(searchTerm\) \|\| v\.description\.includes\(searchTerm\)\);/;
const newFilterLogic = `const filteredVouchers = vouchers.filter(v => activeFilter === 'all' || v.type === activeFilter)
    .filter(v => {
      const matchSearch = v.voucherNumber.includes(searchTerm) || 
                          v.description.includes(searchTerm) ||
                          getPartyName(v).includes(searchTerm) ||
                          v.amount.toString().includes(searchTerm) ||
                          v.date.includes(searchTerm);
      
      const matchStart = startDate ? v.date >= startDate : true;
      const matchEnd = endDate ? v.date <= endDate : true;
      
      return matchSearch && matchStart && matchEnd;
    });`;

if (oldFilterRegex.test(content)) {
    content = content.replace(oldFilterRegex, newFilterLogic);
}

// Now the UI
// Find the card-header where the search input is
const searchUIRegex = /<div className="card-header">\s*<div className="relative max-w-md">\s*<Search className="w-5 h-5 text-slate-400 absolute right-3 top-1\/2 -translate-y-1\/2" \/>\s*<input\s*type="text"\s*placeholder="بحث برقم السند أو الوصف\.\.\."\s*className="input-field pl-4 pr-10"\s*value=\{searchTerm\}\s*onChange=\{\(e\) => setSearchTerm\(e\.target\.value\)\}\s*\/>\s*<\/div>\s*<\/div>/;

const newSearchUI = `<div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center bg-slate-50/50">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="بحث بالرقم، الوصف، الاسم، التاريخ، المبلغ..." 
              className="input-field pl-4 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-sm font-bold text-slate-600 shrink-0">من:</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input-field !py-2"
            />
            <label className="text-sm font-bold text-slate-600 shrink-0">إلى:</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input-field !py-2"
            />
          </div>
        </div>`;

if (searchUIRegex.test(content)) {
    content = content.replace(searchUIRegex, newSearchUI);
} else {
    console.log("Could not find search UI to replace");
}

// Replace the inline party name logic in map
const oldPartyNameLogic = /let partyName = '-';\s*if \(v\.partyType === 'customer'\) partyName = customers\.find\(c => c\.id === v\.partyId\)\?\.name \|\| '-';\s*if \(v\.partyType === 'supplier'\) partyName = suppliers\.find\(s => s\.id === v\.partyId\)\?\.name \|\| '-';/;
content = content.replace(oldPartyNameLogic, "const partyName = getPartyName(v);");

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');

