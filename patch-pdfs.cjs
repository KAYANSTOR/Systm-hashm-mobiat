const fs = require('fs');

function patchFile(filepath, formatWidth) {
  let code = fs.readFileSync(filepath, 'utf8');
  
  const generatePDFRegex = /const (fetchPdfBlob|generatePDF) = async \(\) => \{[\s\S]*?return pdf;[\s\S]*?\}|const (fetchPdfBlob|generatePDF) = async \(\) => \{[\s\S]*?return \w+\.output\('blob'\);[\s\S]*?\}/;
  
  const newFunc = `const fetchPdfBlob = async () => {
    if (!printRef.current) return null;
    try {
      if (typeof setIsGenerating === 'function') setIsGenerating(true);
      
      const element = printRef.current;
      
      const filter = (node) => {
        const exclusionClasses = ['no-print'];
        return !exclusionClasses.some(classname => node.classList?.contains(classname));
      };
      
      const dataUrl = await htmlToImage.toJpeg(element, { 
        quality: 0.95, 
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: element.scrollWidth + 'px',
          height: element.scrollHeight + 'px'
        },
        filter: filter
      });
      
      const pdfWidth = ${formatWidth};
      const imgProps = new jsPDF().getImageProperties(dataUrl);
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Dynamic page size to fit all content perfectly in one continuous page
      const pdf = new jsPDF({ 
        orientation: 'portrait', 
        unit: 'mm', 
        format: [pdfWidth, Math.max(297, pdfHeight + 10)] 
      });
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      
      return pdf.output('blob');
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      if (typeof setIsGenerating === 'function') setIsGenerating(false);
    }
  };

  const generatePDF = async () => {
     const blob = await fetchPdfBlob();
     if (!blob) return null;
     
     // Compatibility layer for code that expects the JS PDF object with a .save method
     return {
       save: (name) => {
         const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
         link.download = name;
         link.click();
         URL.revokeObjectURL(url);
       },
       output: () => blob
     };
  };`;

  code = code.replace(generatePDFRegex, newFunc);
  fs.writeFileSync(filepath, code);
  console.log('Patched', filepath);
}

patchFile('src/components/CustomerStatementPreview.tsx', 210);
patchFile('src/components/InvoicePrintTemplate.tsx', 210);
patchFile('src/components/VoucherPrintTemplate.tsx', 210);
patchFile('src/components/ReceiptPrint.tsx', 80);

