const fs = require('fs');
let inv = fs.readFileSync('src/components/InvoicePrintTemplate.tsx', 'utf8');

// The replacement I did earlier using fix.cjs:
// I replaced:
// `<div className="w-56 flex flex-col items-center shrink-0">[\s\S]*?alt="شعار الاحمدي هاشم" />\s*</div>\s*</div>\s*</div>`
// with the same thing... wait, I didn't actually remove the extra `</div>` !
// Let's just do a string replacement to fix the extra `</div>`.

const badPart = `<div className="w-56 flex flex-col items-center shrink-0">
  <img src="/logo.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" />
</div>
</div>
</div>
              </div>
            </div>`;

const goodPart = `<div className="w-56 flex flex-col items-center shrink-0">
  <img src="/logo.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" />
</div>
              </div>
            </div>`;

if (inv.includes(badPart)) {
  inv = inv.replace(badPart, goodPart);
} else {
  // Try another variation
  const badPart2 = `<div className="w-56 flex flex-col items-center shrink-0">
                  <img src="/logo.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" />
                </div>
              </div>
            </div>
                  <div className="bg-[#088c94] text-white px-3 py-1 rounded-md text-[16px] font-bold w-full text-center tracking-wide">
                    للتطريز الإلكتروني
                  </div>
                </div>
              </div>
            </div>`;
            
  const goodPart2 = `<div className="w-56 flex flex-col items-center shrink-0">
                  <img src="/logo.png" className="w-full h-auto object-contain max-h-32" alt="شعار الاحمدي هاشم" />
                </div>
              </div>
            </div>`;
            
  if (inv.includes(badPart2)) {
    inv = inv.replace(badPart2, goodPart2);
  }
}

fs.writeFileSync('src/components/InvoicePrintTemplate.tsx', inv);

