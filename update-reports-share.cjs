const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

const newShareFunction = `  const shareReportPDF = async () => {
    if (!reportRef.current) return;
    try {
      // Create a small visual loading state on button by just standard react state (if we had one, but we don't need to add it unless necessary)
      const filter = (node: HTMLElement) => {
        if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) return false;
        return true;
      };
      
      const dataUrl = await htmlToImage.toJpeg(reportRef.current, { quality: 0.95, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });
      
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output('blob');
      const filename = \`تقرير_\${reportType === 'sales' ? 'المبيعات' : 'العملاء'}_\${new Date().getTime()}.pdf\`;
      
      if (navigator.canShare && navigator.canShare({ files: [new File([pdfBlob], 'test.pdf', { type: 'application/pdf' })] })) {
        try {
           const file = new File([pdfBlob], filename, { type: 'application/pdf' });
           await navigator.share({
             title: 'تقرير معامل هاشم الأحمدي',
             text: \`تقرير \${reportType === 'sales' ? 'المبيعات' : 'العملاء'}\`,
             files: [file],
           });
        } catch(e: any) {
           if (e.name !== 'AbortError') {
             pdf.save(filename);
           }
        }
      } else {
        pdf.save(filename);
      }
    } catch (error) {
      console.error('Error sharing PDF:', error);
      alert('تعذرت العملية. حاول الطباعة بدلاً من ذلك.');
    }
  };`;

content = content.replace(/const shareReportPDF = async \(\) => \{[\s\S]*?\} catch \(error\) \{[\s\S]*?\}  \};/, newShareFunction);

fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
