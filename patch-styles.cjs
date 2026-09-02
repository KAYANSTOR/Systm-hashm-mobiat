const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const targetLayerBase = `@layer base {
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: fixed;
  }
  body {
    font-family: var(--font-cairo);
    @apply bg-[#f4f6f9] text-slate-900;
  }
}`;

const replaceLayerBase = `@layer base {
  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: fixed;
  }
  body {
    font-family: var(--font-cairo);
    @apply bg-[#f4f6f9] text-slate-900;
  }

  /* Global Select Styling (RTL Aware) */
  select {
    @apply appearance-none bg-no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23208480'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
    background-position: left 1rem center;
    background-size: 1.25rem;
    padding-left: 2.75rem !important; /* Space for the chevron on the left */
  }

  /* Custom styling for date inputs */
  input[type="date"] {
    @apply appearance-none relative;
  }
  
  /* Colorize the calendar icon to match brand-500 */
  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s;
    /* This filter approximates #208480 */
    filter: invert(36%) sepia(35%) saturate(740%) hue-rotate(133deg) brightness(94%) contrast(85%);
  }
  input[type="date"]::-webkit-calendar-picker-indicator:hover {
    opacity: 1;
  }
}`;

if (code.includes(targetLayerBase)) {
    code = code.replace(targetLayerBase, replaceLayerBase);
    fs.writeFileSync('src/index.css', code);
    console.log('Successfully updated index.css layer base');
} else {
    console.log('Could not find target layer base block');
}
