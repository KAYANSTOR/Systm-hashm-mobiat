const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
// Change whitespace-nowrap to whitespace-normal or remove it from table-standard
css = css.replace(/@apply w-full text-xs sm:text-sm text-right whitespace-nowrap;/g, '@apply w-full text-xs sm:text-sm text-right;');
fs.writeFileSync('src/index.css', css, 'utf8');
