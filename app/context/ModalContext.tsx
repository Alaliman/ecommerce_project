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

interface ModalContextType {
  isRemoveModal: boolean;
  isLoadModal: boolean;
  setIsLoadModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsRemoveModal: React.Dispatch<React.SetStateAction<boolean>>;
  cartId: number;
  setCartId: React.Dispatch<React.SetStateAction<number>>;
}

// Create the CartContext
const ModalContext = createContext<ModalContextType>({
  isLoadModal: false,
  isRemoveModal: false,
  setIsLoadModal: () => null,
  setIsRemoveModal: () => null,
  cartId: 0,
  setCartId: () => null,
});

type ModalProviderProps = {
  children: React.ReactNode;
};

// Client-side CartProvider component
export default function ModalProvider({ children }: ModalProviderProps) {
  // State for guest recommended
  const [isRemoveModal, setIsRemoveModal] = useState<boolean>(false);
  const [isLoadModal, setIsLoadModal] = useState<boolean>(false);
  const [cartId, setCartId] = useState<number>(0);

  return (
    <ModalContext.Provider
      value={{
        isLoadModal,
        isRemoveModal,
        setIsLoadModal,
        setIsRemoveModal,
        cartId,
        setCartId,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// Custom hook to use the RecommendedContext
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
