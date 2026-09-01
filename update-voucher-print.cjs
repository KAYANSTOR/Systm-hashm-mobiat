const fs = require('fs');
let content = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');

// Add state
content = content.replace(
  /export default function VoucherPrintTemplate\(\{ voucher, partyName, onClose \}: VoucherPrintTemplateProps\) \{/,
  `export default function VoucherPrintTemplate({ voucher, partyName, onClose }: VoucherPrintTemplateProps) {\n  const [cachedBlob, setCachedBlob] = React.useState<Blob | null>(null);\n  const [isGenerating, setIsGenerating] = React.useState(true);`
);

// Add useEffect
content = content.replace(
  /const printRef = useRef<HTMLDivElement>\(null\);/,
  `const printRef = useRef<HTMLDivElement>(null);\n\n  React.useEffect(() => {\n    const generateBlob = async () => {\n      if (!printRef.current) return;\n      try {\n        const filter = (node: HTMLElement) => {\n          if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) return false;\n          return true;\n        };\n        await new Promise(r => setTimeout(r, 800));\n        const blob = await htmlToImage.toBlob(printRef.current, { quality: 0.9, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });\n        setCachedBlob(blob);\n      } catch (err) {\n        console.error('Pre-generation error:', err);\n      } finally {\n        setIsGenerating(false);\n      }\n    };\n    generateBlob();\n  }, [voucher, partyName]);`
);

// Update handleShareWhatsApp
const newHandleShare = `const handleShareWhatsApp = async () => {
    try {
      if (cachedBlob && navigator.canShare && navigator.canShare({ files: [new File([cachedBlob], 'test.png', { type: 'image/png' })] })) {
        const file = new File([cachedBlob], \`سند_\${voucher.voucherNumber}.png\`, { type: 'image/png' });
        await navigator.share({
          title: 'سند ' + (voucher.type === 'receipt' ? 'قبض' : 'صرف'),
          text: \`سند رقم: \${voucher.voucherNumber}\\nالمبلغ: \${formatCurrency(voucher.amount)}\`,
          files: [file],
        });
      } else {
        const text = \`*معامل هاشم الأحمدي للتطريز الإلكتروني*\\n\\nسند \${voucher.type === 'receipt' ? 'قبض' : 'صرف'}\\nرقم: \${voucher.voucherNumber}\\nالتاريخ: \${formatDate(voucher.date)}\\n\\nالطرف: \${partyName}\\nالمبلغ: \${formatCurrency(voucher.amount)}\`;
        window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      if (error.name === 'AbortError') return;
      alert('تعذرت المشاركة. يمكنك طباعة السند أو أخذ لقطة شاشة.');
    }
  };`;
content = content.replace(/const handleShareWhatsApp = async \(\) => \{[\s\S]*?\} catch \(error: any\) \{[\s\S]*?\}  \};/, newHandleShare);

// Make the share button disabled while generating
content = content.replace(/<button onClick=\{handleShareWhatsApp\} className="flex items-center gap-2 px-3 py-1\.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors">/,
  `<button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">`);
// Add generating indicator text
content = content.replace(/<span className="hidden sm:inline">واتساب<\/span>/,
  `{isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">واتساب</span>}`);

fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', content, 'utf8');
