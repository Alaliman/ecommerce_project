import ProductAdd from "@/components/Products/ProductAdd";
import RelatedProducts from "@/components/Products/RelatedProducts";
import ViewedProductList from "@/components/Products/ViewedProductsList";
import StarRating from "@/components/StarRating";
import { getProduct } from "@/lib/helper";
import Image from "next/image";
import React from "react";

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

const box = (size: string) => (
  <button className="p-3 bg-slate-100 uppercase mr-2 font-semibold">
    {size}
  </button>
);

async function page({ params }: { params: { productId: number } }) {
  const result = await getProduct(params.productId);

  if (!result)
    return (
      <div>
        <h1>You are not Connected</h1>
      </div>
    );

  return (
    <div className="min-h-[60vh] py-12 box-border bg-white">
      <div className="relative md:static w-full">
        <div className="w-[90%] md:w-[80%] mx-auto lg:flex lg:justify-center ">
          <div className="w-full lg:w-[80%] h-fit flex justify-center items-center bg-white">
            <Image
              src={result?.image}
              alt={result.title ? result.title : "Product Image"}
              width={400}
              height={500}
            />
          </div>
          <div className="md:w-[80%] h-fit mt-16 lg:mt-0 mx-auto">
            <h1 className="text-3xl font-bold mb-5">{result.title}</h1>
            {/* Star section */}
            <StarRating rating={result.rating.rate} />
            <div className="flex justify-between py-6">
              <h2 className="text-2xl font-bold">
                {"N " +
                  (result.price * 1000)
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </h2>
              <h2 className="text-xl font-bold text-green-500 uppercase ">
                In Stock
              </h2>
            </div>
            {result.category !== "electronics" && (
              <div>
                <h2>Size</h2>
                <div className="w-fit">
                  {box("sm")}
                  {box("md")}
                  {box("lg")}
                  {box("xl")}
                  {box("xxl")}
                </div>
              </div>
            )}
            <div className="mt-4">
              <h2 className="mb-2">Qty</h2>
              <input
                type="number"
                name="qty"
                id="qty"
                value={1}
                className="max-w-11 border border-black pl-3 text-xl "
              />
            </div>
            <div className="w-full hidden md:block py-2 bg-white">
              <ProductAdd product={result} />
            </div>
          </div>
        </div>
        <div className="w-[90%] md:w-[80%] mx-auto mt-20 mb-10 md:mb-0 ">
          <h1 className="text-3xl mb-4">Description</h1>
          <p className="text-lg">{result.description}</p>
        </div>
        <div className="w-full md:hidden sticky bottom-0 py-2 px-3 bg-white border">
          <ProductAdd product={result} />
        </div>
      </div>
      <div className="md:w-[90%] mx-auto mt-20">
        <RelatedProducts category={result.category} />
      </div>
      <div className="md:w-[90%] mx-auto mt-20">
        <ViewedProductList />
      </div>
    </div>
  );
}

export default page;
