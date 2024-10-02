"use client";
import { addReccommendation, addViewedProduct } from "@/lib/helper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FC } from "react";
import { useCartContext } from "@/app/context/CartContext";
import { useRecommendedContext } from "@/app/context/RecommendedContext";
import { useViewedContext } from "@/app/context/ViewedContext";
import { toast } from "sonner";
import { useModalContext } from "@/app/context/ModalContext";

type ProductCardProps = {
  product: {
    title: string;
    id: number;
    price: number;
    image: string;
    category: string;
  };
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const { addToRecommendations } = useRecommendedContext();
  const { addToViewed } = useViewedContext();
  const { addToCarts } = useCartContext();
  const { setIsLoadModal } = useModalContext();
  const move = useRouter();
  const handleClick = async () => {
    setIsLoadModal(true);
    addToViewed(product);
    addToRecommendations(product.category);
    move.push(`/product/${product.id}`);
  };
  return (
    <div className="relative group">
      <div
        // href={"/" + product.title + "_" + product.id}
        onClick={handleClick}
        className="hover:shadow-xl bg-white  h-full p-2 flex flex-col relative justify-center items-center cursor-pointer transition-all group"
      >
        <div className="bg-white p-5 rounded-md">
          <img
            src={product.image}
            alt={"image of product"}
            className="h-52 w-full md:h-72 scale-90 z-1 relative"
          />
        </div>
        <div className="flex flex-col justify-between items-center gap-2">
          <div>
            <h3 className="text-sm md:scale-105 text-center">
              {product.title}
            </h3>
          </div>
          <div className="text-green-400 font-extrabold text-xl  md:text-3xl">
            {"N " +
              (product.price * 1000)
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </div>
        </div>
      </div>
      <div className="w-full z-50 absolute top-0 bg-black/85 h-full hidden transition-all md:group-hover:flex md:group-hover:items-center md:group-hover:justify-center md:group-hover:flex-col md:group-hover:gap-7">
        <button
          onClick={() => {
            const isSuccess = addToCarts(product);
            if (isSuccess) {
              toast.success("Added to Cart", {
                position: "top-center",
                style: {
                  background: "green",
                },
              });
            } else {
              toast.error("Failed to add to cart", {
                position: "top-center",
              });
            }
          }}
          className="md:uppercase bg-green-400 text-white p-2 rounded-md hover:bg-green-500"
        >
          Add to cart
        </button>

        <button
          onClick={handleClick}
          className="bg-green-400 text-white p-2 rounded-md hover:bg-green-500"
        >
          VIEW PRODUCT
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
