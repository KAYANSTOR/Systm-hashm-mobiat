const fs = require('fs');
const svgContent = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="512" height="512" rx="100" fill="#208480"/>
  
  <!-- Outer Gold Ring -->
  <circle cx="256" cy="256" r="160" stroke="#F59E0B" stroke-width="12" stroke-dasharray="16 12" fill="none"/>
  
  <!-- Needle -->
  <path d="M256 120 L256 320" stroke="white" stroke-width="16" stroke-linecap="round"/>
  <!-- Needle Eye -->
  <ellipse cx="256" cy="150" rx="4" ry="12" fill="#208480" stroke="white" stroke-width="4"/>
  
  <!-- Thread wrapping around -->
  <path d="M256 150 C320 200, 192 250, 256 300 C320 350, 192 400, 256 420" stroke="#F59E0B" stroke-width="14" stroke-linecap="round" fill="none"/>
  
  <!-- Arabic Letter (H for Hashim) stylized -->
  <path d="M190 280 C190 220, 230 190, 260 210 C290 230, 210 260, 250 280 C290 300, 310 260, 310 220" stroke="white" stroke-width="16" stroke-linecap="round" fill="none" opacity="0.9"/>
  
  <text x="256" y="440" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="white" text-anchor="middle" letter-spacing="2">H.A.</text>
</svg>`;

fs.writeFileSync('public/icons/icon-512x512.svg', svgContent);
fs.writeFileSync('public/icons/icon-192x192.svg', svgContent);
fs.writeFileSync('public/icons/icon.svg', svgContent);
