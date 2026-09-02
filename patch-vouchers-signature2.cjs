const fs = require('fs');
let content = fs.readFileSync('src/pages/Vouchers.tsx', 'utf8');

const modalSubmitRegex = /<div className="modal-footer">/;
if (content.match(modalSubmitRegex)) {
  const signatureUI = `
              <div className="col-span-1 md:col-span-2 mb-4">
                <SignaturePad onChange={setSignature} initialValue={signature} />
              </div>
              <div className="modal-footer">`;
  content = content.replace(modalSubmitRegex, signatureUI);
} else {
    console.error("Could not find modal submit buttons");
}

fs.writeFileSync('src/pages/Vouchers.tsx', content, 'utf8');
