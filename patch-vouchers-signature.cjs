const fs = require('fs');
let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

if (!content.includes('import SignaturePad')) {
  content = content.replace(
    /import VoucherPrintTemplate from '\.\.\/components\/VoucherPrintTemplate';/,
    "import VoucherPrintTemplate from '../components/VoucherPrintTemplate';\nimport SignaturePad from '../components/SignaturePad';"
  );
}

if (!content.includes('const [signature, setSignature] = useState')) {
  content = content.replace(
    /const \[description, setDescription\] = useState\(''\);/,
    "const [description, setDescription] = useState('');\n  const [signature, setSignature] = useState<string | null>(null);"
  );
  
  content = content.replace(
    /setDescription\(''\);\s*setIsModalOpen\(true\);/,
    "setDescription('');\n    setSignature(null);\n    setIsModalOpen(true);"
  );
  
  content = content.replace(
    /createdBy: auth\.currentUser\?\.uid \|\| 'user', \/\/ Handled by backend\/auth usually\s*referenceNumber: ''/,
    "createdBy: auth.currentUser?.uid || 'user',\n      referenceNumber: '',\n      signature"
  );
}

// Find where to put the SignaturePad in the modal
// Likely near the end of the form, before the submit button
const modalSubmitRegex = /<div className="flex gap-3 pt-4 border-t border-slate-100">/;
if (content.match(modalSubmitRegex)) {
  const signatureUI = `
              <div className="col-span-1 md:col-span-2">
                <SignaturePad onChange={setSignature} initialValue={signature} />
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">`;
  content = content.replace(modalSubmitRegex, signatureUI);
} else {
    console.error("Could not find modal submit buttons");
}

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');
