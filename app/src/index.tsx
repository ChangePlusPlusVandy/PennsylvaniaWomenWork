import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0ProviderWithNavigate } from "./utils/auth0-provider";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { UserProvider } from "./contexts/UserContext";

document.title = "PWW";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <Toaster />
        <UserProvider>
          <App />
        </UserProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
