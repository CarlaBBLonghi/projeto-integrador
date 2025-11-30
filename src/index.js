import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Mantém a importação do CSS global
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* O componente App é renderizado aqui. */}
    <App />
  </React.StrictMode>
);

// O código anterior que chamava 'reportWebVitals()' foi removido.
// O projeto está agora limpo e pronto para rodar.