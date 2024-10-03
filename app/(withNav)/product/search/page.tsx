import ForRemove from "@/components/ForRemove";
import ProductCard from "@/components/Products/ProductCard";
import { SearchX } from "lucide-react";
import { FC } from "react";

interface MyPageProps {
  searchParams: { [key: string]: string };
}

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

// const queryByWord = (data: products[], searchWord: string) => {
//   return data.filter(
//     (item) =>
//       item.title.toLowerCase().includes(searchWord?.toLowerCase()) ||
//       item.description.toLowerCase().includes(searchWord?.toLowerCase()) ||
//       item.category.toLowerCase().includes(searchWord?.toLowerCase())
//   );
// };

const queryByWord = (data: products[], searchWord: string) => {
  const regex = new RegExp(`\\b${searchWord}\\b`, "i"); // 'i' makes it case-insensitive

  return data.filter(
    (item) =>
      regex.test(item.title) ||
      regex.test(item.description) ||
      regex.test(item.category)
  );
};

const getQueryProducts = async (): Promise<products[]> => {
  const res = await fetch("https://fakestoreapi.com/products");

  await new Promise((resolve) => setTimeout(resolve, 6000));

  return res.json();
};

const page: FC<MyPageProps> = async ({ searchParams }) => {
  // Get the value of a query parameter
  const { query } = searchParams; // e.g., /page?myParam=value

  const result = await getQueryProducts();
  const products = queryByWord(result, query);

  return (
    <div className="min-h-[60vh] py-5 w-[90%] mx-auto box-border ">
      <h1 className="text-2xl font-extrabold ml-5 pt-5">
        Search for &quot;{query}&quot;
      </h1>
      {products.length !== 0 ? (
        <div className="w-full md:p-5 h-fit gap-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product: products) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
      <ForRemove />
    </div>
  );
};

export default page;
