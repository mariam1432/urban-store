import React, { createContext, useContext, useReducer, useEffect } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREMENT_QUANTITY"; payload: string }
  | { type: "DECREMENT_QUANTITY"; payload: string }
  | { type: "CLEAR_CART" };

// Helper functions for localStorage
const getLocalStorageCart = (): CartItem[] => {
  if (typeof window !== "undefined") {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

const setLocalStorageCart = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(items));
  }
};

const initialState: CartState = {
  items: getLocalStorageCart(), // Initialize from localStorage
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;

  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (existingItem) {
        newState = {
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = { items: [...state.items, { ...action.payload }] };
      }
      break;
    case "REMOVE_FROM_CART":
      newState = {
        items: state.items.filter((item) => item.id !== action.payload),
      };
      break;
    case "INCREMENT_QUANTITY":
      newState = {
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
      break;
    case "DECREMENT_QUANTITY":
      newState = {
        items: state.items.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
      break;
    case "CLEAR_CART":
      newState = { items: [] };
      break;
    default:
      newState = state;
  }

  // Save to localStorage after each state change
  setLocalStorageCart(newState.items);
  return newState;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Optional: Sync between tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        dispatch({
          type: "CLEAR_CART",
        });
        const newItems = e.newValue ? JSON.parse(e.newValue) : [];
        newItems.forEach((item: CartItem) => {
          dispatch({
            type: "ADD_TO_CART",
            payload: item,
          });
        });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};