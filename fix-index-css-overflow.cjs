const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/@apply overflow-x-auto w-full;/g, '@apply w-full;');
fs.writeFileSync('src/index.css', css, 'utf8');
