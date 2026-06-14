import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';              // ← THIS
import App from './App';
import { TelemetryProvider } from './hooks/TelemetryContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TelemetryProvider>
      <App />
    </TelemetryProvider>
  </React.StrictMode>
);