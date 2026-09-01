const fs = require('fs');
let content = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');

content = content.replace(
  /export default function ReceiptPrint\(\{ data, onClose \}: ReceiptPrintProps\) \{/,
  `export default function ReceiptPrint({ data, onClose }: ReceiptPrintProps) {
  const [cachedBlob, setCachedBlob] = React.useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(true);`
);

fs.writeFileSync('src/components/ReceiptPrint.tsx', content, 'utf8');
