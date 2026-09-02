const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const todaySalesMatch = /const todaySales = todaySalesInvoices\.reduce\(\(sum, i\) => sum \+ i\.total, 0\);/;
const newTodaySales = `
  const todaySales = todaySalesInvoices.filter(i => i.invoiceType !== 'SERVICE').reduce((sum, i) => sum + i.total, 0);
  const todayServices = todaySalesInvoices.filter(i => i.invoiceType === 'SERVICE').reduce((sum, i) => sum + i.total, 0);
`;
content = content.replace(todaySalesMatch, newTodaySales);

const monthSalesMatch = /const monthSales = monthSalesInvoices\.reduce\(\(sum, i\) => sum \+ i\.total, 0\);/;
const newMonthSales = `
  const monthSales = monthSalesInvoices.filter(i => i.invoiceType !== 'SERVICE').reduce((sum, i) => sum + i.total, 0);
  const monthServices = monthSalesInvoices.filter(i => i.invoiceType === 'SERVICE').reduce((sum, i) => sum + i.total, 0);
`;
content = content.replace(monthSalesMatch, newMonthSales);

// Now patch the cards to show these new numbers
const cardsMatch = /<div className="bg-white rounded-3xl p-5 border border-slate-100\/60 shadow-sm shadow-slate-200\/30 flex flex-col justify-between">/g;

// I'll just find the exact text and replace it.
const salesCard1Match = /<div className="text-slate-500 font-bold text-sm mb-1">مبيعات اليوم<\/div>\s*<div className="text-3xl font-black text-slate-800" dir="ltr">\{formatCurrency\(todaySales\)\}<\/div>/;
const newSalesCard1 = `<div className="text-slate-500 font-bold text-sm mb-1">مبيعات اليوم (بضاعة)</div>
            <div className="text-3xl font-black text-slate-800" dir="ltr">{formatCurrency(todaySales)}</div>`;
content = content.replace(salesCard1Match, newSalesCard1);

const salesCard2Match = /<div className="text-slate-500 font-bold text-sm mb-1">مبيعات الشهر<\/div>\s*<div className="text-3xl font-black text-slate-800" dir="ltr">\{formatCurrency\(monthSales\)\}<\/div>/;
const newSalesCard2 = `<div className="text-slate-500 font-bold text-sm mb-1">مبيعات الشهر (بضاعة)</div>
            <div className="text-3xl font-black text-slate-800" dir="ltr">{formatCurrency(monthSales)}</div>`;
content = content.replace(salesCard2Match, newSalesCard2);

const thirdCardMatch = /<div className="bg-white rounded-3xl p-5 border border-slate-100\/60 shadow-sm shadow-slate-200\/30 flex flex-col justify-between">\s*<div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">\s*<Users className="w-5 h-5 text-orange-500" \/>\s*<\/div>\s*<div>\s*<div className="text-slate-500 font-bold text-sm mb-1">الديون المستحقة \(للعملاء\)<\/div>\s*<div className="text-3xl font-black text-slate-800" dir="ltr">\{formatCurrency\(totalReceivables\)\}<\/div>\s*<\/div>\s*<\/div>/;

const newThirdCard = `<div className="bg-white rounded-3xl p-5 border border-slate-100/60 shadow-sm shadow-slate-200/30 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div className="text-slate-500 font-bold text-sm mb-1">تطريز اليوم</div>
            <div className="text-3xl font-black text-slate-800" dir="ltr">{formatCurrency(todayServices)}</div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-100/60 shadow-sm shadow-slate-200/30 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="text-slate-500 font-bold text-sm mb-1">الديون المستحقة</div>
            <div className="text-3xl font-black text-slate-800" dir="ltr">{formatCurrency(totalReceivables)}</div>
          </div>
        </div>`;
content = content.replace(thirdCardMatch, newThirdCard);

// change grid cols for the cards
content = content.replace(/className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6"/, 'className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"');

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
console.log("Dashboard patched.");
