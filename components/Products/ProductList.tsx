import Link from "next/link";
import React from "react";
import ProductCard from "./ProductCard";
import { getProducts, shuffleArray } from "@/lib/helper";

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

async function ProductList() {
  const result = await getProducts();

  if (!result)
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-semibold">
            You are not connected to the Internet
          </h1>
          <p className="lead my-3">Connect and then refresh the page</p>
          <h3 className="uppercase text-green-700">Thank You</h3>
        </div>
      </div>
    );

  const products = shuffleArray(result);

  return (
    <>
      <h3 className="text-2xl text-center font-extrabold ml-5 mt-5">
        Trending Products
      </h3>
      <div className="w-full p-5 h-fit gap-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {result &&
          products
            .slice(0, 15)
            .map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
      </div>
    </>
  );
}

export default ProductList;
