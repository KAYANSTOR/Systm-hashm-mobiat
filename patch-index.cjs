const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');
html = html.replace('<link rel="apple-touch-icon"', '<link rel="icon" type="image/svg+xml" href="/icons/icon.svg" />\n    <link rel="apple-touch-icon"');
fs.writeFileSync('index.html', html);
