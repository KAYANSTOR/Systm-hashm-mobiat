const fs = require('fs');
if (!fs.existsSync('src/components/ReceiptPrint.tsx')) {
  process.exit(0);
}
let content = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');

// Add state
content = content.replace(
  /export default function ReceiptPrint\(\{[\s\S]*?\}\) \{/,
  (match) => match + `\n  const [cachedBlob, setCachedBlob] = React.useState<Blob | null>(null);\n  const [isGenerating, setIsGenerating] = React.useState(true);`
);

// Add useEffect
content = content.replace(
  /const printRef = useRef<HTMLDivElement>\(null\);/,
  `const printRef = useRef<HTMLDivElement>(null);\n\n  React.useEffect(() => {\n    const generateBlob = async () => {\n      if (!printRef.current) return;\n      try {\n        const filter = (node: HTMLElement) => {\n          if (node.tagName === 'LINK' && (node as HTMLLinkElement).href.includes('fonts.googleapis')) return false;\n          return true;\n        };\n        await new Promise(r => setTimeout(r, 800));\n        const blob = await htmlToImage.toBlob(printRef.current, { quality: 0.9, pixelRatio: 2, backgroundColor: '#ffffff', filter: filter as any });\n        setCachedBlob(blob);\n      } catch (err) {\n        console.error('Pre-generation error:', err);\n      } finally {\n        setIsGenerating(false);\n      }\n    };\n    generateBlob();\n  }, []);`
);

// Update handleShareWhatsApp
const newHandleShare = `const handleShareWhatsApp = async () => {
    try {
      if (cachedBlob && navigator.canShare && navigator.canShare({ files: [new File([cachedBlob], 'test.png', { type: 'image/png' })] })) {
        const file = new File([cachedBlob], \`ايصال.png\`, { type: 'image/png' });
        await navigator.share({
          title: 'إيصال',
          files: [file],
        });
      } else {
        const text = \`*معامل هاشم الأحمدي للتطريز الإلكتروني*\\n\\nإيصال استلام\`;
        window.open(\`https://wa.me/?text=\${encodeURIComponent(text)}\`, '_blank');
      }
    } catch (error: any) {
      console.error('Error sharing:', error);
      if (error.name === 'AbortError') return;
      alert('تعذرت المشاركة.');
    }
  };`;
content = content.replace(/const handleShareWhatsApp = async \(\) => \{[\s\S]*?\} catch \(error: any\) \{[\s\S]*?\}  \};/, newHandleShare);

content = content.replace(/<button onClick=\{handleShareWhatsApp\} className="flex items-center gap-2 px-3 py-1\.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors">/,
  `<button onClick={handleShareWhatsApp} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-bold transition-colors disabled:opacity-50">`);
content = content.replace(/<span className="hidden sm:inline">واتساب<\/span>/,
  `{isGenerating ? <span className="hidden sm:inline text-xs">جاري التجهيز...</span> : <span className="hidden sm:inline">واتساب</span>}`);

fs.writeFileSync('src/components/ReceiptPrint.tsx', content, 'utf8');
