import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// if (import.meta.env.PROD || import.meta.env.VITE_ENABLE_PWA === 'true') {
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker
//         .register('/sw.js', { scope: '/' })
//         .then((registration) => {
//           console.info('[PWA] Service worker registered');

//           if (registration.active) {
//             console.info('[PWA] Service worker active');
//           }

//           registration.addEventListener('updatefound', () => {
//             const worker = registration.installing;
//             worker?.addEventListener('statechange', () => {
//               if (worker.state === 'activated') {
//                 console.info('[PWA] Service worker active');
//               }
//             });
//           });
//         })
//         .catch((error: unknown) => {
//           console.error('[PWA] Service worker registration failed', error);
//         });
//     });
//   }
// }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
