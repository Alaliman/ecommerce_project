import React from "react";
import SearchBar from "./SearchBar";
import { Search, ShoppingCart, UserRound } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buttonVariants } from "./ui/button";
import UserAccountNav from "./UserAccountNav";
import { useCartContext } from "@/app/context/CartContext";

async function NavBar() {
  const session = await getServerSession(authOptions);
  // const { cart } = useCartContext();
  return (
    <div className="z-30 py-3 shadow-sm bg-slate-50 w-full h-32 md:h-20 mx-auto">
      <div className="flex justify-between items-center w-full md:w-[90%] h-[50%] md:h-full p-4 mx-auto">
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold">
            MyShop
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow mx-4 hidden md:block">
          <SearchBar />
        </div>

        {/* Right: Navigation Links */}
        <div className="flex-shrink-0 space-x-4">
          <Link
            href="/carts"
            className="text-gray-700 inline  hover:text-gray-900 ml-3"
          >
            <span className="relative">
              <ShoppingCart className="inline" />
              {/* {cart.length !== 0 && ( */}
              <div className="w-1 h-1 p-2 scale-50 rounded-full bg-red-600 inline absolute"></div>
              {/* )} */}
            </span>
          </Link>
          <Link
            href="/sign-in"
            className="text-gray-700 inline hover:text-gray-900"
          >
            <UserRound className="inline" />
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-center w-[90%] h-[40%] mx-auto md:hidden">
        <SearchBar />
      </div>
    </div>
  );
}

export default NavBar;
