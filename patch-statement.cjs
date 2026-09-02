const fs = require('fs');
let code = fs.readFileSync('src/pages/Parties.tsx', 'utf-8');

code = code.replace(
  "runningBalance += (t.debit - t.credit);",
  "runningBalance += (t.partyType === 'supplier' ? (t.credit - t.debit) : (t.debit - t.credit));"
);

fs.writeFileSync('src/pages/Parties.tsx', code);
