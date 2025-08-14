import React, { createContext, useContext, useReducer, useEffect } from "react";

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

type PromoCode = {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
};

type CartState = {
  items: CartItem[];
  appliedPromo: PromoCode | null;
};

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "INCREMENT_QUANTITY"; payload: string }
  | { type: "DECREMENT_QUANTITY"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_PROMO"; payload: PromoCode }
  | { type: "REMOVE_PROMO" };

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
  items: getLocalStorageCart(),
  appliedPromo: null,
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
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        newState = { ...state, items: [...state.items, { ...action.payload }] };
      }
      break;
    case "REMOVE_FROM_CART":
      newState = {
        items: state.items.filter((item) => item.id !== action.payload),
        appliedPromo: null,
      };
      break;
    case "INCREMENT_QUANTITY":
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
      break;
    case "DECREMENT_QUANTITY":
      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
      break;
    case "CLEAR_CART":
      newState = { items: [], appliedPromo: null };
      break;
    case "APPLY_PROMO":
      return { ...state, appliedPromo: action.payload };
    case "REMOVE_PROMO":
      return { ...state, appliedPromo: null };
    default:
      newState = state;
  }

  setLocalStorageCart(newState.items);
  return newState;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

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
