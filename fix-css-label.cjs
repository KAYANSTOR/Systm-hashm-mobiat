const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/  \.table-standard td:last-child \{\n    border-bottom: none !important;\n    background-color: #f8fafc;\n    justify-content: flex-end;\n  \}/, `  .table-standard td:last-child {
    border-bottom: none !important;
    background-color: #f8fafc;
    justify-content: flex-end;
  }
  
  .table-standard td::before {
    content: attr(data-label);
    font-weight: 700;
    color: #64748b;
    font-size: 0.875rem;
  }`);
fs.writeFileSync('src/index.css', css, 'utf8');
