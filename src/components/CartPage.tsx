import { ChevronLeft, X, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const CartPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const handleBack = () => navigate(-1);
  const handleRemoveItem = (id: string) =>
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const handleIncrement = (id: string) =>
    dispatch({ type: "INCREMENT_QUANTITY", payload: id });
  const handleDecrement = (id: string) =>
    dispatch({ type: "DECREMENT_QUANTITY", payload: id });
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to abandon your cart?")) {
      dispatch({ type: "CLEAR_CART" });
    }
  };

  // Calculate totals
  const subtotal = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <button
        onClick={handleBack}
        className="flex items-center mb-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
      >
        <ChevronLeft className="mr-2" size={20} />
        Continue Shopping
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {state.items.length > 0 && (
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 size={18} />
            <span>Abandon Cart</span>
          </button>
        )}
      </div>

      {state.items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Your cart is empty</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Cart Items List - Always vertical */}
          <div className="space-y-6">
            {state.items.map((item) => (
              <div key={item.id} className="border-b pb-6">
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() =>
                            item.quantity > 1 && handleDecrement(item.id)
                          }
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-4 py-1 border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncrement(item.id)}
                          className="px-3 py-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Always below items */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors mb-4"
            >
              Proceed to Checkout
            </button>

            {/* Promo Code - Simplified inline version */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Promo code"
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button className="whitespace-nowrap bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
