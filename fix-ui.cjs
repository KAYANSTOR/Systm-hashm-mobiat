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

  // Fix colors
  content = content.replace(/bg-\[\#208480\]/g, 'bg-brand-500');
  content = content.replace(/hover:bg-\[\#1a6b68\]/g, 'hover:bg-brand-600');
  content = content.replace(/text-\[\#208480\]/g, 'text-brand-500');
  content = content.replace(/border-\[\#208480\]/g, 'border-brand-500');
  content = content.replace(/ring-\[\#208480\]\/20/g, 'ring-brand-500/20');

  content = content.replace(/bg-\[\#bd5e8e\]/g, 'bg-accent-500');
  content = content.replace(/hover:bg-\[\#a64e7a\]/g, 'hover:bg-accent-600');
  content = content.replace(/shadow-\[\#bd5e8e\]\/40/g, 'shadow-accent-500/40');

  // We can also convert some standard components if it matches perfectly, but let's stick to safe replaces.
  
  // Header section standardization
  content = content.replace(/<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4(?: no-print)?">/g, '<div className="page-header no-print">');
  // Since some don't have no-print, let's just do:
  content = content.replace(/<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">/g, '<div className="page-header">');
  
  content = content.replace(/<h2 className="text-2xl font-bold text-slate-800">/g, '<h2 className="page-title">');
  content = content.replace(/<p className="text-sm text-slate-500 mt-1">/g, '<p className="page-subtitle">');

  // Card header standardization
  content = content.replace(/<div className="p-4 border-b border-slate-100 bg-slate-50\/50(?: flex justify-between items-center)?">/g, '<div className="card-header">');
  
  // Basic input fields
  // "w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#208480]/20 focus:border-[#208480] transition-all"
  // Let's replace various input field classes with 'input-field'
  const inputClass1 = /w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500\/20 focus:border-teal-500/g;
  content = content.replace(inputClass1, 'input-field');

  const inputClass2 = /w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-\[16px\] focus:outline-none focus:ring-2 focus:ring-brand-500\/20 focus:border-brand-500 transition-all/g;
  content = content.replace(inputClass2, 'input-field pl-4 pr-10');

  const inputClass3 = /w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500\/20 focus:border-brand-500 transition-all/g;
  content = content.replace(inputClass3, 'input-field pl-4 pr-10');
  
  const inputClass4 = /w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500\/20 focus:border-brand-500 transition-all/g;
  content = content.replace(inputClass4, 'input-field');

  // Button standardization for headers: "flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm" -> "btn-primary"
  content = content.replace(/className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"/g, 'className="btn-primary"');
  content = content.replace(/className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"/g, 'className="btn-secondary"');
  content = content.replace(/className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-\[16px\] font-semibold transition-colors shadow-sm"/g, 'className="btn-primary"');
  content = content.replace(/className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-\[16px\] font-semibold transition-colors shadow-sm"/g, 'className="btn-secondary"');
  
  // Table
  content = content.replace(/<table className="w-full text-\[11px\] sm:text-xs md:text-sm text-right">/g, '<table className="table-standard">');
  content = content.replace(/<thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">/g, '<thead>');
  
  // Some standard border radiuses like rounded-[16px] or rounded-[24px] -> rounded-2xl
  content = content.replace(/rounded-\[16px\]/g, 'rounded-2xl');
  content = content.replace(/rounded-\[24px\]/g, 'rounded-3xl');

  // Modals
  content = content.replace(/<div className="fixed inset-0 bg-slate-900\/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">/g, '<div className="modal-overlay">');
  content = content.replace(/<div className="bg-white rounded-2xl w-full max-w-2xl max-h-\[90vh\] overflow-hidden shadow-xl flex flex-col">/g, '<div className="modal-content">');
  content = content.replace(/<div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-white shrink-0">/g, '<div className="modal-header">');
  content = content.replace(/<div className="flex-1 overflow-y-auto p-4 sm:p-6">/g, '<div className="modal-body">');
  content = content.replace(/<div className="p-4 sm:p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-2">/g, '<div className="modal-footer">');
  
  // Also common button formats in modals
  content = content.replace(/className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"/g, 'className="btn-outline"');
  content = content.replace(/className="px-4 py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors shadow-sm"/g, 'className="btn-primary"');
  
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Done replacing patterns');
