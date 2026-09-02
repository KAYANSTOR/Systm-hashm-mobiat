const fs = require('fs');

let content = fs.readFileSync('src/components/VoucherPrintTemplate.tsx', 'utf8');

// Ensure Scissors is imported
if (!content.includes('Scissors')) {
    content = content.replace(/import \{ Share2, Printer, X, Download \} from 'lucide-react';/, "import { Share2, Printer, X, Download, Scissors } from 'lucide-react';");
}

// Update the logo section
const logoRegex = /<div className="w-40 ml-4 shrink-0 flex flex-col items-center">\s*\{\/\* Mimicking logo with CSS \*\/\}\s*<div className="text-\[\#199b9e\] font-extrabold text-5xl leading-none relative">\s*<span className="absolute -top-4 right-0 text-sm">الأحمدي<\/span>\s*هاشم\s*<\/div>\s*<div className="text-\[\#199b9e\] font-bold text-sm mt-1 whitespace-nowrap">للتطريز الإلكتروني<\/div>\s*<\/div>/;

const newLogo = `<div className="w-40 ml-4 shrink-0 flex flex-col items-center justify-center">
                   <div className="w-20 h-20 bg-[#199b9e] text-white rounded-full flex items-center justify-center mb-2 shadow-sm border-4 border-teal-100">
                     <Scissors className="w-10 h-10" />
                   </div>
                   <div className="text-[#199b9e] font-black text-lg leading-none tracking-tight">معامل الأحمدي</div>
                   <div className="text-slate-500 font-bold text-xs mt-1">للتطريز الإلكتروني</div>
                </div>`;
                
if (logoRegex.test(content)) {
    content = content.replace(logoRegex, newLogo);
}

// Add Print Date to the bottom left or somewhere
const printDateHtml = `
              <div className="absolute bottom-4 left-6 text-xs text-slate-400 font-mono" dir="ltr">
                Printed: {new Date().toLocaleString('en-GB')}
              </div>
`;

// Insert it before the end of the print-section
const endOfPrintSection = /<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Global Print Styles/g;
if (content.match(endOfPrintSection)) {
    content = content.replace(/<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\{\/\* Global Print Styles/, 
    `  ${printDateHtml}\n            </div>\n          </div>\n        </div>\n      </div>\n\n      {/* Global Print Styles`);
}

fs.writeFileSync('src/components/VoucherPrintTemplate.tsx', content, 'utf8');

