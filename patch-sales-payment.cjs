const fs = require('fs');
let code = fs.readFileSync('src/pages/Sales.tsx', 'utf-8');

code = code.replace(
  "const [paidAmount, setPaidAmount] = useState('0');",
  "const [paidAmount, setPaidAmount] = useState('0');\n  const [paymentType, setPaymentType] = useState<'cash' | 'deferred' | 'partial'>('cash');"
);

code = code.replace(
  "setPaidAmount(inv.paidAmount.toString());",
  "setPaidAmount(inv.paidAmount.toString());\n    setPaymentType(inv.paymentType || (inv.remainingAmount <= 0 ? 'cash' : (inv.paidAmount > 0 ? 'partial' : 'deferred')));"
);

code = code.replace(
  "paidAmount: parseFloat(paidAmount) || 0,",
  "paidAmount: parseFloat(paidAmount) || 0,\n      paymentType,"
);

code = code.replace(
  "const remaining = total - (parseFloat(paidAmount) || 0);",
  "// Calculate amounts based on payment type\n  const actualPaidAmount = paymentType === 'cash' ? total : (paymentType === 'deferred' ? 0 : (parseFloat(paidAmount) || 0));\n  const remaining = total - actualPaidAmount;"
);

code = code.replace(
  "paidAmount: parseFloat(paidAmount) || 0,", // Wait, I already replaced this.
  "paidAmount: parseFloat(paidAmount) || 0," // Just an observation.
);

fs.writeFileSync('src/pages/Sales.tsx', code);
