const fs = require('fs');

function updateToPDF(filePath, titlePrefix, typeCheck, filenamePrefix) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes("import jsPDF from 'jspdf';")) {
    content = content.replace(/import \* as htmlToImage from 'html-to-image';/, "import * as htmlToImage from 'html-to-image';\nimport jsPDF from 'jspdf';");
  }

  // Update generation logic
  const genPattern = /const blob = await htmlToImage\.toBlob\([^;]+;\n\s*setCachedBlob\(blob\);/;
  
  const newGen = `const dataUrl = await htmlToImage.toJpeg(printRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');
        setCachedBlob(pdfBlob);`;
        
  content = content.replace(genPattern, newGen);

  // Update share logic
  // "test.png", { type: 'image/png' } -> "test.pdf", { type: 'application/pdf' }
  content = content.replace(/'test\.png', \{ type: 'image\/png' \}/g, `'test.pdf', { type: 'application/pdf' }`);
  
  // ".png" -> ".pdf" inside File constructor
  content = content.replace(/\.png\`, \{ type: 'image\/png' \}/g, `.pdf\`, { type: 'application/pdf' }`);
  content = content.replace(/\.png", \{ type: 'image\/png' \}/g, `.pdf", { type: 'application/pdf' }`);

  fs.writeFileSync(filePath, content, 'utf8');
}

updateToPDF('src/components/VoucherPrintTemplate.tsx');
updateToPDF('src/components/InvoicePrintTemplate.tsx');
updateToPDF('src/components/ReceiptPrint.tsx');

