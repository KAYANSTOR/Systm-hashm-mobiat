const fs = require('fs');

const files = [
  { path: 'src/components/InvoicePrintTemplate.tsx', format: 'a4' },
  { path: 'src/components/VoucherPrintTemplate.tsx', format: 'a4' } // or whatever width
];

files.forEach(file => {
  let code = fs.readFileSync(file.path, 'utf8');
  
  if (!code.includes("import * as htmlToImage")) {
    code = code.replace(/import React, { useRef } from 'react';/, "import React, { useRef } from 'react';\nimport * as htmlToImage from 'html-to-image';\nimport jsPDF from 'jspdf';");
  }

  const newFetchBlob = `
  const fetchPdfBlob = async () => {
    if (!printRef.current) return null;
    
    const filter = (node: HTMLElement) => {
      const exclusionClasses = ['no-print'];
      return !exclusionClasses.some(classname => node.classList?.contains(classname));
    };
    
    const dataUrl = await htmlToImage.toJpeg(printRef.current, { 
      quality: 0.95, 
      pixelRatio: 2, 
      backgroundColor: '#ffffff', 
      filter: filter as any 
    });
    
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: '${file.format}' });
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    return pdf.output('blob');
  };

  const handlePrint = async () => {
    try {
      setIsGenerating(true);
      const blob = await fetchPdfBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
         win.onload = () => { win.print(); };
      } else {
         alert('يرجى السماح بالنوافذ المنبثقة (Pop-ups) للطباعة، أو استخدم زر التنزيل');
      }
    } catch(e) {
      console.error(e);
      alert("حدث خطأ أثناء الطباعة");
    } finally {
      setIsGenerating(false);
    }
  };
`;

  code = code.replace(/const fetchPdfBlob = async \(\) => \{[\s\S]*?const handlePrint = \(\) => \{ window.print\(\); \};/, newFetchBlob.trim());

  fs.writeFileSync(file.path, code);
  console.log('Patched ' + file.path);
});
