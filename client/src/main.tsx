import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppProvider } from "./lib/api_context";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>
);
