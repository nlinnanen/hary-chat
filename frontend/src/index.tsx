import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
