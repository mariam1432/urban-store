import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Star } from "lucide-react"; // Using Lucide icons
import ProductCard from "./ProductCard";
import { useCart } from "./CartContext";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  brand: string;
  category: string;
  images: string[];
  stock: number;
  thumbnail: string;
  reviews: any[];
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { state, dispatch } = useCart();
  console.log("items", state);
  useEffect(() => {
    if (product) {
      axios
        .get(`https://dummyjson.com/products/category/${product.category}`)
        .then((res) => {
          // Filter out current product and limit to 4
          setRelatedProducts(
            res.data.products
              .filter((p: any) => p.id !== product.id)
              .slice(0, 4)
          );
        })
        .catch(console.error);
    }
  }, [product]);
  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      axios
        .get<Product>(`https://dummyjson.com/products/${id}`)
        .then((response) => {
          setProduct(response.data);
          const existingItem = state.items.find(
            (item) => item.id === response.data.id
          );
          if (existingItem) {
            setQuantity(existingItem.quantity); // Set quantity to the existing item's quantity
          } else {
            setQuantity(1); // Default to 1 if not in cart
          }
        })
        .catch((error) => {
          console.error(`Error fetching product data:${error}`);
          setError("Failed to load product details. Please try again later.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, state.items]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-4 text-red-500">{error}</p>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-5 max-w-6xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={handleBack}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }
  const handleAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product?.thumbnail,
        quantity: quantity,
      },
    });
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center mb-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft className="mr-2" size={20} />
        Back to Products
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Image Gallery */}
        <div className="lg:w-1/2">
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square mb-4">
            <img
              src={product.images[currentImageIndex]}
              alt={product.title}
              className="w-full h-full object-contain p-4"
              loading="eager"
            />
            {product.discountPercentage && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                {Math.round(product.discountPercentage)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          <div className="flex gap-2 overflow-x-auto py-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                  currentImageIndex === index
                    ? "border-black"
                    : "border-transparent"
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {product.title}
          </h1>
          <p className="text-gray-500 mb-2">
            {product.brand} • {product.category}
          </p>

          <div className="flex items-center mb-4">
            <div className="flex mr-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-700">{product.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center mb-4">
            <p className="mr-3 font-medium">Quantity:</p>
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 py-1 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 hover:bg-gray-100"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
          <div className="mb-6">
            {product.discountPercentage ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">
                  $
                  {(
                    product.price *
                    (1 - product.discountPercentage / 100)
                  ).toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-red-500 font-medium">
                  Save {product.discountPercentage}%
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
            <p
              className={`text-sm mt-1 ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>
          </div>

          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "description"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "specs"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "reviews"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews ({product?.reviews?.length || 0})
                </button>
              </nav>
            </div>

            <div className="py-4">
              {activeTab === "description" && (
                <p className="text-gray-700">{product.description}</p>
              )}

              {activeTab === "specs" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Brand</h3>
                    <p>{product.brand || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p>{product.category || "N/A"}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Stock</h3>
                    <p>{product.stock} units available</p>
                  </div>
                  {/* Add more specifications as needed */}
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  {product.reviews?.length > 0 ? (
                    product.reviews.map((review) => (
                      <div key={review.id} className="border-b py-4">
                        <div className="flex items-center mb-2">
                          <div className="flex mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No reviews yet</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors flex-1 min-w-[200px]"
              disabled={product.stock <= 0}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
            <button className="px-6 py-3 border border-black rounded hover:bg-gray-100 transition-colors flex-1 min-w-[200px]">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">You may also like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              image={product?.thumbnail}
              price={product.price}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
