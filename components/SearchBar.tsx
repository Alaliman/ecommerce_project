// components/SearchBar.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      setQuery;
      router.push(`/product/search?query=${query}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center w-full md:max-w-2xl mx-auto"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for products..."
        className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-l-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-500 rounded-r-full hover:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
}
