"use client";
import { useCartContext } from "@/app/context/CartContext";
import { useModalContext } from "@/app/context/ModalContext";
import { X } from "lucide-react";
import { resolve } from "path";
import React from "react";

export default function RemoveModal() {
  const { isRemoveModal, setIsRemoveModal, cartId } = useModalContext();
  const { removeFromCarts } = useCartContext();

  const handleClick = async () => {
    await removeFromCarts(cartId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRemoveModal(false);
  };
  return (
    <div
      className={` ${
        !isRemoveModal && "hidden"
      } fixed flex px-3 box-border transition-all duration-75 justify-center items-center w-full h-screen z-50 bg-black/90`}
    >
      <div className="w-full md:w-[400px] bg-white p-6 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Remove From Cart</h2>
          <X
            onClick={() => {
              setIsRemoveModal(false);
            }}
            className=" cursor-pointer"
          />
        </div>
        <p className="lead mb-2">
          Are you sure you want to remove item from cart ?
        </p>
        <button
          onClick={handleClick}
          className="bg-red-600 text-white w-full px-3 py-2 text-lg hover:bg-red-800 transition-all"
        >
          REMOVE ITEM
        </button>
      </div>
    </div>
  );
}
