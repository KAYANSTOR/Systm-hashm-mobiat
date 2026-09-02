const fs = require('fs');
let code = fs.readFileSync('src/pages/CashBox.tsx', 'utf-8');

code = code.replace(
  "  }, [transactions, filterType, dateFilter, searchTerm]);",
  "  }, [transactions, filterType, dateFilter, opFilter, searchTerm]);"
);

fs.writeFileSync('src/pages/CashBox.tsx', code);
