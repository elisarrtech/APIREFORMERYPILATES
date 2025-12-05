import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css'; // <- IMPORTANTE: asegura que se importe el CSS global (Tailwind + branding)

/**
 * Si tu proyecto usa React 18:
 * createRoot(document.getElementById('root')).render(<App />);
 */
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
