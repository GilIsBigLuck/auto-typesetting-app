import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
  document.body.innerHTML = '<div style="padding: 20px; color: red;"><h1>Root element not found!</h1></div>';
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// HMR 지원
if (import.meta.hot) {
  import.meta.hot.accept('./App', () => {
    console.log('HMR: App module updated');
  });
  import.meta.hot.accept();
}

