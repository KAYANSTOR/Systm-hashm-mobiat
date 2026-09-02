const fs = require('fs');
['src/components/VoucherPrintTemplate.tsx', 'src/components/ReceiptPrint.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('const handleShareWhatsApp = async () => {')) {
    const fetchRegex = /const handleDownloadPDF = async \(\) => \{/;
    const shareCode = `
  const handleShareWhatsApp = async () => {
    try {
      setIsGenerating(true);
      const blob = await fetchPdfBlob();
      if (!blob) return;
      const file = new File([blob], 'مستند.pdf', { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'مستند', files: [file] });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'مستند.pdf';
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
      alert('خطأ في المشاركة');
    } finally {
      setIsGenerating(false);
    }
  };

`;
    content = content.replace(fetchRegex, shareCode + "  const handleDownloadPDF = async () => {");
    fs.writeFileSync(file, content, 'utf8');
  }
});

let serverTs = fs.readFileSync('server.ts', 'utf8');
serverTs = serverTs.replace(/waitUntil: 'networkidle0'/g, "waitUntil: 'networkidle2' as any");
fs.writeFileSync('server.ts', serverTs, 'utf8');

