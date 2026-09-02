import {StrictMode} from 'react';
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
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
