const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const oldInputField = `.input-field {
    @apply w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-medium text-slate-800;
  }`;

const newInputField = `.input-field {
    @apply w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-bold text-slate-800 shadow-sm hover:border-brand-300;
  }`;

if (code.includes(oldInputField)) {
    code = code.replace(oldInputField, newInputField);
    fs.writeFileSync('src/index.css', code);
    console.log('Replaced .input-field styles.');
} else {
    console.log('Could not find .input-field styles.');
}
