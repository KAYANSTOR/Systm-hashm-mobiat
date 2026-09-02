const fs = require('fs');
let content = fs.readFileSync('src/pages/Reports.tsx', 'utf8');
content = content.replace(/<button onClick=\{shareReportPDF\} className="btn-primary">/, '<button onClick={() => shareReportPDF("share")} className="btn-primary">');
fs.writeFileSync('src/pages/Reports.tsx', content, 'utf8');
