"use client";
import { useCartContext } from "@/app/context/CartContext";
import { useModalContext } from "@/app/context/ModalContext";
import React, { useEffect } from "react";

function CartProductsList() {
  const { cart, isCartEmpty, cartTotal, removeFromCarts } = useCartContext();
  const { setIsLoadModal, setIsRemoveModal, setCartId } = useModalContext();

  const removeModal = async () => {
    //wait funtion
    await new Promise((resolve) => setTimeout(resolve, 6000));

    setIsLoadModal(false);
  };

  removeModal();

  return (
    <div className="w-full md:w-[90%] box-border mx-auto">
      {!isCartEmpty && (
        <div className="relative md:static">
          <div className="md:hidden mt-3">
            <h2 className="ml-2 mb-1 uppercase">Cart Summary</h2>
            <div className="flex justify-between p-2 bg-white rounded">
              <h3 className="text-xl font-medium">Subtotal</h3>
              <p className="font-semibold text-xl">
                {"N " +
                  (cartTotal * 1000)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </p>
            </div>
          </div>
          <div className="md:relative mt-3 md:flex md:gap-6 ">
            <div className="w-full md:w-[70%] px-2 md:bg-white">
              <h2 className="pb-2 md:pt-2 md:border-b md:mt-3">
                CART {"(" + cart.length + ")"}
              </h2>
              <div className="mb-2">
                {cart.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="bg-white hover:bg-gradient-to-r hover:from-white via-white hover:to-slate-100 mb-1 md:mb-0"
                  >
                    <div className="flex  items-center">
                      <div className="bg-white p-5 rounded-md w-[30%] md:w-[8.3rem] ">
                        <img
                          src={cartItem.image}
                          alt={"image of product"}
                          className="h-32 w-full md:w-28 scale-90 md:scale-100 z-1 relative"
                        />
                      </div>
                      <div className="md:flex md:justify-between w-[60%] md:flex-grow">
                        <div className="md:w-[80%]">
                          <h2 className="text-md md:text-xl font-medium w-[90%] whitespace-nowrap overflow-hidden text-ellipsis">
                            {cartItem.title}
                          </h2>

                          {/* {cartItem.category !== "electronics" && (
                            <div className="my-2">
                              <h2>Size</h2>
                              <select
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                    block py-2 pl-10 pr-12 focus:outline-none focus:ring-indigo-
                    focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600
                    dark:text-white dark:placeholder-gray-400 dark:focus:ring-gray-
                    500 dark:focus:border-gray-500"
                              >
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                              </select>
                            </div>
                          )} */}

                          <div className="text-black font-bold text-lg  my-2 md:hidden">
                            {"N " +
                              (cartItem.price * 1000)
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </div>

                          <p>In Stock</p>
                        </div>
                        <div className="hidden md:block w-fit md:mr-6 ">
                          <div className="text-black font-bold text-xl my-3">
                            {"N " +
                              (cartItem.price * 1000)
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex justify-end pb-4">
                      <button
                        onClick={() => {
                          setCartId(cartItem.id);
                          setIsRemoveModal(true);
                        }}
                        className="bg-transparent text-red-500 w-[30%] cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:sticky md:top-0  hidden md:block md:w-[30%] bg-white h-fit">
              <div className="mt-3">
                <h2 className="ml-2 mb-1 uppercase md:py-2 border-b">
                  Cart Summary
                </h2>
                <div className="flex justify-between p-2 bg-white rounded">
                  <h3 className="text-xl font-medium">Subtotal</h3>
                  <p className="font-semibold text-xl">
                    {"N " +
                      (cartTotal * 1000)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                </div>
              </div>
              <div className="w-full py-2 px-3 box-border bg-white">
                <button className="w-full bg-green-600 text-white py-4">
                  CHECKOUT
                  {" (N " +
                    (cartTotal * 1000)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                    ")"}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full py-2 px-3 box-border bg-white sticky md:static bottom-0 md:hidden">
            <button className="w-full bg-green-600 text-white py-4">
              CHECKOUT
              {" (N " +
                (cartTotal * 1000)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                ")"}
            </button>
          </div>
        </div>
      )}
      {isCartEmpty && (
        <div>
          <h1 className="text-3xl font-bold text-center py-10 bg-white">
            Your Cart is Empty
          </h1>
        </div>
      )}
    </div>
  );
}

export default CartProductsList;
