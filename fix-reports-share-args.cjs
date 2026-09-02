const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');

// Replace the function definition line
content = content.replace(/const shareReportPDF = async \(\) => \{/, "const shareReportPDF = async (action: 'share' | 'download' = 'share') => {");

// Add the action logic if it's missing (it seems my previous script failed completely!)
if (!content.includes('if (action === \'download\') {')) {
  // Wait, if it failed completely, I need to redo the whole thing for Reports
  // Let me just check if the newShare logic is there
}

fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
