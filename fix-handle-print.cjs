const fs = require('fs');

['src/components/VoucherPrintTemplate.tsx', 'src/components/ReceiptPrint.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('const handlePrint = () => {')) {
    content = content.replace(/const handleDownloadPDF = async \(\) => \{/, "const handlePrint = () => { window.print(); };\n\n  const handleDownloadPDF = async () => {");
    fs.writeFileSync(file, content, 'utf8');
  }
});
