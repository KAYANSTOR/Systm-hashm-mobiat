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

  content = content.replace(/className="pt-4 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white"/g, 'className="modal-footer"');
  content = content.replace(/className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl"/g, 'className="btn-outline"');
  content = content.replace(/className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl"/g, 'className="btn-primary"');
  
  // also standard border-t flex justify-end gap-3
  content = content.replace(/className="flex justify-end gap-3 pt-4 border-t border-slate-100"/g, 'className="modal-footer"');

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Done fixing footers');
