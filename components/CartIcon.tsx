"use client";
import { useCartContext } from "@/app/context/CartContext";
import React, { useEffect } from "react";

export default function CartIcon() {
  const { cart, isCartEmpty } = useCartContext();
  return (
    <>
      {!isCartEmpty && cart.length >= 1 && (
        <div className="w-1 h-1 p-2 scale-50 rounded-full bg-red-600 inline absolute"></div>
      )}
    </>
  );
}
