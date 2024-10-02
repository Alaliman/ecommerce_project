"use client";
import { useModalContext } from "@/app/context/ModalContext";
import React from "react";

export default function LoadingModal() {
  const { isLoadModal } = useModalContext();
  return (
    <div
      className={` ${
        !isLoadModal && "hidden"
      } fixed flex justify-center transition-all duration-75 items-center w-full h-screen z-50 bg-black/90`}
    >
      <div className="w-full h-fit">
        <h2 className="text-5xl text-center font-semibold transition-all animate-pulse text-green-400">
          MyShop
        </h2>
      </div>
    </div>
  );
}
