import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/App.css'; // CSS file का path सही करें

// Firebase को initialize करें (optional, अगर App.jsx में नहीं किया है)
import { auth } from './firebase/firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);