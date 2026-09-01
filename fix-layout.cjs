const fs = require('fs');
let layout = fs.readFileSync('src/components/Layout.tsx', 'utf8');

// Remove LogOut import
layout = layout.replace(/\s*LogOut,\s*/g, " ");

// Remove LogOut button
layout = layout.replace(/<button onClick=\{onSignOut\} className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="تسجيل الخروج">\s*<LogOut className="w-5 h-5 ml-0.5" \/>\s*<\/button>/g, "");

fs.writeFileSync('src/components/Layout.tsx', layout, 'utf8');
