const fs = require('fs');
let code = fs.readFileSync('src/pages/Parties.tsx', 'utf-8');

code = code.replace(
  '<button onClick={() => openModal(c)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>',
  '<button onClick={() => setStatementParty(c)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors"><FileText className="w-4 h-4"/></button>\n                      <button onClick={() => openModal(c)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>'
);

code = code.replace(
  '<button onClick={() => openModal(s)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>',
  '<button onClick={() => setStatementParty(s)} className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors"><FileText className="w-4 h-4"/></button>\n                      <button onClick={() => openModal(s)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit className="w-4 h-4"/></button>'
);

fs.writeFileSync('src/pages/Parties.tsx', code);
