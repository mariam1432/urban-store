import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import ProductPage from "./components/ProductPage";
import TopSellers from "./components/TopSellers";
import PopularBlogs from "./components/PopularBlogs";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
function App() {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar />

        {/* Mobile sidebar (hidden by default) */}
        <div
          id="mobile-sidebar"
          className="hidden md:hidden bg-white z-50 fixed inset-0"
        >
          <div className="p-4">
            <button
              className="mb-4 p-2"
              onClick={() =>
                document
                  .getElementById("mobile-sidebar")
                  ?.classList.add("hidden")
              }
            >
              ✕ Close
            </button>
            <Sidebar />
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Primary content (routes) - takes 70% on large screens */}
            <div className="lg:w-[70%] mt-20 md:mt-0">
              <Routes>
                <Route path="/" element={<MainContent />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
              </Routes>
            </div>

            <div className="lg:w-[30%] space-y-6">
              <TopSellers />
              <PopularBlogs />
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
