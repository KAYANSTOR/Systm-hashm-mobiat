const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf8');

const responsiveCSS = `
/* Responsive Tables for Mobile */
@media (max-width: 639px) {
  .table-standard, .table-standard tbody, .table-standard tr, .table-standard td {
    display: block;
    width: 100%;
    white-space: normal !important;
  }
  .table-standard thead {
    display: none;
  }
  .table-standard tr {
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
  }
  .table-standard td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem !important;
    border-bottom: 1px solid #f8fafc !important;
    text-align: right;
    gap: 1rem;
  }
  .table-standard td:last-child {
    border-bottom: none !important;
    background-color: #f8fafc;
    justify-content: flex-end;
  }
  
  /* Remove wrapping box styles from table containers on mobile since rows are now cards */
  .table-container-wrapper {
    background-color: transparent !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
}
`;

css += responsiveCSS;

fs.writeFileSync('src/index.css', css, 'utf8');
