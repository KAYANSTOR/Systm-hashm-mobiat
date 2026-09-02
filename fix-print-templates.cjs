const fs = require('fs');

function fixTemplate(filePath, namePrefix) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix the handleShareWhatsApp logic to actually use the cachedBlob we created
  const sharePattern = /const handleShareWhatsApp = async \(\) => \{[\s\S]*?\} catch \(error[\s\S]*?\}\s*\};/;
  
  const newShare = `const handleShareWhatsApp = async () => {
    try {
      if (cachedBlob && navigator.canShare && navigator.canShare({ files: [new File([cachedBlob], 'test.pdf', { type: 'application/pdf' })] })) {
        const file = new File([cachedBlob], \`${namePrefix}.pdf\`, { type: 'application/pdf' });
        await navigator.share({
          title: '${namePrefix}',
          files: [file],
        });
      } else {
        alert('المتصفح لا يدعم مشاركة الملفات مباشرة. يمكنك تحميل الـ PDF ثم مشاركته.');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      if (error.name === 'AbortError') return;
      alert('تعذرت المشاركة.');
    }
  };

  const handleDownloadPDF = () => {
    if (cachedBlob) {
      const url = URL.createObjectURL(cachedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = \`${namePrefix}.pdf\`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };`;
  
  if (sharePattern.test(content)) {
    content = content.replace(sharePattern, newShare);
  }

  // Add the Download PDF button if not present
  if (!content.includes('handleDownloadPDF')) {
     console.log("Failed to insert handleDownloadPDF in " + filePath);
  }

  // Add the actual button to the UI
  const buttonPattern = /<button onClick=\{handleShareWhatsApp\} disabled=\{isGenerating\} className="[^"]*">[\s\S]*?<\/button>/;
  if (buttonPattern.test(content) && !content.includes('تنزيل PDF')) {
    const shareBtn = content.match(buttonPattern)[0];
    const dlBtn = `
            <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold transition-colors disabled:opacity-50">
              <Download className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">تنزيل PDF</span>}
            </button>`;
    content = content.replace(buttonPattern, shareBtn + dlBtn);
  } else if (!content.includes('تنزيل PDF')) {
    // If it didn't have the disabled={isGenerating} button
    const fallbackBtn = /<button onClick=\{handleShareWhatsApp\} className="[^"]*">[\s\S]*?<\/button>/;
    if (fallbackBtn.test(content)) {
        const shareBtn = content.match(fallbackBtn)[0];
        const dlBtn = `
                <button onClick={handleDownloadPDF} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-bold transition-colors disabled:opacity-50">
                  <Download className="w-4 h-4" /> {isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">تنزيل PDF</span>}
                </button>`;
        content = content.replace(fallbackBtn, shareBtn + dlBtn);
    }
  }

  // Ensure Download is imported from lucide-react
  if (!content.includes('Download,')) {
    content = content.replace(/import \{ Share2, Printer, X \} from 'lucide-react';/, "import { Share2, Printer, X, Download } from 'lucide-react';");
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

fixTemplate('src/components/VoucherPrintTemplate.tsx', 'سند');
fixTemplate('src/components/InvoicePrintTemplate.tsx', 'فاتورة');
fixTemplate('src/components/ReceiptPrint.tsx', 'ايصال');

