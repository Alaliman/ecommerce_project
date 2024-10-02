"use client";
import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { getProducts, getReccommdations, shuffleArray } from "@/lib/helper";
import { useRecommendedContext } from "@/app/context/RecommendedContext";
import { useModalContext } from "@/app/context/ModalContext";

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

type props = {
  id: string;
};
function RecommendedProductList({ id }: props) {
  const { isLoading, isSuccess, recommendedProducts } = useRecommendedContext();

  const products = shuffleArray(recommendedProducts);

  const { setIsLoadModal, setIsRemoveModal } = useModalContext();

  useEffect(() => {
    const removeModal = async () => {
      //wait funtion
      await new Promise((resolve) => setTimeout(resolve, 6000));

      setIsLoadModal(false);
    };

    removeModal();
  });

  return (
    <div className="w-full p-5 h-fit gap-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {isSuccess &&
        products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      {isLoading && <div>Loading</div>}
    </div>
  );
}

export default RecommendedProductList;
