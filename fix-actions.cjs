const fs = require('fs');
let content = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');

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
      body: JSON.stringify({ html, styles, orientation: 'landscape' })
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
      link.download = \`سند_\${voucher.voucherNumber}.pdf\`;
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
      
      const file = new File([blob], \`سند_\${voucher.voucherNumber}.pdf\`, { type: 'application/pdf' });
      
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: \`سند رقم \${voucher.voucherNumber}\`,
          files: [file]
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = \`سند_\${voucher.voucherNumber}.pdf\`;
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
content = content.replace(/const handleShareWhatsApp = async \(\) => \{[\s\S]*?\}\s*\};/, ""); // clean up the other handleShareWhatsApp if it's there
content = content.replace(/const handlePrint = \(\) => \{\s*window\.print\(\);\s*\};/g, ""); // clean up duplicate handlePrint

fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', content, 'utf8');
