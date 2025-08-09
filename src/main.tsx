import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FilterProvider } from "./components/FilterContext.tsx";
import { CartProvider } from "./components/CartContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FilterProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </FilterProvider>
  </StrictMode>
);
