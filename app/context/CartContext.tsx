"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { addToCart, getCart, removeFromCart } from "@/lib/helper";

interface CartItem {
  title: string;
  id: number;
  price: number;
  image: string;
  category: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCarts: (item: CartItem) => Promise<void>;
  removeFromCarts: (itemId: number) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isCartEmpty: boolean;
  cartTotal: number;
}

// Create the CartContext
const CartContext = createContext<CartContextType>({
  cart: [],
  addToCarts: async () => {},
  removeFromCarts: async () => {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  isCartEmpty: true,
  cartTotal: 0,
});

type CartProviderProps = {
  children: React.ReactNode;
};

// Client-side CartProvider component
export default function CartProvider({ children }: CartProviderProps) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // State for guest cart
  const [guestCart, setGuestCart] = useState<CartItem[]>([]);

  // Fetch the cart for logged-in users using React Query
  const {
    data: usercart,
    isLoading: isUserLoading,
    isError: isUserError,
    isSuccess: isUserSuccess,
  } = useQuery({
    queryKey: ["userCart"], // Cache key based on user ID
    queryFn: async () => {
      if (session) {
        // Fetch cart from the database for logged-in users
        const data = await getCart(session.user.id as string);
        return data;
      }
    },
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes (adjust as needed)
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes (even after query becomes stale)
    refetchOnWindowFocus: false,
    retry: 1, // Retry once if the request fails
  });

  // Fetch the cart for logged-in users using React Query
  const {
    data: guestcart,
    isLoading: isGuestLoading,
    isError: isGuestError,
    isSuccess: isGuestSuccess,
  } = useQuery({
    queryKey: ["guestCart"], // Cache key based on user ID
    queryFn: async () => {
      // Return the guest cart from local state
      return guestCart;
    },
    enabled: status === "unauthenticated",
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes (adjust as needed)
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes (even after query becomes stale)
    refetchOnWindowFocus: false,
    retry: 1, // Retry once if the request fails
  });

  // Add item to the cart (for both logged-in users and guests)
  const addMutation = useMutation({
    mutationFn: async (newItem: CartItem) => {
      if (session) {
        // For logged-in users, add the item to the database or backend
        await addToCart(session.user.id, newItem.id);
      } else {
        // For guest users, update the local state
        setGuestCart((prev) => [...prev, newItem]);
      }
    },
    onSuccess: () => {
      if (status === "authenticated") {
        // If the user is logged in, invalidate and refetch the cart query
        queryClient.invalidateQueries({ queryKey: ["userCart"] });
      }

      if (status === "unauthenticated") {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      }
    },
  });

  // Remove item from the cart (for both logged-in users and guests)
  const removeMutation = useMutation({
    mutationFn: async (itemId: number) => {
      if (session) {
        await removeFromCart(session.user.id, itemId);
      } else {
        setGuestCart((prev) => prev.filter((item) => item.id !== itemId));
      }
    },
    onSuccess: () => {
      if (status === "authenticated") {
        queryClient.invalidateQueries({
          queryKey: ["userCart"],
        }); // Invalidate and refetch cart
      }

      if (status === "unauthenticated") {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      }
    },
  });

  // // Clear the cart (for both logged-in users and guests)
  // const clearMutation = useMutation(
  //   {
  //   mutationFn: () =>{
  //     if(session){
  //       fetch("/api/cart", {
  //           method: "DELETE",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ userId: session?.user?.id }),
  //         })
  //     }
  //     else{
  //       setGuestCart([])
  //       return Promise.resolve();
  //     }} , // For guests, clear local state
  //     onSuccess: () => {
  //       if (session?.user?.id) {
  //         queryClient.invalidateQueries(["cart", session?.user?.id]); // Invalidate and refetch cart
  //       }
  //     },
  //   }
  // );

  const addToCarts = async (item: CartItem) => {
    await addMutation.mutateAsync(item);
  };

  const removeFromCarts = async (itemId: number) => {
    await removeMutation.mutateAsync(itemId);
  };

  // const clearCarts = () => {
  //   clearMutation.mutate();
  // };

  // Determine the current cart (guest cart or logged-in user's cart)
  const currentCart = session ? usercart || [] : guestcart || [];
  const isLoading = session ? isUserLoading : isGuestLoading;
  const isCartEmpty = currentCart.length === 0;
  const isSuccess = session ? isUserSuccess : isGuestSuccess;
  const isError = session ? isUserError : isGuestError;
  const cartTotal = currentCart.reduce((acc, item) => acc + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        cart: currentCart,
        addToCarts,
        isCartEmpty,
        removeFromCarts,
        isLoading,
        isSuccess,
        isError,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
