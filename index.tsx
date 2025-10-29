
import React from 'react';
import ReactDOM from 'react-dom/client';
import { SimpleApp } from './SimpleApp.tsx';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SimpleApp />
    </ErrorBoundary>
  </React.StrictMode>
);