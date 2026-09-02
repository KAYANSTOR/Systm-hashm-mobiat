const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// we'll replace the select {} block to include !important on background properties.
const newCSS = css.replace(/select \{[^}]+\}/, `select {
    @apply appearance-none shadow-sm transition-all;
    background-color: white !important;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23208480'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9' /%3E%3C/svg%3E") !important;
    background-position: left 1rem center !important;
    background-size: 1.25rem !important;
    background-repeat: no-repeat !important;
    padding-left: 2.75rem !important;
    cursor: pointer !important;
}`);

fs.writeFileSync('src/index.css', newCSS);
console.log('Added !important to select styles.');
