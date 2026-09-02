const fs = require('fs');
let code = fs.readFileSync('src/context/StoreContext.tsx', 'utf-8');

code = code.replace(
  "else { credit = v.amount; cashIn = v.amount; }\n      }",
  "else { credit = v.amount; cashIn = v.amount; }\n      } else if (v.partyType === 'other') {\n        if (v.type === 'receipt') { cashIn = v.amount; }\n        else if (v.type === 'payment') { cashOut = v.amount; }\n      }"
);

fs.writeFileSync('src/context/StoreContext.tsx', code);
