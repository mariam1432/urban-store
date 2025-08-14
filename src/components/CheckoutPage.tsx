import React, { useState } from "react";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  Shield,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const [showDetails, setShowDetails] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("shipping");
  
  interface ShippingInfo {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zip: string;
    name: string;
    country: string;
  }

  interface PaymentInfo {
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
    paymentMethod: "credit-card" | "paypal";
  }
  
  interface InputInterface {
    label: string;
    name: keyof ShippingInfo;
    type: string;
    colSpan?: number;
  }

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zip: "",
    name: "",
    country: "United States",
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
    paymentMethod: "credit-card",
  });

  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const inputArray: InputInterface[] = [
    { label: "First Name*", name: "firstName" as const, type: "text" },
    { label: "Last Name*", name: "lastName" as const, type: "text" },
    { label: "Address*", name: "address" as const, type: "text", colSpan: 2 },
    { label: "City*", name: "city" as const, type: "text" },
    { label: "ZIP Code*", name: "zip" as const, type: "text" },
  ];

  const orderItems = state?.items || [];

  // Calculate discount based on state.appliedPromo
  const calculateDiscount = () => {
    if (!state.appliedPromo) return 0;

    if (state.appliedPromo.discount < 1) { // Percentage discount
      return subtotal * state.appliedPromo.discount;
    }
    // Fixed amount discount
    return Math.min(state.appliedPromo.discount, subtotal);
  };

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = orderItems.length ? 5.99 : 0;
  const tax = subtotal * 0.1;
  const discount = calculateDiscount();
  const total = subtotal + shipping + tax - discount;

  const handleRemovePromo = () => {
    dispatch({ type: "REMOVE_PROMO" });
  };

  const validateShipping = () => {
    const s = shippingInfo;
    if (
      !s.firstName.trim() ||
      !s.lastName.trim() ||
      !s.address.trim() ||
      !s.city.trim() ||
      !s.zip.trim()
    ) {
      alert("Please fill in all required shipping fields.");
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    const p = paymentInfo;
    if (p.paymentMethod === "credit-card") {
      if (
        p.cardNumber.trim().length < 12 ||
        !/^\d{2}\/\d{2}$/.test(p.expiry) ||
        p.cvv.trim().length < 3 ||
        !p.nameOnCard.trim()
      ) {
        alert("Please fill in all payment fields correctly.");
        return false;
      }
    }
    return true;
  };

  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentInfo({
      ...paymentInfo,
      paymentMethod: e.target.id as "credit-card" | "paypal",
    });
  };

  const handleContinue = () => {
    if (activeTab === "shipping") {
      if (validateShipping()) {
        setActiveTab("payment");
      }
    } else {
      setShowModal(true);
    }
  };

  const handleCompleteOrder = () => {
    if (!validatePayment()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrderComplete(true);
      dispatch({ type: "CLEAR_CART" });
    }, 2500);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Check size={48} className="text-green-600 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Thank you for your order!</h2>
        <p className="text-center max-w-md mb-6">
          Your payment was successful. We are processing your order and will
          send you a confirmation email shortly.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-6 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="mr-2" size={20} />
          Back to Cart
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex border-b mb-6">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "shipping"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === "payment"
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("payment")}
              >
                Payment
              </button>
            </div>

            {activeTab === "shipping" && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Truck size={20} />
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inputArray.map(({ label, name, type, colSpan }, i) => (
                    <div
                      key={name + i}
                      className={colSpan === 2 ? "md:col-span-2" : ""}
                    >
                      <label className="block text-sm font-medium mb-1">
                        {label}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={shippingInfo[name]}
                        onChange={handleShippingChange}
                        className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        required
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Country*
                    </label>
                    <select
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                    >
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-2" />
                    <span className="text-sm">
                      Save this information for next time
                    </span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <input
                      type="radio"
                      name="paymentMethod"
                      id="credit-card"
                      className="h-4 w-4"
                      checked={paymentInfo.paymentMethod === "credit-card"}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="credit-card" className="flex-1 font-medium">
                      Credit Card
                    </label>
                  </div>

                  {paymentInfo.paymentMethod === "credit-card" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Card Number*
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={handlePaymentChange}
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Expiration Date* (MM/YY)
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={paymentInfo.expiry}
                          onChange={handlePaymentChange}
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          CVV*
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Name on Card*
                        </label>
                        <input
                          type="text"
                          name="nameOnCard"
                          value={paymentInfo.nameOnCard}
                          onChange={handlePaymentChange}
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 border rounded-lg mt-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      id="paypal"
                      className="h-4 w-4"
                      checked={paymentInfo.paymentMethod === "paypal"}
                      onChange={handlePaymentMethodChange}
                    />
                    <label htmlFor="paypal" className="flex-1 font-medium">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {activeTab === "payment" ? (
                <button
                  onClick={() => setActiveTab("shipping")}
                  className="px-6 py-2 border border-black rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={loading}
                >
                  Back to Shipping
                </button>
              ) : (
                <div></div> 
              )}
              <button
                onClick={
                  activeTab === "shipping"
                    ? handleContinue
                    : () => setShowModal(true)
                }
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                {activeTab === "shipping"
                  ? "Continue to Payment"
                  : "Review Order"}
              </button>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-blue-600 hover:underline flex items-center"
                >
                  {showDetails ? (
                    <>
                      Hide details <ChevronUp className="ml-1" size={16} />
                    </>
                  ) : (
                    <>
                      View details <ChevronDown className="ml-1" size={16} />
                    </>
                  )}
                </button>
              </div>

              {/* Promo Code Display (Read-only with remove option) */}
              {state.appliedPromo && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg flex justify-between items-center">
                  <span className="text-green-700">
                    Promo applied: {state.appliedPromo.code}
                  </span>
                  <button
                    onClick={handleRemovePromo}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove promo code"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {showDetails && (
                <div className="mb-4 border-b pb-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between py-2">
                      <div className="flex items-center">
                        <span className="text-gray-600 mr-2">
                          {item.quantity}x
                        </span>
                        <span className="line-clamp-1">{item.title}</span>
                      </div>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>
                    Subtotal ({orderItems.length}{" "}
                    {orderItems.length === 1 ? "item" : "items"})
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                {state.appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({state.appliedPromo.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full text-center py-2 text-sm text-blue-600 hover:underline mb-4"
                disabled={loading}
              >
                View full order details
              </button>

              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <Shield size={16} />
                <span>Secure checkout. Your information is protected.</span>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Order Summary</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-black p-1"
                    disabled={loading}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-start border-b pb-6">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-lg">{item.title}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded">
                            <button
                              className="px-3 py-1 hover:bg-gray-100"
                              disabled
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4 py-1 border-x">
                              {item.quantity}
                            </span>
                            <button
                              className="px-3 py-1 hover:bg-gray-100"
                              disabled
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="font-medium text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  {state.appliedPromo && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({state.appliedPromo.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleCompleteOrder();
                    }}
                    className={`w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 ${
                      loading ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Check size={20} /> Complete Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;