const fs = require('fs');
let content = fs.readFileSync('src/components/ReceiptPrint.tsx', 'utf8');

if (!content.includes('signature?: string;')) {
    content = content.replace(/type: 'receipt' \| 'payment' \| 'deferred';/, "type: 'receipt' | 'payment' | 'deferred';\n  signature?: string;");
}

const receiverRegex = /<div className="receipt-signature receipt-receiver">\s*<div className="receipt-signature-title">\s*المستلم\s*<\/div>\s*<div className="receipt-signature-line">\s*\{data\.receiver\}\s*<\/div>\s*<\/div>/;

const newReceiver = `<div className="receipt-signature receipt-receiver">
                  <div className="receipt-signature-title">
                    المستلم
                  </div>
                  <div className="receipt-signature-line" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {data.signature ? (
                       <img src={data.signature} alt="Signature" style={{ maxHeight: '40px', mixBlendMode: 'multiply', marginBottom: '4px' }} />
                    ) : null}
                    <span>{data.receiver}</span>
                  </div>
                </div>`;

if (content.match(receiverRegex)) {
  content = content.replace(receiverRegex, newReceiver);
}

fs.writeFileSync('src/components/ReceiptPrint.tsx', content, 'utf8');
