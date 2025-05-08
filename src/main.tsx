/// <reference lib="dom" />

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Elemento root não encontrado');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
);
