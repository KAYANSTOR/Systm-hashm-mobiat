const fs = require('fs');
let content = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// Also remove -mx-8 px-8 from dashboard if it's there
content = content.replace(/<div className="-mx-8 px-8">/g, '<div>');

fs.writeFileSync('src/pages/Dashboard.tsx', content, 'utf8');
