const fs = require('fs');
let code = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

// Hide normal report header and footer in print mode when reportType === 'statement'
code = code.replace(
  /<div className="mb-8 flex justify-between items-end print:mt-4">/,
  '<div className={`mb-8 flex justify-between items-end print:mt-4 ${reportType === \'statement\' ? \'print:hidden\' : \'\'}`}>'
);

code = code.replace(
  /<div className="mt-16 pt-8 border-t-2 border-brand-500 flex justify-between items-center text-slate-500 font-bold hidden print:flex">/,
  '<div className={`mt-16 pt-8 border-t-2 border-brand-500 justify-between items-center text-slate-500 font-bold hidden ${reportType === \'statement\' ? \'\' : \'print:flex\'}`}>'
);

// We should also remove the main page padding in print mode when viewing the statement
code = code.replace(
  /className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"/,
  'className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ${reportType === \'statement\' ? \'print:p-0 print:max-w-none\' : \'\'}`}'
);

fs.writeFileSync('src/pages/Reports.tsx', code);
console.log('Fixed print styles for statement mode');
