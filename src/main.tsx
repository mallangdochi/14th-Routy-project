import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import AuthProvider from "./contexts/AuthProvider.tsx";
import SavedPlacesRoot from "./contexts/SavedPlacesRoot.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SavedPlacesRoot>
          <App />
        </SavedPlacesRoot>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
