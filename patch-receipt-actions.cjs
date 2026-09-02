const fs = require('fs');
let content = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');

const regex = /const \[cachedBlob[\s\S]*?URL\.revokeObjectURL\(url\);\s*\}\s*\};/m;

const newCode = `
  const [isGenerating, setIsGenerating] = React.useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchPdfBlob = async () => {
    if (!printRef.current) return null;
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(el => el.outerHTML)
      .join('\\n');
    const html = printRef.current.outerHTML;
    
    const response = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html, styles, orientation: 'receipt' }) // receipt uses 80mm width
    });
    
    if (!response.ok) throw new Error('PDF Generation Failed');
    return await response.blob();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const blob = await fetchPdfBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = \`فاتورة_\${data.receiptNumber}.pdf\`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إنشاء الـ PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      setIsGenerating(true);
      const blob = await fetchPdfBlob();
      if (!blob) return;
      
      const file = new File([blob], \`فاتورة_\${data.receiptNumber}.pdf\`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: \`فاتورة رقم \${data.receiptNumber}\`,
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = \`فاتورة_\${data.receiptNumber}.pdf\`;
        link.click();
        URL.revokeObjectURL(url);
        alert('مشاركة الملفات غير مدعومة في هذا المتصفح، تم تنزيل الملف.');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء المشاركة');
    } finally {
      setIsGenerating(false);
    }
  };
`;

content = content.replace(regex, newCode);
content = content.replace(/const handleShareWhatsApp = async \(\) => \{[\s\S]*?\}\s*\};/, ""); 
content = content.replace(/const handlePrint = \(\) => \{\s*window\.print\(\);\s*\};/g, "");

fs.writeFileSync('src/components/ReceiptPrint.tsx', content, 'utf8');
