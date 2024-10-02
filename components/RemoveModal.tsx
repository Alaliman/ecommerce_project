"use client";
import { useCartContext } from "@/app/context/CartContext";
import { useModalContext } from "@/app/context/ModalContext";
import React from "react";

export default function RemoveModal() {
  const { isRemoveModal, setIsRemoveModal } = useModalContext();
  const { removeFromCarts } = useCartContext();

  const handleClick = () => {
    setIsRemoveModal(false);
  };
  return (
    <div
      className={` ${
        !isRemoveModal && "hidden"
      } fixed flex px-3 box-border transition-all duration-75 justify-center items-center w-full h-screen z-50 bg-black/90`}
    >
      <div className="w-full md:w-[400px] bg-white p-4 ">
        <h2 className="text-xl font-bold">Remove From Cart</h2>
        <p className="lead">Are you sure you want to remove item from cart ?</p>
        <button
          onClick={handleClick}
          className="bg-red-600 text-white w-full px-3 py-2 text-lg"
        >
          REMOVE ITEM
        </button>
      </div>
    </div>
  );
}
