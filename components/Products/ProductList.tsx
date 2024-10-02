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
      <div>
        <h1>You are not Connected</h1>
      </div>
    );

  const products = shuffleArray(result);

  return (
    <div className="w-full p-5 h-fit gap-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {result &&
        products
          .slice(0, 15)
          .map((product) => <ProductCard product={product} key={product.id} />)}
    </div>
  );
}

export default ProductList;
