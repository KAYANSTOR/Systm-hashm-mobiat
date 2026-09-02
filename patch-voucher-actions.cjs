const fs = require('fs');
let content = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');

const regex = /React\.useEffect\(\(\) => \{[\s\S]*?generateBlob\(\);\s*\}, \[voucher, partyName\]\);\s*const handleDownloadPDF = \(\) => \{[\s\S]*?URL\.revokeObjectURL\(url\);\s*\};\s*const handleShareWhatsApp = async \(\) => \{[\s\S]*?alert\('حدث خطأ'\);\s*\}\s*\};/m;

const newCode = `
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

  React.useEffect(() => {
    setIsGenerating(false);
  }, [voucher, partyName]);

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

if (content.match(regex)) {
  content = content.replace(regex, newCode);
  fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', content, 'utf8');
  console.log("Updated VoucherPrintTemplate successfully.");
} else {
  console.log("Could not find regex in VoucherPrintTemplate");
}
