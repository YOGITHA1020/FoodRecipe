import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <Suspense fallback={<h2>Loading...</h2>}>
    <App />
  </Suspense>
);
