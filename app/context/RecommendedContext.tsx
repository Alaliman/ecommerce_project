"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  addReccommendation,
  getCategoryProduct,
  getProducts,
  getReccommdations,
  shuffleArray,
} from "@/lib/helper";

interface RecommendedItem {
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
}

interface RecommendContextType {
  recommendedProducts: RecommendedItem[];
  addToRecommendations: (item: string) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

// Create the CartContext
const RecommendedContext = createContext<RecommendContextType>({
  recommendedProducts: [],
  addToRecommendations: () => null,
  isLoading: false,
  isSuccess: false,
  isError: false,
});

const random = async () => {
  const products = await getProducts();

  // throw err if product is null
  if (!products) {
    return null;
  }
  // shuffle the products
  const shuffledProducts = shuffleArray(products);
  // select four at randon from the shuffled array and assign to updatedRecommendations
  const updatedRecommendations = shuffledProducts.slice(0, 4);

  return updatedRecommendations;
};

type RecommendedProviderProps = {
  children: React.ReactNode;
};

// Client-side CartProvider component
export default function RecommendedProvider({
  children,
}: RecommendedProviderProps) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  // State for guest recommended
  const [recommendedCategory, setRecommendedCategory] = useState<string[]>([]);
  const [guestRecommended, setGuestRecommended] = useState<RecommendedItem[]>(
    []
  );

  // Logged-in user query (enabled only when authenticated)
  const {
    data: userRecommendations,
    isLoading: isUserLoading,
    isError: isUserError,
    isSuccess: isUserSuccess,
  } = useQuery({
    queryKey: ["userRecommendations", session?.user?.id], // Key based on user ID
    queryFn: async () => {
      if (session) {
        const data = await getReccommdations(session.user.id as string);
        return data;
      }
    },
    enabled: status === "authenticated", // This query runs only when user is logged in
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Guest query (enabled only when status is not authenticated)
  const {
    data: guestRecommendations,
    isLoading: isGuestLoading,
    isError: isGuestError,
    isSuccess: isGuestSuccess,
  } = useQuery({
    queryKey: ["guestRecommendations"],
    queryFn: async () => {
      console.log("Fetching recommendations for guest");
      if (recommendedCategory.length === 0) {
        const randomData = await random();
        if (randomData) setGuestRecommended(randomData);
        return randomData;
      }
      const recommendations = await Promise.all(
        recommendedCategory.map(async (category: string) => {
          const rec = await getCategoryProduct(category);
          if (!rec) throw new Error("Error fetching products");
          return rec.slice(0, 2); // Pick only two items
        })
      );
      return recommendations.flat();
    },
    enabled: status === "unauthenticated", // This query runs only when user is not logged in
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // Add item to the cart (for both logged-in users and guests)
  const addMutation = useMutation({
    mutationFn: async (newItem: string) => {
      if (session?.user?.id) {
        await addReccommendation(session.user.id, newItem);
      } else {
        setRecommendedCategory((prev) => [...prev, newItem]);
      }
    },
    onSuccess: () => {
      if (session) {
        queryClient.invalidateQueries({
          queryKey: ["userRecommendations", session.user.id],
        }); // Invalidate and refetch cart
      }
    },
  });

  const addToRecommendations = (item: string) => {
    addMutation.mutate(item);
  };

  // const clearCarts = () => {
  //   clearMutation.mutate();
  // };

  // Determine the current cart (guest cart or logged-in user's cart)
  // Merge recommendations for guest or user
  const recommendations: RecommendedItem[] =
    status === "authenticated"
      ? userRecommendations || []
      : guestRecommendations || [];
  const isLoading = session ? isUserLoading : isGuestLoading;
  const isError = session ? isUserError : isGuestError;
  const isSuccess = session ? isUserSuccess : isGuestSuccess;

  return (
    <RecommendedContext.Provider
      value={{
        recommendedProducts: recommendations,
        addToRecommendations,
        isLoading,
        isSuccess,
        isError,
      }}
    >
      {children}
    </RecommendedContext.Provider>
  );
}

// Custom hook to use the RecommendedContext
export function useRecommendedContext() {
  const context = useContext(RecommendedContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
