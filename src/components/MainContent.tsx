import React, { useEffect, useState, useMemo } from "react";
import { useFilter } from "./FilterContext";
import { Tally3 } from "lucide-react";
import axios from "axios";
import ProductCard from "./ProductCard";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const MainContent = () => {
  const { searchQuery, selectedCategory, minPrice, maxPrice, keyword } = useFilter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<"all" | "expensive" | "cheap" | "popular">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `https://dummyjson.com/products?limit=100`; // Fetch enough for client-side filtering

        if (keyword) {
          url = `https://dummyjson.com/products/search?q=${keyword}&limit=100`;
        }

        const response = await axios.get<ProductsResponse>(url);
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
      } catch (err) {
        setError("Failed to load products");
        console.error("Error fetching products", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [keyword]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (filter) {
      case "expensive":
        return filtered.sort((a, b) => b.price - a.price);
      case "cheap":
        return filtered.sort((a, b) => a.price - b.price);
      case "popular":
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered;
    }
  }, [products, selectedCategory, minPrice, maxPrice, searchQuery, filter]);

  // Calculate pagination based on filtered products
  const totalFilteredProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);
  
  // Get current page products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationButtons = () => {
    if (totalPages <= 1) return [];
    
    const buttons: number[] = [];
    const maxVisibleButtons = window.innerWidth < 640 ? 3 : 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(page);
    }

    return buttons;
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, minPrice, maxPrice, searchQuery, filter]);

  return (
    <section className="w-full max-w-6xl p-4 mx-auto">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="flex flex-col">
        {/* Filter Dropdown */}
        <div className="relative mb-4 self-end">
          <button
            className="border px-4 py-2 rounded-full flex items-center"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Tally3 className="mr-2" />
            {filter === "all"
              ? "Filter"
              : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1 w-40"
              onBlur={() => setDropdownOpen(false)}
              tabIndex={-1}
            >
              <button
                onClick={() => {
                  setFilter("cheap");
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Cheap
              </button>
              <button
                onClick={() => {
                  setFilter("expensive");
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Expensive
              </button>
              <button
                onClick={() => {
                  setFilter("popular");
                  setDropdownOpen(false);
                }}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Popular
              </button>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-lg h-64"
              ></div>
            ))}
          </div>
        ) : paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                image={product.thumbnail}
                price={product.price}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg">No products found matching your criteria</p>
          </div>
        )}

        {/* Pagination - Only show if there are multiple pages */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 border rounded-full disabled:opacity-50"
              aria-label="Previous page"
            >
              Previous
            </button>

            <div className="flex flex-wrap justify-center gap-1">
              {currentPage > 2 && totalPages > 5 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-1 border rounded-full"
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-2">...</span>}
                </>
              )}

              {getPaginationButtons().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-full min-w-[2.5rem] ${
                    page === currentPage ? "bg-black text-white" : ""
                  }`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              {currentPage < totalPages - 1 && totalPages > 5 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 border rounded-full"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 border rounded-full disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainContent;