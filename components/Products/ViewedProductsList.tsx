"use client";
import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import { useViewedContext } from "@/app/context/ViewedContext";
import ViewedProducts from "./ViewedProducts";
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

function ViewedProductList() {
  const { isSuccess, viewed, isLoading } = useViewedContext();

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
    <div className="w-full min-h-[400px] bg-white pt-5 px-2 box-border">
      <h2 className=" text-xl ml-5 after:w-[10px] after:h-[5px] after:bg-slate-400 after:mx-auto after:relative">
        Just Viewed
      </h2>
      <div className="w-full p-5 overflow-x-scroll flex space-x-4 scrollbar-hide">
        {isSuccess &&
          viewed.map((product) => (
            <ViewedProducts product={product} key={product.id} />
          ))}
        {isLoading && <div>Loading</div>}
      </div>
    </div>
  );
}

export default ViewedProductList;
