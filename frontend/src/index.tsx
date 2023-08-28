import axios from "axios";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_APP_API_URL;
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker registered with scope:', registration.scope);
    }, err => {
      console.error('Service Worker registration failed:', err);
    });
  });
}

window.alert("Avaa selaimessa pls")

root.render(
  <React.StrictMode>
    <BrowserRouter >
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
