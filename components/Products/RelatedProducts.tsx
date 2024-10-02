import { FC } from "react";
import ProductCard from "./ProductCard";
import { getCategoryProduct } from "@/lib/helper";

type RelatedProductsProps = {
  category: string;
};

const RelatedProducts: FC<RelatedProductsProps> = async ({ category }) => {
  const result = await getCategoryProduct(category);
  if (!result) return;
  return (
    <div className="w-full h-fit">
      <h2 className="text-center mb-11 text-3xl after:w-[10px] after:h-[5px] after:bg-slate-400 after:mx-auto after:relative">
        Related Products
      </h2>
      <div className="w-full md:p-5 h-fit gap-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {result.slice(0, 4).map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
