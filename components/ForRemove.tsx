"use client";
import { useModalContext } from "@/app/context/ModalContext";
import React, { useEffect } from "react";

export default function ForRemove() {
  const { setIsLoadModal, setIsRemoveModal } = useModalContext();

  useEffect(() => {
    const removeModal = async () => {
      setIsRemoveModal(false);
      //wait funtion
      await new Promise((resolve) => setTimeout(resolve, 6000));

      setIsLoadModal(false);
    };

    removeModal();
  });
  return <div></div>;
}
