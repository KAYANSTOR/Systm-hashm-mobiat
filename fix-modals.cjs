const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const files = walkSync('./src');
const tsxFiles = files.filter(f => f.endsWith('.tsx'));

tsxFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Specific to Inventory.tsx or similar
  content = content.replace(/className="fixed inset-0 bg-slate-900\/50 z-\[100\] flex items-center justify-center sm:p-4"/g, 'className="modal-overlay"');
  content = content.replace(/className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-\[90vh\] max-w-[a-zA-Z0-9]+ overflow-hidden shadow-xl flex flex-col"/g, 'className="modal-content"');
  content = content.replace(/className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-\[90vh\] max-w-xl overflow-hidden shadow-xl flex flex-col"/g, 'className="modal-content"');
  content = content.replace(/className="bg-white sm:rounded-2xl w-full h-full sm:h-auto sm:max-h-\[90vh\] max-w-3xl overflow-hidden shadow-2xl flex flex-col"/g, 'className="modal-content"');
  content = content.replace(/className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50\/50 shrink-0"/g, 'className="modal-header"');
  content = content.replace(/className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0"/g, 'className="modal-header"');
  content = content.replace(/className="p-4 space-y-4 flex-1 overflow-y-auto"/g, 'className="modal-body space-y-4"');
  content = content.replace(/className="p-4 border-t border-slate-100 bg-slate-50\/50 flex justify-end gap-3 shrink-0"/g, 'className="modal-footer"');
  content = content.replace(/className="p-4 border-t border-slate-100 flex justify-end gap-3 shrink-0"/g, 'className="modal-footer"');
  
  // labels and inputs
  content = content.replace(/className="block text-sm font-semibold text-slate-700 mb-1"/g, 'className="label"');
  content = content.replace(/className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500\/20"/g, 'className="input-field"');
  content = content.replace(/className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500\/20 focus:border-brand-500"/g, 'className="input-field"');

  // text styles
  content = content.replace(/font-semibold/g, 'font-bold');

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Done replacing modal patterns');
