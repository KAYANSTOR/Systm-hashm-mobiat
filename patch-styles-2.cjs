const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

const oldGlobalSelect = `  /* Global Select Styling (RTL Aware) */
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
  }`;

const newGlobalSelect = `  /* Global Form Control Styling (RTL Aware) */
  select {
    @apply appearance-none bg-no-repeat shadow-sm transition-all;
    /* Double chevron up/down icon for better visual affordance */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%23208480'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9' /%3E%3C/svg%3E");
    background-position: left 1rem center;
    background-size: 1.25rem;
    padding-left: 2.75rem !important;
    cursor: pointer;
  }
  
  select:hover {
    @apply border-brand-300;
  }

  /* Custom styling for date inputs */
  input[type="date"] {
    @apply relative shadow-sm cursor-pointer transition-all;
  }
  
  input[type="date"]:hover {
    @apply border-brand-300;
  }
  
  /* Colorize the calendar icon to match brand-500 and position it perfectly */
  input[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 1;
    /* This filter makes the black default icon match #208480 (Teal/Brand) */
    filter: invert(36%) sepia(35%) saturate(740%) hue-rotate(133deg) brightness(94%) contrast(85%);
    transform: scale(1.2);
    margin-left: 0.25rem;
  }
  
  /* Make regular inputs match the refined aesthetic */
  input[type="text"], input[type="number"], input[type="tel"], input[type="email"], input[type="password"] {
    @apply shadow-sm transition-all;
  }
  
  input[type="text"]:hover, input[type="number"]:hover, input[type="tel"]:hover {
    @apply border-brand-300;
  }`;

if (code.includes(oldGlobalSelect)) {
    code = code.replace(oldGlobalSelect, newGlobalSelect);
    fs.writeFileSync('src/index.css', code);
    console.log('Replaced global select styles with more refined ones.');
} else {
    console.log('Could not find old global select styles.');
}
