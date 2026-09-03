const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');

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
    
    // Convert to image
    const dataUrl = await htmlToImage.toJpeg(printRef.current, { 
      quality: 0.95, 
      pixelRatio: 2, 
      backgroundColor: '#ffffff', 
      filter: filter as any 
    });
    
    // Receipt is usually 80mm wide. Let's calculate height proportionally.
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, 297] });
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfHeight = (imgProps.height * 80) / imgProps.width;
    
    // Truncate format if it's too long, but we can just set format dynamically
    const dynamicPdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, pdfHeight + 10] });
    
    dynamicPdf.addImage(dataUrl, 'JPEG', 0, 0, 80, pdfHeight);
    return dynamicPdf.output('blob');
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

fs.writeFileSync('src/components/ReceiptPrint.tsx', code);
console.log('Patched ReceiptPrint.tsx');
