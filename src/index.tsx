import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css'; // Tailwind CSS ko import karein
import AppRoutes from './App'; // App.tsx file se import karein

// Yeh Service Worker registration PWA ke liye zaroori hai
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; 
// serviceWorkerRegistration file bhi aapko project mein include karni hogi

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

// Service worker ko register karein
serviceWorkerRegistration.register(); 
