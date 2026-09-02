const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

code = code.replace(
  "else { credit = newVoucher.amount; cashIn = newVoucher.amount; }\n      }",
  "else { credit = newVoucher.amount; cashIn = newVoucher.amount; }\n      } else if (newVoucher.partyType === 'other') {\n        if (newVoucher.type === 'receipt') { cashIn = newVoucher.amount; }\n        else if (newVoucher.type === 'payment') { cashOut = newVoucher.amount; }\n      }"
);

fs.writeFileSync('src/context/StoreContext.tsx', code);
