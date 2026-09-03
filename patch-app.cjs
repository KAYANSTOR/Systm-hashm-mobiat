const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
if (!code.includes("import Settings")) {
  code = code.replace(/import Expenses from '.\/pages\/Expenses';/, "import Expenses from './pages/Expenses';\nimport Settings from './pages/Settings';");
}

// Add case
if (!code.includes("case 'settings':")) {
  code = code.replace(/case 'expenses': return <Expenses \/>;/, "case 'expenses': return <Expenses />;\n      case 'settings': return <Settings />;");
}

fs.writeFileSync('src/App.tsx', code);
console.log('patched App.tsx');
