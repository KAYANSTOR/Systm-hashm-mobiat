const fs = require('fs');
let content = fs.readFileSync('./src/pages/Sales.tsx', 'utf8');
content = content.replace(/setSelectedPartyName\(party \? party\.name : ''\);\n\s*\}\n\s*\}/g, "setSelectedPartyName(party ? party.name : '');\n    }");
fs.writeFileSync('./src/pages/Sales.tsx', content, 'utf8');
