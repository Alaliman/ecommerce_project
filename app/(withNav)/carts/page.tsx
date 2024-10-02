import CartProductsList from "@/components/Products/CartProductsList";
import ViewedProductList from "@/components/Products/ViewedProductsList";

type pageProps = {};

async function page({}: pageProps) {
  return (
    <div className="min-h-[60vh] box-border">
      <div>
        <CartProductsList />
      </div>
      <div className="md:w-[90%] mx-auto mt-1 md:mt-5">
        <ViewedProductList />
      </div>
      <div></div>
    </div>
  );
}

export default page;
