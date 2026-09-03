const fs = require('fs');
const files = ['src/pages/CashBox.tsx', 'src/pages/Reports.tsx', 'src/pages/Sales.tsx', 'src/pages/Vouchers.tsx', 'src/pages/Expenses.tsx'];

const todayStr = "new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]";

files.forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  
  if(file.includes('CashBox.tsx')) {
    code = code.replace(/const \[dateFrom, setDateFrom\] = useState\(''\);/, 'const [dateFrom, setDateFrom] = useState(' + todayStr + ');');
    code = code.replace(/const \[dateTo, setDateTo\] = useState\(''\);/, 'const [dateTo, setDateTo] = useState(' + todayStr + ');');
  }
  
  if(file.includes('Reports.tsx')) {
    code = code.replace(/const \[startDate, setStartDate\] = useState\(''\);/, 'const [startDate, setStartDate] = useState(' + todayStr + ');');
    code = code.replace(/const \[endDate, setEndDate\] = useState\(''\);/, 'const [endDate, setEndDate] = useState(' + todayStr + ');');
    code = code.replace(/const \[statementStartDate, setStatementStartDate\] = useState\(''\);/, 'const [statementStartDate, setStatementStartDate] = useState(' + todayStr + ');');
    code = code.replace(/const \[statementEndDate, setStatementEndDate\] = useState\(''\);/, 'const [statementEndDate, setStatementEndDate] = useState(' + todayStr + ');');
  }
  
  if(file.includes('Sales.tsx')) {
    code = code.replace(/const \[date, setDate\] = useState\(''\);/, 'const [date, setDate] = useState(' + todayStr + ');');
  }
  
  if(file.includes('Vouchers.tsx')) {
    code = code.replace(/const \[startDate, setStartDate\] = useState\(''\);/, 'const [startDate, setStartDate] = useState(' + todayStr + ');');
    code = code.replace(/const \[endDate, setEndDate\] = useState\(''\);/, 'const [endDate, setEndDate] = useState(' + todayStr + ');');
    code = code.replace(/const \[date, setDate\] = useState\(''\);/, 'const [date, setDate] = useState(' + todayStr + ');');
  }

  if(file.includes('Expenses.tsx')) {
    code = code.replace(/const \[date, setDate\] = useState\(new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\]\);/, 'const [date, setDate] = useState(' + todayStr + ');');
  }

  fs.writeFileSync(file, code);
});
console.log('Dates patched');
