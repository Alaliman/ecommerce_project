"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { addViewedProduct, getViewedProducts } from "@/lib/helper";

interface ViewedItem {
  title: string;
  id: number;
  price: number;
  image: string;
  category: string;
}

interface ViewedContextType {
  viewed: ViewedItem[];
  addToViewed: (item: ViewedItem) => Promise<void>;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// Create the CartContext
const ViewedContext = createContext<ViewedContextType>({
  viewed: [],
  addToViewed: async () => {},
  isLoading: false,
  isSuccess: false,
  isError: false,
});

type CartProviderProps = {
  children: React.ReactNode;
};

// Client-side CartProvider component
export default function ViewedProvider({ children }: CartProviderProps) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // State for guest cart
  const [guestViewed, setGuestViewed] = useState<ViewedItem[]>([]);

  // Fetch the cart for logged-in users using React Query
  const {
    data: userviewedProducts,
    isLoading: userLoading,
    isSuccess: userSuccess,
    isError: userError,
  } = useQuery({
    queryKey: ["userViewed"], // Cache key based on user ID
    queryFn: async () => {
      if (session) {
        const data = await getViewedProducts(session.user.id as string);
        return data;
      }
    },
    enabled: status === "authenticated",
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes (adjust as needed)
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes (even after query becomes stale)
    refetchOnWindowFocus: false,
    retry: 1, // Retry once if the request fails
  });

  const {
    data: guestviewedProducts,
    isLoading: isGuestLoading,
    isSuccess: isGuestSuccess,
    isError: isGuestError,
  } = useQuery({
    queryKey: ["guestViewed"], // Cache key based on user ID
    queryFn: async () => {
      return guestViewed;
    },
    enabled: status === "unauthenticated",
    staleTime: 1000 * 60 * 10, // Data is fresh for 10 minutes (adjust as needed)
    gcTime: 1000 * 60 * 30, // Cache persists for 30 minutes (even after query becomes stale)
    refetchOnWindowFocus: false,
    retry: 1, // Retry once if the request fails
  });

  // Add item to the cart (for both logged-in users and guests)
  const addMutation = useMutation({
    mutationFn: async (newItem: ViewedItem) => {
      if (session) {
        console.log("view view");
        await addViewedProduct(session.user.id, newItem.id);
      } else {
        if (guestViewed.length >= 5) {
          // If length is 2 or more, remove the last Viewed Product (FIFO)
          setGuestViewed((prev) => prev.slice(1));
        }
        setGuestViewed((prev) => [...prev, newItem]);
      }
    },
    onSuccess: () => {
      if (status === "authenticated") {
        queryClient.invalidateQueries({ queryKey: ["userViewed"] }); // Invalidate and refetch cart
      }
      if (status === "unauthenticated") {
        queryClient.invalidateQueries({ queryKey: ["guestViewed"] }); // Invalidate and refetch cart
      }
    },
  });

  const addToViewed = async (item: ViewedItem) => {
    await addMutation.mutateAsync(item);
  };

  // const clearCarts = () => {
  //   clearMutation.mutate();
  // };

  // Determine the current cart (guest cart or logged-in user's cart)
  const currentViewed =
    status === "authenticated"
      ? userviewedProducts || []
      : guestviewedProducts || [];
  const isLoading = status === "authenticated" ? userLoading : isGuestLoading;
  const isSuccess = status === "authenticated" ? userSuccess : isGuestSuccess;
  const isError = status === "authenticated" ? userError : isGuestError;

  return (
    <ViewedContext.Provider
      value={{
        viewed: currentViewed,
        addToViewed,
        isLoading,
        isSuccess,
        isError,
      }}
    >
      {children}
    </ViewedContext.Provider>
  );
}

// Custom hook to use the CartContext
export function useViewedContext() {
  const context = useContext(ViewedContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
