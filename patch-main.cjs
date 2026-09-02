const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf-8');

code = code.replace(
  "import { registerSW } from 'virtual:pwa-register';",
  "import { registerSW } from 'virtual:pwa-register';"
);

const oldSW = `if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW Registration Error', error);
    }
  });
}`;

const newSW = `if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Force refresh when new content is available
      if (confirm('توجد تحديثات جديدة للتطبيق. هل تريد تحديث الصفحة الآن لإظهارها؟')) {
        updateSW(true);
      } else {
        // Auto update if user doesn't want prompt
        updateSW(true);
      }
    },
    onRegistered(r) {
      console.log('SW Registered:', r);
      r && setInterval(() => {
        r.update()
      }, 20000); // Check for updates every 20s in dev
    },
    onRegisterError(error) {
      console.log('SW Registration Error', error);
    }
  });
}`;

if (code.includes(oldSW)) {
  fs.writeFileSync('src/main.tsx', code.replace(oldSW, newSW));
  console.log('Patched main.tsx');
} else {
  // If minified or different format, let's just replace the whole file since it's small.
  const fullFile = `import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// PWA Service Worker Registration
import { registerSW } from 'virtual:pwa-register';

if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Force refresh when new content is available
      updateSW(true);
    },
    onRegistered(r) {
      console.log('SW Registered:', r);
      if (r) {
        setInterval(() => {
          r.update();
        }, 10000); // check for updates often
      }
    },
    onRegisterError(error) {
      console.log('SW Registration Error', error);
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
`;
  fs.writeFileSync('src/main.tsx', fullFile);
  console.log('Replaced main.tsx entirely.');
}
