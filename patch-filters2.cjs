const fs = require('fs');
let css = fs.readFileSync('src/components/StatementFilters.css', 'utf8');

css = css.replace(/\.wheel-picker \{[\s\S]*?\}/, `.wheel-picker {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  direction: ltr;
  position: relative;
  margin-bottom: 18px;
}
.wheel-picker::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 60px;
  transform: translateY(-50%);
  border: 1px solid var(--system-border);
  border-radius: 16px;
  pointer-events: none;
  z-index: 1;
}`);

css = css.replace(/\.wheel-column \+ \.wheel-column \{[\s\S]*?\}/, `.wheel-column + .wheel-column {
  /* No border between columns */
}`);

css = css.replace(/\.wheel-item\.current \{[\s\S]*?\}/, `.wheel-item.current {
  color: var(--system-danger);
}`);

css = css.replace(/\.confirm-button \{[\s\S]*?\}/, `.confirm-button {
  width: 100%;
  min-height: 64px;
  border: 0;
  border-radius: 18px;
  background: var(--system-danger);
  color: #fff;
  font: inherit;
  font-size: 18px;
  font-weight: 900;
  cursor: pointer;
}`);

css = css.replace(/\.confirm-button:hover \{[\s\S]*?\}/, `.confirm-button:hover {
  opacity: 0.9;
}`);

// Also fix hover for continue button, as I just matched confirm-button too loosely earlier.
// Earlier: .continue-button:hover, .confirm-button:hover { background: var(--system-primary-dark); }
css = css.replace(/\.continue-button:hover,\s*\.confirm-button:hover \{[\s\S]*?\}/, `.continue-button:hover {
  background: var(--system-primary-dark);
}
.confirm-button:hover {
  opacity: 0.9;
}`);

fs.writeFileSync('src/components/StatementFilters.css', css);
console.log('CSS patched');
