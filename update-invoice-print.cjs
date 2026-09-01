const fs = require('fs');
let content = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf8');

// Add state for pre-generated blob
content = content.replace(
  /export default function InvoicePrintTemplate\(\{ invoice, partyName, onClose \}: InvoicePrintTemplateProps\) \{/,
  `export default function InvoicePrintTemplate({ invoice, partyName, onClose }: InvoicePrintTemplateProps) {\n  const [cachedBlob, setCachedBlob] = React.useState<Blob | null>(null);\n  const [isGenerating, setIsGenerating] = React.useState(true);`
);

// Add useEffect to generate blob
content = content.replace(
  /const printRef = useRef<HTMLDivElement>\(null\);/,
  `const printRef = useRef<HTMLDivElement>(null);\n\n  React.useEffect(() => {\n    const generateBlob = async () => {\n      if (!printRef.current) return;\n      try {\n        const filter = (node: HTMLElement) => {\n          if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) return false;\n          return true;\n        };\n        // small delay to ensure fonts/render is ready\n        await new Promise(r => setTimeout(r, 800));\n        const blob = await htmlToImage.toBlob(printRef.current, { quality: 0.9, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });\n        setCachedBlob(blob);\n      } catch (err) {\n        console.error('Pre-generation error:', err);\n      } finally {\n        setIsGenerating(false);\n      }\n    };\n    generateBlob();\n  }, [invoice, partyName]);`
);

// Update handleShareWhatsApp
const newHandleShare = `const handleShareWhatsApp = async () => {
    try {
      if (cachedBlob && navigator.canShare && navigator.canShare({ files: [new File([cachedBlob], 'test.png', { type: 'image/png' })] })) {
        const file = new File([cachedBlob], \`فاتورة_\${invoice.invoiceNumber}.png\`, { type: 'image/png' });
        await navigator.share({
          title: 'فاتورة ' + (invoice.type === 'sale' ? 'مبيعات' : 'مشتريات'),
          text: \`فاتورة رقم: \${invoice.invoiceNumber}\\nالمبلغ الإجمالي: \${formatCurrency(invoice.total)}\`,
          files: [file],
        });
      } else {
        const text = \`*معامل هاشم الأحمدي للتطريز الإلكتروني*\\n\\nفاتورة \${invoice.type === 'sale' ? 'مبيعات' : 'مشتريات'}\\nرقم: \${invoice.invoiceNumber}\\nالتاريخ: \${formatDate(invoice.date)}\\n\\nالطرف: \${partyName}\\nالإجمالي: \${formatCurrency(invoice.total)}\`;
        window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      if (error.name === 'AbortError') return;
      alert('تعذرت المشاركة. يمكنك طباعة الفاتورة أو أخذ لقطة شاشة.');
    }
  };`;

content = content.replace(/const handleShareWhatsApp = async \(\) => \{[\s\S]*?\} catch \(error: any\) \{[\s\S]*?\}  \};/, newHandleShare);

// Make the share button disabled while generating
content = content.replace(/<button onClick=\{handleShareWhatsApp\} className="flex items-center gap-2 px-3 py-1\.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors">/,
  `<button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">`);
// Add generating indicator text
content = content.replace(/<span className="hidden sm:inline">واتساب<\/span>/,
  `{isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">واتساب</span>}`);

fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', content, 'utf8');
