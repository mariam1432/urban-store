import React, { useEffect, useState } from "react";
import { useFilter } from "./FilterContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import {
  Menu,
  X,
  Search,
  Filter,
  RotateCcw,
  CircleCheck,
  Circle,
  ShoppingCart,
} from "lucide-react";

interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const Sidebar = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    setKeyword,
  } = useFilter();
  const { state } = useCart();
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    if (state && state.items) setCartCount(state.items.length);
  }, [state]);
  const keywords = ["apple", "watch", "trend", "shoes", "shirt"];

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://dummyjson.com/products");
        if (!response.ok) throw new Error("Failed to fetch");
        const data: FetchResponse = await response.json();
        const uniqueCategories = Array.from(
          new Set(data.products.map((product) => product.category))
        );
        setCategories(uniqueCategories);
      } catch (err) {
        setError("Failed to load categories");
        console.error("Error fetching products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPrice(value ? parseFloat(value) : undefined);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPrice(value ? parseFloat(value) : undefined);
  };

  const handleChangeCategories = (category: string) => {
    console.log("selected", category);
    setSelectedCategory(category);
  };

  const handleKeywordClick = (keyword: string) => {
    setKeyword(keyword);
  };

  const handleResetFilters = () => {
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSearchQuery("");
    setSelectedCategory("");
    setKeyword("");
  };

  return (
    <>
      {/* Mobile header with branding - always visible */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black text-white p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <span className="font-bold text-xl mr-2">URBAN</span>
          <span className="text-sm opacity-90">STORE</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Mobile Cart Button */}
          <button
            onClick={() => navigate("/cart")}
            className="relative p-1"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingCart size={24} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X size={24} className="text-white" />
            ) : (
              <Menu size={24} className="text-white" />
            )}
          </button>
        </div>
      </div>
      {/* Sidebar Content */}
      <div
        className={`${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static inset-y-0 left-0 w-3/4 md:w-64 p-5 bg-white z-40 
        transition-transform duration-300 ease-in-out overflow-y-auto pt-16 md:pt-5`}
      >
        <img
          src="../logo.png"
          alt="urban store logo"
          className="w-18 h-20 mx-auto"
        />

        {/* <h1 className="hidden md:block text-2xl font-bold mb-6">Urban Store</h1> */}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <section className="space-y-6">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchQuery}
              className="border-2 rounded-lg pl-10 pr-3 py-2 w-full focus:border-black focus:ring-0"
              placeholder="Search products..."
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2 flex items-center">
              <Filter className="mr-2" size={18} /> Price Range
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  className="border-2 rounded-lg px-3 py-2 w-full"
                  placeholder="$0"
                  value={minPrice ?? ""}
                  onChange={handleMinPriceChange}
                  aria-label="Minimum price"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  className="border-2 rounded-lg px-3 py-2 w-full"
                  placeholder="$1000"
                  value={maxPrice ?? ""}
                  onChange={handleMaxPriceChange}
                  aria-label="Maximum price"
                  min={minPrice?.toString() || "0"}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <fieldset className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <button
                      className="text-black"
                      onClick={() => handleChangeCategories(category)}
                    >
                      {selectedCategory === category ? (
                        <CircleCheck />
                      ) : (
                        <Circle />
                      )}
                    </button>

                    <span className="capitalize">{category}</span>
                  </label>
                ))}
              </fieldset>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Popular Searches</h2>
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="px-3 py-1.5 border rounded-full text-sm hover:bg-black hover:text-white transition-colors"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleResetFilters}
            className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset Filters</span>
          </button>
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            <span>View Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-blue-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
                {cartCount}
              </span>
            )}
          </button>
        </section>
      </div>
      {/* <div className="mt-auto pt-4 border-t">
        <button
          onClick={() => navigate("/cart")}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          <span>View Cart</span>
          {cartCount > 0 && (
            <span className="bg-white text-blue-600 rounded-full h-6 w-6 flex items-center justify-center text-sm">
              {cartCount}
            </span>
          )}
        </button>
      </div> */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => navigate("/cart")}
          className="bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors relative"
          aria-label={`Cart (${cartCount} items)`}
        >
          <ShoppingCart size={24} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
};

export default Sidebar;
