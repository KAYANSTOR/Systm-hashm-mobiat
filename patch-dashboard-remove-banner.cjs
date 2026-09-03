const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target = `      {/* Status Banner */}
      <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
        <div className="bg-white text-emerald-600 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100 flex items-center gap-1.5 shadow-sm">
          <CheckCircle2 className="w-3.5 h-3.5" /> نشطة
        </div>
        <div className="flex items-center gap-3 text-right">
          <div>
            <h4 className="font-bold text-teal-800 text-sm">النظام يعمل بشكل سليم</h4>
            <p className="text-xs text-teal-600 mt-0.5">معالجة مبالغ الفئات المعرفة فقط</p>
          </div>
          <div className="bg-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>`;

if (code.includes(target)) {
  code = code.replace(target, '');
  fs.writeFileSync('src/pages/Dashboard.tsx', code);
  console.log('Banner removed successfully');
} else {
  console.log('Target block not found, trying regex fallback');
  const bannerRegex = /\{\/\* Status Banner \*\/\}.*?<\/div>.*?<\/div>.*?<\/div>.*?<\/div>/s;
  if(bannerRegex.test(code)) {
    code = code.replace(bannerRegex, '');
    fs.writeFileSync('src/pages/Dashboard.tsx', code);
    console.log('Banner removed successfully with regex');
  } else {
    console.log('Banner not found at all');
  }
}
