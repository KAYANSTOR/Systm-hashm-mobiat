const fs = require('fs');
let content = fs.readFileSync('src/pages/Sales.tsx', 'utf8');

const regex = /<td data-label="النوع" className="px-2 py-3">\s*<span className=\{\`inline-flex items-center gap-1\.5 px-2\.5 py-1 rounded-full text-xs font-bold \$\{[\s\S]*?\}<\/span>\s*<\/td>/;

const newCode = `<td data-label="النوع" className="px-2 py-3">
                        {inv.type === 'sale' ? (
                          inv.invoiceType === 'SERVICE' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                              <ArrowUpRight className="w-3 h-3" />
                              خدمة تطريز
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                              <ArrowUpRight className="w-3 h-3" />
                              بيع بضاعة
                            </span>
                          )
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                            <ArrowDownRight className="w-3 h-3" />
                            مشتريات
                          </span>
                        )}
                      </td>`;

content = content.replace(regex, newCode);
fs.writeFileSync('src/pages/Sales.tsx', content, 'utf8');
console.log("Table type patched.");
