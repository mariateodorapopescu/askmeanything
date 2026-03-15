import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import '@fontsource/inter/400.css' // sau: /latin.css, /400.css etc

import { GoogleOAuthProvider } from '@react-oauth/google';

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

const GOOGLE_CLIENT_ID = "481723586664-u2c47k1u29dsums8be10eh0urhckh4g9.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    
    <BrowserRouter>
      <Provider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
        </GoogleOAuthProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
