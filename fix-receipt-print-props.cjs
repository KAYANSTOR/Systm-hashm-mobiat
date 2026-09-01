const fs = require('fs');
if (fs.existsSync('src/components/ReceiptPrint.tsx')) {
  let content = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');
  // Just in case I messed up the signature with regex, check it
}
