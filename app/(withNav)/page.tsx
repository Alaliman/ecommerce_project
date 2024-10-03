import ProductList from "@/components/Products/ProductList";
import RecommendedProductList from "@/components/Products/RecommendedProductList";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main className="w-full">
      <div className=" w-full md:w-[90%] bg-transparent mx-auto">
        {session && (
          <div>
            <h3 className="text-2xl font-extrabold ml-5 pt-5">
              Reccommeded just for you
            </h3>
            <RecommendedProductList id={session.user.id} />
          </div>
        )}
        <div>
          <ProductList />
        </div>
      </div>
    </main>
  );
}
