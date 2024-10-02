"use client";
import { useCartContext } from "@/app/context/CartContext";
import { ShoppingCart } from "lucide-react";
import React, { useEffect } from "react";

export default function CartIcon() {
  const { cart, isCartEmpty } = useCartContext();
  useEffect(() => {
    if (!isCartEmpty) console.log(cart);
  }, [isCartEmpty, cart]);
  return (
    <span className="relative">
      <ShoppingCart className="inline" />
      {!isCartEmpty && cart.length >= 1 && (
        <div className="w-1 h-1 p-2 scale-50 rounded-full bg-red-600 inline absolute"></div>
      )}
    </span>
  );
}
