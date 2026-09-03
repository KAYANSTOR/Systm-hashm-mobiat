const fs = require('fs');
let code = fs.readFileSync('src/components/CustomerStatementPreview.tsx', 'utf8');

code = `import React, { useRef, useState } from "react";
import { CustomerStatement } from "./CustomerStatement";
import type { CustomerStatementData, StatementCompany } from "./CustomerStatement";
import "./CustomerStatementPreview.css";
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { Share2, Download, Printer } from 'lucide-react';

export function CustomerStatementPreview({
  statement,
  company,
}: {
  statement: CustomerStatementData;
  company: StatementCompany;
}) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    if (!printRef.current) return null;
    try {
      setIsGenerating(true);
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
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      return pdf;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      pdf.save(\`كشف_حساب_\${statement.customerName}_\${statement.date}.pdf\`);
    } else {
      alert('حدث خطأ أثناء التصدير');
    }
  };

  const handlePrint = async () => {
    const pdf = await generatePDF();
    if (pdf) {
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) {
         win.onload = () => { win.print(); };
      } else {
         alert('يرجى السماح بالنوافذ المنبثقة (Pop-ups) للطباعة، أو استخدم زر التنزيل');
      }
    }
  };

  return (
    <main className="statement-preview" dir="rtl">
      <div className="statement-actions no-print flex gap-3">
        <button onClick={handlePrint} disabled={isGenerating} className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white">
          <Printer className="w-5 h-5" /> 
          {isGenerating ? 'جاري التجهيز...' : 'طباعة'}
        </button>
        <button onClick={handleDownload} disabled={isGenerating} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="w-5 h-5" />
          {isGenerating ? 'جاري التجهيز...' : 'تنزيل PDF'}
        </button>
      </div>

      <CustomerStatement ref={printRef} statement={statement} company={company} />
    </main>
  );
}
`
fs.writeFileSync('src/components/CustomerStatementPreview.tsx', code);
