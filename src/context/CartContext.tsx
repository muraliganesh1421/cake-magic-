"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "totalPrice">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "cakemagic_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage once mounted
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          setItems(JSON.parse(stored));
        }
      } catch {
        // ignore
      } finally {
        setIsInitialized(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch {
        // ignore
      }
    }
  }, [items, isInitialized]);

  const addItem = (newItem: Omit<CartItem, "totalPrice">) => {
    setItems((prev) => {
      // Find if matching product + size + flavour + eggless exists
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === newItem.productId &&
          i.size === newItem.size &&
          i.flavour === newItem.flavour &&
          i.eggless === newItem.eggless &&
          i.cakeMessage === newItem.cakeMessage
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        const current = updated[existingIndex];
        const newQty = current.quantity + newItem.quantity;
        updated[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * current.unitPrice,
        };
        return updated;
      }

      const itemWithTotal: CartItem = {
        ...newItem,
        totalPrice: newItem.quantity * newItem.unitPrice,
      };
      return [...prev, itemWithTotal];
    });

    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          if (i.id !== id) return i;
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...i,
            quantity: newQty,
            totalPrice: newQty * i.unitPrice,
          };
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
