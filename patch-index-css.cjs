const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

if (!css.includes('accent-color')) {
  css = css.replace(/body \{/, 'body {\n    accent-color: var(--color-brand-500);');
  css = css.replace(/input\[type="date"\] \{/, 'input[type="date"] {\n    accent-color: var(--color-brand-500);');
  fs.writeFileSync('src/index.css', css);
  console.log('patched index.css with accent-color');
} else {
  console.log('already patched');
}
