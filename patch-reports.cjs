const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

// 1. Separate totals
const totalsMatch = /const salesTotals = useMemo\(\(\) => \{[\s\S]*?\}, \[filteredSalesInvoices\]\);/m;
const newTotals = `const salesTotals = useMemo(() => {
    return filteredSalesInvoices.reduce((acc, inv) => {
      acc.total += inv.total;
      acc.paid += inv.paidAmount;
      acc.remaining += inv.remainingAmount;
      if (inv.invoiceType === 'SERVICE') {
        acc.servicesTotal += inv.total;
      } else {
        acc.productsTotal += inv.total;
      }
      return acc;
    }, { total: 0, paid: 0, remaining: 0, productsTotal: 0, servicesTotal: 0 });
  }, [filteredSalesInvoices]);`;
content = content.replace(totalsMatch, newTotals);

// 2. Table Column
const tableHeaderMatch = /<th className="px-3 py-3 font-bold">العميل<\/th>/;
const newTableHeader = `<th className="px-3 py-3 font-bold">العميل</th>\n<th className="px-3 py-3 font-bold text-center">نوع العملية</th>`;
content = content.replace(tableHeaderMatch, newTableHeader);

// 3. Table Row
const tableRowMatch = /<td data-label="العميل" className="px-3 py-3 font-bold text-slate-800">\s*\{partyName\}\s*<\/td>/;
const newTableRow = `<td data-label="العميل" className="px-3 py-3 font-bold text-slate-800">
                      {partyName}
                    </td>
                    <td data-label="نوع العملية" className="px-3 py-3 text-center">
                      {inv.invoiceType === 'SERVICE' ? (
                        <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">خدمة تطريز</span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">بيع بضاعة</span>
                      )}
                    </td>`;
content = content.replace(tableRowMatch, newTableRow);

// 4. Summary Cards
const summaryCardsMatch = /<div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col print:border-slate-300">\s*<span className="text-slate-500 text-sm font-bold mb-1">إجمالي المبيعات<\/span>\s*<span className="text-2xl font-black text-slate-900" dir="ltr">\{formatCurrency\(salesTotals\.total\)\}<\/span>\s*<\/div>/;
const newSummaryCards = `<div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col print:border-slate-300">
                  <span className="text-slate-500 text-sm font-bold mb-1">إجمالي المبيعات (بضاعة)</span>
                  <span className="text-2xl font-black text-slate-900" dir="ltr">{formatCurrency(salesTotals.productsTotal)}</span>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex flex-col print:border-purple-300">
                  <span className="text-purple-700 text-sm font-bold mb-1">إجمالي خدمات التطريز</span>
                  <span className="text-2xl font-black text-purple-900" dir="ltr">{formatCurrency(salesTotals.servicesTotal)}</span>
                </div>`;
content = content.replace(summaryCardsMatch, newSummaryCards);

// We need to change grid-cols-1 md:grid-cols-3 to grid-cols-2 md:grid-cols-4 for the new card
content = content.replace(/grid-cols-1 md:grid-cols-3 gap-4 mt-6/, "grid-cols-2 md:grid-cols-4 gap-4 mt-6");

fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
console.log("Reports patched.");
