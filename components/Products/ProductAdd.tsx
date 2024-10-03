"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { useCartContext } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";

type products = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
};

type add = {
  product: products;
};

export default function ProductAdd({ product }: add) {
  const { status } = useSession();
  const { addToCarts } = useCartContext();
  const move = useRouter();
  const handleClick = () => {
    if (status === "authenticated") {
      addToCarts(product);
      toast.success("Added to Cart", {
        position: "top-center",
        style: {
          background: "green",
        },
      });
    }

    if (status === "unauthenticated") {
      move.push("/sign-in");
    }
  };
  return (
    <button
      onClick={handleClick}
      className="w-full bg-green-600 text-white py-4 hover:bg-green-500 transition-all"
    >
      ADD TO CART
    </button>
  );
}
